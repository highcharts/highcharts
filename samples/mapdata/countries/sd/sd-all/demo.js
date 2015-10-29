$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "sd-rs",
            "value": 0
        },
        {
            "hc-key": "sd-711",
            "value": 1
        },
        {
            "hc-key": "sd-7281",
            "value": 2
        },
        {
            "hc-key": "sd-wd",
            "value": 3
        },
        {
            "hc-key": "sd-kh",
            "value": 4
        },
        {
            "hc-key": "sd-gz",
            "value": 5
        },
        {
            "hc-key": "sd-gd",
            "value": 6
        },
        {
            "hc-key": "sd-rn",
            "value": 7
        },
        {
            "hc-key": "sd-no",
            "value": 8
        },
        {
            "hc-key": "sd-kn",
            "value": 9
        },
        {
            "hc-key": "sd-wn",
            "value": 10
        },
        {
            "hc-key": "sd-si",
            "value": 11
        },
        {
            "hc-key": "sd-nd",
            "value": 12
        },
        {
            "hc-key": "sd-ks",
            "value": 13
        },
        {
            "hc-key": "sd-sd",
            "value": 14
        },
        {
            "hc-key": "sd-ka",
            "value": 15
        },
        {
            "hc-key": "sd-bn",
            "value": 16
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/sd/sd-all.js">Sudan</a>'
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
            mapData: Highcharts.maps['countries/sd/sd-all'],
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
