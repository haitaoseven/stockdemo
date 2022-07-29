const APIHOST = process.env.APIHOST;


function getBaseUrl() {
    return `http://${APIHOST}:9010/api/v1/`;
}

export default {
    getBaseUrl
};