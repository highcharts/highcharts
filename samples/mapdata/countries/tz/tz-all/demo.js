$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "tz-mw",
            "value": 0
        },
        {
            "hc-key": "tz-kr",
            "value": 1
        },
        {
            "hc-key": "tz-pw",
            "value": 2
        },
        {
            "hc-key": "tz-mo",
            "value": 3
        },
        {
            "hc-key": "tz-nj",
            "value": 4
        },
        {
            "hc-key": "tz-zs",
            "value": 5
        },
        {
            "hc-key": "tz-zw",
            "value": 6
        },
        {
            "hc-key": "tz-km",
            "value": 7
        },
        {
            "hc-key": "tz-mt",
            "value": 8
        },
        {
            "hc-key": "tz-rv",
            "value": 9
        },
        {
            "hc-key": "tz-pn",
            "value": 10
        },
        {
            "hc-key": "tz-ps",
            "value": 11
        },
        {
            "hc-key": "tz-zn",
            "value": 12
        },
        {
            "hc-key": "tz-sd",
            "value": 13
        },
        {
            "hc-key": "tz-sh",
            "value": 14
        },
        {
            "hc-key": "tz-as",
            "value": 15
        },
        {
            "hc-key": "tz-my",
            "value": 16
        },
        {
            "hc-key": "tz-ma",
            "value": 17
        },
        {
            "hc-key": "tz-si",
            "value": 18
        },
        {
            "hc-key": "tz-mb",
            "value": 19
        },
        {
            "hc-key": "tz-rk",
            "value": 20
        },
        {
            "hc-key": "tz-ds",
            "value": 21
        },
        {
            "hc-key": "tz-do",
            "value": 22
        },
        {
            "hc-key": "tz-tb",
            "value": 23
        },
        {
            "hc-key": "tz-li",
            "value": 24
        },
        {
            "hc-key": "tz-ge",
            "value": 25
        },
        {
            "hc-key": "tz-kl",
            "value": 26
        },
        {
            "hc-key": "tz-tn",
            "value": 27
        },
        {
            "hc-key": "tz-ka",
            "value": 28
        },
        {
            "hc-key": "tz-ir",
            "value": 29
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/tz/tz-all.js">United Republic of Tanzania</a>'
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
            mapData: Highcharts.maps['countries/tz/tz-all'],
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
