$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ke-co",
            "value": 0
        },
        {
            "hc-key": "ke-ny",
            "value": 1
        },
        {
            "hc-key": "ke-ce",
            "value": 2
        },
        {
            "hc-key": "ke-na",
            "value": 3
        },
        {
            "hc-key": "ke-565",
            "value": 4
        },
        {
            "hc-key": "ke-rv",
            "value": 5
        },
        {
            "hc-key": "ke-we",
            "value": 6
        },
        {
            "hc-key": "ke-ne",
            "value": 7
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ke/ke-all.js">Kenya</a>'
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
            mapData: Highcharts.maps['countries/ke/ke-all'],
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
