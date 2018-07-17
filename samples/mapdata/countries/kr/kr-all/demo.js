// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['kr-4194', 0],
    ['kr-kg', 1],
    ['kr-cb', 2],
    ['kr-kn', 3],
    ['kr-2685', 4],
    ['kr-pu', 5],
    ['kr-2688', 6],
    ['kr-sj', 7],
    ['kr-tj', 8],
    ['kr-ul', 9],
    ['kr-in', 10],
    ['kr-kw', 11],
    ['kr-gn', 12],
    ['kr-cj', 13],
    ['kr-gb', 14],
    ['kr-so', 15],
    ['kr-tg', 16],
    ['kr-kj', 17]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/kr/kr-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/kr/kr-all.js">South Korea</a>'
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
