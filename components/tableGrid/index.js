import React, { Fragment, useState, useEffect } from 'react';
import { Table } from 'antd';
import Scroller from 'components/scroller';
import Utils from 'utils/utils';
import PropTypes from 'prop-types';

function MpsTableGrid(props) {
    const { className, dataSource, rowKey, columns, isMultiple, loading, tableChange, rowSelectedChange, components } = props;

    const [isValidating, setIsValidating] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const setRequestData = (data, fn, fn2) => {
        if (isValidating) {
            fn(data);
            fn2 && fn2();
        }
    };

    const onHandleRecordSelected = (sRKs, sR) => {
        setRequestData(sRKs, setSelectedRowKeys, () => {
            rowSelectedChange && rowSelectedChange(sRKs, sR);
        });
    };


    useEffect(() => {
        setIsValidating(true);
        return () => {
            // Anything in here is fired on component unmount.
            setIsValidating(false);
        };
    }, []);

    const onHandleTableChange = (pagination, filters, sorter) => {
        tableChange(pagination, filters, sorter);
    };
    const tableX = columns.reduce((acc, cur) => acc + Utils.parseFloatSafety(
        (cur.width || '').toString().replace(/px/g, ''),
        0),
    0);

    return (
        <Fragment>
            <Scroller>
                <Table
                    className={className}
                    loading={loading}
                    rowKey={rowKey}
                    pagination={false}
                    columns={columns}
                    dataSource={dataSource}
                    onChange={onHandleTableChange}
                    rowSelection={isMultiple ? {
                        fixed: true,
                        selectedRowKeys,
                        onChange: onHandleRecordSelected,
                    } : null}
                    style={{
                        minWidth: tableX + 'px',
                        tableLayout: 'fixed'
                    }}
                    indentSize={30}
                    components={components}
                />
            </Scroller>
        </Fragment>
    );
}

MpsTableGrid.propTypes = {
    className: PropTypes.string,
    rowKey: PropTypes.any.isRequired,
    columns: PropTypes.array.isRequired,
    dataSource: PropTypes.array.isRequired,
    isMultiple: PropTypes.bool,
    loading: PropTypes.bool,
    tableChange: PropTypes.func,
    rowSelectedChange: PropTypes.func,
    components: PropTypes.any
};

MpsTableGrid.defaultProps = {
    dataSource: []

};

export default MpsTableGrid;