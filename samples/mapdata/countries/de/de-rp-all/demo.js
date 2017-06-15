// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['de-rp-07211000', 0],
    ['de-rp-07138000', 1],
    ['de-rp-07143000', 2],
    ['de-rp-07313000', 3],
    ['de-rp-07317000', 4],
    ['de-rp-07131000', 5],
    ['de-rp-07319000', 6],
    ['de-rp-07137000', 7],
    ['de-rp-07231000', 8],
    ['de-rp-07134000', 9],
    ['de-rp-07235000', 10],
    ['de-rp-07141000', 11],
    ['de-rp-07233000', 12],
    ['de-rp-07318000', 13],
    ['de-rp-07314000', 14],
    ['de-rp-07331000', 15],
    ['de-rp-07336000', 16],
    ['de-rp-07232000', 17],
    ['de-rp-07132000', 18],
    ['de-rp-07135000', 19],
    ['de-rp-07311000', 20],
    ['de-rp-07315000', 21],
    ['de-rp-07333000', 22],
    ['de-rp-07133000', 23],
    ['de-rp-07111000', 24],
    ['de-rp-07312000', 25],
    ['de-rp-07332000', 26],
    ['de-rp-07340000', 27],
    ['de-rp-07335000', 28],
    ['de-rp-07316000', 29],
    ['de-rp-07338000', 30],
    ['de-rp-07320000', 31],
    ['de-rp-07337000', 32],
    ['de-rp-07339000', 33],
    ['de-rp-07140000', 34],
    ['de-rp-07334000', 35]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/de/de-rp-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-rp-all.js">Rheinland-Pfalz</a>'
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
