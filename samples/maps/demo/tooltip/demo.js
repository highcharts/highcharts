(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json'
    ).then(response => response.json());

    // Prevent logarithmic errors in color calulcation
    data.forEach(function (p) {
        p.value = (p.value < 1 ? 1 : p.value);
    });

    // Initialize the chart
    Highcharts.mapChart('container', {

        chart: {
            map: topology
        },

        title: {
            text: 'Fixed tooltip with HTML'
        },

        legend: {
            title: {
                text: 'Population density per km²',
                style: {
                    color: ( // theme
                        Highcharts.defaultOptions &&
                            Highcharts.defaultOptions.legend &&
                            Highcharts.defaultOptions.legend.title &&
                            Highcharts.defaultOptions.legend.title.style &&
                            Highcharts.defaultOptions.legend.title.style.color
                    ) || 'black'
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
            pointFormat: '<span class="f32"><span class="flag {point.properties.hc-key}">' +
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
            joinBy: ['iso-a3', 'code3'],
            name: 'Population density'
        }]
    });

})();