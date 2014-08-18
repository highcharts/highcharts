$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "bi-rt",
            "value": 0
        },
        {
            "hc-key": "bi-kr",
            "value": 1
        },
        {
            "hc-key": "bi-ry",
            "value": 2
        },
        {
            "hc-key": "bi-br",
            "value": 3
        },
        {
            "hc-key": "bi-bb",
            "value": 4
        },
        {
            "hc-key": "bi-ci",
            "value": 5
        },
        {
            "hc-key": "bi-gi",
            "value": 6
        },
        {
            "hc-key": "bi-ky",
            "value": 7
        },
        {
            "hc-key": "bi-ma",
            "value": 8
        },
        {
            "hc-key": "bi-ng",
            "value": 9
        },
        {
            "hc-key": "bi-ki",
            "value": 10
        },
        {
            "hc-key": "bi-my",
            "value": 11
        },
        {
            "hc-key": "bi-bm",
            "value": 12
        },
        {
            "hc-key": "bi-mv",
            "value": 13
        },
        {
            "hc-key": "bi-bu",
            "value": 14
        },
        {
            "hc-key": "bi-mw",
            "value": 15
        },
        {
            "hc-key": "bi-ca",
            "value": 16
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/bi/bi-all.js">Burundi</a>'
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
            mapData: Highcharts.maps['countries/bi/bi-all'],
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
