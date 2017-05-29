// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['co-sa', 0],
    ['co-ca', 1],
    ['co-na', 2],
    ['co-ch', 3],
    ['co-3653', 4],
    ['co-to', 5],
    ['co-cq', 6],
    ['co-hu', 7],
    ['co-pu', 8],
    ['co-am', 9],
    ['co-bl', 10],
    ['co-vc', 11],
    ['co-su', 12],
    ['co-at', 13],
    ['co-ce', 14],
    ['co-lg', 15],
    ['co-ma', 16],
    ['co-ar', 17],
    ['co-ns', 18],
    ['co-cs', 19],
    ['co-gv', 20],
    ['co-me', 21],
    ['co-vp', 22],
    ['co-vd', 23],
    ['co-an', 24],
    ['co-co', 25],
    ['co-by', 26],
    ['co-st', 27],
    ['co-cl', 28],
    ['co-cu', 29],
    ['co-1136', 30],
    ['co-ri', 31],
    ['co-qd', 32],
    ['co-gn', 33]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/co/co-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/co/co-all.js">Colombia</a>'
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
