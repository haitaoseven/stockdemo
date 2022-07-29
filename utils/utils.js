import { message } from 'antd';
import moment from 'moment';

function isUndefined(obj) {
    return 'undefined' === typeof obj;
}

function isDefined(obj) {
    return !isUndefined(obj);
}

function isNull(obj) {
    return isUndefined(obj) || null == obj;
}
function isNotNull(obj) {
    return !isNull(obj);
}

function isEmptyString(obj) {
    return isNull(obj) || obj.toString().trim().length <= 0;
}

function isNotEmptyString(obj) {
    return !isEmptyString(obj);
}

function isArray(obj) {
    if (isNotNull(obj)) {
        if (isNotNull(Array) && isNotNull(Array.isArray)) {
            return Array.isArray(obj);
        } else {
            return '[object Array]' === Object.prototype.toString.call(obj);
        }
    }
    return false;
}

function isNotEmptyArray(obj) {
    if (isArray(obj)) {
        return obj.length > 0;
    }
    return false;
}

function isObject(obj) {
    return Object.prototype.toString.apply(obj) === '[object Object]';
}

function capitalize(string) {
    if (isNotEmptyString(string)) {
        string = string.toString();
        string = string[0].charAt(0).toUpperCase() + string.slice(1);
    }
    return string;
}

function parseIntSafety(value, defaultValue) {
    value = parseInt(value);
    if (false === isNaN(value)) {
        return value;
    }
    return defaultValue || 0;
}

function parseFloatSafety(value, defaultValue) {
    value = parseFloat(value);
    if (false === isNaN(value)) {
        return value;
    }
    return defaultValue || 0;
}

/**
 *
 *
 * @param {*} number 数字 ,
 * @param {*} digits 小数位
 * @returns
 */
function formatNumber(number, digits) {
    const value = parseFloatSafety(number, 0);
    digits = parseIntSafety(digits, 2);
    return value.toLocaleString('en-US', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
    });
}

function contains(source, search) {
    if (isNull(source)) {
        return false;
    }
    if (isNull(search)) {
        return true;
    }
    if ('object' === typeof source) {
        if (search in source) {
            return true;
        }
    }
    return (
        source
            .toString()
            .toLowerCase()
            .indexOf(search.toString().toLowerCase()) >= 0
    );
}

function resolvePagination(pagination) {
    const resolved = {
        CurrentPageIndex: parseIntSafety((pagination || {}).current, 1)
    };
    var pageSize = parseIntSafety((pagination || {}).pageSize, 0);
    if (pageSize > 0) {
        resolved.PageSize = pageSize;
    }
    if (isNotNull(pagination.isRequestAll)) {
        resolved.isRequestAll = pagination.isRequestAll;
    }
    return resolved;
}

function generateUrl(url, query) {
    const params = isNull(query)
        ? []
        : Object.keys(query).map(key => key + '=' + encodeURIComponent(query[key]));
    return (url || '') + (params.length > 0 ? '?' + params.join('&') : '');
}

function getEnumItem(key, enums) {
    if (isNotNull(enums)) {
        return Object.values(enums.values).find(e => key === e.key);
    }
    return null;
}

const defaultTimeOut = 200;
let timeOutId;

/**
 * 多次连续请求只保留最后一次
 *
 * @param {*} func throttled function
 * @param {*} [ms=defaultTimeOut] timeout ms
 * @returns
 */
function throttle(func, ms = defaultTimeOut) {
    if (typeof func !== 'function') {
        return;
    }
    if (timeOutId) {
        clearTimeout(timeOutId);
    }
    timeOutId = setTimeout(() => {
        func();
    }, ms);
}

/**
 * 取上传文件扩展名
 *
 * @param {*} fileName
 * @returns
 * @memberof AddEditAsset
 */
function getFileExtension(fileName) {
    return fileName
        .split('.')
        .slice(-1)
        .toString();
}

/**
 * 获取图片链接
 *
 * @param {*} fileOrBlob
 * @param {*} callback
 * @memberof AddEditAsset
 */
function fileOrBlobToDataUrl(fileOrBlob, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(fileOrBlob);
    reader.onload = () => {
        if (typeof callback === 'function') {
            callback(reader.result);
        }
    };
}

/**
 * Convert Hex to RGB color
 *
 * @param {string} hex
 * @returns rgb color string
 */
function hex2rgb(hex) {
    const hexValue = hex.replace('#', '');
    const rgb = {
        r: parseInt(hexValue[0] + hexValue[hexValue[3] ? 1 : 0], 16),
        g: parseInt(
            hexValue[hexValue[3] ? 2 : 1] + (hexValue[3] || hexValue[1]),
            16
        ),
        b: parseInt((hexValue[4] || hexValue[2]) + (hexValue[5] || hexValue[2]), 16)
    };
    return `rgb(${(rgb.r, rgb.g, rgb.b)})`;
}

//// ITU-R BT.2100, https://en.wikipedia.org/wiki/Rec._2100
const luma = 255;
const ratioRed = 0.2627;
const ratioGreen = 0.678;
const ratioBlue = 0.0593;
function convertToGrayFromRgb(rgbString) {
    if (isNotEmptyString(rgbString)) {
        rgbString = rgbString.replace(/#/g, '');
        if (3 === rgbString.length) {
            rgbString
                = rgbString[0]
                + rgbString[0]
                + rgbString[1]
                + rgbString[1]
                + rgbString[2]
                + rgbString[2];
        }
        if (6 === rgbString.length) {
            const red = parseIntSafety(rgbString.substr(0, 2));
            const green = parseIntSafety(rgbString.substr(2, 2));
            const blue = parseIntSafety(rgbString.substr(4, 2));
            return red * ratioRed + green * ratioGreen + blue * ratioBlue;
        }
    }
    return luma;
}

function calculateFontColor(backgroundColorRgbString) {
    const threshold = 128; //// 256 / 2
    const backgroundColorGrayscale = convertToGrayFromRgb(
        backgroundColorRgbString
    );
    return backgroundColorGrayscale >= threshold
        ? '#262626' //// 128 - 255
        : '#FFFFFF'; ////  0 - 127
}

function assignColumns(buildinColumns, columns) {
    if (isNull(buildinColumns) || isNotEmptyArray(columns)) {
        return columns
            .map(col => {
                const column
                    = 'object' === typeof col
                        ? { ...buildinColumns[col.key], ...col }
                        : { ...buildinColumns[col] };
                const render = column.render;
                if ('function' === typeof render) {
                    column.render = (value, record) => render(value, record, column);
                }
                return column;
            })
            .filter(e => isNotNull(e));
    }
    return [];
}

/**
 * Convert pixel from image natrual size in mm based on DPI settings
 *
 * @param {number} sizeInMm
 * @param {number} [dpi=300] Default 300 dpi
 * @returns size in pixels
 */
function mm2pixel(sizeInMm, dpi = 300) {
    const IN_TO_MM = 25.4;
    const sizeInInch = sizeInMm / IN_TO_MM;
    return sizeInInch * dpi;
}

/**
 *
 * This is necessary as the javascript % operator is actually a remainder, not modulus, and does not handle negatives properly.
 * @param {Number} a
 * @param {Number} n
 * @returns mod
 */
function mod(a, n) {
    return ((a % n) + n) % n;
}
function addZero(value) {
    return value > 9 ? value : `0${value}`;
}
function formatDate(date, type = 1) {
    const Time = new Date(date);
    const Year = Time.getFullYear();
    const Mouth
        = addZero(Time.getMonth() + 1);
    const Day = addZero(Time.getDate());
    const Hour = addZero(Time.getHours());
    const Min
        = addZero(Time.getMinutes());
    const Second
        = addZero(Time.getSeconds());
    const dateStr = `${Year}-${Mouth}-${Day}`;
    const timeStr = `${Hour}:${Min}:${Second}`;
    if (type === 1) {
        return dateStr;
    } else if (type === 2) {
        return timeStr;
    } else if (type === 3) {
        return `${dateStr} ${timeStr}`;
    }
}
// base64编码
function encodeBase(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}
// base64解码
function decodeBase(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        // eslint-disable-next-line no-magic-numbers
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}
function upload() {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.click();
        input.onchange = e => {
            const file = e.target.files[0];
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('请上传正确的图片');
                reject(file);
            } else {
                resolve(file);
            }
        };
    });
}

function formatUtcTime(time, dateFormat = 'YYYY-MM-DD HH:mm:ss') {
    return moment.utc(time).local().format(dateFormat);
}

function checkPermisson(allowance = []) {
    try {
        const { roles = [] } = JSON.parse(localStorage.getItem('adminOption'));
        const arr = [];
        roles.map(role => {
            allowance.map(item => {
                if (role === item) {
                    arr.push(role);
                }
            });
        });
        return arr.length > 0;
    } catch (error) {
        return false;
    }
}

function randomWord(min) {
    var str = ' ',
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    //随机产生
    for (var i = 0; i < range; i++) {
        var pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
}

function isEmptyObject(obj) {
    return Object.getOwnPropertyNames(obj).length === 0;
}

export default {
    checkPermisson,
    encodeBase,
    decodeBase,
    isUndefined,
    isDefined,
    isNull,
    isNotNull,
    isNotEmptyString,
    isEmptyString,
    capitalize,
    isArray,
    isNotEmptyArray,
    isObject,
    parseIntSafety,
    parseFloatSafety,
    contains,
    formatNumber,
    resolvePagination,
    getEnumItem,
    generateUrl,
    throttle,
    calculateFontColor,
    assignColumns,
    getFileExtension,
    fileOrBlobToDataUrl,
    hex2rgb,
    mm2pixel,
    mod,
    formatDate,
    upload,
    formatUtcTime,
    randomWord,
    isEmptyObject
};
