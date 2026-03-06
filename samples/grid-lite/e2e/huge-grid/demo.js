const columnsTenMillion = {
    'Row number': Array.from({ length: 10000000 }, (_, i) => i + 1)
};
const columnsOneMillion = {
    'Row number': Array.from({ length: 1000000 }, (_, i) => i + 1),
    'Variable height': Array.from({ length: 1000000 }, (_, i) => i + 1)
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
    columns: [
        {},
        {
            id: 'Variable height',
            cells: {
                formatter: function () {
                    const n = this.value;
                    if (n % 5 === 0) {
                        return 'Tall row<br/>Line 2<br/>Line 3<br/>Line 4';
                    }
                    if (n % 25 === 0) {
                        return 'Medium row<br/>Line 2';
                    }
                    return 'Short';
                }
            }
        }
    ],
    rendering: {
        rows: {
            strictHeights: false
        }
    }
});
