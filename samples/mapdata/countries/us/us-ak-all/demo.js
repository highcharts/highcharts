// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-ak-261', 0],
    ['us-ak-050', 1],
    ['us-ak-070', 2],
    ['us-ak-013', 3],
    ['us-ak-180', 4],
    ['us-ak-016', 5],
    ['us-ak-150', 6],
    ['us-ak-105', 7],
    ['us-ak-130', 8],
    ['us-ak-220', 9],
    ['us-ak-290', 10],
    ['us-ak-068', 11],
    ['us-ak-170', 12],
    ['us-ak-198', 13],
    ['us-ak-195', 14],
    ['us-ak-275', 15],
    ['us-ak-110', 16],
    ['us-ak-240', 17],
    ['us-ak-020', 18],
    ['us-ak-090', 19],
    ['us-ak-100', 20],
    ['us-ak-122', 21],
    ['us-ak-164', 22],
    ['us-ak-060', 23],
    ['us-ak-282', 24],
    ['us-ak-230', 25],
    ['us-ak-270', 26],
    ['us-ak-185', 27],
    ['us-ak-188', 28]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-ak-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-ak-all.js">Alaska</a>'
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
