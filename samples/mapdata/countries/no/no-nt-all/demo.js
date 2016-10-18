$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "no-nt-1749",
            "value": 0
        },
        {
            "hc-key": "no-nt-1755",
            "value": 1
        },
        {
            "hc-key": "no-nt-1703",
            "value": 2
        },
        {
            "hc-key": "no-nt-1750",
            "value": 3
        },
        {
            "hc-key": "no-nt-1719",
            "value": 4
        },
        {
            "hc-key": "no-nt-1748",
            "value": 5
        },
        {
            "hc-key": "no-nt-1744",
            "value": 6
        },
        {
            "hc-key": "no-nt-1718",
            "value": 7
        },
        {
            "hc-key": "no-nt-1724",
            "value": 8
        },
        {
            "hc-key": "no-nt-1702",
            "value": 9
        },
        {
            "hc-key": "no-nt-1725",
            "value": 10
        },
        {
            "hc-key": "no-nt-1721",
            "value": 11
        },
        {
            "hc-key": "no-nt-1736",
            "value": 12
        },
        {
            "hc-key": "no-nt-1740",
            "value": 13
        },
        {
            "hc-key": "no-nt-1743",
            "value": 14
        },
        {
            "hc-key": "no-nt-1739",
            "value": 15
        },
        {
            "hc-key": "no-nt-1742",
            "value": 16
        },
        {
            "hc-key": "no-nt-1714",
            "value": 17
        },
        {
            "hc-key": "no-nt-1738",
            "value": 18
        },
        {
            "hc-key": "no-nt-1711",
            "value": 19
        },
        {
            "hc-key": "no-nt-1717",
            "value": 20
        },
        {
            "hc-key": "no-nt-1756",
            "value": 21
        },
        {
            "hc-key": "no-nt-1751",
            "value": 22
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-nt-all.js">Nord-Trøndelag</a>'
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
            mapData: Highcharts.maps['countries/no/no-nt-all'],
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
