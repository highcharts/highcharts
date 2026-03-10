const dataTable = {
    columns: {
        product: Array(20).fill('key'),
        weight: Array(20).fill(0).map((_, i) => i)
    }
};

['container', 'grid2', 'grid3', 'grid4'].forEach(id => Grid.grid(id, { dataTable })); // eslint-disable-line no-loop-func, max-len