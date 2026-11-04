// Define the common data table
const dataTable = new Grid.DataTable({
    columns: {
        Year: [2020, 2021, 2022, 2023],
        Cost: [11, 13, 12, 14],
        Revenue: [12, 15, 14, 18]
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
    plotOptions: {
        series: {
            dataMapping: {
                x: 'Year'
            }
        }
    },
    series: [{
        dataMapping: {
            y: 'Cost'
        }
    }, {
        dataMapping: {
            y: 'Revenue'
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
        id: 'Year',
        cells: {
            // No thousands separator
            format: '{value}'
        }
    }]
});

document.getElementById('addrow').addEventListener('click', e => {
    dataTable.setRow({
        Year: 2024,
        Cost: 15,
        Revenue: 20
    });
    e.target.disabled = true;
});

document.getElementById('updaterow').addEventListener('click', () => {
    dataTable.setRow({
        Cost: Math.round(15 * Math.random()),
        Revenue: Math.round(10 * Math.random())
    }, 1);
});

document.getElementById('deleterow').addEventListener('click', e => {
    dataTable.deleteRows(0);
    e.target.disabled = true;
});

document.getElementById('setcolumn').addEventListener('click', () => {
    dataTable.setColumn(
        'Revenue',
        dataTable.getColumns().Revenue.map(() => Math.round(10 * Math.random()))
    );
});
