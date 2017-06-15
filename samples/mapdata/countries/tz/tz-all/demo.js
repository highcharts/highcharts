// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['tz-mw', 0],
    ['tz-kr', 1],
    ['tz-pw', 2],
    ['tz-mo', 3],
    ['tz-nj', 4],
    ['tz-zs', 5],
    ['tz-zw', 6],
    ['tz-km', 7],
    ['tz-mt', 8],
    ['tz-rv', 9],
    ['tz-pn', 10],
    ['tz-ps', 11],
    ['tz-zn', 12],
    ['tz-sd', 13],
    ['tz-sh', 14],
    ['tz-as', 15],
    ['tz-my', 16],
    ['tz-ma', 17],
    ['tz-si', 18],
    ['tz-mb', 19],
    ['tz-rk', 20],
    ['tz-ds', 21],
    ['tz-do', 22],
    ['tz-tb', 23],
    ['tz-li', 24],
    ['tz-ge', 25],
    ['tz-kl', 26],
    ['tz-tn', 27],
    ['tz-ka', 28],
    ['tz-ir', 29]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/tz/tz-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/tz/tz-all.js">United Republic of Tanzania</a>'
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
