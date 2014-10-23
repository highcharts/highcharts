$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "au-nt",
            "value": 0
        },
        {
            "hc-key": "au-wa",
            "value": 1
        },
        {
            "hc-key": "au-ct",
            "value": 2
        },
        {
            "hc-key": "au-sa",
            "value": 3
        },
        {
            "hc-key": "au-ql",
            "value": 4
        },
        {
            "hc-key": "au-2557",
            "value": 5
        },
        {
            "hc-key": "au-ts",
            "value": 6
        },
        {
            "hc-key": "au-jb",
            "value": 7
        },
        {
            "hc-key": "au-ns",
            "value": 8
        },
        {
            "hc-key": "au-vi",
            "value": 9
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/au/au-all.js">Australia</a>'
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
            mapData: Highcharts.maps['countries/au/au-all'],
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
