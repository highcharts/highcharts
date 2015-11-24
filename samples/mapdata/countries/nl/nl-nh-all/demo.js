$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "nl-3557-gm0381",
            "value": 0
        },
        {
            "hc-key": "nl-3557-gm0377",
            "value": 1
        },
        {
            "hc-key": "nl-3557-gm0363",
            "value": 2
        },
        {
            "hc-key": "nl-3557-gm0376",
            "value": 3
        },
        {
            "hc-key": "nl-3557-gm0420",
            "value": 4
        },
        {
            "hc-key": "nl-3557-gm0424",
            "value": 5
        },
        {
            "hc-key": "nl-3557-gm0448",
            "value": 6
        },
        {
            "hc-key": "nl-3557-gm0453",
            "value": 7
        },
        {
            "hc-key": "nl-3557-gm0383",
            "value": 8
        },
        {
            "hc-key": "nl-3557-gm1911",
            "value": 9
        },
        {
            "hc-key": "nl-3557-gm0398",
            "value": 10
        },
        {
            "hc-key": "nl-3557-gm0479",
            "value": 11
        },
        {
            "hc-key": "nl-3557-gm0362",
            "value": 12
        },
        {
            "hc-key": "nl-3557-gm0393",
            "value": 13
        },
        {
            "hc-key": "nl-3557-gm0498",
            "value": 14
        },
        {
            "hc-key": "nl-3557-gm0405",
            "value": 15
        },
        {
            "hc-key": "nl-3557-gm0388",
            "value": 16
        },
        {
            "hc-key": "nl-3557-gm0425",
            "value": 17
        },
        {
            "hc-key": "nl-3557-gm0402",
            "value": 18
        },
        {
            "hc-key": "nl-3557-gm0457",
            "value": 19
        },
        {
            "hc-key": "nl-3557-gm0406",
            "value": 20
        },
        {
            "hc-key": "nl-3557-gm0392",
            "value": 21
        },
        {
            "hc-key": "nl-3557-gm0394",
            "value": 22
        },
        {
            "hc-key": "nl-3557-gm0375",
            "value": 23
        },
        {
            "hc-key": "nl-3557-gm0437",
            "value": 24
        },
        {
            "hc-key": "nl-3557-gm1598",
            "value": 25
        },
        {
            "hc-key": "nl-3557-gm0417",
            "value": 26
        },
        {
            "hc-key": "nl-3557-gm0432",
            "value": 27
        },
        {
            "hc-key": "nl-3557-gm0358",
            "value": 28
        },
        {
            "hc-key": "nl-3557-gm0365",
            "value": 29
        },
        {
            "hc-key": "nl-3557-gm0370",
            "value": 30
        },
        {
            "hc-key": "nl-3557-gm0361",
            "value": 31
        },
        {
            "hc-key": "nl-3557-gm0373",
            "value": 32
        },
        {
            "hc-key": "nl-3557-gm0416",
            "value": 33
        },
        {
            "hc-key": "nl-3557-gm0415",
            "value": 34
        },
        {
            "hc-key": "nl-3557-gm0439",
            "value": 35
        },
        {
            "hc-key": "nl-3557-gm0441",
            "value": 36
        },
        {
            "hc-key": "nl-3557-gm0396",
            "value": 37
        },
        {
            "hc-key": "nl-3557-gm0852",
            "value": 38
        },
        {
            "hc-key": "nl-3557-gm0451",
            "value": 39
        },
        {
            "hc-key": "nl-3557-gm0880",
            "value": 40
        },
        {
            "hc-key": "nl-3557-gm0431",
            "value": 41
        },
        {
            "hc-key": "nl-3557-gm0384",
            "value": 42
        },
        {
            "hc-key": "nl-3557-gm0532",
            "value": 43
        },
        {
            "hc-key": "nl-3557-gm1696",
            "value": 44
        },
        {
            "hc-key": "nl-3557-gm0400",
            "value": 45
        },
        {
            "hc-key": "nl-3557-gm0399",
            "value": 46
        },
        {
            "hc-key": "nl-3557-gm0385",
            "value": 47
        },
        {
            "hc-key": "nl-3557-gm0478",
            "value": 48
        },
        {
            "hc-key": "nl-3557-gm0473",
            "value": 49
        },
        {
            "hc-key": "nl-3557-gm0397",
            "value": 50
        },
        {
            "hc-key": "nl-3557-gm0458",
            "value": 51
        },
        {
            "hc-key": "nl-3557-gm0450",
            "value": 52
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/nl/nl-nh-all.js">Noord-Holland</a>'
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
            mapData: Highcharts.maps['countries/nl/nl-nh-all'],
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
