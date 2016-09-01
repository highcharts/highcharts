$(function () {

    $('#container').highcharts({

        chart: {
            type: 'column'
        },

        title: {
            text: 'POC: Exporting CSS-based Highcharts'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },

        legend: {
            align: 'right',
            verticalAlign: 'middle',
            layout: 'vertical'
        },

        series: [{
            data: [1, 2, 3]
        }, {
            data: [1, 2, 3]
        }, {
            data: [1, 2, 3]
        }]

    });

    $('#pre').html((function () {
        var indent = '';
        return $('#container').highcharts().getSVG()
            .replace(/(<\/?|\/?>)/g, function (a) {
                var ret;
                if (a === '<') {
                    ret = '\n' + indent + '&lt;';
                    indent += '   ';
                } else if (a === '>') {
                    ret = '&gt;';
                } else if (a === '</') {
                    indent = indent.substr(3);
                    ret = '\n' + indent + '&lt;/';
                } else if (a === '/>') {
                    indent = indent.substr(3);
                    ret = '/&lt;';
                }
                return ret;
            });
    }()));

    CodeMirror.fromTextArea(document.getElementById('pre'), {
        mode: "xml",
        theme: "default",
        lineNumbers: true,
        lineWrapping: true,
        readOnly: true,
        viewportMargin: Infinity
    });

});