$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "kw-ja",
            "value": 0
        },
        {
            "hc-key": "kw-ku",
            "value": 1
        },
        {
            "hc-key": "kw-fa",
            "value": 2
        },
        {
            "hc-key": "kw-ah",
            "value": 3
        },
        {
            "hc-key": "kw-1922",
            "value": 4
        },
        {
            "hc-key": "kw-hw",
            "value": 5
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/kw/kw-all.js">Kuwait</a>'
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
            mapData: Highcharts.maps['countries/kw/kw-all'],
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
