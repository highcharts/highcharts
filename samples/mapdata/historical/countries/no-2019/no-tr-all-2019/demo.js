// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-tr-1943', 0],
    ['no-tr-1941', 1],
    ['no-tr-1902', 2],
    ['no-tr-1936', 3],
    ['no-tr-1940', 4],
    ['no-tr-1938', 5],
    ['no-tr-1917', 6],
    ['no-tr-1926', 7],
    ['no-tr-1923', 8],
    ['no-tr-1931', 9],
    ['no-tr-1925', 10],
    ['no-tr-1927', 11],
    ['no-tr-1929', 12],
    ['no-tr-1942', 13],
    ['no-tr-1903', 14],
    ['no-tr-1924', 15],
    ['no-tr-1939', 16],
    ['no-tr-1919', 17],
    ['no-tr-1913', 18],
    ['no-tr-1911', 19],
    ['no-tr-1920', 20],
    ['no-tr-1922', 21],
    ['no-tr-1928', 22],
    ['no-tr-1933', 23]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'historical/countries/no-2019/no-tr-all-2019'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/no-2019/no-tr-all-2019.js">Troms (2019)</a>'
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
