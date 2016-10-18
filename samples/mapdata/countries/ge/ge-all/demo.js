$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ge-ab",
            "value": 0
        },
        {
            "hc-key": "ge-aj",
            "value": 1
        },
        {
            "hc-key": "ge-gu",
            "value": 2
        },
        {
            "hc-key": "ge-sz",
            "value": 3
        },
        {
            "hc-key": "ge-im",
            "value": 4
        },
        {
            "hc-key": "ge-ka",
            "value": 5
        },
        {
            "hc-key": "ge-mm",
            "value": 6
        },
        {
            "hc-key": "ge-rk",
            "value": 7
        },
        {
            "hc-key": "ge-tb",
            "value": 8
        },
        {
            "hc-key": "ge-kk",
            "value": 9
        },
        {
            "hc-key": "ge-sj",
            "value": 10
        },
        {
            "hc-key": "ge-sd",
            "value": 11
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ge/ge-all.js">Georgia</a>'
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
            mapData: Highcharts.maps['countries/ge/ge-all'],
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
