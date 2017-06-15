// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['de-by-09774000', 0],
    ['de-by-09673000', 1],
    ['de-by-09471000', 2],
    ['de-by-09377000', 3],
    ['de-by-09187000', 4],
    ['de-by-09372000', 5],
    ['de-by-09674000', 6],
    ['de-by-09172000', 7],
    ['de-by-09462000', 8],
    ['de-by-09564000', 9],
    ['de-by-09162000', 10],
    ['de-by-09678000', 11],
    ['de-by-09478000', 12],
    ['de-by-09472000', 13],
    ['de-by-09184000', 14],
    ['de-by-09262000', 15],
    ['de-by-09778000', 16],
    ['de-by-09771000', 17],
    ['de-by-09772000', 18],
    ['de-by-09671000', 19],
    ['de-by-09676000', 20],
    ['de-by-09780000', 21],
    ['de-by-09376000', 22],
    ['de-by-09576000', 23],
    ['de-by-09777000', 24],
    ['de-by-09563000', 25],
    ['de-by-09562000', 26],
    ['de-by-09573000', 27],
    ['de-by-09575000', 28],
    ['de-by-09373000', 29],
    ['de-by-09179000', 30],
    ['de-by-09277000', 31],
    ['de-by-09271000', 32],
    ['de-by-09473000', 33],
    ['de-by-09779000', 34],
    ['de-by-09176000', 35],
    ['de-by-09174000', 36],
    ['de-by-09177000', 37],
    ['de-by-09764000', 38],
    ['de-by-09274000', 39],
    ['de-by-09375000', 40],
    ['de-by-09186000', 41],
    ['de-by-09183000', 42],
    ['de-by-09175000', 43],
    ['de-by-09574000', 44],
    ['de-by-09371000', 45],
    ['de-by-09776000', 46],
    ['de-by-09571000', 47],
    ['de-by-09276000', 48],
    ['de-by-09773000', 49],
    ['de-by-09479000', 50],
    ['de-by-09374000', 51],
    ['de-by-09677000', 52],
    ['de-by-09363000', 53],
    ['de-by-09672000', 54],
    ['de-by-09180000', 55],
    ['de-by-09461000', 56],
    ['de-by-09275000', 57],
    ['de-by-09679000', 58],
    ['de-by-09272000', 59],
    ['de-by-09189000', 60],
    ['de-by-09273000', 61],
    ['de-by-09173000', 62],
    ['de-by-09182000', 63],
    ['de-by-09577000', 64],
    ['de-by-09477000', 65],
    ['de-by-09475000', 66],
    ['de-by-09178000', 67],
    ['de-by-09171000', 68],
    ['de-by-09775000', 69],
    ['de-by-09476000', 70],
    ['de-by-09763000', 71],
    ['de-by-09279000', 72],
    ['de-by-09261000', 73],
    ['de-by-09761000', 74],
    ['de-by-09181000', 75],
    ['de-by-09188000', 76],
    ['de-by-09561000', 77],
    ['de-by-09163000', 78],
    ['de-by-09762000', 79],
    ['de-by-09572000', 80],
    ['de-by-09565000', 81],
    ['de-by-09474000', 82],
    ['de-by-09661000', 83],
    ['de-by-09361000', 84],
    ['de-by-09675000', 85],
    ['de-by-09463000', 86],
    ['de-by-09663000', 87],
    ['de-by-09278000', 88],
    ['de-by-09190000', 89],
    ['de-by-09161000', 90],
    ['de-by-09362000', 91],
    ['de-by-09263000', 92],
    ['de-by-09464000', 93],
    ['de-by-09185000', 94],
    ['de-by-09662000', 95]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/de/de-by-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-by-all.js">Bayern</a>'
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
