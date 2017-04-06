// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['in-an', 0],
    ['in-wb', 1],
    ['in-ld', 2],
    ['in-5390', 3],
    ['in-py', 4],
    ['in-3464', 5],
    ['in-mz', 6],
    ['in-as', 7],
    ['in-pb', 8],
    ['in-ga', 9],
    ['in-2984', 10],
    ['in-jk', 11],
    ['in-hr', 12],
    ['in-nl', 13],
    ['in-mn', 14],
    ['in-tr', 15],
    ['in-mp', 16],
    ['in-ct', 17],
    ['in-ar', 18],
    ['in-ml', 19],
    ['in-kl', 20],
    ['in-tn', 21],
    ['in-ap', 22],
    ['in-ka', 23],
    ['in-mh', 24],
    ['in-or', 25],
    ['in-dn', 26],
    ['in-dl', 27],
    ['in-hp', 28],
    ['in-rj', 29],
    ['in-up', 30],
    ['in-ut', 31],
    ['in-jh', 32],
    ['in-ch', 33],
    ['in-br', 34],
    ['in-sk', 35]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/in/custom/in-all-disputed'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/in/custom/in-all-disputed.js">India with disputed territories</a>'
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
