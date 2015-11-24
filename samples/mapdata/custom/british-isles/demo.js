$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ie-irl",
            "value": 0
        },
        {
            "hc-key": "gb-eng",
            "value": 1
        },
        {
            "hc-key": "gb-wls",
            "value": 2
        },
        {
            "hc-key": "gb-sct",
            "value": 3
        },
        {
            "hc-key": "gb-imn",
            "value": 4
        },
        {
            "hc-key": "gb-nir",
            "value": 5
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/custom/british-isles.js">British Isles</a>'
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
            mapData: Highcharts.maps['custom/british-isles'],
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
