$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "sy-di",
            "value": 0
        },
        {
            "hc-key": "sy-hl",
            "value": 1
        },
        {
            "hc-key": "sy-hm",
            "value": 2
        },
        {
            "hc-key": "sy-hi",
            "value": 3
        },
        {
            "hc-key": "sy-id",
            "value": 4
        },
        {
            "hc-key": "sy-ha",
            "value": 5
        },
        {
            "hc-key": "sy-dy",
            "value": 6
        },
        {
            "hc-key": "sy-su",
            "value": 7
        },
        {
            "hc-key": "sy-rd",
            "value": 8
        },
        {
            "hc-key": "sy-qu",
            "value": 9
        },
        {
            "hc-key": "sy-dr",
            "value": 10
        },
        {
            "hc-key": "sy-3686",
            "value": 11
        },
        {
            "hc-key": "sy-la",
            "value": 12
        },
        {
            "hc-key": "sy-ta",
            "value": 13
        },
        {
            "hc-key": "sy-ra",
            "value": 14
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/sy/sy-all.js">Syria</a>'
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
            mapData: Highcharts.maps['countries/sy/sy-all'],
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
