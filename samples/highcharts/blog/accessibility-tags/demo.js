Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    legend: {
        enabled: false
    },
    title: {
        text: 'Palmer Penguin Species'
    },
    subtitle: {
        text:
      'Total counts of Palmer Penguin species, from the Palmer Penguins dataset'
    },
    xAxis: {
        title: {
            text: 'Penguin Species'
        },
        categories: ['Chinstrap', 'Gentoo', 'Adelie'],
        accessibility: {
            description: 'Penguin species: Chinstrap, Gentoo, and Adelie.'
        }
    },
    yAxis: {
        title: {
            text: 'Count'
        },
        accessibility: {
            description: 'Total number of penguins for each species.'
        }
    },
    plotOptions: {
        series: {
            colorByPoint: true
        }
    },
    series: [
        {
            name: 'Penguins',
            data: [68, 124, 152],
            accessibility: {
                description:
          'Adelie penguins are the most abundant species in this dataset'
            }
        }
    ]
});
