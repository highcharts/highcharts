$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ca-ns-1217",
            "value": 0
        },
        {
            "hc-key": "ca-ns-1201",
            "value": 1
        },
        {
            "hc-key": "ca-ns-1209",
            "value": 2
        },
        {
            "hc-key": "ca-ns-1218",
            "value": 3
        },
        {
            "hc-key": "ca-ns-1203",
            "value": 4
        },
        {
            "hc-key": "ca-ns-1206",
            "value": 5
        },
        {
            "hc-key": "ca-ns-1202",
            "value": 6
        },
        {
            "hc-key": "ca-ns-1212",
            "value": 7
        },
        {
            "hc-key": "ca-ns-1216",
            "value": 8
        },
        {
            "hc-key": "ca-ns-1214",
            "value": 9
        },
        {
            "hc-key": "ca-ns-1210",
            "value": 10
        },
        {
            "hc-key": "ca-ns-1213",
            "value": 11
        },
        {
            "hc-key": "ca-ns-1208",
            "value": 12
        },
        {
            "hc-key": "ca-ns-1205",
            "value": 13
        },
        {
            "hc-key": "ca-ns-1215",
            "value": 14
        },
        {
            "hc-key": "ca-ns-1207",
            "value": 15
        },
        {
            "hc-key": "ca-ns-1204",
            "value": 16
        },
        {
            "hc-key": "ca-ns-1211",
            "value": 17
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ca/ca-ns-all.js">Nova Scotia</a>'
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
            mapData: Highcharts.maps['countries/ca/ca-ns-all'],
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
