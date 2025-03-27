function generateRandomData(rows) {
    return {
        Data: Array.from({ length: rows }, () => Math.floor(Math.random() * 11))
    };
}

Grid.grid('container', {
    dataTable: {
        columns: generateRandomData(100)
    }
});
