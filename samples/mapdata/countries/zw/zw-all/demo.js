$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "zw-ma",
            "value": 0
        },
        {
            "hc-key": "zw-ms",
            "value": 1
        },
        {
            "hc-key": "zw-bu",
            "value": 2
        },
        {
            "hc-key": "zw-mv",
            "value": 3
        },
        {
            "hc-key": "zw-mw",
            "value": 4
        },
        {
            "hc-key": "zw-mc",
            "value": 5
        },
        {
            "hc-key": "zw-ha",
            "value": 6
        },
        {
            "hc-key": "zw-mn",
            "value": 7
        },
        {
            "hc-key": "zw-mi",
            "value": 8
        },
        {
            "hc-key": "zw-me",
            "value": 9
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/zw/zw-all.js">Zimbabwe</a>'
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
            mapData: Highcharts.maps['countries/zw/zw-all'],
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
