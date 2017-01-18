$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "cd-bc",
            "value": 0
        },
        {
            "hc-key": "cd-kv",
            "value": 1
        },
        {
            "hc-key": "cd-eq",
            "value": 2
        },
        {
            "hc-key": "cd-hc",
            "value": 3
        },
        {
            "hc-key": "cd-bn",
            "value": 4
        },
        {
            "hc-key": "cd-kn",
            "value": 5
        },
        {
            "hc-key": "cd-kr",
            "value": 6
        },
        {
            "hc-key": "cd-kt",
            "value": 7
        },
        {
            "hc-key": "cd-kc",
            "value": 8
        },
        {
            "hc-key": "cd-1694",
            "value": 9
        },
        {
            "hc-key": "cd-1697",
            "value": 10
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/cd/cd-all.js">Democratic Republic of the Congo</a>'
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
            mapData: Highcharts.maps['countries/cd/cd-all'],
            joinBy: 'hc-key',
            name: 'Random data',
            states: {
                hover: {
                    color: '#a4edba'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });
});
