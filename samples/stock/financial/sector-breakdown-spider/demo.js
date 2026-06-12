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

    // Parse data from two connectors and return a Highcharts compatible array
    const parseData = connector => {
        const table = connector.getTable('GlobalStockSectorBreakdown');

        // Reduce callback for getting the right values in the right order
        const reduceCallback = (obj, row) => {
            if (row[0] !== undefined) {
                obj[row[0]] = row[1];
            }
            return obj;
        };

        const category = [],
            categoryData = table
                .getRows(0, table.getRowCount(), [
                    'Type_EUCA000550',
                    'L_EUCA000550'
                ])
                .reduce(reduceCallback, {});

        const target = [],
            targetData = table
                .getRows(0, table.getRowCount(), [
                    'Type_F0GBR052QA',
                    'L_F0GBR052QA'
                ])
                .reduce(reduceCallback, {});

        for (const [key, sector] of Object.entries(
            globalStockSectorBreakdown
        )) {
            category.push([sector, categoryData[key]]);
            target.push([sector, targetData[key]]);
        }

        return {
            category,
            target
        };
    };

    const dataset = parseData(connector);

    Highcharts.chart('container', {
        chart: {
            polar: true,
            type: 'line',
            ignoreHiddenSeries: false
        },
        title: {
            text: 'Sector Breakdown Chart'
        },
        xAxis: {
            type: 'category',
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
                '{point.name}<b> {point.y:.2f}%</b><br/>'
        },
        series: [{
            name: 'Category',
            data: dataset.category,
            color: '#666666'
        }, {
            name: 'BlackRock Income and Growth Ord',
            data: dataset.target,
            color: '#274FE0'
        }]
    });
}

renderChart();
