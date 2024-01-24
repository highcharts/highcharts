const parseData = () => {
    const lifeData = document.getElementById('csv').innerHTML;
    const lines = lifeData.trim().split('\n');
    lines.shift(); // Remove first line

    const data = lines.map(line => {
        const values = line.split(';');
        if (values.length < 3 || isNaN(parseFloat(values[2]))) {
            return null;
        }
        return {
            code: values[1],
            value: parseFloat(values[2])
        };
    }).filter(p => p); // Filter out null values
    return data;
};

(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Life expectancy in the world (2021)'
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
            seriesMapping: [{
                code: 1,
                value: 2
            }]
        },

        tooltip: {
            pointFormat: '{point.name}: <b>{point.value}</b> years'
        },

        series: [{
            data: parseData(),
            name: 'Life expectancy',
            joinBy: ['iso-a3', 'code'],
            dataLabels: {
                enabled: true,
                format: '{point.value:.0f}'
            }
        }]
    });

})();