$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "iq-na",
            "value": 0
        },
        {
            "hc-key": "iq-ka",
            "value": 1
        },
        {
            "hc-key": "iq-ba",
            "value": 2
        },
        {
            "hc-key": "iq-mu",
            "value": 3
        },
        {
            "hc-key": "iq-qa",
            "value": 4
        },
        {
            "hc-key": "iq-dq",
            "value": 5
        },
        {
            "hc-key": "iq-ma",
            "value": 6
        },
        {
            "hc-key": "iq-wa",
            "value": 7
        },
        {
            "hc-key": "iq-sd",
            "value": 8
        },
        {
            "hc-key": "iq-su",
            "value": 9
        },
        {
            "hc-key": "iq-di",
            "value": 10
        },
        {
            "hc-key": "iq-bb",
            "value": 11
        },
        {
            "hc-key": "iq-bg",
            "value": 12
        },
        {
            "hc-key": "iq-an",
            "value": 13
        },
        {
            "hc-key": "iq-ar",
            "value": 14
        },
        {
            "hc-key": "iq-ts",
            "value": 15
        },
        {
            "hc-key": "iq-da",
            "value": 16
        },
        {
            "hc-key": "iq-ni",
            "value": 17
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/iq/iq-all.js">Iraq</a>'
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
            mapData: Highcharts.maps['countries/iq/iq-all'],
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
