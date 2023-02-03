const columnChart = Highcharts.chart('container-1', {
    chart: {
        type: 'column'
    },
    xAxis: {
        categories: ['Apples', 'Pears', 'Bananas', 'Oranges']
    },
    accessibility: {
        enabled: false
    },
    title: {
        text: 'Highcharts with rounded corners'
    },
    plotOptions: {
        series: {
            _borderRadius: {
                radius: '20px',
                scope: 'stack',
                where: 'end'
            },
            borderRadius: '50%',
            borderWidth: 2,
            borderColor: '#666',
            dataLabels: {
                enabled: true
            },
            stacking: 'normal'
        }
    },
    series: [{
        data: [50, -50, 500, -90],
        name: 'Norway'
    }, {
        data: [50, 250, 260, -50],
        name: 'Sweden'
    }, {
        data: [150, 20, 30, -120],
        name: 'Denmark'
    }],
    colors: ['#d7bfff', '#af80ff', '#5920b9', '#48208b']
});


document.querySelectorAll('button.corner-radius').forEach(btn => {
    btn.addEventListener(
        'click',
        () => {
            columnChart.update({
                plotOptions: {
                    series: {
                        borderRadius: btn.dataset.value
                    }
                }
            });
        }
    );
});

document.querySelectorAll('button.chart-type').forEach(btn => {
    btn.addEventListener(
        'click',
        () => {
            columnChart.update({
                chart: {
                    type: btn.dataset.value
                }
            });
        }
    );
});

Highcharts.chart('container-2', {
    chart: {
        type: 'pie'
    },
    xAxis: {
        categories: ['Apples', 'Pears', 'Bananas', 'Oranges']
    },
    accessibility: {
        enabled: false
    },
    title: {
        text: 'Pie with rounded corners'
    },
    plotOptions: {
        series: {
            borderRadius: 10,
            borderWidth: 2,
            borderColor: 'white',
            dataLabels: {
                enabled: true
            },
            size: '80%'
        }
    },
    series: [{
        data: [{
            y: 1,
            sliced: true
        }, 3, 2, 4],
        name: 'Norway'
    }],
    colors: ['#d7bfff', '#af80ff', '#5920b9', '#48208b']
});
