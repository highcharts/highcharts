(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Life expectancy by country (2021)'
        },

        credits: {
            href: 'https://data.worldbank.org',
            mapText: ' Data source: The World Bank'

        },
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 60
        },

        data: {
            csv: document.getElementById('csv').innerText,
            seriesMapping: [{
                code: 1,
                value: 2
            }]
        },

        tooltip: {
            valueDecimals: 1,
            valueSuffix: ' years'
        },

        series: [{
            name: 'Life expectancy',
            joinBy: ['iso-a3', 'code'],
            dataLabels: {
                enabled: true,
                format: '{point.value:.0f}',
                filter: {
                    operator: '>',
                    property: 'labelrank',
                    value: 250
                },
                style: {
                    fontWeight: 'normal'
                }
            }
        }]
    });

})();