import React, { Fragment, useState } from 'react';
import './index.module.less';
import { Pagination, ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import PropTypes from 'prop-types';
function MpsPagination(props) {
    // get inital or default props settings 
    const { defaultPageSize, defaultCurrentPageIndex, showSizeChanger, showQuickJumper, pageSizeOptions } = props;
    const total = props.total;

    //define pageSize, and currentPageIndex state
    const [pageSize, setPageSize] = useState(defaultPageSize);
    const [currentPageIndex, setCurrentPageIndex] = useState(defaultCurrentPageIndex);

    const pageChange = (index, psize) => {
        setPageSize(psize);
        setCurrentPageIndex(index);
        const pagination = {
            'currentPageIndex': index,
            'pageSize': psize
        };
        props.onChange && props.onChange(pagination);
    };

    return <Fragment>
        <div className='paginationComponent'>
            <ConfigProvider locale={enUS}><Pagination
                className='tablePagination'
                showTotal={() => {
                    return `${'Total'} ${total} ${'Item'}`;
                }}
                showQuickJumper={showQuickJumper}
                showSizeChanger={showSizeChanger}
                total={total}
                pageSize={pageSize}
                current={currentPageIndex}
                pageSizeOptions={pageSizeOptions}
                onChange={(index, psize) => pageChange(index, psize)}
                onShowSizeChange={(current, psize) => pageChange(current, psize)}
            /></ConfigProvider>
        </div>
    </Fragment>;
}

MpsPagination.propTypes = {
    defaultPageSize: PropTypes.number.isRequired,
    defaultCurrentPageIndex: PropTypes.number.isRequired,
    showSizeChanger: PropTypes.bool,
    showQuickJumper: PropTypes.bool,
    total: PropTypes.number.isRequired,
    pageSizeOptions: PropTypes.array,
};

MpsPagination.defaultProps = {
    defaultPageSize: 20,
    defaultCurrentPageIndex: 1,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['20', '30', '40', '50', '999999']
};

export default MpsPagination;