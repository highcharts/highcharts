// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-fi-2002', 0],
    ['no-fi-2019', 1],
    ['no-fi-2030', 2],
    ['no-fi-2018', 3],
    ['no-fi-2014', 4],
    ['no-fi-2020', 5],
    ['no-fi-2015', 6],
    ['no-fi-2017', 7],
    ['no-tr-2012', 8],
    ['no-fi-2004', 9],
    ['no-fi-2027', 10],
    ['no-fi-2025', 11],
    ['no-fi-2011', 12],
    ['no-fi-2022', 13],
    ['no-fi-2024', 14],
    ['no-fi-2021', 15],
    ['no-fi-2023', 16],
    ['no-fi-2028', 17],
    ['no-fi-2003', 18]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/no/no-fi-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-fi-all.js">Finnmark</a>'
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
