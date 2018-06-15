

$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/680f5d50a47e90f53d814b53f80ce1850b9060c0/samples/data/world-population-density.json', function (data) {

    // Add lower case codes to the data set for inclusion in the tooltip.pointFormat
    $.each(data, function () {
        this.flag = this.code.toLowerCase();
    });

    // Initiate the chart
    Highcharts.mapChart('container', {

        title: {
            text: 'Full HTML tooltip'
        },

        legend: {
            title: {
                text: 'Population density per km²'
            }
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        tooltip: {
            backgroundColor: null,
            borderWidth: 0,
            shadow: false,
            useHTML: true,
            pointFormat: '<span class="f32"><span class="flag {point.flag}"></span></span>' +
                ' {point.name}: <b>{point.value}</b>/km²'
        },

        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic'
        },

        series: [{
            data: data,
            mapData: Highcharts.maps['custom/world'],
            joinBy: ['iso-a2', 'code'],
            name: 'Population density',
            states: {
                hover: {
                    color: '#a4edba'
                }
            }
        }]
    });
});