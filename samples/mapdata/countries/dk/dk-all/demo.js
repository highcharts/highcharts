$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "dk-6326",
            "value": 0
        },
        {
            "hc-key": "dk-3564",
            "value": 1
        },
        {
            "hc-key": "dk-3568",
            "value": 2
        },
        {
            "hc-key": "dk-6325",
            "value": 3
        },
        {
            "hc-key": "dk-3563",
            "value": 4
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/dk/dk-all.js">Denmark</a>'
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
            mapData: Highcharts.maps['countries/dk/dk-all'],
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
