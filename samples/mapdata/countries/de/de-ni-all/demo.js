// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['de-ni-03452000', 0],
    ['de-ni-03461000', 1],
    ['de-ni-03353000', 2],
    ['de-ni-04011000', 3],
    ['de-ni-03459000', 4],
    ['de-ni-03455000', 5],
    ['de-ni-03352000', 6],
    ['de-ni-03356000', 7],
    ['de-ni-03361000', 8],
    ['de-ni-03404000', 9],
    ['de-ni-03403000', 10],
    ['de-ni-03155000', 11],
    ['de-ni-03457000', 12],
    ['de-ni-03462000', 13],
    ['de-ni-03360000', 14],
    ['de-ni-03152000', 15],
    ['de-ni-03153000', 16],
    ['de-ni-03158000', 17],
    ['de-ni-03401000', 18],
    ['de-ni-03451000', 19],
    ['de-ni-03458000', 20],
    ['de-ni-03358000', 21],
    ['de-ni-03355000', 22],
    ['de-ni-03402000', 23],
    ['de-ni-03254000', 24],
    ['de-ni-03102000', 25],
    ['de-ni-03241000', 26],
    ['de-ni-03151000', 27],
    ['de-ni-03154000', 28],
    ['de-ni-03101000', 29],
    ['de-ni-03251000', 30],
    ['de-ni-03156000', 31],
    ['de-ni-03359000', 32],
    ['de-ni-03256000', 33],
    ['de-ni-03454000', 34],
    ['de-ni-03354000', 35],
    ['de-ni-03257000', 36],
    ['de-ni-03405000', 37],
    ['de-ni-03456000', 38],
    ['de-ni-03252000', 39],
    ['de-ni-03255000', 40],
    ['de-ni-03357000', 41],
    ['de-ni-03103000', 42],
    ['de-ni-03453000', 43],
    ['de-ni-03460000', 44],
    ['de-ni-03351000', 45],
    ['de-ni-03157000', 46]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/de/de-ni-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-ni-all.js">Niedersachsen</a>'
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
