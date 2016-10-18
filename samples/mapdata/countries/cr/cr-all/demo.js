$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "cr-pu",
            "value": 0
        },
        {
            "hc-key": "cr-sj",
            "value": 1
        },
        {
            "hc-key": "cr-al",
            "value": 2
        },
        {
            "hc-key": "cr-gu",
            "value": 3
        },
        {
            "hc-key": "cr-li",
            "value": 4
        },
        {
            "hc-key": "cr-ca",
            "value": 5
        },
        {
            "hc-key": "cr-he",
            "value": 6
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/cr/cr-all.js">Costa Rica</a>'
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
            mapData: Highcharts.maps['countries/cr/cr-all'],
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
