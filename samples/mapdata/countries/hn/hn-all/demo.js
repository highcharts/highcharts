$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "hn-ib",
            "value": 0
        },
        {
            "hc-key": "hn-va",
            "value": 1
        },
        {
            "hc-key": "hn-at",
            "value": 2
        },
        {
            "hc-key": "hn-gd",
            "value": 3
        },
        {
            "hc-key": "hn-cl",
            "value": 4
        },
        {
            "hc-key": "hn-ol",
            "value": 5
        },
        {
            "hc-key": "hn-fm",
            "value": 6
        },
        {
            "hc-key": "hn-yo",
            "value": 7
        },
        {
            "hc-key": "hn-cm",
            "value": 8
        },
        {
            "hc-key": "hn-cr",
            "value": 9
        },
        {
            "hc-key": "hn-in",
            "value": 10
        },
        {
            "hc-key": "hn-lp",
            "value": 11
        },
        {
            "hc-key": "hn-sb",
            "value": 12
        },
        {
            "hc-key": "hn-cp",
            "value": 13
        },
        {
            "hc-key": "hn-le",
            "value": 14
        },
        {
            "hc-key": "hn-oc",
            "value": 15
        },
        {
            "hc-key": "hn-ch",
            "value": 16
        },
        {
            "hc-key": "hn-ep",
            "value": 17
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/hn/hn-all.js">Honduras</a>'
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
            mapData: Highcharts.maps['countries/hn/hn-all'],
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
