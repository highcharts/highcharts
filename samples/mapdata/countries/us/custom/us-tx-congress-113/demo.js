// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-tx-34', 0],
    ['us-tx-14', 1],
    ['us-tx-27', 2],
    ['us-tx-20', 3],
    ['us-tx-21', 4],
    ['us-tx-32', 5],
    ['us-tx-03', 6],
    ['us-tx-31', 7],
    ['us-tx-10', 8],
    ['us-tx-04', 9],
    ['us-tx-36', 10],
    ['us-tx-25', 11],
    ['us-tx-35', 12],
    ['us-tx-28', 13],
    ['us-tx-23', 14],
    ['us-tx-11', 15],
    ['us-tx-13', 16],
    ['us-tx-26', 17],
    ['us-tx-07', 18],
    ['us-tx-05', 19],
    ['us-tx-22', 20],
    ['us-tx-09', 21],
    ['us-tx-18', 22],
    ['us-tx-19', 23],
    ['us-tx-06', 24],
    ['us-tx-17', 25],
    ['us-tx-16', 26],
    ['us-tx-01', 27],
    ['us-tx-33', 28],
    ['us-tx-15', 29],
    ['us-tx-12', 30],
    ['us-tx-24', 31],
    ['us-tx-30', 32],
    ['us-tx-08', 33],
    ['us-tx-02', 34],
    ['us-tx-29', 35]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/custom/us-tx-congress-113'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/custom/us-tx-congress-113.js">Texas congressional districts</a>'
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
