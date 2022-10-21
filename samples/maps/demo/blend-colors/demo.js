(async () => {

    function getFlag(code) {
        return '<span class="f16"><span id="flag" class="flag ' +
            code.toLowerCase() +
            '"></span></span>';
    }

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@b0488c7087/samples/data/busiest-europe-airports-2021.json'
    ).then(response => response.json());


    data.forEach(airport => {
        airport.z = airport.labelrank = airport.total_passengers / 1e6;
        airport.custom = {
            flag: getFlag(airport.iso_country)
        };
    });

    Highcharts.mapChart('container', {
        chart: {
            map: topology,
            plotBackgroundColor: 'rgba(0, 128, 255, 0.1)',
            margin: 1
        },

        title: {
            text: 'Top 100 busiest airports in Europe in 2021',
            align: 'left',
            style: {
                textOutline: '5px contrast'
            }
        },

        subtitle: {
            text: `Source: <a href='https://w.wiki/5j6g'>Wikipedia</a> and
            <a href='https://ourairports.com/continents/EU/'>
                OurAirports
            </a>`,
            align: 'left',
            style: {
                textOutline: '5px contrast'
            }
        },

        accessibility: {
            description: `We see how the top 100 busiest airports in Europe,
            ranked by total passengers in 2021 look like.`
        },

        legend: {
            enabled: false
        },

        mapNavigation: {
            enabled: false
        },

        mapView: {
            projection: {
                name: 'Miller'
            },
            zoom: 3.5,
            center: [10, 50.5]
        },

        plotOptions: {
            mapbubble: {
                minSize: 15,
                maxSize: 120,
                opacity: 0.45,
                marker: {
                    lineWidth: 0,
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }
            }
        },

        tooltip: {
            useHTML: true
        },

        series: [{
            name: 'Countries',
            color: '#E0E0E0',
            enableMouseTracking: false,
            borderColor: 'rgba(0, 0, 0, 0.5)'
        }, {
            type: 'mapbubble',
            name: 'Europe airports',
            data: data,
            tooltip: {
                headerFormat: `{point.point.custom.flag}
                    {point.point.name}:<br/>`,
                pointFormat: `
                    <span style="font-weight: bold;">
                    {point.z:.1f} M
                    </span> total passengers`
            },
            states: {
                inactive: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: true,
                padding: 10,
                borderWidth: 1,
                format: '{point.municipality}'
            },
            blendColors: [
                '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff'
            ]
        }]
    });

})();
