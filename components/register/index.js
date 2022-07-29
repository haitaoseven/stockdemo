import React, { useState, useEffect } from 'react';
import { Input, Button, Form } from 'antd';
import style from './index.module.less';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Router from 'next/router';
import { useRouter } from 'next/router';
// import userApi from 'api/user';
import MpsSession from '../../utils/session';
import { error } from '../toast';
import stockApi from '../../api/stock';
// import accessTokenApi from '../../api/accessToken';

let index = 1;
let registerFormRefs = null;
const time = 10000;
const bgNums = 5;

function StockRegister() {
    const [loading, setLoading] = useState(false);
    const [bgImage, setBgImage] = useState('/background/bg_001.jpg');

    const router = useRouter();
    const { redirect } = router.query;

    const getIndex = () => {
        const i = Math.ceil(Math.random() * bgNums);
        return index === i ? getIndex() : i;
    };

    const setBackground = () => {
        index = getIndex();
        setBgImage(`/background/bg_00${index}.jpg`);
    };

    const register = async item => {
        try {
            setLoading(true);
            const res = await stockApi.createUser(item);
            if (res.code === 200) {
                // then get accesstoken
                
            } else {
                error('user name or password is not correct');
            }
        } catch (e) {
            error('register failed');
        } finally {
            setLoading(false);
        }
    };

    const onHandleRegister = () => {
        registerFormRefs.validateFields().then(res => {
            register(res);
        }).catch(() => {
            //console.log('err', err);
        });
    };

    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         setBackground();
    //     }, time);

    //     return () => clearInterval(timer);
    // }, []);


    return (
        <div className={style.loginComponent} style={{ backgroundImage: `url(${bgImage})` }}>
            <div className={style.loginContent}>
                <div className={style.logo}>stock demo login</div>
                <div className={style.inputContent}>
                    <Form className={style.infoForm} ref={refs => loginFormRefs = refs}>
                        <div className={style.loginUnit}>
                            <Form.Item
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入用户名!',
                                    },
                                ]}>
                                <Input
                                    size='large'
                                    prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder='User Name'
                                />
                            </Form.Item>
                        </div>
                        <div className={style.loginUnit}>
                            <Form.Item name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入密码！',
                                    },
                                ]}>
                                <Input.Password size='large'
                                    prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder='Password' />
                            </Form.Item>
                        </div>
                        
                        <Form.Item className={style.formButton}>
                            <Button block type='primary' htmlType="submit" size='large' loading={loading} onClick={() => onHandleRegister()}>Register</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default StockRegister;
