import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Select, Input, DatePicker, Button, Checkbox } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import moment from 'moment';
import './index.module.less';

const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;
const dateType = 'X';

function MpsFilterInput(props) {
    const [isValidating, setIsValidating] = useState(true);
    const { data } = props;
    const initFilterOption = {};
    data.map(item => {
        initFilterOption[item.field] = '';
    });
    const [filterOption, setFilterOption] = useState(initFilterOption);
    const [searchOrderOption, setSearchOrderOption] = useState({});

    useEffect(() => {
        setIsValidating(true);
        return () => {
            // Anything in here is fired on component unmount.
            setIsValidating(false);
        };
    }, []);

    const setDataRequest = (option, fn, fn2) => {
        if (isValidating) {
            fn(option);
            fn2 && fn2();
        }
    };

    const formatFilterOption = item => {
        const option = {};
        Object.keys(item).map(key => {
            if (!(item[key] === '' || item[key] === undefined)) {
                option[key] = item[key];
            }
        });
        return option;
    };

    const onHandleFilterChange = (key, value = '') => {
        filterOption[key] = value;
        const formatData = formatFilterOption(filterOption);
        setDataRequest(filterOption, setFilterOption, () => {
            props.onSearch && props.onSearch(formatData);
        });
    };

    const onHandleFilterInputChange = (key, value = '') => {
        filterOption[key] = value;
        setDataRequest(filterOption, setFilterOption);
    };

    const onHandleFilterSearchChange = (key, value = '') => {
        searchOrderOption[key] = value;
        const formatData = formatFilterOption(searchOrderOption);
        setDataRequest(searchOrderOption, setSearchOrderOption, () => {
            props.onSearch && props.onSearch(formatData);
        });
    };

    const onHandleFilterTimeChange = (key, value) => {
        const item = data.find(r => {
            return r.field === key;
        }) || {};
        const { showTime = false } = item;
        value = value || '';
        if (value.length) {
            if (showTime) {
                const start = parseInt(moment(value[0]).format(dateType)) ? parseInt(moment(value[0]).format(dateType)) : undefined;
                const end = parseInt(moment(value[1]).format(dateType)) ? parseInt(moment(value[1]).format(dateType)) : undefined;
                value = [start, end];
            } else {
                const start = parseInt(moment(value[0]).startOf('day').format(dateType)) ? parseInt(moment(value[0]).startOf('day').format(dateType)) : undefined;
                const end = parseInt(moment(value[1]).endOf('day').format(dateType)) ? parseInt(moment(value[1]).endOf('day').format(dateType)) : undefined;
                value = [start, end];
            }
        }

        filterOption[key] = value;
        setDataRequest(filterOption, setFilterOption);
    };
    const onHandleSearch = () => {
        const formatData = formatFilterOption(filterOption);
        props.onSearch && props.onSearch(formatData);
    };

    return (
        <Fragment>
            <div className='filterInputComponent filter'>
                <div className='left'>
                    {data.map(item => (
                        <div className='filterUnit' key={item.field}>
                            {item.label && <div className='filterLabel'>{item.label}</div>}
                            {item.type === 'input' && <Input
                                allowClear
                                className={clsx('pluginUnit', item.size)}
                                placeholder={item.placeholder}
                                onChange={e => onHandleFilterInputChange(item.field, e.target.value)}
                            />}
                            {item.type === 'search' && <Search
                                allowClear
                                className={clsx('pluginUnit', item.size)}
                                placeholder={item.placeholder}
                                onSearch={value => onHandleFilterSearchChange(item.field, value)}
                            />}
                            {item.type === 'time' && <RangePicker
                                {...item}
                                placeholder={[item.startTime, item.endTime]}
                                className={clsx('pluginUnit', 'larger', item.showTime && 'rangPickerTime')}
                                onChange={e => onHandleFilterTimeChange(item.field, e)}
                                onBlur={() => onHandleSearch()}
                            />}
                            {item.type === 'checkbox' && <Checkbox onChange={e => onHandleFilterInputChange(item.field, e.target.checked)}>{item.placeholder}</Checkbox>}
                            {!item.type && <Select
                                defaultValue={item.defaultValue}
                                showSearch
                                allowClear
                                showArrow
                                className={clsx('pluginUnit', item.size)}
                                mode={item.multiple && 'multiple'}
                                placeholder={item.placeholder}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                onChange={value => onHandleFilterChange(item.field, value)}>
                                {item.list.length > 0 && item.list.map(opt => (
                                    <Option value={opt.value} key={opt.value}>{opt.label}</Option>
                                ))}
                            </Select>}
                        </div>
                    ))}
                    {props.isButton && data.length > 0 && <div className='filterUnit'>
                        <Button type='primary' icon={<SearchOutlined />} onClick={() => onHandleSearch()}>{props.searchTxt}</Button>
                    </div>}
                </div>
                <div className='right'>
                    {props.children}
                </div>
            </div>
        </Fragment>
    );
}
MpsFilterInput.propTypes = {
    searchTxt: PropTypes.string,
    data: PropTypes.array,
    onSearch: PropTypes.func,
    isButton: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.object,
    ])
};

MpsFilterInput.defaultProps = {
    isButton: true,
    searchTxt: 'Search'
};
export default MpsFilterInput;