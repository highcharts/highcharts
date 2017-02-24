/* global CodeMirror*/



var chart = Highcharts.chart('container', {

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
        data: [3, 2, 1],
        type: 'line'
    }]

});

var start = Date.now();
var svg = chart.getSVGForExport();

$('#report').html('SVG size: ' + Highcharts.numberFormat(svg.length, 0) + ' B<br>Export generation time: ' + (Date.now() - start) + ' ms');
$('#pre').html((function () {
    var indent = '';
    return svg
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

