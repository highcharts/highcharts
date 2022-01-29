(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json', function (data) {

        // Initialize the chart
        const chart = Highcharts.mapChart('container', {

            title: {
                text: 'Allow point select'
            },

            legend: {
                title: {
                    text: 'Population density per km²'
                }
            },

            plotOptions: {
                series: {
                    point: {
                        events: {
                            select: function () {
                                const text = 'Selected ' + this.name + ' (' + this.value + '/km²)',
                                    chart = this.series.chart;
                                if (!chart.selectedLabel) {
                                    chart.selectedLabel = chart.renderer
                                        .label(text, 0, 320)
                                        .add();
                                } else {
                                    chart.selectedLabel.attr({
                                        text: text
                                    });
                                }
                            },
                            unselect: function () {
                                const text = 'Unselected ' + this.name + ' (' + this.value + '/km²)',
                                    chart = this.series.chart;
                                if (!chart.unselectedLabel) {
                                    chart.unselectedLabel = chart.renderer
                                        .label(text, 0, 300)
                                        .add();
                                } else {
                                    chart.unselectedLabel.attr({
                                        text: text
                                    });
                                }
                            }
                        }
                    }
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
                allowPointSelect: true,
                cursor: 'pointer',
                states: {
                    hover: {
                        color: '#a4edba'
                    },
                    select: {
                        color: '#EFFFEF',
                        borderColor: 'black',
                        dashStyle: 'dot'
                    }
                },
                tooltip: {
                    valueSuffix: '/km²'
                }
            }]
        });

        // Activate the button
        const button = document.getElementById('getselectedpoints');
        button.disabled = false;

        // When the button is clicked
        button.onclick = () => {
            const selectedPoints = chart.getSelectedPoints().length;
            const pluralText = selectedPoints ? '.' : 's.';
            alert('You selected ' + selectedPoints + ' point' + pluralText);
        };
    });

})();