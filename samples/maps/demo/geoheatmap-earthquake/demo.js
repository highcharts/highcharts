(async () => {
    const topology = await fetch(
            'https://code.highcharts.com/mapdata/custom/world.topo.json'
        ).then(response => response.json()),
        dataCSV = document.getElementById('csv').innerHTML,
        dataArray = dataCSV.split('\n').map(str => str.split(',').map(Number));

    Highcharts.mapChart('container', {

        chart: {
            map: topology
        },

        title: {
            text: 'GeoHeatMap Series Demo',
            floating: true,
            align: 'left',
            style: {
                textOutline: '2px white'
            }
        },

        subtitle: {
            text: 'Earthquakes in 2023<br>',
            floating: true,
            y: 34,
            align: 'left'
        },

        legend: {
            enabled: false
        },

        mapNavigation: {
            enabled: true,
            enableDoubleClickZoomTo: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        mapView: {
            projection: {
                name: 'Orthographic',
                rotation: [0, -10, 0]
            }
        },
        colorAxis: {
            min: 0,
            max: 5,
            minColor: 'rgba(255,0,255,0.25)',
            maxColor: 'rgba(0,0,255,0.25)'
        },

        series: [{
            states: {
                inactive: {
                    enabled: false
                }
            }
        }, {
            name: 'GeoHeatMap',
            opacity: 0.9,
            colsize: 10,
            rowsize: 10,
            type: 'geoheatmap',
            data: dataArray
        }]
    });

})();
