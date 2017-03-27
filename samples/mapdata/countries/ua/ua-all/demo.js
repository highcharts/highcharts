// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ua-my', 0],
    ['ua-ks', 1],
    ['ua-kc', 2],
    ['ua-zt', 3],
    ['ua-sm', 4],
    ['ua-dt', 5],
    ['ua-dp', 6],
    ['ua-kk', 7],
    ['ua-lh', 8],
    ['ua-pl', 9],
    ['ua-zp', 10],
    ['ua-sc', 11],
    ['ua-kr', 12],
    ['ua-ch', 13],
    ['ua-rv', 14],
    ['ua-cv', 15],
    ['ua-if', 16],
    ['ua-km', 17],
    ['ua-lv', 18],
    ['ua-tp', 19],
    ['ua-zk', 20],
    ['ua-vo', 21],
    ['ua-ck', 22],
    ['ua-kh', 23],
    ['ua-kv', 24],
    ['ua-mk', 25],
    ['ua-vi', 26]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ua/ua-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ua/ua-all.js">Ukraine</a>'
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
