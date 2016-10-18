$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "nz-6471",
            "value": 0
        },
        {
            "hc-key": "nz-6475",
            "value": 1
        },
        {
            "hc-key": "nz-3583",
            "value": 2
        },
        {
            "hc-key": "nz-6470",
            "value": 3
        },
        {
            "hc-key": "nz-6473",
            "value": 4
        },
        {
            "hc-key": "nz-6474",
            "value": 5
        },
        {
            "hc-key": "nz-6476",
            "value": 6
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ck/ck-all.js">Cook Islands</a>'
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
            mapData: Highcharts.maps['countries/ck/ck-all'],
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
