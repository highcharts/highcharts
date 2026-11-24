const months = Array.from({ length: 12 }, (_, i) => Date.UTC(2025, i, 1));

const monthlyGridPromise = Grid.grid('monthly', {
    data: {
        columns: {
            month: months,
            revenue: [
                120, 132, 101, 134, 190, 230, 210, 182, 191, 234, 290, 330
            ],
            cost: [80, 85, 90, 92, 110, 120, 130, 118, 121, 140, 160, 170],
            visitors: [
                2200, 2400, 2100, 2600, 3100, 3500, 3300, 3000, 3200, 3600,
                4100, 4500
            ]
        }
    },
    columns: [{
        id: 'month',
        dataType: 'datetime',
        header: { format: 'Month' },
        cells: { format: '{value:%b %Y}' }
    }, {
        id: 'revenue',
        header: { format: 'Revenue' },
        cells: { format: '{value} k€' }
    }, {
        id: 'cost',
        header: { format: 'Cost' },
        cells: { format: '{value} k€' }
    }, {
        id: 'visitors',
        header: { format: 'Visitors' }
    }],
    events: {
        afterChartCreate: function (e) {
            console.log('Chart created', e.chartType, e.columns);
        }
    }
}, true);

const regionGridPromise = Grid.grid('regions', {
    data: {
        columns: {
            region: ['North', 'South', 'East', 'West', 'Central', 'Islands'],
            sales: [420, 310, 280, 390, 220, 90],
            margin: [12.5, 9.8, 14.1, 11.2, 8.4, 16.3],
            customers: [1200, 950, 870, 1100, 640, 210]
        }
    },
    columns: [{
        id: 'region',
        header: { format: 'Region' }
    }, {
        id: 'sales',
        header: { format: 'Sales (k€)' }
    }, {
        id: 'margin',
        header: { format: 'Margin (%)' }
    }, {
        id: 'customers',
        header: { format: 'Customers' }
    }],
    rowSelection: {
        enabled: true,
        mode: 'multiple',
        checkbox: { enabled: true }
    },
    charting: {
        chartOptions: {
            credits: { enabled: false }
        }
    }
}, true);

/**
 * Adds a button that creates a chart from the given grid.
 */
function addButton(containerId, label, grid, options) {
    const button = document.createElement('button');
    const recommended = grid.charting.getRecommendations(options.columns);

    button.textContent = label + ' (' +
        (options.type || recommended[0]) + '; recommended: ' +
        recommended.join(', ') + ')';
    button.addEventListener('click', () => grid.charting.createChart(options));
    document.getElementById(containerId).appendChild(button);
}

Promise.all([monthlyGridPromise, regionGridPromise]).then(([
    monthlyGrid,
    regionGrid
]) => {
    addButton('monthly-buttons', 'Revenue & cost over time', monthlyGrid, {
        columns: ['month', 'revenue', 'cost']
    });
    addButton('monthly-buttons', 'Visitors over time as area', monthlyGrid, {
        columns: ['month', 'visitors'],
        type: 'area'
    });
    addButton('monthly-buttons', 'Revenue vs visitors', monthlyGrid, {
        columns: ['visitors', 'revenue']
    });

    addButton('region-buttons', 'Sales by region', regionGrid, {
        columns: ['region', 'sales']
    });
    addButton('region-buttons', 'Sales share as pie', regionGrid, {
        columns: ['region', 'sales'],
        type: 'pie'
    });
    addButton('region-buttons', 'Sales, margin, customers', regionGrid, {
        columns: ['sales', 'margin', 'customers']
    });
    addButton('region-buttons', 'Sales & customers by region', regionGrid, {
        columns: ['region', 'sales', 'customers']
    });
    addButton('region-buttons', 'Sales & customers stacked', regionGrid, {
        columns: ['region', 'sales', 'customers'],
        type: 'stackedColumn'
    });

    // Charts the rows checked in the Grid
    const selectedButton = document.createElement('button');
    selectedButton.textContent = 'Sales of the selected regions';
    selectedButton.addEventListener('click', () => {
        const rows = regionGrid.rowSelection.getSelectedRowIds();

        if (rows.length) {
            regionGrid.charting.createChart({
                columns: ['region', 'sales'],
                rows
            });
        }
    });
    document.getElementById('region-buttons').appendChild(selectedButton);

    regionGrid.charting.createChart({
        columns: ['region', 'customers'],
        renderTo: 'chart',
        chartOptions: {
            title: { text: 'Customers per region (renderTo)' }
        }
    });
});
