(async () => {

    const nordicTopology = await fetch(
        'https://code.highcharts.com/mapdata/custom/nordic-countries-core.topo.json'
    ).then(response => response.json());

    const noTopology = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/no-all.topo.json'
    ).then(response => response.json());

    // Create the chart
    Highcharts.mapChart('container', {

        title: {
            text: 'Highcharts Maps drilldown basic demo'
        },

        subtitle: {
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/custom/nordic-countries.topo.json">Nordic Countries</a> and <a href="https://code.highcharts.com/mapdata/countries/no/no-all.topo.json">Norway</a>'
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
                value: 14,
                drilldown: 'norway'
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
                name: 'norway',
                mapData: noTopology,
                data: [
                    ['no-vl-46', 10],
                    ['no-mr-15', 11],
                    ['no-ag-42', 12],
                    ['no-no-18', 13],
                    ['no-vi-30', 14],
                    ['no-ro-11', 15],
                    ['no-tf-54', 16],
                    ['no-td-50', 17],
                    ['no-os-0301', 18],
                    ['no-vt-38', 19],
                    ['no-in-34', 20]
                ]
            }]
        }
    });

})();
