import Layout from 'components/layout';
import React, { useRef, useState, useEffect } from 'react';
import { Form, Upload, Modal, Card, Radio, Collapse, Input, Button, Select, Row, Col, Divider, Space } from 'antd';
import { PlusOutlined, MinusOutlined, LeftOutlined, WarningOutlined, CopyOutlined } from '@ant-design/icons';

import { useRouter } from 'next/router';
import Router from 'next/router';
function ImportStock() {
    const router = useRouter();

    const formRef = useRef();

    const back = () => {
        Router.back();
    };
    return <Layout selectedKeys='importstock' breadKeys='importstock' openKeys={['stock']} loading={false}>
        <div>
            <LeftOutlined></LeftOutlined>
            <Button type="text" onClick={back}>Back</Button>

        </div>
        <div className="filterUnit">
            <Upload
                name='file'
                accept=".csv"
                //action={adminApi.importCostsUrl()}
                headers={{
                    // authorization: `Bearer ${localStorage.getItem('ADMINTOKEN')}`
                }}
                showUploadList={false}
            //beforeUpload={this.handleUploadBefore}
            //onChange={this.handleUploadChange}
            >
                <Button type="primary">导入股票数据</Button>
            </Upload>
        </div>


    </Layout >;
}

export default ImportStock;