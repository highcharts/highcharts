$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "na-os",
            "value": 0
        },
        {
            "hc-key": "na-on",
            "value": 1
        },
        {
            "hc-key": "na-ow",
            "value": 2
        },
        {
            "hc-key": "na-ot",
            "value": 3
        },
        {
            "hc-key": "na-oh",
            "value": 4
        },
        {
            "hc-key": "na-ok",
            "value": 5
        },
        {
            "hc-key": "na-ca",
            "value": 6
        },
        {
            "hc-key": "na-ka",
            "value": 7
        },
        {
            "hc-key": "na-ha",
            "value": 8
        },
        {
            "hc-key": "na-kh",
            "value": 9
        },
        {
            "hc-key": "na-ku",
            "value": 10
        },
        {
            "hc-key": "na-er",
            "value": 11
        },
        {
            "hc-key": "na-od",
            "value": 12
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/na/na-all.js">Namibia</a>'
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
            mapData: Highcharts.maps['countries/na/na-all'],
            joinBy: 'hc-key',
            name: 'Random data',
            states: {
                hover: {
                    color: '#a4edba'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });
});
