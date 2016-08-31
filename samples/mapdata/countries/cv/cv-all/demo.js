$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "cv-br",
            "value": 0
        },
        {
            "hc-key": "cv-ma",
            "value": 1
        },
        {
            "hc-key": "cv-6566",
            "value": 2
        },
        {
            "hc-key": "cv-6567",
            "value": 3
        },
        {
            "hc-key": "cv-6570",
            "value": 4
        },
        {
            "hc-key": "cv-sf",
            "value": 5
        },
        {
            "hc-key": "cv-mo",
            "value": 6
        },
        {
            "hc-key": "cv-cf",
            "value": 7
        },
        {
            "hc-key": "cv-ta",
            "value": 8
        },
        {
            "hc-key": "cv-ca",
            "value": 9
        },
        {
            "hc-key": "cv-sm",
            "value": 10
        },
        {
            "hc-key": "cv-cr",
            "value": 11
        },
        {
            "hc-key": "cv-ss",
            "value": 12
        },
        {
            "hc-key": "cv-so",
            "value": 13
        },
        {
            "hc-key": "cv-sd",
            "value": 14
        },
        {
            "hc-key": "cv-rs",
            "value": 15
        },
        {
            "hc-key": "cv-pr",
            "value": 16
        },
        {
            "hc-key": "cv-6568",
            "value": 17
        },
        {
            "hc-key": "cv-6569",
            "value": 18
        },
        {
            "hc-key": "cv-6571",
            "value": 19
        },
        {
            "hc-key": "cv-6572",
            "value": 20
        },
        {
            "hc-key": "cv-6573",
            "value": 21
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/cv/cv-all.js">Cape Verde</a>'
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
            mapData: Highcharts.maps['countries/cv/cv-all'],
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
