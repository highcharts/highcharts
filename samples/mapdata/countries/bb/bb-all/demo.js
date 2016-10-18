$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "bb-mi",
            "value": 0
        },
        {
            "hc-key": "bb-pe",
            "value": 1
        },
        {
            "hc-key": "bb-an",
            "value": 2
        },
        {
            "hc-key": "bb-ph",
            "value": 3
        },
        {
            "hc-key": "bb-cc",
            "value": 4
        },
        {
            "hc-key": "bb-th",
            "value": 5
        },
        {
            "hc-key": "bb-ge",
            "value": 6
        },
        {
            "hc-key": "bb-jm",
            "value": 7
        },
        {
            "hc-key": "bb-jn",
            "value": 8
        },
        {
            "hc-key": "bb-js",
            "value": 9
        },
        {
            "hc-key": "bb-lu",
            "value": 10
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/bb/bb-all.js">Barbados</a>'
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
            mapData: Highcharts.maps['countries/bb/bb-all'],
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
