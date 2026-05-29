const globalRegionClassification = {
    AfricaormiddleEast: 'Africa/Middle East',
    Americas: 'Americas',
    AsiaDev: 'Asia (Developed)',
    AsiaEmrg: 'Asia (Emerging)',
    Australasia: 'Australasia',
    Developed: 'Developed Markets',
    EuropeDev: 'Europe (Developed)',
    EuropeEmrg: 'Europe (Emerging)',
    Emerging: 'Emerging Markets',
    GreaterAsia: 'Greater Asia',
    GreaterEurope: 'Greater Europe',
    Japan: 'Japan',
    LatinAmerica: 'Latin America',
    NorthAmerica: 'North America',
    NotClassified: 'Not Classified',
    UnitedKingdom: 'United Kingdom',
    UnitedStates: 'United States'
};

// Helper function
Highcharts.Templating.helpers.translateRegionClassification = value =>
    globalRegionClassification[value];

async function renderChart() {

    // Then configure the connector
    const connector =
        new HighchartsConnectors.MorningstarDWS.InvestmentsConnector({
            api: {
                url: 'https://demo-live-data.highcharts.com',
                access: {
                    url: 'https://demo-live-data.highcharts.com/token/oauth',
                    token: 'token'
                }
            },
            security: {
                id: '0P0000XTUQ'
            },
            converters: {
                CountryAndRegionExposure: {}
            }
        });

    await connector.load();

    // Extract data from table
    const table = connector.getTable('RegionFixedIncome'),
        data = table.getColumns(['Region', 'PercLongRescaled']);

    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Region Breakdown Chart',
            margin: 30,
            align: 'left'
        },
        xAxis: [{
            grid: {
                enabled: true,
                borderColor: '#E1E1E1'
            },
            categories: data.Region,
            labels: {
                format: '{translateRegionClassification value}'
            }
        }, {
            grid: {
                enabled: true,
                borderColor: '#E1E1E1'
            },
            categories: data.PercLongRescaled,
            labels: {
                format: '{value:.2f}%',
                align: 'right',
                x: -5
            },
            linkedTo: 0
        }],
        legend: {
            align: 'right',
            verticalAlign: 'top'
        },
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
                borderColor: '#0000001C'
            }
        },
        tooltip: {
            followPointer: true,
            headerFormat:
                '<span style="font-size:10px;">{series.name}</span></br>',
            pointFormat:
            '<span style="color:{point.color}">\u25CF</span>' +
            '{translateRegionClassification point.key}' +
            '<b> {point.y:.2f}%</b><br/>'
        },
        series: [{
            name: 'Anfield Universal Fixed Income Fund',
            color: '#274FE0',
            data: data.PercLongRescaled
        }]
    });
}

renderChart();
