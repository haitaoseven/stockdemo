import Layout from 'components/layout';
import React, { Fragment } from 'react';
import { Button, Tag, Modal, Input, Form, Row, Col, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState, useRef } from 'react';
import stockApi from '../../../api/stock';
import MpsFilterInput from '../../../components/filter/input';
import Router from 'next/router';
import MpsTableGrid from 'components/tableGrid';
import MpsPagination from 'components/pagination';
//import AuthWrapper from 'utils/authWrapper';
//import MpsTranslate from 'utils/translate';
import { error, success } from 'components/toast';

const initRequest = {
    'page': 0,
    'pageSize': 5,
    'orderBy': 'createdAt',
    'sort': 'desc',
    'equalsCondition': { 'Status': 20 },
};

function StockList() {
    const [data, setData] = useState([]);
    const [dataTotal, setDataTotal] = useState(0);
    const [queryRequest, setQueryRequest] = useState(initRequest);
    const [searchClicked, setSearchClicked] = useState(0);
    const [tableLoading, setTableLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [currentRecord, setCurrentRecord] = useState({});
    // const [translate, setTranslate] = useState(MpsTranslate);

    const deleteFormRef = useRef();

    const getChannelsData = async items => {
        const result = await stockApi.getStockList(items);
        let channelDataTotal = 0;
        let channelData = [];
        console.log("mmmm")

        console.log(result)

        if (result && result.code === 200 && (result.data !== null)) {
            console.log("ddddd")
            console.log(result)
            channelDataTotal = result.data.count;
            channelData = result.data.data;
        }
        setData(channelData);
        setDataTotal(channelDataTotal);
        setTableLoading(false);
    };

    useEffect(() => {
        // const t = Object.create(MpsTranslate);
        //t.dictionary = t.init();
        //setTranslate(t);
        //rebuild the queryrequest
        setTableLoading(true);
        //setQueryRequest();
        getChannelsData(queryRequest);
    }, [searchClicked, queryRequest]);

    const onHandleNew = () => {
        Router.push('/stock/add');
    };

    const onHandleEdit = record => {
        Router.push(`/stock/detail?code=${record.code}`);
    };

    const onHandleDelete = record => {
        setShowModal(true);
        const newrecord = { ...currentRecord, ...record };
        setCurrentRecord(newrecord);
    };

    const onHandleSearch = filterData => {
        if (filterData.Status != null) {
            queryRequest.equalsCondition.Status = filterData.Status;
        } else {
            delete (queryRequest.equalsCondition.Status);
        }
        if (filterData.channelType != null) {
            queryRequest.equalsCondition.channelType = filterData.channelType;
        } else {
            delete (queryRequest.equalsCondition.channelType);
        }

        if (filterData.search != null) {
            queryRequest.orLikeCondition = {
                'name': filterData.search,
                'description': filterData.search,
                'clientId': filterData.search
            };
        } else {
            delete (queryRequest.orLikeCondition);
        }
        setQueryRequest(queryRequest);
        setSearchClicked(!searchClicked);
    };

    const getList = pagination => {
        queryRequest.pageSize = pagination.pageSize;
        queryRequest.page = pagination.currentPageIndex - 1;
        setQueryRequest(queryRequest);
        setSearchClicked(!searchClicked);
    };

    //process the delete confirm modal
    const handleCancel = () => {
        setShowModal(false);
    };

    const handleOk = async () => {
        setDeleteLoading(true);
        currentRecord.status = -10;
        const value = deleteFormRef.current.getFieldValue('name');
        if (value !== currentRecord.name) {
            error(('Input key is not equals configuration key'));
            setDeleteLoading(false);
        } else {
            const res = await channelApi.createOrUpdateChannel(currentRecord);
            if (res.success) {
                success(('success'));
                setDeleteLoading(false);
                setSearchClicked(!searchClicked);
                setShowModal(false);
            }
        }
    };

    const columns = [
        {
            title: ('Id'),
            dataIndex: 'id',
            key: 'sid',
        },
        {
            title: ('Stock Name'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: ('Stock Code'),
            dataIndex: 'code',
            key: 'code',
        },


        // {
        //     title: ('Image'),
        //     dataIndex: 'status',
        //     key: 'status',
        //     render: status => {
        //         return 'jjj';
        //     }

        // },
        {
            title: ('Operation'),
            fixed: 'right',
            render: record => {
                return (
                    <Fragment>
                        <Button className='btnMargin' icon={<EditOutlined />} type='primary'  style={{
                        marginRight: 8,
                    }} onClick={() => onHandleEdit(record)}></Button>

                        <Button danger className='btnMargin' icon={<DeleteOutlined />} type='primary' onClick={() => onHandleDelete(record)}>

                        </Button>
                    </Fragment>
                );
            }
        }
    ];

    // const filterInput = [
    //     {
    //         field: 'search',
    //         type: 'input',
    //         placeholder: ('Keyword'),
    //     },
    //     {
    //         field: 'channelType',
    //         list: channelTypes.map(item => {
    //             item.label = (item.label);
    //         }) ? channelTypes : [],
    //         placeholder: ('Channel Type')
    //     },
    //     {
    //         field: 'Status',
    //         list: channelStatus.map(item => {
    //             item.label = (item.label);
    //         }) ? channelStatus : [],
    //         placeholder: ('Channel Status'),
    //         defaultValue: 20
    //     }
    // ];

    return <Layout selectedKeys='liststock' breadKeys='liststock' openKeys={['stock']} loading={false}>
        <Row>
            {/* <MpsFilterInput
                data={filterInput}
                onSearch={res => onHandleSearch(res)}
                searchTxt={('Search')}
            >
                <AuthWrapper permission='Mps.Channel.Create'><Button style={{
                    marginLeft: 8,
                }} type='primary' icon={<PlusOutlined />} onClick={onHandleNew}>
                    {('New')}
                </Button></AuthWrapper>
            </MpsFilterInput> */}
            <Button style={{
                    marginLeft: 8,
                }} type='primary' icon={<PlusOutlined />} onClick={onHandleNew}>
                    {'New'}
                </Button>
        </Row>
        <MpsTableGrid
            defaultPageSize={initRequest.pageSize}
            rowKey='id'
            loading={tableLoading}
            pagination={false}
            columns={columns}
            dataSource={data}
        />
        <MpsPagination
            total={dataTotal}
            defaultPageSize={initRequest.pageSize}
            defaultCurrentPageIndex={initRequest.currentPageIndex}
            onChange={pagination => getList(pagination)}
        />
        <Modal visible={showModal} title={('Delete_Channel_Confirm')}
            onCancel={() => handleCancel()}
            footer={false}
        >
            <Form layout="vertical" ref={deleteFormRef}>
                <Row><Col span={24}>
                    <Form.Item label={('Delete_Channel_Confirm_Message')} name="name">
                        <Input></Input>
                    </Form.Item></Col>
                </Row>
                <Row justify='end'>
                    <Col >
                        <Button key="back" onClick={handleCancel}>
                            {('Cancel')}
                        </Button>
                    </Col>
                    <Col offset={1}>
                        <Button key="submit" type="primary" loading={deleteLoading} onClick={handleOk}>
                            {('Confirm')}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    </Layout >;
}

export default StockList;
