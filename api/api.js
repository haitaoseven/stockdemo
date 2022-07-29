import { service } from './axios.config';
import StockSession from 'utils/session';

const getAccessToken = () => {
    const token = StockSession.getItem('accessToken');
    if (token) {
        return token;
    }
    return '';
};
const getToken = () => {
    const user = StockSession.getItem('mps-user');
    if (user && !StockSession.isExpire()) {
        return user.token;
    }
    return '';
    // return getAccessToken();
};

const buildHeader = (contentType, isAuthorization, isAccessToken, user = '') => {
    return '';
    let token;
    if (isAccessToken === true) {
        token = getAccessToken();
    } else {
        token = getToken();
    }
    return { 'Content-Type': contentType, Authorization: isAuthorization ? `Bearer ${token}` : null, user };
};

export function get(url, data, isAuthorization = true, isAccessToken = true) {
    const headers = buildHeader('application/json', isAuthorization, isAccessToken);
    console.log(url)
    return service.get(url, { params: data, headers });
}
export function post(url, params, contentType = 'application/json', isAuthorization = true, responseType = '', isAccessToken = true, user = '') {
    const headerObj = buildHeader(contentType, isAuthorization, isAccessToken, user);
    return service.post(url, params, { headers: headerObj, responseType });
}
export function put(url, params, config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAccessToken()}` } }) {
    return service.put(url, params, config);
}
export function del(url, data) {
    return service.delete(url, { data, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAccessToken()}` } });
}
export function del_user(url, data) {
    return service.delete(url, { data, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` } });
}
