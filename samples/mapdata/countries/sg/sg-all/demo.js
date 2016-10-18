$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "sg-3595",
            "value": 0
        },
        {
            "hc-key": "sg-6400",
            "value": 1
        },
        {
            "hc-key": "sg-6401",
            "value": 2
        },
        {
            "hc-key": "sg-6402",
            "value": 3
        },
        {
            "hc-key": "sg-6403",
            "value": 4
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/sg/sg-all.js">Singapore</a>'
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
            mapData: Highcharts.maps['countries/sg/sg-all'],
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
