// The region codes are available in the dictionary tab
// of the security details datapoint file.
const globalRegionClassification = {
    1: 'United States',
    2: 'Canada',
    3: 'Latin America',
    4: 'United Kingdom',
    5: 'Eurozone',
    6: 'Europe - ex Euro',
    7: 'Europe - Emerging',
    8: 'Africa',
    9: 'Middle East',
    10: 'Japan',
    11: 'Australasia',
    12: 'Asia - Developed',
    13: 'Asia - Emerging',
    14: 'Emerging Market',
    15: 'Developed Country',
    16: 'Not Classified'
};

// Helper function
Highcharts.Templating.helpers.translateGlobalRegion = value =>
    globalRegionClassification[value];

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
                type: 'RegionalExposure'
            }
        });

    await connector.load();

    const data = connector.getTable().getColumns(
        ['Type_F0GBR052QA', 'N_F0GBR052QA', 'Type_EUCA000550', 'N_EUCA000550']
    );

    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Region Breakdown Chart',
            margin: 30,
            align: 'left'
        },
        legend: {
            enabled: true,
            align: 'right',
            verticalAlign: 'top'
        },
        tooltip: {
            followPointer: true,
            shared: true,
            valueDecimals: 2,
            valueSuffix: '%',
            headerFormat:
                '<span style="font-size:10px;">' +
                '{translateGlobalRegion point.key}</span></br>'
        },
        xAxis: [{
            grid: {
                enabled: true,
                borderColor: '#E1E1E1'
            },
            categories: data.Type_F0GBR052QA,
            labels: {
                format: '{translateGlobalRegion value}'
            }
        }, {
            grid: {
                enabled: true,
                borderColor: '#E1E1E1'
            },
            categories: data.N_F0GBR052QA,
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
            categories: data.N_EUCA000550,
            labels: {
                format: '{value:.2f}%',
                align: 'right',
                x: -5
            },
            linkedTo: 0
        }],
        yAxis: {
            max: 100,
            title: {
                text: 'Region weight'
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
        series: [{
            name: 'Category',
            color: '#E1E1E6',
            data: data.N_F0GBR052QA
        }, {
            name: 'BlackRock Income and Growth Ord',
            color: '#274FE0',
            data: data.N_EUCA000550
        }]
    });
}

renderChart();
