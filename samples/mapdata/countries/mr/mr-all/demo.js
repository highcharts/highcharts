$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "mr-4965",
            "value": 0
        },
        {
            "hc-key": "mr-dn",
            "value": 1
        },
        {
            "hc-key": "mr-in",
            "value": 2
        },
        {
            "hc-key": "mr-no",
            "value": 3
        },
        {
            "hc-key": "mr-br",
            "value": 4
        },
        {
            "hc-key": "mr-tr",
            "value": 5
        },
        {
            "hc-key": "mr-as",
            "value": 6
        },
        {
            "hc-key": "mr-gd",
            "value": 7
        },
        {
            "hc-key": "mr-go",
            "value": 8
        },
        {
            "hc-key": "mr-ad",
            "value": 9
        },
        {
            "hc-key": "mr-hc",
            "value": 10
        },
        {
            "hc-key": "mr-hg",
            "value": 11
        },
        {
            "hc-key": "mr-tg",
            "value": 12
        },
        {
            "hc-key": "mr-tz",
            "value": 13
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/mr/mr-all.js">Mauritania</a>'
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
            mapData: Highcharts.maps['countries/mr/mr-all'],
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
