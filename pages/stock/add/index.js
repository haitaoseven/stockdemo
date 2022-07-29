import Layout from 'components/layout';
import React, { useRef, useState, useEffect } from 'react';
import { Form, Modal, Card, Radio, Collapse, Input, Button, Select, Row, Col, Divider, Space } from 'antd';
import { PlusOutlined, MinusOutlined, LeftOutlined, WarningOutlined, CopyOutlined } from '@ant-design/icons';

import { useRouter } from 'next/router';
import Router from 'next/router';
import stockApi from '../../../api/stock';
import { error, success } from 'components/toast';


function AddStock() {

    
    const router = useRouter();

    const [stockData, setStockData] = useState({});
    const formRef = useRef();
    const onHandleSave = () => {
        formRef.current.validateFields().then(async formData => {
            
            const newData = {...formData };
            createOrUpdateStock(newData);
        });
    };
    const createOrUpdateStock = async formData => {
        //const buildFormData = buildChannelDataFromForm(formData);
        const res = await stockApi.createStock(formData);
        if (res.code === 200) {
            
            //success('success');
            Router.push('/stock/list');

        }
    };
    const back = () => {
        Router.back();
    };
    return <Layout selectedKeys='addstock' breadKeys='addstock' openKeys={['stock']} loading={false}>
        <div>
            <LeftOutlined></LeftOutlined>
            <Button type="text" onClick={back}>Back</Button>

        </div>
        {/* this is for the basic information */}
        <Form layout="vertical" ref={formRef}>
            <Divider></Divider>

            <Row>
                <Col span={7}>
                    <Form.Item
                        label='Stock Name'
                        name='name'
                        rules={[
                            {
                                message: ('Please enter the name!')
                            },
                        ]}
                    >
                        <Input placeholder={('Stock Name')} maxLength={30} />
                    </Form.Item>
                </Col>


            </Row>
            <Row>
                <Col span={7}>
                    <Form.Item
                        label='Stock Code'
                        name='code'
                        rules={[
                            {
                                message: ('Please enter the code!')
                            },
                        ]}
                    >
                        <Input placeholder={('Stock Code:000111')} maxLength={30} />
                    </Form.Item>
                </Col>


            </Row>

            <Divider></Divider>
            <Row justify='end'>
                <Col className='formCol' span={5} offset={1}>
                    <Button type='primary' block onClick={() => onHandleSave()} disabled={false}>{('Submit')}</Button>
                </Col>
            </Row>




        </Form>
    </Layout >;
}

export default AddStock;