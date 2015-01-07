$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ec-gu",
            "value": 0
        },
        {
            "hc-key": "ec-es",
            "value": 1
        },
        {
            "hc-key": "ec-cr",
            "value": 2
        },
        {
            "hc-key": "ec-im",
            "value": 3
        },
        {
            "hc-key": "ec-su",
            "value": 4
        },
        {
            "hc-key": "ec-se",
            "value": 5
        },
        {
            "hc-key": "ec-sd",
            "value": 6
        },
        {
            "hc-key": "ec-az",
            "value": 7
        },
        {
            "hc-key": "ec-eo",
            "value": 8
        },
        {
            "hc-key": "ec-lj",
            "value": 9
        },
        {
            "hc-key": "ec-zc",
            "value": 10
        },
        {
            "hc-key": "ec-cn",
            "value": 11
        },
        {
            "hc-key": "ec-bo",
            "value": 12
        },
        {
            "hc-key": "ec-ct",
            "value": 13
        },
        {
            "hc-key": "ec-lr",
            "value": 14
        },
        {
            "hc-key": "ec-mn",
            "value": 15
        },
        {
            "hc-key": "ec-cb",
            "value": 16
        },
        {
            "hc-key": "ec-ms",
            "value": 17
        },
        {
            "hc-key": "ec-pi",
            "value": 18
        },
        {
            "hc-key": "ec-pa",
            "value": 19
        },
        {
            "hc-key": "ec-1076",
            "value": 20
        },
        {
            "hc-key": "ec-na",
            "value": 21
        },
        {
            "hc-key": "ec-tu",
            "value": 22
        },
        {
            "hc-key": "ec-ga",
            "value": 23
        },
        {
            "value": 24
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ec/ec-all.js">Ecuador</a>'
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
            mapData: Highcharts.maps['countries/ec/ec-all'],
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
            data: Highcharts.geojson(Highcharts.maps['countries/ec/ec-all'], 'mapline'),
            color: 'silver',
            showInLegend: false,
            enableMouseTracking: false
        }]
    });
});
