$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ht-ou",
            "value": 0
        },
        {
            "hc-key": "ht-gr",
            "value": 1
        },
        {
            "hc-key": "ht-no",
            "value": 2
        },
        {
            "hc-key": "ht-sd",
            "value": 3
        },
        {
            "hc-key": "ht-ni",
            "value": 4
        },
        {
            "hc-key": "ht-ar",
            "value": 5
        },
        {
            "hc-key": "ht-ce",
            "value": 6
        },
        {
            "hc-key": "ht-ne",
            "value": 7
        },
        {
            "hc-key": "ht-nd",
            "value": 8
        },
        {
            "hc-key": "ht-se",
            "value": 9
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ht/ht-all.js">Haiti</a>'
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
            mapData: Highcharts.maps['countries/ht/ht-all'],
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
