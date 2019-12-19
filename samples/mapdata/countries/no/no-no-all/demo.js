// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-no-1875', 0],
    ['no-no-1806', 1],
    ['no-no-1836', 2],
    ['no-no-1837', 3],
    ['no-no-1834', 4],
    ['no-no-1835', 5],
    ['no-no-1838', 6],
    ['no-no-1827', 7],
    ['no-no-1848', 8],
    ['no-no-1865', 9],
    ['no-no-1815', 10],
    ['no-no-1812', 11],
    ['no-no-1818', 12],
    ['no-no-1856', 13],
    ['no-no-1804', 14],
    ['no-no-1860', 15],
    ['no-no-1867', 16],
    ['no-no-1866', 17],
    ['no-no-1870', 18],
    ['no-no-1841', 19],
    ['no-no-1840', 20],
    ['no-no-1845', 21],
    ['no-no-1820', 22],
    ['no-no-1824', 23],
    ['no-no-1868', 24],
    ['no-no-1813', 25],
    ['no-no-1811', 26],
    ['no-no-1851', 27],
    ['no-no-1853', 28],
    ['no-no-1832', 29],
    ['no-no-1828', 30],
    ['no-no-1833', 31],
    ['no-no-1839', 32],
    ['no-no-1871', 33],
    ['no-no-1874', 34],
    ['no-no-1825', 35],
    ['no-no-1826', 36],
    ['no-no-1822', 37],
    ['no-no-1816', 38],
    ['no-no-1859', 39],
    ['no-no-1857', 40]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/no/no-no-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-no-all.js">Nordland</a>'
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
