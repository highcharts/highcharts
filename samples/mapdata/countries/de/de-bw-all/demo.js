// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['de-bw-08136000', 0],
    ['de-bw-08116000', 1],
    ['de-bw-08415000', 2],
    ['de-bw-08115000', 3],
    ['de-bw-08117000', 4],
    ['de-bw-08425000', 5],
    ['de-bw-08226000', 6],
    ['de-bw-08236000', 7],
    ['de-bw-08235000', 8],
    ['de-bw-08231000', 9],
    ['de-bw-08125000', 10],
    ['de-bw-08215000', 11],
    ['de-bw-08111000', 12],
    ['de-bw-08222000', 13],
    ['de-bw-08221000', 14],
    ['de-bw-08212000', 15],
    ['de-bw-08216000', 16],
    ['de-bw-08118000', 17],
    ['de-bw-08119000', 18],
    ['de-bw-08311000', 19],
    ['de-bw-08316000', 20],
    ['de-bw-08135000', 21],
    ['de-bw-08417000', 22],
    ['de-bw-08237000', 23],
    ['de-bw-08225000', 24],
    ['de-bw-08128000', 25],
    ['de-bw-08435000', 26],
    ['de-bw-08127000', 27],
    ['de-bw-08335000', 28],
    ['de-bw-08317000', 29],
    ['de-bw-08336000', 30],
    ['de-bw-08326000', 31],
    ['de-bw-08337000', 32],
    ['de-bw-08436000', 33],
    ['de-bw-08437000', 34],
    ['de-bw-08426000', 35],
    ['de-bw-08421000', 36],
    ['de-bw-08315000', 37],
    ['de-bw-08121000', 38],
    ['de-bw-08416000', 39],
    ['de-bw-08211000', 40],
    ['de-bw-08325000', 41],
    ['de-bw-08327000', 42],
    ['de-bw-08126000', 43]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/de/de-bw-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-bw-all.js">Baden-Württemberg</a>'
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
