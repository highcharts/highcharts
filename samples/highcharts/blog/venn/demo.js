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
            color: "#b3e5fc"
        }, {
            sets: ['Great Power Great Responsibility'],
            value: 4,
            color: '#bee175'
        }, {
            sets: ['Wears Red Suit'],
            value: 4,
            color: "#ff3232"
        }, {
            sets: ['Great Power Great Responsibility', 'Wears Red Suit'],
            value: 1,
            name: 'Spider Man',
            dataLabels: {
                color: "white"
            }
        }, {
            sets: ['Great Power Great Responsibility', 'Knows If You Have Been Naughty Or Nice'],
            value: 1,
            name: 'GOD',
            dataLabels: {
                color: "white"
            }
        }, {
            sets: ['Wears Red Suit', 'Knows If You Have Been Naughty Or Nice'],
            value: 1,
            name: 'Spanish Inquisition',
            dataLabels: {
                color: "white"
            }
        }, {
            sets: ['Great Power Great Responsibility', 'Wears Red Suit', 'Knows If You Have Been Naughty Or Nice'],
            value: 1,
            name: 'Santa',
            dataLabels: {
                color: "white"
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
