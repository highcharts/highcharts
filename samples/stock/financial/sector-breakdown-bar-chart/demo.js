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

    // Parse data from two securities and return a Highcharts compatible array
    const parseData = table => {
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

        let index = 0;
        for (const [key, sector] of Object.entries(
            globalStockSectorBreakdown
        )) {
            category.push({
                name: sector,
                x: index,
                y: categoryData[key]
            });

            target.push({
                name: sector,
                x: index,
                y: targetData[key]
            });

            index++;
        }

        return {
            category,
            target
        };
    };

    const dataset = parseData(connector.getTable());

    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Sector Breakdown Chart',
            margin: 30,
            align: 'left'
        },
        xAxis: [{
            grid: {
                enabled: true,
                borderColor: '#E1E1E1'
            },
            categories: dataset.target,
            labels: {
                format: '{value.name}'
            }
        }, {
            grid: {
                enabled: true,
                borderColor: '#E1E1E1'
            },
            categories: dataset.target,
            labels: {
                format:
                    '{#if (eq value.y undefined)}N/A{else}{value.y:.2f}%{/if}',
                align: 'right',
                x: -5
            },
            linkedTo: 0
        }, {
            grid: {
                enabled: true,
                borderColor: '#E1E1E1'
            },
            categories: dataset.category,
            labels: {
                format:
                    '{#if (eq value.y undefined)}N/A{else}{value.y:.2f}%{/if}',
                align: 'right',
                x: -5
            },
            linkedTo: 0
        }],
        legend: {
            enabled: true,
            align: 'right',
            verticalAlign: 'top'
        },
        yAxis: {
            title: {
                text: 'Sector weight'
            },
            labels: {
                format: '{value}%'
            }
        },
        plotOptions: {
            series: {
                minPointLength: 3,
                borderWidth: 1,
                borderColor: '#0001C'
            }
        },
        tooltip: {
            followPointer: true,
            shared: true,
            valueDecimals: 2,
            valueSuffix: '%',
            headerFormat:
                '<span style="font-size:10px;">{point.key}</span></br>'
        },
        series: [{
            name: 'Category',
            data: dataset.category,
            color: '#E1E1E6'
        }, {
            name: 'BlackRock Income and Growth Ord',
            data: dataset.target,
            color: '#274FE0'
        }]
    });
}

renderChart();
