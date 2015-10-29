$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "pt-fa",
            "value": 0
        },
        {
            "hc-key": "pt-li",
            "value": 1
        },
        {
            "hc-key": "pt-av",
            "value": 2
        },
        {
            "hc-key": "pt-vc",
            "value": 3
        },
        {
            "hc-key": "pt-be",
            "value": 4
        },
        {
            "hc-key": "pt-ev",
            "value": 5
        },
        {
            "hc-key": "pt-se",
            "value": 6
        },
        {
            "hc-key": "pt-pa",
            "value": 7
        },
        {
            "hc-key": "pt-sa",
            "value": 8
        },
        {
            "hc-key": "pt-br",
            "value": 9
        },
        {
            "hc-key": "pt-le",
            "value": 10
        },
        {
            "hc-key": "pt-ba",
            "value": 11
        },
        {
            "hc-key": "pt-cb",
            "value": 12
        },
        {
            "hc-key": "pt-gu",
            "value": 13
        },
        {
            "hc-key": "pt-co",
            "value": 14
        },
        {
            "hc-key": "pt-po",
            "value": 15
        },
        {
            "hc-key": "pt-vi",
            "value": 16
        },
        {
            "hc-key": "pt-vr",
            "value": 17
        },
        {
            "hc-key": "pt-ma",
            "value": 18
        },
        {
            "hc-key": "pt-ac",
            "value": 19
        },
        {
            "value": 20
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/pt/pt-all.js">Portugal</a>'
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
            mapData: Highcharts.maps['countries/pt/pt-all'],
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
            data: Highcharts.geojson(Highcharts.maps['countries/pt/pt-all'], 'mapline'),
            color: 'silver',
            showInLegend: false,
            enableMouseTracking: false
        }]
    });
});
