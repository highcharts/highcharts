Highcharts.getJSON(
    'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json',
    function (data) {
        // Initialize the chart
        const chart = Highcharts.mapChart('container', {
            title: {
                text: 'Update point'
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
            series: [
                {
                    data: data,
                    mapData: Highcharts.maps['custom/world'],
                    joinBy: ['iso-a2', 'code'],
                    name: 'Population density',
                    allowPointSelect: true,
                    cursor: 'pointer',
                    states: {
                        hover: {
                            color: '#a4edba'
                        }
                    },
                    tooltip: {
                        valueSuffix: '/km²'
                    }
                }
            ]
        });

        // Set button text
        const country = 76, // Needed in case the API changes
            button = document.getElementById('update');
        button.textContent =
            'Update population of ' + chart.series[0].points[country].name;

        // Activate the button
        button.disabled = false;

        // When the button is clicked
        button.onclick = () => {
            chart.series[0].points[country].update(10000000);
            console.log(chart.series[0].points[country]);
        };
    }
);
