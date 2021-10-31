const getGeoJSON = async (url) => {
    const result = await fetch(url);
    const json = result.ok && (await result.json());
    return window.topojson.feature(
        json,
        // For this demo, get the first of the named objects
        json.objects[Object.keys(json.objects)[0]]
    );
};

(async () => {
    const norway = await getGeoJSON(
        'https://rawgit.com/deldersveld/topojson/master/countries/norway/norway-counties.json'
    );
    const sweden = await getGeoJSON(
        'https://rawgit.com/deldersveld/topojson/master/countries/sweden/sweden-counties.json'
    );

    // Initialize the chart
    Highcharts.mapChart('container', {
        title: {
            text: 'Highcharts, multiple GeoJSON'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        mapView: {
            projection: {
                name: 'Orthographic',
                rotation: [-16, -63]
            }
        },

        plotOptions: {
            map: {
                showInLegend: false
            }
        },

        series: [
            {
                data: [],
                mapData: norway
            },
            {
                data: [],
                mapData: sweden
            }
        ]
    });
})();
