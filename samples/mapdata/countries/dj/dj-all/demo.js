$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "dj-5766",
            "value": 0
        },
        {
            "hc-key": "dj-db",
            "value": 1
        },
        {
            "hc-key": "dj-1166",
            "value": 2
        },
        {
            "hc-key": "dj-as",
            "value": 3
        },
        {
            "hc-key": "dj-dk",
            "value": 4
        },
        {
            "hc-key": "dj-ob",
            "value": 5
        },
        {
            "hc-key": "dj-ta",
            "value": 6
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/dj/dj-all.js">Djibouti</a>'
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
            mapData: Highcharts.maps['countries/dj/dj-all'],
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
