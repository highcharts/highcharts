(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json'
    ).then(response => response.json());


    // Remove Greenland from the map and the data set
    const mapData = Highcharts.geojson(topology),
        mapDataIndex = mapData.findIndex(d => d.properties['iso-a2'] === 'GL'),
        dataIndex = data.findIndex(d => d.name === 'Greenland');

    const greenland = Highcharts.extend(data[dataIndex], mapData[mapDataIndex]);
    data.splice(dataIndex, 1);
    mapData.splice(mapDataIndex, 1);

    // Initialize the chart
    const chart = Highcharts.mapChart('container', {

        title: {
            text: 'Add point'
        },

        mapView: {
            projection: {
                name: 'Miller'
            }
        },

        legend: {
            title: {
                text: 'Population density per km²'
            }
        },

        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic'
        },

        series: [{
            data: data,
            mapData: mapData,
            joinBy: ['iso-a3', 'code3'],
            name: 'Population density',
            tooltip: {
                valueSuffix: '/km²'
            }
        }]
    });

    // Activate the button
    const button = document.getElementById('addpoint');
    button.disabled = false;

    button.onclick = () => {
        chart.series[0].addPoint(greenland);
        button.disabled = true;
    };

})();