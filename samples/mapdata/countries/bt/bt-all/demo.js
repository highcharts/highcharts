$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "bt-ty",
            "value": 0
        },
        {
            "hc-key": "bt-sg",
            "value": 1
        },
        {
            "hc-key": "bt-to",
            "value": 2
        },
        {
            "hc-key": "bt-wp",
            "value": 3
        },
        {
            "hc-key": "bt-mo",
            "value": 4
        },
        {
            "hc-key": "bt-pm",
            "value": 5
        },
        {
            "hc-key": "bt-sj",
            "value": 6
        },
        {
            "hc-key": "bt-ta",
            "value": 7
        },
        {
            "hc-key": "bt-ck",
            "value": 8
        },
        {
            "hc-key": "bt-da",
            "value": 9
        },
        {
            "hc-key": "bt-ha",
            "value": 10
        },
        {
            "hc-key": "bt-pr",
            "value": 11
        },
        {
            "hc-key": "bt-sm",
            "value": 12
        },
        {
            "hc-key": "bt-tm",
            "value": 13
        },
        {
            "hc-key": "bt-ga",
            "value": 14
        },
        {
            "hc-key": "bt-pn",
            "value": 15
        },
        {
            "hc-key": "bt-cr",
            "value": 16
        },
        {
            "hc-key": "bt-ge",
            "value": 17
        },
        {
            "hc-key": "bt-bu",
            "value": 18
        },
        {
            "hc-key": "bt-lh",
            "value": 19
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/bt/bt-all.js">Bhutan</a>'
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
            mapData: Highcharts.maps['countries/bt/bt-all'],
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
