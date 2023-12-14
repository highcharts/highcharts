(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/au/au-all.topo.json'
    ).then(response => response.json());

    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Choropleth map with pattern fill'
        },

        series: [{
            keys: ['hc-key', 'value', 'color.patternIndex'],
            data: [
                ['au-nt', 10, 0],
                ['au-wa', 11, 1],
                ['au-act', 12, 2],
                ['au-sa', 13, 3],
                ['au-qld', 14, 4],
                ['au-nf', 15, 5],
                ['au-tas', 16, 6],
                ['au-jb', 17, 7],
                ['au-nsw', 18, 8],
                ['au-vic', 19, 9]
            ],
            showInLegend: false
        }],

        mapNavigation: {
            enabled: true
        }
    });

})();
