Highcharts.addEvent(Highcharts.Chart, 'render', function () {
    var table = this.dataTableDiv;
    if (table) {

        // Apply styles inline because stylesheets are not passed to the exported SVG
        Highcharts.css(table.querySelector('table'), {
            'border-collapse': 'collapse',
            'border-spacing': 0,
            'background': 'white',
            'min-width': '100%',
            'font-family': 'sans-serif',
            'font-size': '14px'
        });

        table.querySelectorAll('td, th, caption').forEach(function (elem) {
            Highcharts.css(elem, {
                border: '1px solid silver',
                padding: '0.5em'
            });
        });

        Highcharts.css(table.querySelector('caption'), {
            'border-bottom': 'none',
            'font-size': '1.1em',
            'font-weight': 'bold'
        });

        table.querySelectorAll('caption, tr').forEach(function (elem, i) {
            if (i % 2) {
                Highcharts.css(elem, {
                    background: '#f8f8f8'
                });
            }
        });


        // Add the table as the subtitle to make it part of the export
        this.setTitle(null, {
            text: table.outerHTML,
            useHTML: true
        });
        if (table.parentNode) {
            table.parentNode.removeChild(table);
        }
        delete this.dataTableDiv;
    }
});


Highcharts.chart('container', {

    chart: {
        width: 800
    },
    title: {
        text: 'My custom table chart',
        style: {
            display: 'none'
        }
    },

    subtitle: {
        text: null,
        align: 'left'
    },

    credits: {
        enabled: false
    },

    xAxis: {
        visible: false
    },

    yAxis: {
        visible: false
    },
    legend: {
        enabled: false
    },

    plotOptions: {
        series: {
            pointStart: 2010,
            marker: {
                enabled: false
            },
            lineWidth: 0,
            enableMouseTracking: false
        }
    },

    series: [{
        name: 'Installation',
        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
    }, {
        name: 'Manufacturing',
        data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
    }, {
        name: 'Sales & Distribution',
        data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
    }, {
        name: 'Project Development',
        data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
    }, {
        name: 'Other',
        data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
    }],

    exporting: {
        showTable: true,
        allowHTML: true
    }

});