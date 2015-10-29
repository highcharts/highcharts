$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "li-6425",
            "value": 0
        },
        {
            "hc-key": "li-6426",
            "value": 1
        },
        {
            "hc-key": "li-6427",
            "value": 2
        },
        {
            "hc-key": "li-6418",
            "value": 3
        },
        {
            "hc-key": "li-3644",
            "value": 4
        },
        {
            "hc-key": "li-6419",
            "value": 5
        },
        {
            "hc-key": "li-6420",
            "value": 6
        },
        {
            "hc-key": "li-6421",
            "value": 7
        },
        {
            "hc-key": "li-6422",
            "value": 8
        },
        {
            "hc-key": "li-6423",
            "value": 9
        },
        {
            "hc-key": "li-6424",
            "value": 10
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/li/li-all.js">Liechtenstein</a>'
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
            mapData: Highcharts.maps['countries/li/li-all'],
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
