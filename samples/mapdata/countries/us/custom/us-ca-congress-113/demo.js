// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-ca-26', 0],
    ['us-ca-24', 1],
    ['us-ca-47', 2],
    ['us-ca-14', 3],
    ['us-ca-51', 4],
    ['us-ca-28', 5],
    ['us-ca-33', 6],
    ['us-ca-36', 7],
    ['us-ca-31', 8],
    ['us-ca-45', 9],
    ['us-ca-48', 10],
    ['us-ca-46', 11],
    ['us-ca-34', 12],
    ['us-ca-40', 13],
    ['us-ca-30', 14],
    ['us-ca-12', 15],
    ['us-ca-18', 16],
    ['us-ca-13', 17],
    ['us-ca-20', 18],
    ['us-ca-16', 19],
    ['us-ca-37', 20],
    ['us-ca-43', 21],
    ['us-ca-32', 22],
    ['us-ca-35', 23],
    ['us-ca-42', 24],
    ['us-ca-44', 25],
    ['us-ca-09', 26],
    ['us-ca-15', 27],
    ['us-ca-10', 28],
    ['us-ca-41', 29],
    ['us-ca-08', 30],
    ['us-ca-27', 31],
    ['us-ca-17', 32],
    ['us-ca-53', 33],
    ['us-ca-52', 34],
    ['us-ca-49', 35],
    ['us-ca-25', 36],
    ['us-ca-07', 37],
    ['us-ca-06', 38],
    ['us-ca-04', 39],
    ['us-ca-39', 40],
    ['us-ca-38', 41],
    ['us-ca-05', 42],
    ['us-ca-02', 43],
    ['us-ca-11', 44],
    ['us-ca-03', 45],
    ['us-ca-23', 46],
    ['us-ca-50', 47],
    ['us-ca-01', 48],
    ['us-ca-21', 49],
    ['us-ca-22', 50],
    ['us-ca-19', 51],
    ['us-ca-29', 52]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/custom/us-ca-congress-113'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/custom/us-ca-congress-113.js">California congressional districts</a>'
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
