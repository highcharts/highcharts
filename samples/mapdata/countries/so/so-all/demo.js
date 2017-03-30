// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['so-br', 0],
    ['so-by', 1],
    ['so-ge', 2],
    ['so-bk', 3],
    ['so-jd', 4],
    ['so-sh', 5],
    ['so-bn', 6],
    ['so-ga', 7],
    ['so-hi', 8],
    ['so-sd', 9],
    ['so-mu', 10],
    ['so-nu', 11],
    ['so-jh', 12]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/so/so-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/so/so-all.js">Somalia</a>'
    },

    mapNavigation: {
        enabled: true,
        buttonOptions: {
            verticalAlign: 'bottom'
        }
    },

    colorAxis: {
        min: 0
    },

    series: [{
        data: data,
        name: 'Random data',
        states: {
            hover: {
                color: '#BADA55'
            }
        },
        dataLabels: {
            enabled: true,
            format: '{point.name}'
        }
    }]
});
