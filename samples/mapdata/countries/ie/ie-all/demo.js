$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ie-5551",
            "value": 0
        },
        {
            "hc-key": "ie-1510",
            "value": 1
        },
        {
            "hc-key": "ie-ky",
            "value": 2
        },
        {
            "hc-key": "ie-dl",
            "value": 3
        },
        {
            "hc-key": "ie-491",
            "value": 4
        },
        {
            "hc-key": "ie-rn",
            "value": 5
        },
        {
            "hc-key": "ie-so",
            "value": 6
        },
        {
            "hc-key": "ie-7034",
            "value": 7
        },
        {
            "hc-key": "ie-lm",
            "value": 8
        },
        {
            "hc-key": "ie-7035",
            "value": 9
        },
        {
            "hc-key": "ie-ld",
            "value": 10
        },
        {
            "hc-key": "ie-mo",
            "value": 11
        },
        {
            "hc-key": "ie-ce",
            "value": 12
        },
        {
            "hc-key": "ie-cn",
            "value": 13
        },
        {
            "hc-key": "ie-2363",
            "value": 14
        },
        {
            "hc-key": "ie-mn",
            "value": 15
        },
        {
            "hc-key": "ie-gy",
            "value": 16
        },
        {
            "hc-key": "ie-ck",
            "value": 17
        },
        {
            "hc-key": "ie-wd",
            "value": 18
        },
        {
            "hc-key": "ie-7033",
            "value": 19
        },
        {
            "hc-key": "ie-1528",
            "value": 20
        },
        {
            "hc-key": "ie-dn",
            "value": 21
        },
        {
            "hc-key": "ie-lh",
            "value": 22
        },
        {
            "hc-key": "ie-mh",
            "value": 23
        },
        {
            "hc-key": "ie-oy",
            "value": 24
        },
        {
            "hc-key": "ie-wh",
            "value": 25
        },
        {
            "hc-key": "ie-wx",
            "value": 26
        },
        {
            "hc-key": "ie-cw",
            "value": 27
        },
        {
            "hc-key": "ie-ww",
            "value": 28
        },
        {
            "hc-key": "ie-ke",
            "value": 29
        },
        {
            "hc-key": "ie-kk",
            "value": 30
        },
        {
            "hc-key": "ie-ls",
            "value": 31
        },
        {
            "hc-key": "ie-ty",
            "value": 32
        },
        {
            "hc-key": "ie-1533",
            "value": 33
        },
        {
            "hc-key": "ie-lk",
            "value": 34
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ie/ie-all.js">Ireland</a>'
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
            mapData: Highcharts.maps['countries/ie/ie-all'],
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
        }]
    });
});
