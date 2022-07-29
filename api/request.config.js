const ENVHOST = process.env.ENVHOST;

function getBaseUrl() {
    return 'http://localhost:9010/api/v1/';
}

export default {
    getBaseUrl
};