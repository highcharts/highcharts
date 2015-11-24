var percent = false;
$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column',
            marginTop: 70
        },
        credits: {
            enabled: false
        },
        title: {
            text: 'Chart1',
            align: 'left'
        },
        xAxis: {
            categories: ['Room1'],
            title: {
                text: 'Rooms'
            }
        },
        yAxis: {
            title: {
                text: 'Numbers'
            },
            stackLabels: {
                enabled: true,
                crop: false,
                style: {
                    fontWeight: 'bold',
                    color: '#6E6E6E'
                },
                formatter: function () {
                    return this.stack;
                }
            }
        },
        tooltip: {
            enabled: false,
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
            shared: false
        },
        plotOptions: {
            series: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: '#210B61',
                    align: 'center',
                    style: {
                        fontSize: '9px',
                        fontFamily: 'Verdana, sans-serif',
                        textShadow: '0 0 2px black'
                    },
                    formatter: function () {
                        return this.y;
                    }
                },
                groupPadding: 0
            }
        },

        series: [{
            name: "Baseline Fail",
            data: [31],
            stack: "Baseline Gary",
            id: "Baseline FailGary",
            color: "#BDBDBD"
        }, {
            name: "Baseline Fail",
            data: [17],
            stack: "Baseline Marty",
            color: "#BDBDBD",
            linkedTo: "Baseline FailGary"
        }, {
            name: "Baseline Fail",
            data: [28],
            stack: "Baseline TonyG",
            color: "#BDBDBD",
            linkedTo: "Baseline FailGary"
        }, {
            name: "Baseline Fail",
            data: [58],
            stack: "Baseline piernot",
            color: "#BDBDBD",
            linkedTo: "Baseline FailGary"
        }, {
            name: "Baseline",
            data: [49],
            stack: "Baseline Gary",
            id: "BaselineGary",
            color: "#DF7401"
        }, {
            name: "Baseline",
            data: [63],
            stack: "Baseline Marty",
            color: "#DF7401",
            linkedTo: "BaselineGary"
        }, {
            name: "Baseline",
            data: [52],
            stack: "Baseline TonyG",
            color: "#DF7401",
            linkedTo: "BaselineGary"
        }, {
            name: "Baseline",
            data: [22],
            stack: "Baseline piernot",
            color: "#DF7401",
            linkedTo: "BaselineGary"
        }]
    });

    $('#update').click(function () {
        $.each($('#container').highcharts().series, function (key, value) {
            value.update({
                stacking: percent ? 'normal' : 'percent'
            });
        });

        percent = !percent;
    });
});