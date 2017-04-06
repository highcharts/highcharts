// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-no-1856', 0],
    ['no-no-1849', 1],
    ['no-no-1804', 2],
    ['no-no-1836', 3],
    ['no-no-1837', 4],
    ['no-no-1834', 5],
    ['no-no-1835', 6],
    ['no-no-1838', 7],
    ['no-no-1825', 8],
    ['no-no-1811', 9],
    ['no-no-1827', 10],
    ['no-no-1848', 11],
    ['no-no-1865', 12],
    ['no-no-1815', 13],
    ['no-no-1812', 14],
    ['no-no-1818', 15],
    ['no-no-1860', 16],
    ['no-no-1867', 17],
    ['no-no-1866', 18],
    ['no-no-1832', 19],
    ['no-no-1839', 20],
    ['no-no-1824', 21],
    ['no-no-1833', 22],
    ['no-no-1828', 23],
    ['no-no-1820', 24],
    ['no-no-1841', 25],
    ['no-no-1840', 26],
    ['no-no-1845', 27],
    ['no-no-1868', 28],
    ['no-no-1870', 29],
    ['no-no-1813', 30],
    ['no-no-1851', 31],
    ['no-no-1852', 32],
    ['no-no-1850', 33],
    ['no-no-1853', 34],
    ['no-no-1854', 35],
    ['no-no-1871', 36],
    ['no-no-1857', 37],
    ['no-no-1826', 38],
    ['no-no-1822', 39],
    ['no-no-1816', 40],
    ['no-no-1805', 41],
    ['no-no-1859', 42],
    ['no-no-1874', 43]
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
