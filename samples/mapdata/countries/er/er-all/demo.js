$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "er-5773",
            "value": 0
        },
        {
            "hc-key": "er-du",
            "value": 1
        },
        {
            "hc-key": "er-gb",
            "value": 2
        },
        {
            "hc-key": "er-an",
            "value": 3
        },
        {
            "hc-key": "er-sk",
            "value": 4
        },
        {
            "hc-key": "er-ma",
            "value": 5
        },
        {
            "hc-key": "er-dk",
            "value": 6
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/er/er-all.js">Eritrea</a>'
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
            mapData: Highcharts.maps['countries/er/er-all'],
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
