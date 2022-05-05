(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/in/custom/in-all-disputed.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['madhya pradesh', 10], ['uttar pradesh', 11], ['karnataka', 12],
        ['nagaland', 13], ['bihar', 14], ['lakshadweep', 15],
        ['andaman and nicobar', 16], ['assam', 17], ['west bengal', 18],
        ['puducherry', 19], ['daman and diu', 20], ['gujarat', 21],
        ['rajasthan', 22], ['dadara and nagar havelli', 23],
        ['chhattisgarh', 24], ['tamil nadu', 25], ['chandigarh', 26],
        ['punjab', 27], ['haryana', 28], ['andhra pradesh', 29],
        ['maharashtra', 30], ['himachal pradesh', 31], ['meghalaya', 32],
        ['kerala', 33], ['telangana', 34], ['mizoram', 35], ['tripura', 36],
        ['manipur', 37], ['arunanchal pradesh', 38], ['jharkhand', 39],
        ['goa', 40], ['nct of delhi', 41], ['odisha', 42],
        ['jammu and kashmir', 43], ['sikkim', 44], ['uttarakhand', 45]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/in/custom/in-all-disputed.topo.json">India with disputed territories</a>'
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
