// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-oh-13', 0],
    ['us-oh-09', 1],
    ['us-oh-04', 2],
    ['us-oh-01', 3],
    ['us-oh-11', 4],
    ['us-oh-05', 5],
    ['us-oh-16', 6],
    ['us-oh-14', 7],
    ['us-oh-08', 8],
    ['us-oh-12', 9],
    ['us-oh-03', 10],
    ['us-oh-02', 11],
    ['us-oh-06', 12],
    ['us-oh-15', 13],
    ['us-oh-10', 14],
    ['us-oh-07', 15]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/custom/us-oh-congress-113'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/custom/us-oh-congress-113.js">Ohio congressional districts</a>'
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
