// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ne-ni', 0],
    ['ne-tl', 1],
    ['ne-ag', 2],
    ['ne-ma', 3],
    ['ne-zi', 4],
    ['ne-ds', 5],
    ['ne-th', 6],
    ['ne-df', 7]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ne/ne-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ne/ne-all.js">Niger</a>'
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
