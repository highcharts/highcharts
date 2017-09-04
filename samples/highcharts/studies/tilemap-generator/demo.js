var each = Highcharts.each,
    map = Highcharts.map;

// Get the extremes and center point of a GeoJSON feature
function getFeatureMetrics(feature) {
    var type = feature.geometry.type,
        coords = feature.geometry.coordinates,
        flattened = [],
        extremes = {
            xMin: Infinity,
            xMax: -Infinity,
            yMin: Infinity,
            yMax: -Infinity
        },
        center = [];

    // Flatten feature into list of coordinates
    switch (type) {
    case 'MultiPolygon':
        each(coords, function (polygon) {
            each(polygon, function (ring) {
                each(ring, function (pair) {
                    flattened.push(pair);
                });
            });
        });
        break;

    case 'Polygon':
        each(coords, function (ring) {
            each(ring, function (pair) {
                flattened.push(pair);
            });
        });
        break;

    default:
        return;
    }

    // Find extremes of coordinates
    each(flattened, function (pair) {
        if (pair[0] < extremes.xMin) {
            extremes.xMin = pair[0];
        }
        if (pair[0] > extremes.xMax) {
            extremes.xMax = pair[0];
        }
        if (pair[1] < extremes.yMin) {
            extremes.yMin = pair[1];
        }
        if (pair[1] > extremes.yMax) {
            extremes.yMax = pair[1];
        }
    });
    extremes.width = Math.abs(extremes.xMax - extremes.xMin);
    extremes.height = Math.abs(extremes.yMax - extremes.yMin);

    // Get label point and use it as center
    if (feature.properties['hc-middle-x']) {
        center.push(
            extremes.xMin + (extremes.xMax - extremes.xMin) *
            feature.properties['hc-middle-x']
        );
    } else {
        center.push((extremes.xMax + extremes.xMin) / 2);
    }
    if (feature.properties['hc-middle-y']) {
        center.push(
            extremes.yMin + (extremes.yMax - extremes.yMin) *
            feature.properties['hc-middle-y']
        );
    } else {
        center.push((extremes.yMax + extremes.yMin) / 2);
    }

    return {
        center: center,
        extremes: extremes
    };
}


// Create tilemap data structure from GeoJSON map
function geojsonToTilemapData(geojson) {
    var areas = geojson.features,
        points = map(areas, function (area) {
            var metrics = getFeatureMetrics(area);
            return Highcharts.extend({
                x: metrics.center[0],
                y: metrics.center[1],
                z: Math.max(metrics.extremes.width + metrics.extremes.height),
                id: area.id
            }, area.properties);
        });

    return points;
}


// Initiate the chart
Highcharts.chart('container', {
    chart: {
        type: 'bubble'
    },

    title: {
        text: 'Honeycomb map demo'
    },

    series: [{
        dataLabels: {
            enabled: true,
            formatter: function () {
                return this.point.id;
            }
        },
        data: geojsonToTilemapData(Highcharts.maps['custom/europe'])
    }]
});