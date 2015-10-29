$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "no-no-1856",
            "value": 0
        },
        {
            "hc-key": "no-no-1849",
            "value": 1
        },
        {
            "hc-key": "no-no-1804",
            "value": 2
        },
        {
            "hc-key": "no-no-1836",
            "value": 3
        },
        {
            "hc-key": "no-no-1837",
            "value": 4
        },
        {
            "hc-key": "no-no-1834",
            "value": 5
        },
        {
            "hc-key": "no-no-1835",
            "value": 6
        },
        {
            "hc-key": "no-no-1838",
            "value": 7
        },
        {
            "hc-key": "no-no-1825",
            "value": 8
        },
        {
            "hc-key": "no-no-1811",
            "value": 9
        },
        {
            "hc-key": "no-no-1827",
            "value": 10
        },
        {
            "hc-key": "no-no-1848",
            "value": 11
        },
        {
            "hc-key": "no-no-1865",
            "value": 12
        },
        {
            "hc-key": "no-no-1815",
            "value": 13
        },
        {
            "hc-key": "no-no-1812",
            "value": 14
        },
        {
            "hc-key": "no-no-1818",
            "value": 15
        },
        {
            "hc-key": "no-no-1860",
            "value": 16
        },
        {
            "hc-key": "no-no-1867",
            "value": 17
        },
        {
            "hc-key": "no-no-1866",
            "value": 18
        },
        {
            "hc-key": "no-no-1832",
            "value": 19
        },
        {
            "hc-key": "no-no-1839",
            "value": 20
        },
        {
            "hc-key": "no-no-1824",
            "value": 21
        },
        {
            "hc-key": "no-no-1833",
            "value": 22
        },
        {
            "hc-key": "no-no-1828",
            "value": 23
        },
        {
            "hc-key": "no-no-1820",
            "value": 24
        },
        {
            "hc-key": "no-no-1841",
            "value": 25
        },
        {
            "hc-key": "no-no-1840",
            "value": 26
        },
        {
            "hc-key": "no-no-1845",
            "value": 27
        },
        {
            "hc-key": "no-no-1868",
            "value": 28
        },
        {
            "hc-key": "no-no-1870",
            "value": 29
        },
        {
            "hc-key": "no-no-1813",
            "value": 30
        },
        {
            "hc-key": "no-no-1851",
            "value": 31
        },
        {
            "hc-key": "no-no-1852",
            "value": 32
        },
        {
            "hc-key": "no-no-1850",
            "value": 33
        },
        {
            "hc-key": "no-no-1853",
            "value": 34
        },
        {
            "hc-key": "no-no-1854",
            "value": 35
        },
        {
            "hc-key": "no-no-1871",
            "value": 36
        },
        {
            "hc-key": "no-no-1857",
            "value": 37
        },
        {
            "hc-key": "no-no-1826",
            "value": 38
        },
        {
            "hc-key": "no-no-1822",
            "value": 39
        },
        {
            "hc-key": "no-no-1816",
            "value": 40
        },
        {
            "hc-key": "no-no-1805",
            "value": 41
        },
        {
            "hc-key": "no-no-1859",
            "value": 42
        },
        {
            "hc-key": "no-no-1874",
            "value": 43
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-no-all.js">Nordland</a>'
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
            mapData: Highcharts.maps['countries/no/no-no-all'],
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
