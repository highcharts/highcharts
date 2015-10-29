$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "bs-rc",
            "value": 0
        },
        {
            "hc-key": "bs-ri",
            "value": 1
        },
        {
            "hc-key": "bs-ck",
            "value": 2
        },
        {
            "hc-key": "bs-ak",
            "value": 3
        },
        {
            "hc-key": "bs-bi",
            "value": 4
        },
        {
            "hc-key": "bs-ht",
            "value": 5
        },
        {
            "hc-key": "bs-ce",
            "value": 6
        },
        {
            "hc-key": "bs-wg",
            "value": 7
        },
        {
            "hc-key": "bs-eg",
            "value": 8
        },
        {
            "hc-key": "bs-gc",
            "value": 9
        },
        {
            "hc-key": "bs-co",
            "value": 10
        },
        {
            "hc-key": "bs-so",
            "value": 11
        },
        {
            "hc-key": "bs-mi",
            "value": 12
        },
        {
            "hc-key": "bs-by",
            "value": 13
        },
        {
            "hc-key": "bs-cs",
            "value": 14
        },
        {
            "hc-key": "bs-sa",
            "value": 15
        },
        {
            "hc-key": "bs-bp",
            "value": 16
        },
        {
            "hc-key": "bs-ex",
            "value": 17
        },
        {
            "hc-key": "bs-sw",
            "value": 18
        },
        {
            "hc-key": "bs-hi",
            "value": 19
        },
        {
            "hc-key": "bs-fp",
            "value": 20
        },
        {
            "hc-key": "bs-ne",
            "value": 21
        },
        {
            "hc-key": "bs-se",
            "value": 22
        },
        {
            "hc-key": "bs-no",
            "value": 23
        },
        {
            "hc-key": "bs-mc",
            "value": 24
        },
        {
            "hc-key": "bs-ci",
            "value": 25
        },
        {
            "hc-key": "bs-ss",
            "value": 26
        },
        {
            "hc-key": "bs-li",
            "value": 27
        },
        {
            "hc-key": "bs-mg",
            "value": 28
        },
        {
            "hc-key": "bs-in",
            "value": 29
        },
        {
            "hc-key": "bs-ns",
            "value": 30
        },
        {
            "hc-key": "bs-nw",
            "value": 31
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/bs/bs-all.js">The Bahamas</a>'
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
            mapData: Highcharts.maps['countries/bs/bs-all'],
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
