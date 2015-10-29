$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "as-6516",
            "value": 0
        },
        {
            "hc-key": "as-6515",
            "value": 1
        },
        {
            "hc-key": "as-6514",
            "value": 2
        },
        {
            "hc-key": "as-6513",
            "value": 3
        },
        {
            "hc-key": "as-3585",
            "value": 4
        },
        {
            "value": 5
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/as/as-all.js">American Samoa</a>'
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
            mapData: Highcharts.maps['countries/as/as-all'],
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
        }, {
            name: 'Separators',
            type: 'mapline',
            data: Highcharts.geojson(Highcharts.maps['countries/as/as-all'], 'mapline'),
            color: 'silver',
            showInLegend: false,
            enableMouseTracking: false
        }]
    });
});
