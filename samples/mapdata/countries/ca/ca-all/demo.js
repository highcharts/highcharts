// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ca-5682', 0],
    ['ca-bc', 1],
    ['ca-nu', 2],
    ['ca-nt', 3],
    ['ca-ab', 4],
    ['ca-nl', 5],
    ['ca-sk', 6],
    ['ca-mb', 7],
    ['ca-qc', 8],
    ['ca-on', 9],
    ['ca-nb', 10],
    ['ca-ns', 11],
    ['ca-pe', 12],
    ['ca-yt', 13]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ca/ca-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ca/ca-all.js">Canada</a>'
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
