$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "no-st-1621",
            "value": 0
        },
        {
            "hc-key": "no-st-1620",
            "value": 1
        },
        {
            "hc-key": "no-st-1627",
            "value": 2
        },
        {
            "hc-key": "no-st-1663",
            "value": 3
        },
        {
            "hc-key": "no-st-1630",
            "value": 4
        },
        {
            "hc-key": "no-st-1617",
            "value": 5
        },
        {
            "hc-key": "no-st-1640",
            "value": 6
        },
        {
            "hc-key": "no-st-1662",
            "value": 7
        },
        {
            "hc-key": "no-st-1648",
            "value": 8
        },
        {
            "hc-key": "no-st-1601",
            "value": 9
        },
        {
            "hc-key": "no-st-1644",
            "value": 10
        },
        {
            "hc-key": "no-st-1622",
            "value": 11
        },
        {
            "hc-key": "no-st-1624",
            "value": 12
        },
        {
            "hc-key": "no-st-1635",
            "value": 13
        },
        {
            "hc-key": "no-st-1632",
            "value": 14
        },
        {
            "hc-key": "no-st-1634",
            "value": 15
        },
        {
            "hc-key": "no-st-1636",
            "value": 16
        },
        {
            "hc-key": "no-st-1638",
            "value": 17
        },
        {
            "hc-key": "no-st-1665",
            "value": 18
        },
        {
            "hc-key": "no-st-1612",
            "value": 19
        },
        {
            "hc-key": "no-st-1653",
            "value": 20
        },
        {
            "hc-key": "no-st-1613",
            "value": 21
        },
        {
            "hc-key": "no-st-1657",
            "value": 22
        },
        {
            "hc-key": "no-st-1664",
            "value": 23
        },
        {
            "hc-key": "no-st-1633",
            "value": 24
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-st-all.js">Sør-Trøndelag</a>'
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
            mapData: Highcharts.maps['countries/no/no-st-all'],
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
