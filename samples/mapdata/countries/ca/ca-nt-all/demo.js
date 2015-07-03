$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ca-nt-6103",
            "value": 0
        },
        {
            "hc-key": "ca-nt-6101",
            "value": 1
        },
        {
            "hc-key": "ca-nt-6106",
            "value": 2
        },
        {
            "hc-key": "ca-nt-6105",
            "value": 3
        },
        {
            "hc-key": "ca-nt-6104",
            "value": 4
        },
        {
            "hc-key": "ca-nt-6102",
            "value": 5
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ca/ca-nt-all.js">Northwest Territories</a>'
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
            mapData: Highcharts.maps['countries/ca/ca-nt-all'],
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
