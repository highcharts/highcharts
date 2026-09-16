const columns = {
    product: Array(20).fill('key'),
    weight: Array(20).fill(0).map((_, i) => i)
};

['container', 'grid2', 'grid3', 'grid4'].forEach(id => {
    Grid.grid(id, {
        data: {
            columns
        }
    });
});
