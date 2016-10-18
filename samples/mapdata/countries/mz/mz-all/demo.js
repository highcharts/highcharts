$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "mz-nm",
            "value": 0
        },
        {
            "hc-key": "mz-in",
            "value": 1
        },
        {
            "hc-key": "mz-mp",
            "value": 2
        },
        {
            "hc-key": "mz-za",
            "value": 3
        },
        {
            "hc-key": "mz-7278",
            "value": 4
        },
        {
            "hc-key": "mz-te",
            "value": 5
        },
        {
            "hc-key": "mz-mn",
            "value": 6
        },
        {
            "hc-key": "mz-cd",
            "value": 7
        },
        {
            "hc-key": "mz-ns",
            "value": 8
        },
        {
            "hc-key": "mz-ga",
            "value": 9
        },
        {
            "hc-key": "mz-so",
            "value": 10
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/mz/mz-all.js">Mozambique</a>'
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
            mapData: Highcharts.maps['countries/mz/mz-all'],
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
