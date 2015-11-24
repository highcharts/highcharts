$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "de-he-06633000",
            "value": 0
        },
        {
            "hc-key": "de-he-06635000",
            "value": 1
        },
        {
            "hc-key": "de-he-06431000",
            "value": 2
        },
        {
            "hc-key": "de-he-06535000",
            "value": 3
        },
        {
            "hc-key": "de-he-06634000",
            "value": 4
        },
        {
            "hc-key": "de-he-06611000",
            "value": 5
        },
        {
            "hc-key": "de-he-06636000",
            "value": 6
        },
        {
            "hc-key": "de-he-06532000",
            "value": 7
        },
        {
            "hc-key": "de-he-06440000",
            "value": 8
        },
        {
            "hc-key": "de-he-06531000",
            "value": 9
        },
        {
            "hc-key": "de-he-06632000",
            "value": 10
        },
        {
            "hc-key": "de-he-06435000",
            "value": 11
        },
        {
            "hc-key": "de-he-06413000",
            "value": 12
        },
        {
            "hc-key": "de-he-06432000",
            "value": 13
        },
        {
            "hc-key": "de-he-06411000",
            "value": 14
        },
        {
            "hc-key": "de-he-06438000",
            "value": 15
        },
        {
            "hc-key": "de-he-06436000",
            "value": 16
        },
        {
            "hc-key": "de-he-06439000",
            "value": 17
        },
        {
            "hc-key": "de-he-06414000",
            "value": 18
        },
        {
            "hc-key": "de-he-06437000",
            "value": 19
        },
        {
            "hc-key": "de-he-06434000",
            "value": 20
        },
        {
            "hc-key": "de-he-06631000",
            "value": 21
        },
        {
            "hc-key": "de-he-06412000",
            "value": 22
        },
        {
            "hc-key": "de-he-06533000",
            "value": 23
        },
        {
            "hc-key": "de-he-06534000",
            "value": 24
        },
        {
            "hc-key": "de-he-06433000",
            "value": 25
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/de/de-he-all.js">Hessen</a>'
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
            mapData: Highcharts.maps['countries/de/de-he-all'],
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
