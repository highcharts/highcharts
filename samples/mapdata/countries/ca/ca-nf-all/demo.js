// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ca-nl-1009', 0],
    ['ca-nl-1008', 1],
    ['ca-nl-1007', 2],
    ['ca-nl-1003', 3],
    ['ca-nl-1001', 4],
    ['ca-nl-1002', 5],
    ['ca-nl-1010', 6],
    ['ca-nl-1011', 7],
    ['ca-nl-1006', 8],
    ['ca-nl-1005', 9],
    ['ca-nl-1004', 10]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ca/ca-nf-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ca/ca-nf-all.js">Newfoundland and Labrador</a>'
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
