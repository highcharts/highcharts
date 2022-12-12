Highcharts.chart('container', {
    title: {
        text: 'Estimated US Energy Consumption in 2017'
    },
    subtitle: {
        text:
      'Source: <a href=\'https://www.llnl.gov/\'> Lawrence Livermore National Laboratory</a>'
    },

    tooltip: {
        headerFormat: null,
        pointFormat:
      '{point.fromNode.name} \u2192 {point.toNode.name}: {point.weight:.2f} quads',
        nodeFormat: '{point.name}: {point.sum:.2f} quads'
    },
    series: [
        {
            borderColor: '#1a1a1a',
            borderWidth: 1,
            keys: ['from', 'to', 'weight'],
            nodes: [
                {
                    id: 'Electricity & Heat',
                    color: '#ffa500',
                    offset: -110
                },
                {
                    id: 'Residential',
                    color: '#74ffe7',
                    column: 2,
                    offset: 50
                },
                {
                    id: 'Commercial',
                    color: '#8cff74',
                    column: 2,
                    offset: 50
                },
                {
                    id: 'Industrial',
                    color: '#ff8da1',
                    column: 2,
                    offset: 50
                },
                {
                    id: 'Transportation',
                    color: '#f4c0ff',
                    column: 2,
                    offset: 50
                },
                {
                    id: 'Rejected Energy',
                    color: '#e6e6e6',
                    column: 3,
                    offset: -30
                },
                {
                    id: 'Energy Services',
                    color: '#F9E79F',
                    column: 3
                },
                {
                    id: 'Solar',
                    color: '#009c00'
                },
                {
                    id: 'Nuclear',
                    color: '#1a8dff'
                },
                {
                    id: 'Hydro',
                    color: '#009c00'
                },
                {
                    id: 'Wind',
                    color: '#009c00'
                },
                {
                    id: 'Geothermal',
                    color: '#009c00'
                },
                {
                    id: 'Natural Gas',
                    color: '#1a8dff'
                },
                {
                    id: 'Biomass',
                    color: '#009c00'
                },
                {
                    id: 'Coal',
                    color: '#989898'
                },
                {
                    id: 'Petroleum',
                    color: '#989898',
                    offset: -1
                }
            ],
            data: [
                ['Solar', 'Electricity & Heat', 0.48],
                ['Nuclear', 'Electricity & Heat', 8.42],
                ['Hydro', 'Electricity & Heat', 2.75],
                ['Wind', 'Electricity & Heat', 2.35],
                ['Geothermal', 'Electricity & Heat', 0.15],
                ['Natural Gas', 'Electricity & Heat', 9.54],
                ['Coal', 'Electricity & Heat', 12.7],
                ['Biomass', 'Electricity & Heat', 0.52],
                ['Petroleum', 'Electricity & Heat', 0.21],

                ['Electricity & Heat', 'Residential', 4.7],
                ['Solar', 'Residential', 0.19],
                ['Geothermal', 'Residential', 0.04],
                ['Natural Gas', 'Residential', 4.58],
                ['Biomass', 'Residential', 0.33],
                ['Petroleum', 'Residential', 0.88],

                ['Electricity & Heat', 'Commercial', 4.6],
                ['Solar', 'Commercial', 0.08],
                ['Geothermal', 'Commercial', 0.02],
                ['Natural Gas', 'Commercial', 3.29],
                ['Coal', 'Commercial', 0.02],
                ['Biomass', 'Commercial', 0.16],
                ['Petroleum', 'Commercial', 0.83],

                ['Electricity & Heat', 'Industrial', 3.23],
                ['Solar', 'Industrial', 0.02],
                ['Hydro', 'Industrial', 0.01],
                ['Natural Gas', 'Industrial', 9.84],
                ['Coal', 'Industrial', 1.24],
                ['Biomass', 'Industrial', 2.48],
                ['Petroleum', 'Industrial', 8.38],

                ['Electricity & Heat', 'Transportation', 0.03],
                ['Natural Gas', 'Transportation', 0.76],
                ['Biomass', 'Transportation', 1.43],
                ['Petroleum', 'Transportation', 25.9],

                ['Electricity & Heat', 'Rejected Energy', 24.7],
                ['Residential', 'Rejected Energy', 3.75],
                ['Commercial', 'Rejected Energy', 3.15],
                ['Industrial', 'Rejected Energy', 12.9],
                ['Transportation', 'Rejected Energy', 22.2],

                ['Residential', 'Energy Services', 6.97],
                ['Commercial', 'Energy Services', 5.84],
                ['Industrial', 'Energy Services', 12.4],
                ['Transportation', 'Energy Services', 5.91]
            ],
            type: 'sankey',
            name: 'Energy Consumption',
            dataLabels: {
                style: {
                    color: '#1a1a1a',
                    textOutline: false
                }
            }
        }
    ]
});
