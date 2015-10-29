$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "gh-ah",
            "value": 0
        },
        {
            "hc-key": "gh-ep",
            "value": 1
        },
        {
            "hc-key": "gh-wp",
            "value": 2
        },
        {
            "hc-key": "gh-aa",
            "value": 3
        },
        {
            "hc-key": "gh-tv",
            "value": 4
        },
        {
            "hc-key": "gh-np",
            "value": 5
        },
        {
            "hc-key": "gh-ue",
            "value": 6
        },
        {
            "hc-key": "gh-uw",
            "value": 7
        },
        {
            "hc-key": "gh-ba",
            "value": 8
        },
        {
            "hc-key": "gh-cp",
            "value": 9
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/gh/gh-all.js">Ghana</a>'
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
            mapData: Highcharts.maps['countries/gh/gh-all'],
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
