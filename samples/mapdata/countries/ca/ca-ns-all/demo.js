(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ca/ca-ns-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ca-ns-1217', 10], ['ca-ns-1201', 11], ['ca-ns-1209', 12],
        ['ca-ns-1218', 13], ['ca-ns-1203', 14], ['ca-ns-1206', 15],
        ['ca-ns-1202', 16], ['ca-ns-1212', 17], ['ca-ns-1216', 18],
        ['ca-ns-1214', 19], ['ca-ns-1210', 20], ['ca-ns-1213', 21],
        ['ca-ns-1208', 22], ['ca-ns-1205', 23], ['ca-ns-1215', 24],
        ['ca-ns-1207', 25], ['ca-ns-1204', 26], ['ca-ns-1211', 27]
    ];

    // Create the chart
    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Highcharts Maps basic demo'
        },

        subtitle: {
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ca/ca-ns-all.topo.json">Nova Scotia</a>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },

        series: [{
            data: data,
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });

})();
