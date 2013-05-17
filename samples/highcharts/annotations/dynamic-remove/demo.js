$(function() {
    $('#container').highcharts({
        chart: {
            events: {
                load: function() {
                    var annotations = this.annotations.allItems,
                        len = annotations.length,
                        list = $('#list'),
                        str = '',
                        i;

                    for (i = 0; i < len; i++) {
                        str += '<li>' + annotations[i].options.title.text + ' <button>remove</button></li>';
                    }

                    list.html(str);
                }
            }
        },
        title: {
            text: 'dynamically removed annotations'
        },
        credits: {
            enabled: false
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }],

        annotations: [{
            xValue: 0,
            yValue: 29.9,
            anchorY: "bottom",
            anchorX: "center",
            width: 80,
            height: 40,
            title: {
                text: "Annotation 3"
            },
            shape: {
                type: "path",
                params: {
                    d: ["M", 40, 20, "L", 40, 32],
                    stroke: "#2f7ed8",
                    strokeWidth: 2
                }
            }
        }, {
            xValue: 9,
            yValue: 194.1,
            anchorY: "bottom",
            anchorX: "center",
            width: 80,
            height: 40,
            title: {
                text: "Annotation 2"
            },
            shape: {
                type: "path",
                params: {
                    d: ["M", 40, 20, "L", 40, 32],
                    stroke: "#2f7ed8",
                    strokeWidth: 2
                }
            }
        }, {
            xValue: 4,
            yValue: 144,
            anchorY: "bottom",
            anchorX: "center",
            width: 80,
            height: 40,
            title: {
                text: "Annotation 1"
            },
            shape: {
                type: "path",
                params: {
                    d: ["M", 40, 20, "L", 40, 32],
                    stroke: "#2f7ed8",
                    strokeWidth: 2
                }
            }
        }, {
            xValue: 8,
            yValue: 216.4,
            anchorY: "bottom",
            anchorX: "center",
            width: 80,
            height: 40,
            title: {
                text: "Annotation 0 "
            },
            shape: {
                type: "path",
                params: {
                    d: ["M", 40, 20, "L", 40, 32],
                    stroke: "#2f7ed8",
                    strokeWidth: 2
                }
            }
        }]

    });

    $('#list').on('click', 'button', function () {
        var li = $(this.parentNode),
            n = li.index();

        Highcharts.charts[0].annotations.allItems[n].destroy();
        li.remove();
    });
});