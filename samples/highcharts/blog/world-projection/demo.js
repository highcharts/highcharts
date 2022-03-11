(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    const data = topology.objects.default.geometries.map((g, i) => i);

    // Initialize the chart
    const chart = Highcharts.mapChart('container', {

        title: {
            text: null
        },

        legend: {
            enabled: false
        },

        colorAxis: {
            minColor: '#92a8d3'
        },

        series: [{
            data,
            mapData: topology,
            joinBy: null,
            borderColor: 'black',
            borderWidth: 0.2,
            states: {
                hover: {
                    borderWidth: 1
                }
            },
            name: 'Demo data'
        }]
    });

    document.querySelectorAll('.buttons button').forEach(btn => {
        btn.addEventListener('click', () => {
            chart.update({
                mapView: {
                    projection: {
                        name: btn.textContent
                    }
                }
            });
        });
    });

    let i = 0;
    setInterval(() => {
        const buttons = document.querySelectorAll('.buttons button');

        i = i ? 0 : 1;
        const btn = buttons[i];
        buttons.forEach(btn => btn.classList.remove('active'));
        btn.classList.add('active');

        btn.click();

    }, 2000);
})();