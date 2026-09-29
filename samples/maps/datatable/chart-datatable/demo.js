(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const dataTable = new Highcharts.DataTable({
        columns: {
            'State Code': [
                'us-ma', 'us-wa', 'us-ca', 'us-or', 'us-wi', 'us-me',
                'us-mi', 'us-nv', 'us-nm', 'us-co', 'us-wy', 'us-ks',
                'us-ne', 'us-ok', 'us-mo', 'us-il', 'us-in', 'us-vt',
                'us-ar', 'us-tx', 'us-ri', 'us-al', 'us-ms', 'us-nc',
                'us-va', 'us-ia', 'us-md', 'us-de', 'us-pa', 'us-nj',
                'us-ny', 'us-id', 'us-sd', 'us-ct', 'us-nh', 'us-ky',
                'us-oh', 'us-tn', 'us-wv', 'us-dc', 'us-la', 'us-fl',
                'us-ga', 'us-sc', 'us-mn', 'us-mt', 'us-nd', 'us-az',
                'us-ut', 'us-hi', 'us-ak'
            ],
            'Random Value': [
                10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
                25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
                40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54,
                55, 56, 57, 58, 59, 60
            ]
        }
    });

    // Create the chart
    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        dataTable,

        title: {
            text: 'Highcharts Maps basic demo'
        },

        subtitle: {
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-all.topo.json">United States of America</a>'
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
            name: 'Random data',
            dataMapping: {
                'hc-key': 'State Code',
                value: 'Random Value'
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });

})();
