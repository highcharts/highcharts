// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['jp-hs', 0],
    ['jp-sm', 1],
    ['jp-yc', 2],
    ['jp-km', 3],
    ['jp-eh', 4],
    ['jp-kg', 5],
    ['jp-is', 6],
    ['jp-hk', 7],
    ['jp-tk', 8],
    ['jp-3461', 9],
    ['jp-3457', 10],
    ['jp-ib', 11],
    ['jp-st', 12],
    ['jp-sg', 13],
    ['jp-yn', 14],
    ['jp-kn', 15],
    ['jp-fo', 16],
    ['jp-fs', 17],
    ['jp-3480', 18],
    ['jp-ts', 19],
    ['jp-ky', 20],
    ['jp-me', 21],
    ['jp-ai', 22],
    ['jp-nr', 23],
    ['jp-os', 24],
    ['jp-wk', 25],
    ['jp-ch', 26],
    ['jp-ak', 27],
    ['jp-mg', 28],
    ['jp-tt', 29],
    ['jp-hg', 30],
    ['jp-gf', 31],
    ['jp-nn', 32],
    ['jp-ty', 33],
    ['jp-ni', 34],
    ['jp-oy', 35],
    ['jp-ao', 36],
    ['jp-mz', 37],
    ['jp-iw', 38],
    ['jp-kc', 39],
    ['jp-ot', 40],
    ['jp-sz', 41],
    ['jp-fi', 42],
    ['jp-sh', 43],
    ['jp-tc', 44],
    ['jp-yt', 45],
    ['jp-3302', 46],
    ['undefined', 47]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/jp/jp-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/jp/jp-all.js">Japan</a>'
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
    }, {
        name: 'Separators',
        type: 'mapline',
        data: Highcharts.geojson(Highcharts.maps['countries/jp/jp-all'], 'mapline'),
        color: 'silver',
        showInLegend: false,
        enableMouseTracking: false
    }]
});
