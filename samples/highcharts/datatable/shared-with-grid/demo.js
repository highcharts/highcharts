// Define the common data table
const dataTable = new Grid.DataTable({
    columns: {
        year: [2020, 2021, 2022, 2023],
        cost: [11, 13, 12, 14],
        revenue: [12, 15, 14, 18]
    }
});

// Create the chart
Highcharts.chart('chart-container', {
    dataTable,
    chart: {
        type: 'column'
    },
    title: {
        text: ''
    },
    series: [{
        name: 'Cost',
        dataMapping: {
            x: {
                column: 'year'
            },
            y: {
                column: 'cost'
            }
        }
    }, {
        name: 'Revenue',
        dataMapping: {
            x: {
                column: 'year'
            },
            y: {
                column: 'revenue'
            }
        }
    }]
});

// Create the grid
Grid.grid('grid-container', {
    data: {
        dataTable,
        updateOnChange: true
    },
    columns: [{
        id: 'year',
        cells: {
            // No thousands separator
            format: '{value}'
        }
    }]
});

document.getElementById('addrow').addEventListener('click', e => {
    dataTable.setRow({
        year: 2024,
        cost: 15,
        revenue: 20
    });
    e.target.disabled = true;
});

document.getElementById('updaterow').addEventListener('click', () => {
    dataTable.setRow({
        cost: Math.round(15 * Math.random()),
        revenue: Math.round(10 * Math.random())
    }, 1);
});

document.getElementById('deleterow').addEventListener('click', e => {
    dataTable.deleteRows(0);
    e.target.disabled = true;
});

document.getElementById('setcolumn').addEventListener('click', () => {
    dataTable.setColumn(
        'revenue',
        dataTable.getColumns().revenue.map(() => Math.round(10 * Math.random()))
    );
});
