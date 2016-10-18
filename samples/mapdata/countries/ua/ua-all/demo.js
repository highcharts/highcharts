$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ua-my",
            "value": 0
        },
        {
            "hc-key": "ua-ks",
            "value": 1
        },
        {
            "hc-key": "ua-kc",
            "value": 2
        },
        {
            "hc-key": "ua-zt",
            "value": 3
        },
        {
            "hc-key": "ua-sm",
            "value": 4
        },
        {
            "hc-key": "ua-dt",
            "value": 5
        },
        {
            "hc-key": "ua-dp",
            "value": 6
        },
        {
            "hc-key": "ua-kk",
            "value": 7
        },
        {
            "hc-key": "ua-lh",
            "value": 8
        },
        {
            "hc-key": "ua-pl",
            "value": 9
        },
        {
            "hc-key": "ua-zp",
            "value": 10
        },
        {
            "hc-key": "ua-sc",
            "value": 11
        },
        {
            "hc-key": "ua-kr",
            "value": 12
        },
        {
            "hc-key": "ua-ch",
            "value": 13
        },
        {
            "hc-key": "ua-rv",
            "value": 14
        },
        {
            "hc-key": "ua-cv",
            "value": 15
        },
        {
            "hc-key": "ua-if",
            "value": 16
        },
        {
            "hc-key": "ua-km",
            "value": 17
        },
        {
            "hc-key": "ua-lv",
            "value": 18
        },
        {
            "hc-key": "ua-tp",
            "value": 19
        },
        {
            "hc-key": "ua-zk",
            "value": 20
        },
        {
            "hc-key": "ua-vo",
            "value": 21
        },
        {
            "hc-key": "ua-ck",
            "value": 22
        },
        {
            "hc-key": "ua-kh",
            "value": 23
        },
        {
            "hc-key": "ua-kv",
            "value": 24
        },
        {
            "hc-key": "ua-mk",
            "value": 25
        },
        {
            "hc-key": "ua-vi",
            "value": 26
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ua/ua-all.js">Ukraine</a>'
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
            mapData: Highcharts.maps['countries/ua/ua-all'],
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
