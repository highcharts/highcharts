$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "no-sf-1428",
            "value": 0
        },
        {
            "hc-key": "no-sf-1429",
            "value": 1
        },
        {
            "hc-key": "no-sf-1430",
            "value": 2
        },
        {
            "hc-key": "no-sf-1420",
            "value": 3
        },
        {
            "hc-key": "no-sf-1422",
            "value": 4
        },
        {
            "hc-key": "no-sf-1445",
            "value": 5
        },
        {
            "hc-key": "no-sf-1426",
            "value": 6
        },
        {
            "hc-key": "no-sf-1424",
            "value": 7
        },
        {
            "hc-key": "no-sf-1443",
            "value": 8
        },
        {
            "hc-key": "no-sf-1418",
            "value": 9
        },
        {
            "hc-key": "no-sf-1439",
            "value": 10
        },
        {
            "hc-key": "no-sf-1412",
            "value": 11
        },
        {
            "hc-key": "no-sf-1413",
            "value": 12
        },
        {
            "hc-key": "no-sf-1417",
            "value": 13
        },
        {
            "hc-key": "no-sf-1421",
            "value": 14
        },
        {
            "hc-key": "no-sf-1432",
            "value": 15
        },
        {
            "hc-key": "no-sf-1433",
            "value": 16
        },
        {
            "hc-key": "no-sf-1431",
            "value": 17
        },
        {
            "hc-key": "no-sf-1401",
            "value": 18
        },
        {
            "hc-key": "no-sf-1441",
            "value": 19
        },
        {
            "hc-key": "no-sf-1444",
            "value": 20
        },
        {
            "hc-key": "no-sf-1449",
            "value": 21
        },
        {
            "hc-key": "no-sf-1419",
            "value": 22
        },
        {
            "hc-key": "no-sf-1438",
            "value": 23
        },
        {
            "hc-key": "no-sf-1411",
            "value": 24
        },
        {
            "hc-key": "no-sf-1416",
            "value": 25
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-sf-all.js">Sogn og Fjordane</a>'
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
            mapData: Highcharts.maps['countries/no/no-sf-all'],
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
