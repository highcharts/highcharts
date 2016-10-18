$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "no-tr-1943",
            "value": 0
        },
        {
            "hc-key": "no-tr-1941",
            "value": 1
        },
        {
            "hc-key": "no-tr-1902",
            "value": 2
        },
        {
            "hc-key": "no-tr-1936",
            "value": 3
        },
        {
            "hc-key": "no-tr-1940",
            "value": 4
        },
        {
            "hc-key": "no-tr-1938",
            "value": 5
        },
        {
            "hc-key": "no-tr-1917",
            "value": 6
        },
        {
            "hc-key": "no-tr-1926",
            "value": 7
        },
        {
            "hc-key": "no-tr-1923",
            "value": 8
        },
        {
            "hc-key": "no-tr-1931",
            "value": 9
        },
        {
            "hc-key": "no-tr-1925",
            "value": 10
        },
        {
            "hc-key": "no-tr-1927",
            "value": 11
        },
        {
            "hc-key": "no-tr-1929",
            "value": 12
        },
        {
            "hc-key": "no-tr-1942",
            "value": 13
        },
        {
            "hc-key": "no-tr-1903",
            "value": 14
        },
        {
            "hc-key": "no-tr-1924",
            "value": 15
        },
        {
            "hc-key": "no-tr-1939",
            "value": 16
        },
        {
            "hc-key": "no-tr-1919",
            "value": 17
        },
        {
            "hc-key": "no-tr-1913",
            "value": 18
        },
        {
            "hc-key": "no-tr-1911",
            "value": 19
        },
        {
            "hc-key": "no-tr-1920",
            "value": 20
        },
        {
            "hc-key": "no-tr-1922",
            "value": 21
        },
        {
            "hc-key": "no-tr-1928",
            "value": 22
        },
        {
            "hc-key": "no-tr-1933",
            "value": 23
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-tr-all.js">Troms</a>'
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
            mapData: Highcharts.maps['countries/no/no-tr-all'],
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
