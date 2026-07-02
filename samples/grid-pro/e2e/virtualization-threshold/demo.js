function generateRandomData(rows) {
    return {
        Data: Array.from({ length: rows }, () => Math.floor(Math.random() * 11))
    };
}

Grid.grid('container', {
    data: {
        columns: generateRandomData(100)
    }
});
