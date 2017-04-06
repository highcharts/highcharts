// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['in-5390', 0],
    ['in-py', 1],
    ['in-ld', 2],
    ['in-an', 3],
    ['in-wb', 4],
    ['in-or', 5],
    ['in-br', 6],
    ['in-sk', 7],
    ['in-ct', 8],
    ['in-tn', 9],
    ['in-mp', 10],
    ['in-2984', 11],
    ['in-ga', 12],
    ['in-nl', 13],
    ['in-mn', 14],
    ['in-ar', 15],
    ['in-mz', 16],
    ['in-tr', 17],
    ['in-3464', 18],
    ['in-dl', 19],
    ['in-hr', 20],
    ['in-ch', 21],
    ['in-hp', 22],
    ['in-jk', 23],
    ['in-kl', 24],
    ['in-ka', 25],
    ['in-dn', 26],
    ['in-mh', 27],
    ['in-as', 28],
    ['in-ap', 29],
    ['in-ml', 30],
    ['in-pb', 31],
    ['in-rj', 32],
    ['in-up', 33],
    ['in-ut', 34],
    ['in-jh', 35]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/in/custom/in-all-andaman-and-nicobar'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/in/custom/in-all-andaman-and-nicobar.js">India with Andaman and Nicobar</a>'
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
