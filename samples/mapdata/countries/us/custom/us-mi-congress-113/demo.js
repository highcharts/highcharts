// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-mi-01', 0],
    ['us-mi-12', 1],
    ['us-mi-14', 2],
    ['us-mi-13', 3],
    ['us-mi-10', 4],
    ['us-mi-05', 5],
    ['us-mi-11', 6],
    ['us-mi-09', 7],
    ['us-mi-07', 8],
    ['us-mi-08', 9],
    ['us-mi-02', 10],
    ['us-mi-03', 11],
    ['us-mi-06', 12],
    ['us-mi-04', 13]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/custom/us-mi-congress-113'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/custom/us-mi-congress-113.js">Michigan congressional districts</a>'
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
