// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-il-12', 0],
    ['us-il-01', 1],
    ['us-il-11', 2],
    ['us-il-04', 3],
    ['us-il-07', 4],
    ['us-il-05', 5],
    ['us-il-08', 6],
    ['us-il-09', 7],
    ['us-il-02', 8],
    ['us-il-18', 9],
    ['us-il-15', 10],
    ['us-il-16', 11],
    ['us-il-14', 12],
    ['us-il-13', 13],
    ['us-il-17', 14],
    ['us-il-06', 15],
    ['us-il-03', 16],
    ['us-il-10', 17]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/custom/us-il-congress-113'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/custom/us-il-congress-113.js">Illinois congressional districts</a>'
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
