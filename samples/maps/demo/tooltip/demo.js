
$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/v6.0.4/samples/data/world-population-density.json', function (data) {

    // Add lower case codes to the data set for inclusion in the tooltip.pointFormat
    $.each(data, function () {
        this.flag = this.code.replace('UK', 'GB').toLowerCase();
    });

    // Initiate the chart
    Highcharts.mapChart('container', {

        chart: {
            map: 'custom/world'
        },

        title: {
            text: 'Fixed tooltip with HTML'
        },

        legend: {
            title: {
                text: 'Population density per km²',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                }
            }
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        tooltip: {
            backgroundColor: 'none',
            borderWidth: 0,
            shadow: false,
            useHTML: true,
            padding: 0,
            pointFormat: '<span class="f32"><span class="flag {point.flag}">' +
                '</span></span> {point.name}<br>' +
                '<span style="font-size:30px">{point.value}/km²</span>',
            positioner: function () {
                return { x: 0, y: 250 };
            }
        },

        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic'
        },

        series: [{
            data: data,
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
