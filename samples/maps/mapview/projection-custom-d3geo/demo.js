/**
 * Define and add a custom projection for Highcharts. This definition relays to
 * d3-geo to do the math.
 */
if (window.d3) {
    class RobinsonProjectionDefinition {
        constructor() {
            this.projection = window.d3
                .geoRobinson()
                .reflectY(true);
        }

        forward(lonLat) {
            return this.projection(lonLat);
        }

        inverse(point) {
            return this.projection.invert(point);
        }
    }
    Highcharts.Projection.add('Robinson', RobinsonProjectionDefinition);
}

(async () => {

    const map = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    // Add some data for each geometry
    const data = map.objects.default.geometries.map((g, i) => i);

    // Initialize the chart
    Highcharts.mapChart('container', {

        chart: {
            map
        },

        title: {
            text: 'Map with custom projection'
        },

        subtitle: {
            text: 'Robinson projection is relayed to d3-geo'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        mapView: {
            projection: {
                name: 'Robinson'
            }
        },

        colorAxis: {
        },

        legend: {
            enabled: false
        },

        series: [{
            data,
            joinBy: null
        }]
    });
})();