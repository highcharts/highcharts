$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "pl-ld",
            "value": 0
        },
        {
            "hc-key": "pl-mz",
            "value": 1
        },
        {
            "hc-key": "pl-sk",
            "value": 2
        },
        {
            "hc-key": "pl-pd",
            "value": 3
        },
        {
            "hc-key": "pl-lu",
            "value": 4
        },
        {
            "hc-key": "pl-pk",
            "value": 5
        },
        {
            "hc-key": "pl-op",
            "value": 6
        },
        {
            "hc-key": "pl-ma",
            "value": 7
        },
        {
            "hc-key": "pl-wn",
            "value": 8
        },
        {
            "hc-key": "pl-pm",
            "value": 9
        },
        {
            "hc-key": "pl-ds",
            "value": 10
        },
        {
            "hc-key": "pl-zp",
            "value": 11
        },
        {
            "hc-key": "pl-lb",
            "value": 12
        },
        {
            "hc-key": "pl-wp",
            "value": 13
        },
        {
            "hc-key": "pl-kp",
            "value": 14
        },
        {
            "hc-key": "pl-sl",
            "value": 15
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/pl/pl-all.js">Poland</a>'
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
            mapData: Highcharts.maps['countries/pl/pl-all'],
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
