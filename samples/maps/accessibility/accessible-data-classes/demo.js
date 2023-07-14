(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/europe.topo.json'
    ).then(response => response.json());

    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },
        colorAxis: {
            dataClasses: [{
                from: 0,
                to: 2
            }, {
                from: 2,
                to: 4
            }, {
                from: 4
            }]
        },
        series: [{
            data: [
                ['is', 1],
                ['no', 2],
                ['se', 3],
                ['dk', 4],
                ['fi', 5]
            ]
        }]
    });

})();