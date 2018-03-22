Highcharts.chart('container', {
    chart: {
        type: 'pie'
    },
    title: {
        text: 'Pie labels with ellipsis'
    },
    plotOptions: {
        pie: {
            size: '50%',
            dataLabels: {
                enabled: true,
                style: {
                    textOverflow: 'ellipsis'
                }
            }
        }
    },
    series: [{
        colorByPoint: true,
        data: [{
            name: 'Sim, e a maior parte dos projetos é de outras áreas',
            y: 30
        }, {
            name: 'Sim, e a maior parte dos projetos é de educação musical',
            y: 29
        }, {
            name: 'Só atua em educação musical',
            y: 19,
            sliced: true,
            selected: true
        }, {
            name: 'Sim, e a educação musical tem o mesmo peso que outras atividades',
            y: 18
        }, {
            name: 'Não atua na educação musical',
            y: 5
        }]
    }]
});
