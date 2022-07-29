import Layout from 'components/layout';
import React, { useRef, useState, useEffect } from 'react';
import { Form, Modal, Card, Radio, Collapse, Input, Button, Select, Row, Col, Divider, Space } from 'antd';
import { PlusOutlined, MinusOutlined, LeftOutlined, WarningOutlined, CopyOutlined } from '@ant-design/icons';

import { useRouter } from 'next/router';
import Router from 'next/router';
import { error, success } from 'components/toast';
import { Line, G2 } from '@ant-design/plots';
import stockApi from '../../../api/stock';

import { each, findIndex } from '@antv/util';
const { confirm } = Modal;

const { Option } = Select;
const { Panel } = Collapse;

const currentTimeMinStamp = new Date().getTime()
// const startDate = new Date(currentTimeMinStamp-30*1000*3600*24)
const startDateStr = getDate(currentTimeMinStamp-30*1000*3600*24);//startDate.getFullYear()+"-"+(startDate.getMonth()+1)+"-"+startDate.getDate()
// const endDate = new Date()
const endDateStr = getDate(currentTimeMinStamp)//endDate.getFullYear()+"-"+(endDate.getMonth()+1)+"-"+endDate.getDate()

function getDate(minitimeStamp){
    var date = new Date(minitimeStamp);
    var year = date.getFullYear()
    var month = date.getMonth()+1
    var day = date.getDate()
    if (month<10) {
        month = "0"+month
    }
    return year+"-"+month+"-"+day

}
function StockDetail() {
    const router = useRouter();
    const { code } = router.query;
    const initRequest = {
        "code":code,
        "startDate":startDateStr,
        "endDate":endDateStr
    };
    const { InteractionAction, registerInteraction, registerAction } = G2;
   
    const [queryRequest, setQueryRequest] = useState(initRequest);
    const [data, setData] = useState([])
    
    const getStockData = async items => {
        const result = await stockApi.getStockByDate(items);
        if (result && result.code === 200 && (result.data !== null)) {
            console.log(result)
            setData(result.data)
        }
       
    };

    useEffect(() => {
       
        getStockData(queryRequest);
    },[queryRequest]);

    const min = Math.min.apply(Math,data.map(ele=>{return ele.finalPrice}))
    G2.registerShape('point', 'custom-point', {
      draw(cfg, container) {
        const point = {
          x: cfg.x,
          y: cfg.y,
        };
        const group = container.addGroup();
        group.addShape('circle', {
          name: 'outer-point',
          attrs: {
            x: point.x,
            y: point.y,
            fill: cfg.color || 'red',
            opacity: 0.5,
            r: 6,
          },
        });
        group.addShape('circle', {
          name: 'inner-point',
          attrs: {
            x: point.x,
            y: point.y,
            fill: cfg.color || 'red',
            opacity: 1,
            r: 2,
          },
        });
        return group;
      },
    });
  
    class CustomMarkerAction extends InteractionAction {
      active() {
        const view = this.getView();
        const evt = this.context.event;
  
        if (evt.data) {
          // items: 数组对象，当前 tooltip 显示的每条内容
          const { items } = evt.data;
          const pointGeometries = view.geometries.filter((geom) => geom.type === 'point');
          each(pointGeometries, (pointGeometry) => {
            each(pointGeometry.elements, (pointElement, idx) => {
              const active = findIndex(items, (item) => item.data === pointElement.data) !== -1;
              const [point0, point1] = pointElement.shape.getChildren();
  
              if (active) {
                // outer-circle
                point0.animate(
                  {
                    r: 10,
                    opacity: 0.2,
                  },
                  {
                    duration: 1800,
                    easing: 'easeLinear',
                    repeat: true,
                  },
                ); // inner-circle
  
                point1.animate(
                  {
                    r: 6,
                    opacity: 0.4,
                  },
                  {
                    duration: 800,
                    easing: 'easeLinear',
                    repeat: true,
                  },
                );
              } else {
                this.resetElementState(pointElement);
              }
            });
          });
        }
      }
  
      reset() {
        const view = this.getView();
        const points = view.geometries.filter((geom) => geom.type === 'point');
        each(points, (point) => {
          each(point.elements, (pointElement) => {
            this.resetElementState(pointElement);
          });
        });
      }
  
      resetElementState(element) {
        const [point0, point1] = element.shape.getChildren();
        point0.stopAnimate();
        point1.stopAnimate();
        const { r, opacity } = point0.get('attrs');
        point0.attr({
          r,
          opacity,
        });
        const { r: r1, opacity: opacity1 } = point1.get('attrs');
        point1.attr({
          r: r1,
          opacity: opacity1,
        });
      }
  
      getView() {
        return this.context.view;
      }
    }
  
    registerAction('custom-marker-action', CustomMarkerAction);
    registerInteraction('custom-marker-interaction', {
      start: [
        {
          trigger: 'tooltip:show',
          action: 'custom-marker-action:active',
        },
      ],
      end: [
        {
          trigger: 'tooltip:hide',
          action: 'custom-marker-action:reset',
        },
      ],
    });
    const config = {
      data,
      xField: 'date',
      yField: 'finalPrice',
      label: {},
      point: {
        size: 5,
        shape: 'custom-point',
        style: {
          fill: 'white',
          stroke: '#5B8FF9',
          lineWidth: 2,
        },
      },
      tooltip: {
        showMarkers: false,
      },
      state: {
        active: {
          style: {
            shadowBlur: 4,
            stroke: '#000',
            fill: 'red',
          },
        },
      },
      yAxis:{

        min:min-1
      },
      interactions: [
        {
          type: 'custom-marker-interaction',
        },
      ],
    };
    return <Layout selectedKeys='addstock' breadKeys='addstock' openKeys={['stock']} loading={false}>
<Line {...config} />

    </Layout>;
  
}
export default StockDetail;
