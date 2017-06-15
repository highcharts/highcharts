// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-fl-16', 0],
    ['us-fl-26', 1],
    ['us-fl-02', 2],
    ['us-fl-25', 3],
    ['us-fl-19', 4],
    ['us-fl-27', 5],
    ['us-fl-14', 6],
    ['us-fl-13', 7],
    ['us-fl-24', 8],
    ['us-fl-11', 9],
    ['us-fl-15', 10],
    ['us-fl-12', 11],
    ['us-fl-20', 12],
    ['us-fl-18', 13],
    ['us-fl-22', 14],
    ['us-fl-06', 15],
    ['us-fl-08', 16],
    ['us-fl-17', 17],
    ['us-fl-09', 18],
    ['us-fl-10', 19],
    ['us-fl-07', 20],
    ['us-fl-23', 21],
    ['us-fl-03', 22],
    ['us-fl-05', 23],
    ['us-fl-04', 24],
    ['us-fl-01', 25],
    ['us-fl-21', 26]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/custom/us-fl-congress-113'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/custom/us-fl-congress-113.js">Florida congressional districts</a>'
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
