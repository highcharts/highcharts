// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-nj-02', 0],
    ['us-nj-07', 1],
    ['us-nj-01', 2],
    ['us-nj-09', 3],
    ['us-nj-06', 4],
    ['us-nj-10', 5],
    ['us-nj-12', 6],
    ['us-nj-03', 7],
    ['us-nj-11', 8],
    ['us-nj-04', 9],
    ['us-nj-05', 10],
    ['us-nj-08', 11]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/custom/us-nj-congress-113'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/custom/us-nj-congress-113.js">New Jersey congressional districts</a>'
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
