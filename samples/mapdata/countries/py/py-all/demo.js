$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "py-ag",
            "value": 0
        },
        {
            "hc-key": "py-bq",
            "value": 1
        },
        {
            "hc-key": "py-cn",
            "value": 2
        },
        {
            "hc-key": "py-ph",
            "value": 3
        },
        {
            "hc-key": "py-cr",
            "value": 4
        },
        {
            "hc-key": "py-sp",
            "value": 5
        },
        {
            "hc-key": "py-ce",
            "value": 6
        },
        {
            "hc-key": "py-mi",
            "value": 7
        },
        {
            "hc-key": "py-ne",
            "value": 8
        },
        {
            "hc-key": "py-gu",
            "value": 9
        },
        {
            "hc-key": "py-pg",
            "value": 10
        },
        {
            "hc-key": "py-am",
            "value": 11
        },
        {
            "hc-key": "py-aa",
            "value": 12
        },
        {
            "hc-key": "py-cg",
            "value": 13
        },
        {
            "hc-key": "py-cz",
            "value": 14
        },
        {
            "hc-key": "py-cy",
            "value": 15
        },
        {
            "hc-key": "py-it",
            "value": 16
        },
        {
            "hc-key": "py-as",
            "value": 17
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/py/py-all.js">Paraguay</a>'
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
            mapData: Highcharts.maps['countries/py/py-all'],
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
