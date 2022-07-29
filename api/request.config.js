const ENVHOST = process.env.ENVHOST;

function getBaseUrl() {
    return 'http://localhost:9001/api/v1/';
}

export default {
    getBaseUrl
};