// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['id-3700', 0],
    ['id-ac', 1],
    ['id-jt', 2],
    ['id-be', 3],
    ['id-bt', 4],
    ['id-kb', 5],
    ['id-bb', 6],
    ['id-ba', 7],
    ['id-ji', 8],
    ['id-ks', 9],
    ['id-nt', 10],
    ['id-se', 11],
    ['id-kr', 12],
    ['id-ib', 13],
    ['id-su', 14],
    ['id-ri', 15],
    ['id-sw', 16],
    ['id-ku', 17],
    ['id-la', 18],
    ['id-sb', 19],
    ['id-ma', 20],
    ['id-nb', 21],
    ['id-sg', 22],
    ['id-st', 23],
    ['id-pa', 24],
    ['id-jr', 25],
    ['id-ki', 26],
    ['id-1024', 27],
    ['id-jk', 28],
    ['id-go', 29],
    ['id-yo', 30],
    ['id-sl', 31],
    ['id-sr', 32],
    ['id-ja', 33],
    ['id-kt', 34]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/id/id-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/id/id-all.js">Indonesia</a>'
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
