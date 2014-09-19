$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "am-gr",
            "value": 0
        },
        {
            "hc-key": "am-ag",
            "value": 1
        },
        {
            "hc-key": "am-av",
            "value": 2
        },
        {
            "hc-key": "am-sh",
            "value": 3
        },
        {
            "hc-key": "am-ar",
            "value": 4
        },
        {
            "hc-key": "am-tv",
            "value": 5
        },
        {
            "hc-key": "am-kt",
            "value": 6
        },
        {
            "hc-key": "am-lo",
            "value": 7
        },
        {
            "hc-key": "am-er",
            "value": 8
        },
        {
            "hc-key": "am-su",
            "value": 9
        },
        {
            "hc-key": "am-vd",
            "value": 10
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/am/am-all.js">Armenia</a>'
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
            mapData: Highcharts.maps['countries/am/am-all'],
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
