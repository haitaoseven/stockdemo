// /pages/index.js页面 ----> /
import React, { Fragment } from 'react';
import StockLogin from '../../components/login';
import { ToastContainer } from 'react-toastify';

function AdminLogin() {
    return (
        <Fragment>
            <StockLogin type="admin" />
            <ToastContainer />
        </Fragment>
    );
}

export default AdminLogin;