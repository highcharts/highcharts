

(function (H) {
    var x = $('#x');
    var y = $('#y');
    var text = $('#text');
    var each = Highcharts.each;

    var dialog = $('#annotation-form').dialog({
        autoOpen: false,
        modal: true,
        width: 200,
        position: {
            of: $('#container')
        },
        title: 'Add label'
    });

    var form;

    function addButtons() {
        var chart = this;
        var renderer = chart.renderer;
        var normalState = {
            fill: 'none',
            'stroke-width': 0
        };
        var buttonY = 34;
        var group = renderer.g('annotations-menu').attr({
            translateX: 4,
            translateY: chart.plotTop
        }).add();


        var buttons = [];
        var button = function (text, x, y, type) {
            var button = renderer.button(text, x, y, function () {
                if (this.state !== 2) {
                    this.setState(2);
                    each(buttons, function (button) {
                        if (button !== this) {
                            button.setState(0);
                        }
                    }, this);
                    chart.annotating = type || 'label';
                } else {
                    this.setState(0);
                    chart.annotating = null;
                }
            }, normalState, null, {
                fill: '#e6ebf5',
                style: {
                    color: '#000000',
                    fontWeight: 'bold'
                }
            });

            if (type) {
                button.attr({
                    width: 8,
                    height: 14
                });

                renderer.symbol(type, 7, 10, 11, 11).add(button).attr({
                    'stroke-width': 1,
                    stroke: 'black',
                    zIndex: 1
                });
            }

            return button.add(group);
        };

        chart.annotating = null;
        renderer.rect(0, 0, 32, 4 * buttonY + 4).attr({
            fill: '#F5F5F5',
            'stroke-width': 0
        }).add(group);


        buttons.push(
          button('T', 4, 4),
          button(null, 4, 4 + buttonY,  'circle'),
          button(null, 4, 4 + 2 * buttonY,  'square'),

          renderer.button(' V ', 4, 4 + 3 * buttonY, function () {
              each(chart.annotations, function (annotation) {
                  annotation.setVisible();
              });
          }, normalState, null).add(group)
        );
    }


    function addLabel(e) {
        e.preventDefault();

        var backgroundColor = $('input:radio[name="background-color"]:checked').val();
        var shape = $('input:radio[name="shape"]:checked').val();

        Highcharts.charts[0].addAnnotation({
            labels: [{
                text: text.val(),
                point: { x: Number(x.val()), y: Number(y.val()) },
                backgroundColor: backgroundColor,
                shape: shape,
                borderWidth: shape !== 'connector' ? 0 : 1,
                x: 0,
                y: shape === 'circle' ? 0 : -16
            }]
        });

        dialog.dialog('close');
        form[0].reset();
    }

    function addShape(chart, type) {
        var options = {
            type: type,
            point: {
                x: Number(x.val()),
                y: Number(y.val())
            },
            x: 0,
            y: 0
        };

        if (type === 'circle') {
            options.r = 10;
        } else if (type === 'square') {
            options.width = 20;
            options.height = 20;
            options.x = -10;
            options.y = -10;
        }

        chart.addAnnotation({
            shapes: [options]
        });
    }

    form = dialog.find('#add-annotation').on('submit', addLabel);

    H.Chart.prototype.callbacks.push(function () {
        H.addEvent(this, 'load', addButtons);
        H.addEvent(this, 'click', function (e) {
            var annotating = this.annotating;
            x.val(e.chartX - this.plotLeft);
            y.val(e.chartY - this.plotTop);

            if (annotating === 'label') {
                dialog.dialog('open');
            } else if (annotating !== null) {
                addShape(this, annotating);
            }
        });
    });
}(Highcharts));



var chart = Highcharts.chart('container', {
    subtitle: {
        text: '<ul><li>T - add a label</li><li>&#9711; - add circle</li><li>&#9634; - add square</li><li>V - toggle visibility</li></ul>',
        useHTML: true
    },
    chart: {
        marginLeft: 50
    },


    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    yAxis: {
        opposite: true
    },

    title: {
        text: 'Highcharts Annotations'
    },

    series: [{
        data: [29, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216, 194.1, 95.6, 54.4]
    }],

    annotations: [{
        labels: [{
            point: 'max',
            text: 'Max'
        }, {
            point: 'min',
            text: 'Min',
            backgroundColor: 'white'
        }]
    }]
});

$('#btn').onclick = function () {
    chart.addAnnotation({
        labels: [{
            text: 'janusz',
            point: { x: 20, y: 20 }
        }]
    });
};
