// /pages/index.js页面 ----> /
import React, { Fragment } from 'react';
import StockLogin from '../components/login';
import { ToastContainer } from 'react-toastify';

function LoginTest() {
    return (
        <Fragment>
            <StockLogin />
            <ToastContainer />
        </Fragment>
    );
}

export default LoginTest;
