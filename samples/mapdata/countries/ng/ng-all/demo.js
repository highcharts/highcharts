$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ng-ri",
            "value": 0
        },
        {
            "hc-key": "ng-kt",
            "value": 1
        },
        {
            "hc-key": "ng-so",
            "value": 2
        },
        {
            "hc-key": "ng-za",
            "value": 3
        },
        {
            "hc-key": "ng-yo",
            "value": 4
        },
        {
            "hc-key": "ng-ke",
            "value": 5
        },
        {
            "hc-key": "ng-ad",
            "value": 6
        },
        {
            "hc-key": "ng-bo",
            "value": 7
        },
        {
            "hc-key": "ng-ak",
            "value": 8
        },
        {
            "hc-key": "ng-ab",
            "value": 9
        },
        {
            "hc-key": "ng-im",
            "value": 10
        },
        {
            "hc-key": "ng-by",
            "value": 11
        },
        {
            "hc-key": "ng-be",
            "value": 12
        },
        {
            "hc-key": "ng-cr",
            "value": 13
        },
        {
            "hc-key": "ng-ta",
            "value": 14
        },
        {
            "hc-key": "ng-kw",
            "value": 15
        },
        {
            "hc-key": "ng-la",
            "value": 16
        },
        {
            "hc-key": "ng-ni",
            "value": 17
        },
        {
            "hc-key": "ng-fc",
            "value": 18
        },
        {
            "hc-key": "ng-og",
            "value": 19
        },
        {
            "hc-key": "ng-on",
            "value": 20
        },
        {
            "hc-key": "ng-ek",
            "value": 21
        },
        {
            "hc-key": "ng-os",
            "value": 22
        },
        {
            "hc-key": "ng-oy",
            "value": 23
        },
        {
            "hc-key": "ng-an",
            "value": 24
        },
        {
            "hc-key": "ng-ba",
            "value": 25
        },
        {
            "hc-key": "ng-go",
            "value": 26
        },
        {
            "hc-key": "ng-de",
            "value": 27
        },
        {
            "hc-key": "ng-ed",
            "value": 28
        },
        {
            "hc-key": "ng-en",
            "value": 29
        },
        {
            "hc-key": "ng-eb",
            "value": 30
        },
        {
            "hc-key": "ng-kd",
            "value": 31
        },
        {
            "hc-key": "ng-ko",
            "value": 32
        },
        {
            "hc-key": "ng-pl",
            "value": 33
        },
        {
            "hc-key": "ng-na",
            "value": 34
        },
        {
            "hc-key": "ng-ji",
            "value": 35
        },
        {
            "hc-key": "ng-kn",
            "value": 36
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ng/ng-all.js">Nigeria</a>'
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
            mapData: Highcharts.maps['countries/ng/ng-all'],
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
