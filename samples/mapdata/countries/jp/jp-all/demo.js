$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "jp-hs",
            "value": 0
        },
        {
            "hc-key": "jp-sm",
            "value": 1
        },
        {
            "hc-key": "jp-yc",
            "value": 2
        },
        {
            "hc-key": "jp-km",
            "value": 3
        },
        {
            "hc-key": "jp-eh",
            "value": 4
        },
        {
            "hc-key": "jp-kg",
            "value": 5
        },
        {
            "hc-key": "jp-is",
            "value": 6
        },
        {
            "hc-key": "jp-hk",
            "value": 7
        },
        {
            "hc-key": "jp-tk",
            "value": 8
        },
        {
            "hc-key": "jp-3461",
            "value": 9
        },
        {
            "hc-key": "jp-3457",
            "value": 10
        },
        {
            "hc-key": "jp-ib",
            "value": 11
        },
        {
            "hc-key": "jp-st",
            "value": 12
        },
        {
            "hc-key": "jp-sg",
            "value": 13
        },
        {
            "hc-key": "jp-yn",
            "value": 14
        },
        {
            "hc-key": "jp-kn",
            "value": 15
        },
        {
            "hc-key": "jp-fo",
            "value": 16
        },
        {
            "hc-key": "jp-fs",
            "value": 17
        },
        {
            "hc-key": "jp-3480",
            "value": 18
        },
        {
            "hc-key": "jp-ts",
            "value": 19
        },
        {
            "hc-key": "jp-ky",
            "value": 20
        },
        {
            "hc-key": "jp-me",
            "value": 21
        },
        {
            "hc-key": "jp-ai",
            "value": 22
        },
        {
            "hc-key": "jp-nr",
            "value": 23
        },
        {
            "hc-key": "jp-os",
            "value": 24
        },
        {
            "hc-key": "jp-wk",
            "value": 25
        },
        {
            "hc-key": "jp-ch",
            "value": 26
        },
        {
            "hc-key": "jp-ak",
            "value": 27
        },
        {
            "hc-key": "jp-mg",
            "value": 28
        },
        {
            "hc-key": "jp-tt",
            "value": 29
        },
        {
            "hc-key": "jp-hg",
            "value": 30
        },
        {
            "hc-key": "jp-gf",
            "value": 31
        },
        {
            "hc-key": "jp-nn",
            "value": 32
        },
        {
            "hc-key": "jp-ty",
            "value": 33
        },
        {
            "hc-key": "jp-ni",
            "value": 34
        },
        {
            "hc-key": "jp-oy",
            "value": 35
        },
        {
            "hc-key": "jp-ao",
            "value": 36
        },
        {
            "hc-key": "jp-mz",
            "value": 37
        },
        {
            "hc-key": "jp-iw",
            "value": 38
        },
        {
            "hc-key": "jp-kc",
            "value": 39
        },
        {
            "hc-key": "jp-ot",
            "value": 40
        },
        {
            "hc-key": "jp-sz",
            "value": 41
        },
        {
            "hc-key": "jp-fi",
            "value": 42
        },
        {
            "hc-key": "jp-sh",
            "value": 43
        },
        {
            "hc-key": "jp-tc",
            "value": 44
        },
        {
            "hc-key": "jp-yt",
            "value": 45
        },
        {
            "hc-key": "jp-3302",
            "value": 46
        },
        {
            "value": 47
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/jp/jp-all.js">Japan</a>'
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

        series : [{
            data : data,
            mapData: Highcharts.maps['countries/jp/jp-all'],
            joinBy: 'hc-key',
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
});
