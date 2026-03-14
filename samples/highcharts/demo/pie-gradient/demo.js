// eslint-disable-next-line max-len
// Data retrieved from https://www.ssb.no/en/transport-og-reiseliv/landtransport/statistikk/bilparken
// Radialize the colors
const colors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => ({
    radialGradient: {
        cx: 0.5,
        cy: 0.3,
        r: 0.7
    },
    stops: [
        // Base color
        [0, `var(--highcharts-color-${i})`],
        // Darker color
        [1, `color-mix(in srgb, var(--highcharts-color-${i}), #000 30%)`]
    ]
}));

// Build the chart
Highcharts.chart('container', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'Registered private vehicles in Norway, by type of fuel, 2020'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            colors,
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<span style="font-size: 1.2em"><b>{point.name}</b>' +
                    '</span><br>' +
                    '<span style="opacity: 0.6">{point.percentage:.1f} ' +
                    '%</span>',
                connectorColor: 'rgba(128,128,128,0.5)'
            }
        }
    },
    series: [{
        name: 'Share',
        data: [
            { name: 'Petrol', y: 938899 },
            { name: 'Diesel', y: 1229600 },
            { name: 'Electricity', y: 325251 },
            { name: 'Other', y: 238751 }
        ]
    }]
});
