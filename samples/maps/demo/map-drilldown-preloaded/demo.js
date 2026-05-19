(async () => {

    const nordicTopology = await fetch(
        'https://code.highcharts.com/mapdata/custom/nordic-countries-core.topo.json'
    ).then(response => response.json());

    const topologies = {};
    for (const geometry of nordicTopology.objects.default.geometries) {
        const key = geometry.properties['hc-key'];
        topologies[key] = await fetch(
            'https://code.highcharts.com/mapdata/' +
            `countries/${key}/${key}-all.topo.json`
        ).then(response => response.json());
    }

    // Create the chart
    Highcharts.mapChart('container', {

        title: {
            text: 'Highcharts Maps drilldown with preloaded maps'
        },

        subtitle: {
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/custom/nordic-countries.topo.json">Nordic Countries</a>'
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

        plotOptions: {
            map: {
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }
            }
        },

        series: [{
            name: 'Random data',
            mapData: nordicTopology,
            data: [{
                'hc-key': 'no',
                value: 15,
                drilldown: 'norway'
            }, {
                'hc-key': 'is',
                value: 14,
                drilldown: 'iceland'
            }, {
                'hc-key': 'fo',
                value: 13,
                drilldown: 'faroe-islands'
            }, {
                'hc-key': 'fi',
                value: 12,
                drilldown: 'finland'
            }, {
                'hc-key': 'se',
                value: 11,
                drilldown: 'sweden'
            }, {
                'hc-key': 'dk',
                value: 10,
                drilldown: 'denmark'
            }]
        }],

        drilldown: {
            activeDataLabelStyle: {
                color: '#FFFFFF',
                textDecoration: 'none',
                textOutline: '1px #000000'
            },
            breadcrumbs: {
                floating: true,
                showFullPath: false
            },
            mapZooming: true,
            series: [{
                id: 'norway',
                name: 'Norway',
                mapData: topologies.no,
                data: [
                    ['no-vf', 10], ['no-te', 11], ['no-ro', 12], ['no-of', 13],
                    ['no-os', 14], ['no-ak', 15], ['no-fi', 16], ['no-td', 17],
                    ['no-mr', 18], ['no-tr', 19], ['no-no', 20], ['no-bu', 21],
                    ['no-ag', 22], ['no-in', 23], ['no-vl', 24]
                ]
            }, {
                id: 'iceland',
                name: 'Iceland',
                mapData: topologies.is,
                data: [
                    ['is-ne', 10],
                    ['is-sl', 11],
                    ['is-su', 12],
                    ['is-ho', 13],
                    ['is-6642', 14],
                    ['is-vf', 15],
                    ['is-al', 16],
                    ['is-vl', 17],
                    ['is-nv', 18]
                ]
            }, {
                id: 'faroe-islands',
                name: 'Faroe Islands',
                mapData: topologies.fo,
                data: [
                    ['fo-os', 10]
                ]
            }, {
                id: 'sweden',
                name: 'Sweden',
                mapData: topologies.se,
                data: [
                    ['se-4461', 10],
                    ['se-ka', 11],
                    ['se-og', 12],
                    ['se-nb', 13],
                    ['se-vn', 14],
                    ['se-vb', 15],
                    ['se-gt', 16],
                    ['se-st', 17],
                    ['se-up', 18],
                    ['se-bl', 19],
                    ['se-vg', 20],
                    ['se-ko', 21],
                    ['se-gv', 22],
                    ['se-jo', 23],
                    ['se-kr', 24],
                    ['se-or', 25],
                    ['se-vm', 26],
                    ['se-ha', 27],
                    ['se-sd', 28],
                    ['se-vr', 29],
                    ['se-ja', 30],
                    ['se-sn', 31]
                ]
            }, {
                id: 'finland',
                name: 'Finland',
                mapData: topologies.fi,
                data: [
                    ['fi-3280', 10],
                    ['fi-3272', 11],
                    ['fi-3275', 12],
                    ['fi-3281', 13],
                    ['fi-3279', 14],
                    ['fi-3276', 15],
                    ['fi-3287', 16],
                    ['fi-3286', 17],
                    ['fi-3290', 18],
                    ['fi-3291', 19],
                    ['fi-3292', 20],
                    ['fi-3293', 21],
                    ['fi-3294', 22],
                    ['fi-3295', 23],
                    ['fi-3296', 24],
                    ['fi-3288', 25],
                    ['fi-3285', 26],
                    ['fi-3289', 27]
                ]
            }, {
                id: 'denmark',
                name: 'Denmark',
                mapData: topologies.dk,
                data: [
                    ['dk-6326', 10],
                    ['dk-3564', 11],
                    ['dk-3568', 12],
                    ['dk-6325', 13],
                    ['dk-3563', 14]
                ]
            }]
        }
    });

})();
