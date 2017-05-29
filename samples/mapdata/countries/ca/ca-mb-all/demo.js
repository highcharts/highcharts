// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ca-mb-4620', 0],
    ['ca-mb-4621', 1],
    ['ca-mb-4622', 2],
    ['ca-mb-4623', 3],
    ['ca-mb-4608', 4],
    ['ca-mb-4609', 5],
    ['ca-mb-4606', 6],
    ['ca-mb-4619', 7],
    ['ca-mb-4607', 8],
    ['ca-mb-4604', 9],
    ['ca-mb-4618', 10],
    ['ca-mb-4605', 11],
    ['ca-mb-4602', 12],
    ['ca-mb-4603', 13],
    ['ca-mb-4610', 14],
    ['ca-mb-4601', 15],
    ['ca-mb-4611', 16],
    ['ca-mb-4613', 17],
    ['ca-mb-4612', 18],
    ['ca-mb-4615', 19],
    ['ca-mb-4614', 20],
    ['ca-mb-4617', 21],
    ['ca-mb-4616', 22]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ca/ca-mb-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ca/ca-mb-all.js">Manitoba</a>'
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
