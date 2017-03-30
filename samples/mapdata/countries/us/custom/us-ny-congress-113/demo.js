// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-ny-11', 0],
    ['us-ny-21', 1],
    ['us-ny-01', 2],
    ['us-ny-07', 3],
    ['us-ny-05', 4],
    ['us-ny-24', 5],
    ['us-ny-16', 6],
    ['us-ny-17', 7],
    ['us-ny-15', 8],
    ['us-ny-23', 9],
    ['us-ny-08', 10],
    ['us-ny-12', 11],
    ['us-ny-18', 12],
    ['us-ny-02', 13],
    ['us-ny-10', 14],
    ['us-ny-25', 15],
    ['us-ny-04', 16],
    ['us-ny-13', 17],
    ['us-ny-09', 18],
    ['us-ny-19', 19],
    ['us-ny-20', 20],
    ['us-ny-22', 21],
    ['us-ny-03', 22],
    ['us-ny-26', 23],
    ['us-ny-27', 24],
    ['us-ny-14', 25],
    ['us-ny-06', 26]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/custom/us-ny-congress-113'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/custom/us-ny-congress-113.js">New York congressional districts</a>'
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
