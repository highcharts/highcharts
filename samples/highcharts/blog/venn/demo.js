Highcharts.chart('container', {
    chart: {
        backgroundColor: "#f2f2f2"
    },
    plotOptions: {
        venn: {
            dataLabels: {
                useHTML: true,
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
            sets: ['Great Power Great Responsibility'],
            value: 4,
            color: '#bee175',
            dataLabels: {
                enabled: true,
                useHTML: true,
                x: -20,
                y: 10
            }
        }, {
            sets: ['Wears Red Suit'],
            value: 4,
            color: "#ff3232",
            dataLabels: {
                enabled: true,
                useHTML: true,
                x: 0,
                y: 0,
                style: {
                    width: 200
                }
            }
        }, {
            sets: ['Knows If You Have Been Naughty Or Nice'],
            value: 4,
            color: "#b3e5fc",
            dataLabels: {
                enabled: true,
                useHTML: true,
                x: -80,
                y: 30
            }
        }, {
            sets: ['Great Power Great Responsibility', 'Wears Red Suit'],
            value: 1,
            name: 'Spider Man',
            dataLabels: {
                enabled: true,
                useHTML: true,
                color: "white",
                x: -20,
                y: 50
            }
        }, {
            sets: ['Great Power Great Responsibility', 'Knows If You Have Been Naughty Or Nice'],
            value: 1,
            name: 'GOD',
            dataLabels: {
                enabled: true,
                useHTML: true,
                color: "white",
                x: -50,
                y: -40
            }
        }, {
            sets: ['Wears Red Suit', 'Knows If You Have Been Naughty Or Nice'],
            value: 1,
            name: 'Spanish Inquisition',
            dataLabels: {
                enabled: true,
                useHTML: true,
                color: "white",
                x: 50,
                y: 20
            }
        }, {
            sets: ['Great Power Great Responsibility', 'Wears Red Suit', 'Knows If You Have Been Naughty Or Nice'],
            value: 1,
            name: 'Santa',
            dataLabels: {
                color: "white",
                useHTML: true,
                x: 0,
                y: -40
            }
        }]
    }],
    title: {
        text: null
    }
});
