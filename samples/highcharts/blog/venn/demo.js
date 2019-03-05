Highcharts.chart('container', {
    chart: {
        backgroundColor: "#f2f2f2",
        height: '100%'
    },
    plotOptions: {
        venn: {
            dataLabels: {
                enabled: true,
                style: {
                    textOutline: false,
                    width: 175,
                    fontSize: '24px',
                    color: "#808080"
                }
            }
        }
    },
    tooltip: {
        enabled: false
    },
    series: [{
        type: 'venn',
        name: null,
        opacity: 0.4,
        borderWidth: 0,
        data: [{
            sets: ['Knows If You Have Been Naughty Or Nice'],
            value: 4,
            color: "#b3e5fc",
            dataLabels: {
                x: -40,
                y: 10
            }
        }, {
            sets: ['Great Power Great Responsibility'],
            value: 4,
            color: '#bee175',
            dataLabels: {
                x: -20,
                y: 10
            }
        }, {
            sets: ['Wears Red Suit'],
            value: 4,
            color: "#ff3232",
            dataLabels: {
                x: 0,
                y: 0,
                style: {
                    width: 200
                }
            }
        }, {
            sets: ['Great Power Great Responsibility', 'Wears Red Suit'],
            value: 1,
            name: 'Spider Man',
            dataLabels: {
                color: "white",
                x: -20,
                y: 30
            }
        }, {
            sets: ['Great Power Great Responsibility', 'Knows If You Have Been Naughty Or Nice'],
            value: 1,
            name: 'GOD',
            dataLabels: {
                color: "white",
                x: -20,
                y: -20
            }
        }, {
            sets: ['Wears Red Suit', 'Knows If You Have Been Naughty Or Nice'],
            value: 1,
            name: 'Spanish Inquisition',
            dataLabels: {
                color: "white",
                x: 20,
                y: 20
            }
        }, {
            sets: ['Great Power Great Responsibility', 'Wears Red Suit', 'Knows If You Have Been Naughty Or Nice'],
            value: 1,
            name: 'Santa',
            dataLabels: {
                color: "white",
                x: 0,
                y: -20
            }
        }]
    }],
    title: {
        text: null
    },
    responsive: {
        rules: [{
            condition: {
                maxWidth: 650
            },
            chartOptions: {
                plotOptions: {
                    venn: {
                        dataLabels: {
                            style: {
                                fontSize: '14px',
                                width: '100px'
                            }
                        }
                    }
                }
            }
        }]
    }
});
