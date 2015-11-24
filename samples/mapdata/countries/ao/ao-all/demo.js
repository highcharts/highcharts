$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ao-na",
            "value": 0
        },
        {
            "hc-key": "ao-cb",
            "value": 1
        },
        {
            "hc-key": "ao-ln",
            "value": 2
        },
        {
            "hc-key": "ao-ls",
            "value": 3
        },
        {
            "hc-key": "ao-ml",
            "value": 4
        },
        {
            "hc-key": "ao-bo",
            "value": 5
        },
        {
            "hc-key": "ao-cn",
            "value": 6
        },
        {
            "hc-key": "ao-cs",
            "value": 7
        },
        {
            "hc-key": "ao-lu",
            "value": 8
        },
        {
            "hc-key": "ao-ui",
            "value": 9
        },
        {
            "hc-key": "ao-za",
            "value": 10
        },
        {
            "hc-key": "ao-bi",
            "value": 11
        },
        {
            "hc-key": "ao-bg",
            "value": 12
        },
        {
            "hc-key": "ao-cc",
            "value": 13
        },
        {
            "hc-key": "ao-cu",
            "value": 14
        },
        {
            "hc-key": "ao-hm",
            "value": 15
        },
        {
            "hc-key": "ao-hl",
            "value": 16
        },
        {
            "hc-key": "ao-mx",
            "value": 17
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ao/ao-all.js">Angola</a>'
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
            mapData: Highcharts.maps['countries/ao/ao-all'],
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
