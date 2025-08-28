const columnsTenMillion = {
    'Row number': Array.from({ length: 10000000 }, (_, i) => i + 1)
};
const columnsOneMillion = {
    'Row number': Array.from({ length: 1000000 }, (_, i) => i + 1)
};

Grid.grid('grid-1', {
    dataTable: {
        columns: columnsTenMillion
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
Grid.grid('grid-2', {
    dataTable: {
        columns: columnsOneMillion
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
