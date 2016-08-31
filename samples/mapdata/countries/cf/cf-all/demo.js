$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "cf-vk",
            "value": 0
        },
        {
            "hc-key": "cf-hk",
            "value": 1
        },
        {
            "hc-key": "cf-hm",
            "value": 2
        },
        {
            "hc-key": "cf-mb",
            "value": 3
        },
        {
            "hc-key": "cf-bg",
            "value": 4
        },
        {
            "hc-key": "cf-mp",
            "value": 5
        },
        {
            "hc-key": "cf-lb",
            "value": 6
        },
        {
            "hc-key": "cf-hs",
            "value": 7
        },
        {
            "hc-key": "cf-op",
            "value": 8
        },
        {
            "hc-key": "cf-se",
            "value": 9
        },
        {
            "hc-key": "cf-nm",
            "value": 10
        },
        {
            "hc-key": "cf-kg",
            "value": 11
        },
        {
            "hc-key": "cf-kb",
            "value": 12
        },
        {
            "hc-key": "cf-bk",
            "value": 13
        },
        {
            "hc-key": "cf-uk",
            "value": 14
        },
        {
            "hc-key": "cf-ac",
            "value": 15
        },
        {
            "hc-key": "cf-bb",
            "value": 16
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/cf/cf-all.js">Central African Republic</a>'
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
            mapData: Highcharts.maps['countries/cf/cf-all'],
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
