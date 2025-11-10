const colors =  ['#6CDDCA', '#C771F3', '#4D90DB', '#FAB776'];

const chart = Highcharts.chart('container', {
    colors: colors,
    chart: {
        type: 'column',
        // backgroundColor: '#F2F1F4',
        borderRadius: 10,
        margin: [30, 30, 40, 70]
    },

    exporting: {
        enabled: false
    },
    credits: {
        enabled: false
    },

    title: {
        text: 'Olympic all-time medals by country',
        floating: true,
        y: 20,
        x: 20,
        align: 'left',
        style: {
            fontSize: '14px'

        }
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: true
            }
        }
    },

    legend: {
        align: 'right',
        verticalAlign: 'top',
        layout: 'vertical',
        itemStyle: {
            fontSize: 11
        }
    },

    xAxis: {

        categories: ['Gold', 'Silver', 'Bronze'],
        labels: {
            x: -10,
            style: {
                fontWeight: 'bold'
            }
        }
    },

    yAxis: {
        tickInterval: 20,
        height: '90%',
        top: 62,
        allowDecimals: false,

        labels: {
            style: {
                color: '#5E5C70'
            }
        },
        title: {
            text: 'Amount',
            style: {
                color: '#5E5C70'
            }
        }
    },

    series: [{
        name: 'Norway',
        data: [148, 133, 124],
        stack: 'Europe'
    }, {
        name: 'Germany',
        data: [102, 98, 65],
        stack: 'Europe'
    }, {
        name: 'United States',
        data: [113, 122, 95],
        stack: 'North America'
    }, {
        name: 'Canada',
        data: [77, 72, 80],
        stack: 'North America'
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 300
            },
            chartOptions: {
                chart: {
                    margin: [10, 10, 150, 10]
                },
                title: {
                    text: 'Olympic all-time medals by country',
                    floating: true,
                    y: 30,
                    x: 0,
                    align: 'center',
                    style: {
                        fontSize: '14px'

                    }
                },
                plotOptions: {
                    series: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: false
                        }
                    }
                },
                legend: {
                    align: 'center',
                    verticalAlign: 'bottom',
                    layout: 'horizontal'
                },
                yAxis: {
                    tickInterval: 50,
                    height: '100%',
                    top: null,
                    visible: false,
                    labels: {
                        align: 'left',
                        x: 0,
                        y: -10
                    },
                    title: {
                        text: null
                    }
                },
                subtitle: {
                    text: null
                },
                credits: {
                    enabled: false
                }
            }
        }]
    }
});

document.getElementById('mobile').addEventListener('click', function () {
    this.classList.add('active');
    document.getElementById('desktop').classList.remove('active');
    document.getElementById('container').style.width = '300px';
    chart.setSize(300);
});

document.getElementById('desktop').addEventListener('click', function () {
    this.classList.add('active');
    document.getElementById('mobile').classList.remove('active');
    document.getElementById('container').style.width = '620px';
    chart.setSize(600);
});
