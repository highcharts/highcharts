$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "sk-bl",
            "value": 0
        },
        {
            "hc-key": "sk-bc",
            "value": 1
        },
        {
            "hc-key": "sk-zi",
            "value": 2
        },
        {
            "hc-key": "sk-ni",
            "value": 3
        },
        {
            "hc-key": "sk-tc",
            "value": 4
        },
        {
            "hc-key": "sk-ta",
            "value": 5
        },
        {
            "hc-key": "sk-ki",
            "value": 6
        },
        {
            "hc-key": "sk-pv",
            "value": 7
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/sk/sk-all.js">Slovakia</a>'
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
            mapData: Highcharts.maps['countries/sk/sk-all'],
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
