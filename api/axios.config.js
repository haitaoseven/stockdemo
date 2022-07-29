import axios from 'axios';
import { message } from 'antd';
import Router from 'next/router';
const qs = require('qs');
let CancelToken = axios.CancelToken;
let source = CancelToken.source();

Router.onRouteChangeStart = () => {
    // console.log('App is changing to: ', pageUrl);
    source.cancel('取消请求');
    CancelToken = axios.CancelToken;
    source = CancelToken.source();
};

export const httpStatus = {
    'SUCCESS': {
        //一般请求成功后，返回此状态。如是Grid分页类请求，没有数据的话，依然返回200，Count设为0
        code: 200,
        // msg: intl.get('SUCCESS')
        msg: '请求成功'
    },
    'ERR_PARAMETER_HAS_ERROR': {
        //请求参数类型、个数等错误的情况下，返回此状态
        code: 400,
        // msg: intl.get('ERR_PARAMETER_HAS_ERROR')
        msg: '请求参数错误'
    },
    'ERR_TOKEN_EXPIRED': {
        // Token过期或未登录
        code: 401,
        // msg: intl.get('ERR_TOKEN_EXPIRED')
        msg: '登录失效或未登录'
    },
    'ERR_NO_AUTHORIZATION': {
        // 请求参数类型、个数等错误的情况下，返回此状态
        code: 403,
        // msg: intl.get('ERR_NO_AUTHORIZATION')
        msg: '您无权进行此操作'
    },
    'ERR_NOT_FOUND': {
        // 未找到接口函数
        code: 404,
        // msg: intl.get('ERR_NOT_FOUND')
        msg: '请求地址错误，请确认'
    },
    'ERROR_UNHANDLED_EXCEPTION': {
        // 请求参数类型、个数等错误的情况下，返回此状态
        code: 500,
        // msg: intl.get('ERROR_UNHANDLED_EXCEPTION')
        msg: '请求异常'
    }
};

// 创建一个axios实例
export const service = axios.create({
    timeout: 30000, // 超时时间
    cancelToken: source.token
    // withCredentials: false // 允许携带cookie
});

// 请求发送处理
service.interceptors.request.use(config => {
    config.cancelToken = source.token;
    if (config.url.split('/').includes('Export')) {
        config.responseType = 'blob';
    }
    if (config.method === 'get') {
        config.paramsSerializer = function(params) {
            return qs.stringify(params, { arrayFormat: 'repeat' });
        };
    }
    return config;
},
error => {
// 发送请求失败报错
    Promise.reject(error);
});

// respone拦截器
service.interceptors.response.use(
    response => {
        const res = response.data;
        if (response.status !== 200) {
            // 请求异常
            message.error('请求异常');
            return Promise.resolve({
                success: false
            });
        } else {
            // 请求成功
            return res;
        }
    },
    error => {
        if (error.response && error.response.status === httpStatus.ERR_TOKEN_EXPIRED.code) {
            message.error(httpStatus.ERR_TOKEN_EXPIRED.msg);
            Router.push('/login');
            return Promise.resolve({
                success: false
            });
        }
        if (error.response && error.response.status === httpStatus.ERR_NO_AUTHORIZATION.code) {
            message.error(httpStatus.ERR_NO_AUTHORIZATION.msg);
            Router.push('/login');
            return Promise.resolve({
                success: false
            });
        }
        return Promise.resolve({
            success: false
        });
        // return Promise.reject(error);
    }
);
