(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
    ).then(response => response.json());

    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/us-capitals.json'
    ).then(response => response.json());

    data.forEach(p => {
        p.z = p.population;
    });

    const H = Highcharts;

    const chart = Highcharts.mapChart('container', {
        title: {
            text: 'Highcharts Maps lon/lat demo'
        },

        tooltip: {
            pointFormat: '{point.capital}, {point.parentState}<br>' +
                'Lon: {point.lon}<br>' +
                'Lat: {point.lat}<br>' +
                'Population: {point.population}'
        },

        xAxis: {
            crosshair: {
                zIndex: 5,
                dashStyle: 'dot',
                snap: false,
                color: 'gray'
            }
        },

        yAxis: {
            crosshair: {
                zIndex: 5,
                dashStyle: 'dot',
                snap: false,
                color: 'gray'
            }
        },

        series: [{
            name: 'Basemap',
            mapData: topology,
            accessibility: {
                exposeAsGroupOnly: true
            },
            borderColor: '#606060',
            nullColor: 'rgba(200, 200, 200, 0.2)',
            showInLegend: false
        }, {
            type: 'mapbubble',
            dataLabels: {
                enabled: true,
                format: '{point.capital}'
            },
            accessibility: {
                point: {
                    valueDescriptionFormat: '{point.capital}, {point.parentState}. Population {point.population}. Latitude {point.lat:.2f}, longitude {point.lon:.2f}.'
                }
            },
            name: 'State capital cities',
            data: data,
            maxSize: '12%',
            color: H.getOptions().colors[0]
        }]
    });

    // Display custom label with lat/lon next to crosshairs
    document.getElementById('container').addEventListener('mousemove', e => {
        if (!chart.lbl) {
            chart.lbl = chart.renderer.text('', 0, 0)
                .attr({
                    zIndex: 5
                })
                .css({
                    color: '#505050'
                })
                .add();
        }

        e = chart.pointer.normalize(e);

        chart.lbl.attr({
            x: e.chartX + 5,
            y: e.chartY - 22,
            text: 'Lat: ' + e.lat.toFixed(2) + '<br>Lon: ' + e.lon.toFixed(2)
        });
    });

})();