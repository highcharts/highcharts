$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "de-bb-12065000",
            "value": 0
        },
        {
            "hc-key": "de-bb-12052000",
            "value": 1
        },
        {
            "hc-key": "de-bb-12062000",
            "value": 2
        },
        {
            "hc-key": "de-bb-12053000",
            "value": 3
        },
        {
            "hc-key": "de-bb-12072000",
            "value": 4
        },
        {
            "hc-key": "de-bb-12063000",
            "value": 5
        },
        {
            "hc-key": "de-bb-12060000",
            "value": 6
        },
        {
            "hc-key": "de-bb-12066000",
            "value": 7
        },
        {
            "hc-key": "de-bb-12068000",
            "value": 8
        },
        {
            "hc-key": "de-bb-12054000",
            "value": 9
        },
        {
            "hc-key": "de-bb-12061000",
            "value": 10
        },
        {
            "hc-key": "de-bb-12051000",
            "value": 11
        },
        {
            "hc-key": "de-bb-12067000",
            "value": 12
        },
        {
            "hc-key": "de-bb-12071000",
            "value": 13
        },
        {
            "hc-key": "de-bb-12070000",
            "value": 14
        },
        {
            "hc-key": "de-bb-12069000",
            "value": 15
        },
        {
            "hc-key": "de-bb-12073000",
            "value": 16
        },
        {
            "hc-key": "de-bb-12064000",
            "value": 17
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/de/de-bb-all.js">Brandenburg</a>'
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
            mapData: Highcharts.maps['countries/de/de-bb-all'],
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
