$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "bw-6964",
            "value": 0
        },
        {
            "hc-key": "bw-6963",
            "value": 1
        },
        {
            "hc-key": "bw-6967",
            "value": 2
        },
        {
            "hc-key": "bw-6966",
            "value": 3
        },
        {
            "hc-key": "bw-kg",
            "value": 4
        },
        {
            "hc-key": "bw-se",
            "value": 5
        },
        {
            "hc-key": "bw-ne",
            "value": 6
        },
        {
            "hc-key": "bw-6962",
            "value": 7
        },
        {
            "hc-key": "bw-gh",
            "value": 8
        },
        {
            "hc-key": "bw-nw",
            "value": 9
        },
        {
            "hc-key": "bw-ce",
            "value": 10
        },
        {
            "hc-key": "bw-kl",
            "value": 11
        },
        {
            "hc-key": "bw-kw",
            "value": 12
        },
        {
            "hc-key": "bw-6965",
            "value": 13
        },
        {
            "hc-key": "bw-so",
            "value": 14
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/bw/bw-all.js">Botswana</a>'
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
            mapData: Highcharts.maps['countries/bw/bw-all'],
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
