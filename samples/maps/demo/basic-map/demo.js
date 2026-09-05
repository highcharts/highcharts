(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    const dataTable = new Highcharts.Data({
        csv: document.getElementById('csv').innerText
    }).getDataTable();

    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        dataTable,

        title: {
            text: 'Life expectancy by country (2021)',
            align: 'left'
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

        tooltip: {
            valueDecimals: 1,
            valueSuffix: ' years'
        },

        series: [{
            name: 'Life expectancy',
            // Point properties (countryCode, name and value) are mapped to
            // columns in the data table
            dataMapping: {
                countryCode: 'Country Code',
                name: 'Country Name',
                value: '2021'
            },
            // The `iso-a3` property in the map topology is used to join with
            // the `countryCode` of the point properties
            joinBy: ['iso-a3', 'countryCode'],
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