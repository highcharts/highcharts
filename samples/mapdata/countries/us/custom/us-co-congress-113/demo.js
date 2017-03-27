// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-co-01', 0],
    ['us-co-04', 1],
    ['us-co-02', 2],
    ['us-co-06', 3],
    ['us-co-05', 4],
    ['us-co-07', 5],
    ['us-co-03', 6]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/custom/us-co-congress-113'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/custom/us-co-congress-113.js">Colorado congressional districts</a>'
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
