$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ve-3609",
            "value": 0
        },
        {
            "hc-key": "ve-dp",
            "value": 1
        },
        {
            "hc-key": "ve-ne",
            "value": 2
        },
        {
            "hc-key": "ve-su",
            "value": 3
        },
        {
            "hc-key": "ve-da",
            "value": 4
        },
        {
            "hc-key": "ve-bo",
            "value": 5
        },
        {
            "hc-key": "ve-ap",
            "value": 6
        },
        {
            "hc-key": "ve-ba",
            "value": 7
        },
        {
            "hc-key": "ve-me",
            "value": 8
        },
        {
            "hc-key": "ve-ta",
            "value": 9
        },
        {
            "hc-key": "ve-tr",
            "value": 10
        },
        {
            "hc-key": "ve-zu",
            "value": 11
        },
        {
            "hc-key": "ve-co",
            "value": 12
        },
        {
            "hc-key": "ve-po",
            "value": 13
        },
        {
            "hc-key": "ve-ca",
            "value": 14
        },
        {
            "hc-key": "ve-la",
            "value": 15
        },
        {
            "hc-key": "ve-ya",
            "value": 16
        },
        {
            "hc-key": "ve-fa",
            "value": 17
        },
        {
            "hc-key": "ve-am",
            "value": 18
        },
        {
            "hc-key": "ve-an",
            "value": 19
        },
        {
            "hc-key": "ve-ar",
            "value": 20
        },
        {
            "hc-key": "ve-213",
            "value": 21
        },
        {
            "hc-key": "ve-df",
            "value": 22
        },
        {
            "hc-key": "ve-gu",
            "value": 23
        },
        {
            "hc-key": "ve-mi",
            "value": 24
        },
        {
            "hc-key": "ve-mo",
            "value": 25
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ve/ve-all.js">Venezuela</a>'
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
            mapData: Highcharts.maps['countries/ve/ve-all'],
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
