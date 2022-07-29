import { post, get } from './api';
import config from './request.config';
import StockSession from 'utils/session';
const baseURL = config.getBaseUrl()
const stockApi = {
    async createUser(request) {
        return get(`${baseURL}stock/user/register`, request, 'application/json', true, '', true);
    },
    async getStockList(request) {
        return get(`${baseURL}stock/stock/list`, request, 'application/json', true, '', true);
    },
    async createStock(request) {
        return post(`${baseURL}stock/stock/add`, request, 'application/json', true, '', true);
    },
    async getStock(request) {
        return get(`${baseURL}Stock`, request, 'application/json', true, '', true);
    },
    async getStockByDate(request) {
        return get(`${baseURL}stock/stock/getData`, request, 'application/json', true, '', true);
    },
    
    
}
export default stockApi;
