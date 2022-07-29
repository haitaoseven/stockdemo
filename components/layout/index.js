import React, { Fragment, useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import styles from './index.module.less';

import { Layout, Menu, Breadcrumb, Popconfirm, Spin, Dropdown, Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, ExportOutlined, GlobalOutlined } from '@ant-design/icons';
import Scroller from 'components/scroller';

import clsx from 'clsx';

import routes from 'utils/routes';
import PropTypes from 'prop-types';
import StockSession from 'utils/session';
const { Header, Sider, Content, Footer } = Layout;
const { SubMenu } = Menu;


function ManagementLayout(props) {
    const routerList = routes.getRoutesList();
    const { hideKey, selectedKeys, breadKeys } = props;
    const [collapsed, setCollapsed] = useState(false);
    const [openKeys, setOpenKey] = useState(props.openKeys);
    const [breadPath, setBreadPath] = useState([]);
    const [username, setUsername] = useState('test');
    const [localLanguage, setLocalLanguage] = useState({});
    const router = useRouter();

    const onHandleMenuToPage = (e, routeData, isSubMenu = false) => {
        let link = routeData.link;
        const key = routeData.permission;
        isSubMenu && link && e.stopPropagation();
        if (link) {
            link = link || '/';
            if (router.pathname !== link) {
                //if (!auth.checkPermissions(key)) {
                  //  router.replace('/401');
                //} else {
                    router.push(link);
                //}
            }
        }
    };
    const onHandleMenuToggle = bool => {
        setCollapsed(bool);
        setOpenKey(openKeys);
    };
    const onHandleOpenChange = array => {
        setOpenKey(array);
    };

    const formatRouteMenu = list => {
        return list.map(item => {
            if (item.children) {
                const arr = item.children || [];
                const bool = arr.some(r => {
                    return !r.hide;
                });
                if (bool) {
                    return (
                        <SubMenu key={item.key} icon={item.icon}
                            className={item.link && router.pathname === item.link && 'ant-menu-item-selected'}
                            title={<span onClick={e => onHandleMenuToPage(e, item, true)}>{item.label}</span>}>
                            {formatRouteMenu(item.children)}
                        </SubMenu>
                    );
                } else {
                    return (
                        <Menu.Item key={item.key} icon={item.icon} onClick={e => onHandleMenuToPage(e, item)}>{item.label}</Menu.Item>
                    );
                }
            } else if (!item.hide) {
                return (
                    <Menu.Item key={item.key} icon={item.icon} onClick={e => onHandleMenuToPage(e, item)}>{item.label}</Menu.Item>
                );
            }
        });
    };

    useEffect(() => {
        // if (StockSession.isExpire()) {
        //     const redirect = `${encodeURI(window.location.pathname)}${encodeURI(window.location.search)}`;
        //     router.push(`/login?redirect=${redirect}`);
        // }
        // validatePermission();
        // getMenuList();
        // getLocal();
    }, []);
    return (
        <Fragment>
            hhhhhhhh
            <Layout className={styles.layoutIndex}>
                <Sider trigger={null} className={clsx(styles.layoutSider, collapsed && styles.siderHidden)} collapsible collapsed={collapsed}>
                    <div className={styles['top-block']}>
                        {!collapsed && <div className={styles.logo} />}
                        {!collapsed && <MenuFoldOutlined className={styles['top-arrow']} onClick={() => onHandleMenuToggle(true)} />}
                        {collapsed && <MenuUnfoldOutlined className={styles['top-arrow']} onClick={() => onHandleMenuToggle(false)} />}
                    </div>
                    <div className={styles.layoutMenu}>
                        <Scroller>
                            <Menu theme='dark' mode="inline" selectedKeys={selectedKeys} openKeys={openKeys} onOpenChange={array => onHandleOpenChange(array)}>
                                {formatRouteMenu(routerList)}
                            </Menu>
                        </Scroller>
                    </div>
                </Sider>
                <Layout className={styles['site-layout']}>
                    <Header className={styles.layoutHeader}>
                        <div className={styles.headerName}>StockDemo</div>
                        <div className={styles.headerSet}>
                            <div className={styles.language}>
                                {localLanguage.value && <Dropdown overlay={languageMenu} placement='bottom'>
                                    <Button type='link'>{localLanguage.label}<GlobalOutlined /></Button>
                                </Dropdown>}
                            </div>
                            <div>
                                <label className={styles.userName}>{username}</label>
                            </div>
                            <Popconfirm title="Are you sure？" onConfirm={() => onHandleLogout()}>
                                <ExportOutlined className={styles.goOut} />
                            </Popconfirm>
                        </div>
                    </Header>
                    <Content className={styles.layoutContent}>
                        <div className={styles.layoutBread}>
                            {breadPath.length === 1 && <h2 style={{ fontSize: '24px', color: '#000', fontWeight: '700' }}>{breadPath[0].label}</h2>}
                            {breadPath.length > 1 && <Breadcrumb >
                                {breadPath.map((item, index) => (
                                    <Breadcrumb.Item disabled={!item.link} key={index} href={breadPath.length === index + 1 ? '' : item.link}>{item.label}</Breadcrumb.Item>
                                ))}
                            </Breadcrumb>}
                        </div>
                        <div className={clsx(styles.infoContent)}>
                            {(props.loading || false) && <Spin className={styles.adminSpining} size='large' spinning></Spin>}
                            <Scroller className={styles.scrollerContainer} ref={refs => window.pageScrollerRef = refs}>
                                {props.children}
                            </Scroller>
                        </div>

                    </Content>
                    <Footer className={styles.layoutFooter}>© {new Date().getFullYear()} StockDemo  All rights reserved.</Footer>
                </Layout>
            </Layout>
            <ToastContainer />
        </Fragment>
    );

}
ManagementLayout.propTypes = {
    children: PropTypes.any,
    selectedKeys: PropTypes.any,
    breadKeys: PropTypes.any,
    openKeys: PropTypes.array,
    hideKey: PropTypes.string,
    loading: PropTypes.bool,
    className: PropTypes.string
};

export default ManagementLayout;
