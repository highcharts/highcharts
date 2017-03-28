// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-ca', 0],
    ['us-or', 1],
    ['us-nd', 2],
    ['ca-sk', 3],
    ['us-mt', 4],
    ['us-az', 5],
    ['us-nv', 6],
    ['us-al', 7],
    ['us-nm', 8],
    ['us-co', 9],
    ['us-wy', 10],
    ['us-wi', 11],
    ['us-ks', 12],
    ['us-ne', 13],
    ['us-ok', 14],
    ['us-mi', 15],
    ['us-ak', 16],
    ['us-oh', 17],
    ['ca-bc', 18],
    ['ca-nu', 19],
    ['ca-nt', 20],
    ['ca-ab', 21],
    ['us-ma', 22],
    ['us-vt', 23],
    ['us-mn', 24],
    ['us-wa', 25],
    ['us-id', 26],
    ['us-ar', 27],
    ['us-tx', 28],
    ['us-ri', 29],
    ['us-fl', 30],
    ['us-ms', 31],
    ['us-ut', 32],
    ['us-nc', 33],
    ['us-ga', 34],
    ['us-va', 35],
    ['us-tn', 36],
    ['us-ia', 37],
    ['us-md', 38],
    ['us-de', 39],
    ['us-mo', 40],
    ['us-pa', 41],
    ['us-nj', 42],
    ['us-ny', 43],
    ['us-la', 44],
    ['us-nh', 45],
    ['us-me', 46],
    ['us-sd', 47],
    ['us-ct', 48],
    ['us-il', 49],
    ['us-in', 50],
    ['us-ky', 51],
    ['us-wv', 52],
    ['us-dc', 53],
    ['ca-on', 54],
    ['ca-qc', 55],
    ['ca-nb', 56],
    ['ca-ns', 57],
    ['ca-nl', 58],
    ['ca-mb', 59],
    ['us-sc', 60],
    ['ca-yt', 61],
    ['ca-pe', 62],
    ['undefined', 63]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'custom/usa-and-canada'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/usa-and-canada.js">Canada and United States of America</a>'
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
