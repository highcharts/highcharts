// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ni-as', 0],
    ['ni-an', 1],
    ['ni-224', 2],
    ['ni-6330', 3],
    ['ni-ca', 4],
    ['ni-gr', 5],
    ['ni-ji', 6],
    ['ni-le', 7],
    ['ni-mn', 8],
    ['ni-ms', 9],
    ['ni-ci', 10],
    ['ni-es', 11],
    ['ni-md', 12],
    ['ni-mt', 13],
    ['ni-ns', 14],
    ['ni-bo', 15],
    ['ni-co', 16]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ni/ni-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ni/ni-all.js">Nicaragua</a>'
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
