import React from 'react';
import {
    ApartmentOutlined,
    HomeOutlined,
    SettingOutlined,
    TeamOutlined,
    ToolOutlined,
    UserOutlined,
    UserSwitchOutlined,
    VerifiedOutlined,
    WarningOutlined
} from '@ant-design/icons';

function getNotPermissionValidate() {
    return ['/login', '/403'];
}

function getRoutesList() {
    return [

        {
            label: 'Stock',
            key: 'stock',
            icon: <UserSwitchOutlined />,
            isAdmin: true,
            children: [
                {
                    label: 'Add stock',
                    link: '/stock/add',
                    key: 'addstock',
                    permission: 'AddStock',
                    isAdmin: true,
                    icon: <TeamOutlined />,
                },
                {
                    label: 'Import stock',
                    link: '/stock/import',
                    key: 'importstock',
                    permission: 'ImportStock',
                    isAdmin: true,
                    icon: <TeamOutlined />,
                },
                {
                    label: 'Stock List',
                    link: '/stock/list',
                    key: 'liststock',
                    permission: 'ListStock',
                    isAdmin: true,
                    icon: <TeamOutlined />,
                }
            ],
        },
        {
            label: 'System',
            key: 'system',
            icon: <TeamOutlined />,
            isAdmin: true,
            children: [
                {
                    label: 'User',
                    link: '/user/detail',
                    key: 'userDetail',
                    permission: 'ViewUser',
                    isAdmin: true,
                    icon: <UserOutlined />,
                }
            ],

        }

    ];
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getNotPermissionValidate,
    getRoutesList,
};
