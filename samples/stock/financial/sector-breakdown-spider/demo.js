// Category names can be retrieved from the Morningstar Security Details API
// dictionary, under "Data Points" section
const globalStockSectorBreakdown = {
    101: 'Basic Materials',
    102: 'Consumer Cyclical',
    103: 'Financial Services',
    104: 'Real Estate',
    205: 'Consumer Defensive',
    206: 'Healthcare',
    207: 'Utilities',
    308: 'Communication Services',
    309: 'Energy',
    310: 'Industrials',
    311: 'Technology'
};

// Parse data from two connectors and return a chart-ready DataTable
function buildDataTable(source) {
    const valuesByType = (typeColumn, valueColumn) => source
        .getRows(0, source.getRowCount(), [typeColumn, valueColumn])
        .reduce((map, row) => {
            if (row[0] !== undefined) {
                map[row[0]] = row[1];
            }
            return map;
        }, {});

    const categoryByType = valuesByType('Type_EUCA000550', 'L_EUCA000550'),
        targetByType = valuesByType('Type_F0GBR052QA', 'L_F0GBR052QA'),
        name = [],
        category = [],
        target = [];

    for (const [type, sector] of Object.entries(globalStockSectorBreakdown)) {
        name.push(sector);
        category.push(categoryByType[type] || '-');
        target.push(targetByType[type] || '-');
    }

    return new Highcharts.DataTable({
        columns: {
            name,
            category,
            target
        }
    });
}

async function renderChart() {

    // Configure the connector
    const connector =
        new HighchartsConnectors.Morningstar.SecurityCompareConnector({
            api: {
                url: 'https://demo-live-data.highcharts.com',
                access: {
                    url: 'https://demo-live-data.highcharts.com/token/oauth',
                    token: 'token'
                }
            },
            security: {
                ids: ['F0GBR052QA', 'EUCA000550'],
                idType: 'MSID'
            },
            converter: {
                type: 'GlobalStockSectorBreakdown'
            }
        });

    await connector.load();
    const dataTable = buildDataTable(connector.getTable());

    Highcharts.chart('container', {
        chart: {
            polar: true,
            type: 'line'
        },
        title: {
            text: 'Sector Breakdown Chart'
        },
        dataTable,
        xAxis: {
            categories: dataTable.getColumn('name'),
            tickmarkPlacement: 'on',
            lineWidth: 0
        },
        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            labels: {
                format: '{value}%'
            },
            min: 0
        },
        tooltip: {
            followPointer: true,
            shared: true,
            animation: {
                duration: 0
            },
            pointFormat:
                '<span style="color:{point.color}">\u25CF</span> ' +
                '{series.name}<b> {point.y:.2f}%</b><br/>'
        },
        series: [{
            name: 'Category',
            dataMapping: {
                y: 'category'
            },
            color: '#666666'
        }, {
            name: 'BlackRock Income and Growth Ord',
            dataMapping: {
                y: 'target'
            },
            color: '#274FE0'
        }]
    });
}

renderChart();
