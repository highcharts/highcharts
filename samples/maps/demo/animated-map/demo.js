(async () => {
    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world-highres.topo.json'
    ).then(response => response.json());

    // Create a data value for each feature
    const data = [
        {
            'hc-key': 'ye',
            color: '#ffa500',
            info: 'Yemen is where coffee took off.'
        },
        {
            'hc-key': 'br',
            color: '#c0ffd5',
            info: 'Coffee came from La Reunion.'
        },
        {
            'hc-key': 'fr',
            color: '#c0ffd5',
            info: 'Coffee came from Java.'
        },
        {
            'hc-key': 'gb',
            color: '#c0ffd5',
            info: 'Coffee came from Java.'
        },
        {
            'hc-key': 'id',
            color: '#c0ffd5',
            info: 'Coffee came from Yemen.'
        },
        {
            'hc-key': 'nl',
            color: '#c0ffd5',
            info: 'Coffee came from Java.'
        },
        {
            'hc-key': 'gu',
            color: '#c0ffd5',
            info: 'Coffee came from France.'
        },
        {
            'hc-key': 're',
            color: '#c0ffd5',
            info: 'Coffee came from Yemen.'
        },
        {
            'hc-key': 'in',
            color: '#c0ffd5',
            info: 'Coffee came from Java.'
        }
    ];

    // Initialize the chart
    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'The history of the coffee bean ☕'
        },
        legend: {
            enabled: false
        },
        tooltip: {
            useHTML: true,
            headerFormat: '<b>{point.key}</b>:<br/>',
            pointFormat: '{point.info}'
        },

        series: [
            {
                data,
                keys: ['hc-key', 'color', 'info'],
                name: 'Coffee',
                states: {
                    hover: {
                        color: '#a4edba'
                    }
                }
            },
            {
                type: 'mapline',
                data: [
                    {
                        geometry: {
                            type: 'LineString',
                            coordinates: [
                                [48.516388, 15.552727], // Yemen
                                [110.004444, -7.491667] // Java
                            ]
                        },
                        className: 'animated-line',
                        color: '#666'
                    },
                    {
                        geometry: {
                            type: 'LineString',
                            coordinates: [
                                [48.516388, 15.552727], // Yemen
                                [55.5325, -21.114444] // La reunion
                            ]
                        },
                        className: 'animated-line',
                        color: '#666'
                    },
                    {
                        geometry: {
                            type: 'LineString',
                            coordinates: [
                                [55.5325, -21.114444], // La reunion
                                [-43.2, -22.9] // Brazil
                            ]
                        },
                        className: 'animated-line',
                        color: '#666'
                    },
                    {
                        geometry: {
                            type: 'LineString',
                            coordinates: [
                                [110.004444, -7.491667], // Java
                                [78, 21] // India
                            ]
                        },
                        className: 'animated-line',
                        color: '#666'
                    },
                    {
                        geometry: {
                            type: 'LineString',
                            coordinates: [
                                [110.004444, -7.491667], // Java
                                [4.9, 52.366667] // Amsterdam
                            ]
                        },
                        className: 'animated-line',
                        color: '#666'
                    },
                    {
                        geometry: {
                            type: 'LineString',
                            coordinates: [
                                [-3, 55], // UK
                                [-61.030556, 14.681944] // Antilles
                            ]
                        },
                        className: 'animated-line',
                        color: '#666'
                    },
                    {
                        geometry: {
                            type: 'LineString',
                            coordinates: [
                                [2.352222, 48.856613], // Paris
                                [-53, 4] // Guyane
                            ]
                        },
                        className: 'animated-line',
                        color: '#666'
                    }
                ],
                lineWidth: 2,
                enableMouseTracking: false
            },
            {
                type: 'mappoint',
                color: '#333',
                data: [
                    {
                        name: 'Yemen',
                        geometry: {
                            type: 'Point',
                            coordinates: [48.516388, 15.552727] // Yemen
                        }
                    },
                    {
                        name: 'Java',
                        geometry: {
                            type: 'Point',
                            coordinates: [110.004444, -7.491667] // Java
                        }
                    },
                    {
                        name: 'La Reunion',
                        geometry: {
                            type: 'Point',
                            coordinates: [55.5325, -21.114444] // La reunion
                        }
                    },
                    {
                        name: 'Brazil',
                        geometry: {
                            type: 'Point',
                            coordinates: [-43.2, -22.9] // Brazil
                        }
                    },
                    {
                        name: 'India',
                        geometry: {
                            type: 'Point',
                            coordinates: [78, 21] // India
                        }
                    },
                    {
                        name: 'Amsterdam',
                        geometry: {
                            type: 'Point',
                            coordinates: [4.9, 52.366667] // Amsterdam
                        }
                    },
                    {
                        name: 'Antilles',
                        geometry: {
                            type: 'Point',
                            coordinates: [-61.030556, 14.681944] // Antilles
                        }
                    },
                    {
                        name: 'Guyane',
                        geometry: {
                            type: 'Point',
                            coordinates: [-53, 4] // Guyane
                        }
                    }
                ],
                enableMouseTracking: false
            }
        ]
    });
})();
