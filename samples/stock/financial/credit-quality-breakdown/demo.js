// The region codes are available in the dictionary tab
// of the security details datapoint file.
const creditQualityClassification = {
    1: 'Government',
    2: 'AAA',
    3: 'AA',
    4: 'A',
    5: 'BBB',
    6: 'BB',
    7: 'B',
    8: 'Below B',
    9: 'Not Rated'
};

// Helpers
Highcharts.Templating.helpers.translateCreditQuality =
    value => creditQualityClassification[value];


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
            converter: {
                type: 'CreditQualityBreakdown'
            },
            security: {
                ids: ['F00001GPCX', 'F00000YG2F'],
                idType: 'MSID'
            }
        });

    await connector.load();

    // Extract data from table
    const data = connector.getTable().getColumns(
        ['Type_F00001GPCX', 'N_F00001GPCX', 'Type_F00000YG2F', 'N_F00000YG2F']
    );

    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Credit Quality Chart',
            margin: 30,
            align: 'left'
        },
        legend: {
            align: 'right',
            verticalAlign: 'top'
        },
        xAxis: [{
            grid: {
                enabled: true,
                borderColor: '#E1E1E1'
            },
            categories: data.Type_F00001GPCX,
            labels: {
                format: '{translateCreditQuality value}'
            }
        }, {
            grid: {
                enabled: true,
                borderColor: '#E1E1E1'
            },
            categories: data.N_F00001GPCX,
            labels: {
                format: '{value:.2f}%',
                align: 'right',
                x: -5
            },
            linkedTo: 0
        }, {
            grid: {
                enabled: true,
                borderColor: '#E1E1E1'
            },
            categories: data.N_F00000YG2F,
            labels: {
                format: '{value:.2f}%',
                align: 'right',
                x: -5
            },
            linkedTo: 0
        }],
        yAxis: {
            title: {
                text: 'Credit quality weight'
            },
            labels: {
                format: '{value}%'
            }
        },
        plotOptions: {
            series: {
                minPointLength: 3,
                borderWidth: 1,
                borderColor: '#0000001C'
            }
        },
        tooltip: {
            followPointer: true,
            headerFormat:
                '<span style="font-size: 10px">' +
                '{translateCreditQuality point.key}</span><br/>',
            shared: true,
            valueSuffix: '%'
        },
        series: [{
            name: 'Aviva Investors - ' +
                'Emerging Markets Corporate Bond Fund I USD Acc',
            color: '#E1E1E6',
            data: data.N_F00001GPCX
        }, {
            name: 'Aviva Investors - Emerging Markets Bond Fund K USD Acc',
            color: '#274FE0',
            data: data.N_F00000YG2F
        }]
    });
}

renderChart();
