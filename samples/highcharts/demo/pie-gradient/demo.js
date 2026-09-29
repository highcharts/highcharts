// eslint-disable-next-line max-len
// Data retrieved from https://www.ssb.no/en/transport-og-reiseliv/landtransport/statistikk/bilparken
// Radialize the colors
Highcharts.setOptions({
    colors: Highcharts.getOptions().colors.map(color => ({
        radialGradient: {
            cx: 0.5,
            cy: 0.3,
            r: 0.7
        },
        stops: [
            // The `color` is a CSS color string on the form
            // `var(--highcharts-color-{n})`, where `n` is the index of the
            // color in the `palette.colors` array.
            [0, color],
            [1, `color-mix(${color} 70%, black 30%)`] // darken
        ]
    }))
});

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
