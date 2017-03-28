// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-nc-03', 0],
    ['us-nc-07', 1],
    ['us-nc-08', 2],
    ['us-nc-09', 3],
    ['us-nc-01', 4],
    ['us-nc-13', 5],
    ['us-nc-06', 6],
    ['us-nc-10', 7],
    ['us-nc-05', 8],
    ['us-nc-11', 9],
    ['us-nc-02', 10],
    ['us-nc-12', 11],
    ['us-nc-04', 12]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/custom/us-nc-congress-113'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/custom/us-nc-congress-113.js">North Carolina congressional districts</a>'
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
