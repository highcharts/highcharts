(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());
    const geojson = Highcharts.topo2geo(topology);

    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json'
    ).then(response => response.json());

    const multiPointGeometry = {
        type: 'MultiPoint',
        coordinates: [
            // Alaska west
            [-164, 54],
            // Greenland north
            [-35, 84],
            // New Zealand east
            [179, -38],
            // Chile south
            [-68, -55]
        ]
    };

    const polygonGeometry = {
        type: 'Polygon',
        coordinates: [
            [
                // Africa
                [-17, 32],
                [51, 32],
                [51, -30],
                [-17, -30],
                [-17, 32]
            ]
        ]
    };

    // Find the geometry for one specific feature
    const countryGeometry = geojson.features.find(f =>
        f.properties.name === 'Brazil'
    ).geometry;

    // Combine the geometries of multiple features into one, so that we can fit
    // the map to a region
    const regionGeometry = geojson.features
        .filter(f =>
            ['Oman', 'Saudi Arabia', 'Yemen'].includes(f.properties.name)
        )
        .reduce((combined, f) => {
            const geometry = f.geometry;
            if (geometry.type === 'Polygon') {
                combined.coordinates.push(geometry.coordinates);
            } else if (geometry.type === 'MultiPolygon') {
                combined.coordinates.push.apply(
                    combined.coordinates,
                    geometry.coordinates
                );
            }
            return combined;
        }, {
            type: 'MultiPolygon',
            coordinates: []
        });


    // Initialize the chart
    const chart = Highcharts.mapChart('container', {

        chart: {
            plotBorderWidth: 1
        },

        title: {
            text: 'Fit to geometry'
        },

        legend: {
            enabled: false
        },

        colorAxis: {
            min: 1,
            max: 1000,
            minColor: '#a6d7ff',
            maxColor: '#0b407b',
            type: 'logarithmic'
        },

        mapView: {
            fitToGeometry: multiPointGeometry,
            padding: 15
        },

        series: [{
            data,
            mapData: geojson,
            joinBy: ['iso-a2', 'code'],
            name: 'Population density',
            tooltip: {
                valueSuffix: '/km²'
            },
            borderWidth: 0
        }, {
            type: 'mappoint',
            id: 'preview',
            keys: ['lon', 'lat'],
            marker: {
                radius: 5,
                fillColor: '#ffffff',
                lineWidth: 2,
                lineColor: '#000000'
            },
            data: multiPointGeometry.coordinates
        }]


    });

    document.getElementById('multipoint').addEventListener('click', () => {
        chart.mapView.update({ fitToGeometry: multiPointGeometry });
        const preview = chart.get('preview');
        if (preview) {
            preview.remove();
        }
        chart.addSeries({
            type: 'mappoint',
            id: 'preview',
            keys: ['lon', 'lat'],
            marker: {
                radius: 5,
                symbol: 'circle',
                fillColor: '#ffffff',
                lineWidth: 2,
                lineColor: '#000000'
            },
            data: multiPointGeometry.coordinates
        });
    });

    document.getElementById('polygon').addEventListener('click', () => {
        chart.mapView.update({ fitToGeometry: polygonGeometry });
        const preview = chart.get('preview');
        if (preview) {
            preview.remove();
        }
        chart.addSeries({
            type: 'mapline',
            id: 'preview',
            data: [{ geometry: polygonGeometry }],
            dashStyle: 'dash',
            lineWidth: 2,
            animation: false,
            color: '#039'
        });
    });

    document.getElementById('country').addEventListener('click', () => {
        chart.mapView.update({ fitToGeometry: countryGeometry });
        const preview = chart.get('preview');
        if (preview) {
            preview.remove();
        }
    });

    document.getElementById('region').addEventListener('click', () => {
        chart.mapView.update({ fitToGeometry: regionGeometry });
        const preview = chart.get('preview');
        if (preview) {
            preview.remove();
        }
    });

    document.getElementById('none').addEventListener('click', () => {
        chart.mapView.update({ fitToGeometry: undefined });
        const preview = chart.get('preview');
        if (preview) {
            preview.remove();
        }
    });
})();