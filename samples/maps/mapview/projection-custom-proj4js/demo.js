/**
 * Define and add a custom projection for Highcharts. This definition relays to
 * proj4.js to do the math.
 *
 * For the sake of education we set the forward and inverse class methods in
 * this demo. But in this particular case, since we're only relaying to
 * proj4.js, we could also do it all in the constructor:
 *
 * @example
 * const { forward, inverse } = window.proj4(`+proj=utm +zone=${options.zone}`);
 * this.forward = forward;
 * this.inverse = inverse;
 */
class UTMProjectionDefinition {
    constructor(options) {
        this.proj = window.proj4(`+proj=utm +zone=${options.zone}`);
    }

    forward(lonLat) {
        return this.proj.forward(lonLat);
    }

    inverse(point) {
        return this.proj.inverse(point);
    }
}
Highcharts.Projection.add('UTM', UTMProjectionDefinition);

(async () => {

    const map = await fetch(
        'https://code.highcharts.com/mapdata/custom/british-isles.topo.json'
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
            text: 'UTM projection is relayed to proj4.js'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        mapView: {
            projection: {
                name: 'UTM',
                // Custom options
                zone: 30
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