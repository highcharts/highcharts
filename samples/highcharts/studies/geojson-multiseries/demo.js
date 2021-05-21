const getGeoJSON = async url => {
    const result = await fetch(url);
    const json = result.ok && await result.json();
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


    // Initiate the chart
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
                projectionName: 'Orthographic',
                rotation: [-16, -63]
            }
        },

        colorAxis: {
            tickPixelInterval: 100
        },

        plotOptions: {
            map: {
                keys: ['code_hasc', 'value'],
                joinBy: 'code_hasc',
                name: 'Random data',
                states: {
                    hover: {
                        color: '#a4edba'
                    }
                },
                dataLabels: {
                    enabled: true
                }
            }
        },

        series: [/*{
            name: 'Graticule',
            type: 'mapline',
            data: [{
                type: 'LineString',
                coordinates: [
                    [-179, 88],
                    [179, 88],
                    [179, -60],
                    [-179, -60]
                ]
            }, {
                type: 'LineString',
                coordinates: [
                    [-179, 89],
                    [0, 89],
                    [179, 89]
                ]
            }],
            nullColor: '#e8e8e8',
            color: '#e8e8e8'
        },*/ {
            data: [],
            mapData: norway
        }, {
            data: [],
            mapData: sweden
        }]
    });
})();
