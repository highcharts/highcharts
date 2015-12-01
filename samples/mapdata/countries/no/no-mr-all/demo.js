$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "no-mr-1566",
            "value": 0
        },
        {
            "hc-key": "no-mr-1576",
            "value": 1
        },
        {
            "hc-key": "no-mr-1554",
            "value": 2
        },
        {
            "hc-key": "no-mr-1511",
            "value": 3
        },
        {
            "hc-key": "no-mr-1526",
            "value": 4
        },
        {
            "hc-key": "no-mr-1524",
            "value": 5
        },
        {
            "hc-key": "no-mr-1525",
            "value": 6
        },
        {
            "hc-key": "no-mr-1528",
            "value": 7
        },
        {
            "hc-key": "no-mr-1523",
            "value": 8
        },
        {
            "hc-key": "no-mr-1539",
            "value": 9
        },
        {
            "hc-key": "no-mr-1535",
            "value": 10
        },
        {
            "hc-key": "no-mr-1529",
            "value": 11
        },
        {
            "hc-key": "no-mr-1514",
            "value": 12
        },
        {
            "hc-key": "no-mr-1563",
            "value": 13
        },
        {
            "hc-key": "no-mr-1502",
            "value": 14
        },
        {
            "hc-key": "no-mr-1551",
            "value": 15
        },
        {
            "hc-key": "no-mr-1531",
            "value": 16
        },
        {
            "hc-key": "no-mr-1504",
            "value": 17
        },
        {
            "hc-key": "no-mr-1505",
            "value": 18
        },
        {
            "hc-key": "no-mr-1557",
            "value": 19
        },
        {
            "hc-key": "no-mr-1519",
            "value": 20
        },
        {
            "hc-key": "no-mr-1547",
            "value": 21
        },
        {
            "hc-key": "no-mr-1520",
            "value": 22
        },
        {
            "hc-key": "no-mr-1517",
            "value": 23
        },
        {
            "hc-key": "no-mr-1516",
            "value": 24
        },
        {
            "hc-key": "no-mr-1548",
            "value": 25
        },
        {
            "hc-key": "no-mr-1545",
            "value": 26
        },
        {
            "hc-key": "no-mr-1571",
            "value": 27
        },
        {
            "hc-key": "no-mr-1515",
            "value": 28
        },
        {
            "hc-key": "no-mr-1534",
            "value": 29
        },
        {
            "hc-key": "no-mr-1532",
            "value": 30
        },
        {
            "hc-key": "no-mr-1567",
            "value": 31
        },
        {
            "hc-key": "no-mr-1573",
            "value": 32
        },
        {
            "hc-key": "no-mr-1560",
            "value": 33
        },
        {
            "hc-key": "no-mr-1546",
            "value": 34
        },
        {
            "hc-key": "no-mr-1543",
            "value": 35
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-mr-all.js">Møre og Romsdal</a>'
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
            mapData: Highcharts.maps['countries/no/no-mr-all'],
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
