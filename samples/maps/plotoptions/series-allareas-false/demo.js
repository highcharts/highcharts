$(function () {

    // Prepare demo data
    var data = [{
        'hc-key': 'us',
        value: 3
    }, {
        'hc-key': 'ca',
        value: 5
    }, {
        'hc-key': 'mx',
        value: 20
    }];


    // Initiate the chart
    $('#container').highcharts('Map', {

        title: {
            text: 'Showing only non-null areas'
        },

        subtitle: {
            text: 'The <em>allAreas</em> option is false'
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

        series: [{
            data: data,
            mapData: Highcharts.maps['custom/north-america-no-central'],
            joinBy: 'hc-key',
            allAreas: false,
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