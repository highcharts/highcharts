const columns = {
    'Row number': Array.from({ length: 10000000 }, (_, i) => i + 1)
};

Grid.grid('container', {
    dataTable: {
        columns
    },
    columnDefaults: {
        cells: {
            format: '{value:,.0f}'
        }
    },
    rendering: {
        rows: {
            strictHeights: true
        }
    }
});
