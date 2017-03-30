// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-ga-01', 0],
    ['us-ga-11', 1],
    ['us-ga-04', 2],
    ['us-ga-05', 3],
    ['us-ga-12', 4],
    ['us-ga-13', 5],
    ['us-ga-10', 6],
    ['us-ga-03', 7],
    ['us-ga-09', 8],
    ['us-ga-02', 9],
    ['us-ga-07', 10],
    ['us-ga-06', 11],
    ['us-ga-08', 12],
    ['us-ga-14', 13]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/custom/us-ga-congress-113'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/custom/us-ga-congress-113.js">Georgia congressional districts</a>'
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
