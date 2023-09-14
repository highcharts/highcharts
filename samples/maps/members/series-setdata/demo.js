(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json', function (data) {

        // Initialize the chart
        const chart = Highcharts.mapChart('container', {

            title: {
                text: 'Set random data'
            },

            legend: {
                title: {
                    text: 'Population density per km²'
                }
            },

            colorAxis: {
                min: 1,
                max: 1000,
                type: 'logarithmic'
            },
            series: [{
                data: data,
                mapData: topology,
                joinBy: ['iso-a2', 'code'],
                name: 'Population density',
                tooltip: {
                    valueSuffix: '/km²'
                }
            }]
        });

        // Activate the button
        document.getElementById('setdata').addEventListener('click', function () {
            data.forEach(function (p) {
                p.value = Math.round(Math.random() * 1000);
            });
            chart.series[0].setData(data);
        });
    });

})();