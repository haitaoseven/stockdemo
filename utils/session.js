function StockSession() {
    this.setItem = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    };

    this.isExpire = () => {
        const setupTime = localStorage.getItem('stock-initial-time');
        const hours = 10;
        const now = new Date().getTime();
        if (setupTime == null || now - parseInt(setupTime) > hours * 60 * 60 * 1000 - 60 * 1000) {
            this.removeItem('stock-user');
            this.removeItem('stock-admin-user');
            this.removeItem('stock-initial-time');
            return true;
        }
        return false;
    };

    this.getItem = key => {
        var value = localStorage.getItem(key);
        return JSON.parse(value || '{}');
    };

    this.removeItem = key => {
        localStorage.removeItem(key);
    };
}

export default new StockSession();