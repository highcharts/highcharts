$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "gq-li",
            "value": 0
        },
        {
            "hc-key": "gq-cs",
            "value": 1
        },
        {
            "hc-key": "gq-kn",
            "value": 2
        },
        {
            "hc-key": "gq-wn",
            "value": 3
        },
        {
            "hc-key": "gq-bn",
            "value": 4
        },
        {
            "hc-key": "gq-bs",
            "value": 5
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/gq/gq-all.js">Equatorial Guinea</a>'
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
            mapData: Highcharts.maps['countries/gq/gq-all'],
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
