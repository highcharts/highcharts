(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/de/de-st-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['de-st-15002000', 10], ['de-st-15001000', 11], ['de-st-15082000', 12],
        ['de-st-15090000', 13], ['de-st-15081000', 14], ['de-st-14730000', 15],
        ['de-st-15085000', 16], ['de-st-15086000', 17], ['de-st-15088000', 18],
        ['de-st-15089000', 19], ['de-st-15087000', 20], ['de-st-15083000', 21],
        ['de-st-15003000', 22], ['de-st-15084000', 23], ['de-st-15091000', 24]
    ];

    // Create the chart
    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Highcharts Maps basic demo'
        },

        subtitle: {
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-st-all.topo.json">Sachsen-Anhalt</a>'
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
            data: data,
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });

})();
