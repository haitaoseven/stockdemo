// /pages/index.js页面 ----> /
import React, { Fragment } from 'react';
import StockLogin from '../components/login';
import { ToastContainer } from 'react-toastify';
import StockRegister from '../components/register';

function Login() {
    return (
        <Fragment>
            <StockRegister></StockRegister>
            <ToastContainer />
        </Fragment>
    );
}

export default Login;
