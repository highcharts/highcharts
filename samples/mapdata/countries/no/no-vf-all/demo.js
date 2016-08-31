$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "no-vf-701",
            "value": 0
        },
        {
            "hc-key": "no-vf-723",
            "value": 1
        },
        {
            "hc-key": "no-vf-706",
            "value": 2
        },
        {
            "hc-key": "no-vf-722",
            "value": 3
        },
        {
            "hc-key": "no-vf-711",
            "value": 4
        },
        {
            "hc-key": "no-vf-709",
            "value": 5
        },
        {
            "hc-key": "no-vf-714",
            "value": 6
        },
        {
            "hc-key": "no-vf-720",
            "value": 7
        },
        {
            "hc-key": "no-vf-716",
            "value": 8
        },
        {
            "hc-key": "no-vf-704",
            "value": 9
        },
        {
            "hc-key": "no-vf-713",
            "value": 10
        },
        {
            "hc-key": "no-vf-728",
            "value": 11
        },
        {
            "hc-key": "no-vf-702",
            "value": 12
        },
        {
            "hc-key": "no-vf-719",
            "value": 13
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-vf-all.js">Vestfold</a>'
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
            mapData: Highcharts.maps['countries/no/no-vf-all'],
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
