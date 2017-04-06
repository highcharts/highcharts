// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['mx-3622', 0],
    ['mx-bc', 1],
    ['mx-bs', 2],
    ['mx-so', 3],
    ['mx-cl', 4],
    ['mx-na', 5],
    ['mx-cm', 6],
    ['mx-qr', 7],
    ['mx-mx', 8],
    ['mx-mo', 9],
    ['mx-df', 10],
    ['mx-qt', 11],
    ['mx-tb', 12],
    ['mx-cs', 13],
    ['mx-nl', 14],
    ['mx-si', 15],
    ['mx-ch', 16],
    ['mx-ve', 17],
    ['mx-za', 18],
    ['mx-ag', 19],
    ['mx-ja', 20],
    ['mx-mi', 21],
    ['mx-oa', 22],
    ['mx-pu', 23],
    ['mx-gr', 24],
    ['mx-tl', 25],
    ['mx-tm', 26],
    ['mx-co', 27],
    ['mx-yu', 28],
    ['mx-dg', 29],
    ['mx-gj', 30],
    ['mx-sl', 31],
    ['mx-hg', 32]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/mx/mx-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/mx/mx-all.js">Mexico</a>'
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
