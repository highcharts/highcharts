$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "de-th-16062000",
            "value": 0
        },
        {
            "hc-key": "de-th-16055000",
            "value": 1
        },
        {
            "hc-key": "de-th-16064000",
            "value": 2
        },
        {
            "hc-key": "de-th-16054000",
            "value": 3
        },
        {
            "hc-key": "de-th-16070000",
            "value": 4
        },
        {
            "hc-key": "de-th-16051000",
            "value": 5
        },
        {
            "hc-key": "de-th-16071000",
            "value": 6
        },
        {
            "hc-key": "de-th-16074000",
            "value": 7
        },
        {
            "hc-key": "de-th-16052000",
            "value": 8
        },
        {
            "hc-key": "de-th-16056000",
            "value": 9
        },
        {
            "hc-key": "de-th-16075000",
            "value": 10
        },
        {
            "hc-key": "de-th-16069000",
            "value": 11
        },
        {
            "hc-key": "de-th-16068000",
            "value": 12
        },
        {
            "hc-key": "de-th-16067000",
            "value": 13
        },
        {
            "hc-key": "de-th-16053000",
            "value": 14
        },
        {
            "hc-key": "de-th-16076000",
            "value": 15
        },
        {
            "hc-key": "de-th-16065000",
            "value": 16
        },
        {
            "hc-key": "de-th-16073000",
            "value": 17
        },
        {
            "hc-key": "de-th-16061000",
            "value": 18
        },
        {
            "hc-key": "de-th-16077000",
            "value": 19
        },
        {
            "hc-key": "de-th-16063000",
            "value": 20
        },
        {
            "hc-key": "de-th-16072000",
            "value": 21
        },
        {
            "hc-key": "de-th-16066000",
            "value": 22
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/de/de-th-all.js">Thüringen</a>'
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
            mapData: Highcharts.maps['countries/de/de-th-all'],
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
