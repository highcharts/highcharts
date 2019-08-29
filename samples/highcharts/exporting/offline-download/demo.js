/* Automate testing of module somewhat */

var nav = Highcharts.win.navigator,
    isMSBrowser = /Edge\/|Trident\/|MSIE /.test(nav.userAgent),
    isEdgeBrowser = /Edge\/\d+/.test(nav.userAgent),
    containerEl = document.getElementById('container'),
    parentEl = containerEl.parentNode,
    oldDownloadURL = Highcharts.downloadURL;

function addText(text) {
    var heading = document.createElement('h2');
    heading.innerHTML = text;
    parentEl.appendChild(heading);
}

function addURLView(title, url) {
    var iframe = document.createElement('iframe');
    if (isMSBrowser && Highcharts.isObject(url)) {
        addText(title +
        ': Microsoft browsers do not support Blob iframe.src, test manually'
        );
        return;
    }
    iframe.src = url;
    iframe.width = 400;
    iframe.height = 300;
    iframe.title = title;
    iframe.style.display = 'inline-block';
    parentEl.appendChild(iframe);
}

function fallbackHandler(options) {
    if (options.type !== 'image/svg+xml' && isEdgeBrowser ||
        options.type === 'application/pdf' && isMSBrowser) {
        addText(options.type + ' fell back on purpose');
    } else {
        throw 'Should not have to fall back for this combination. ' +
            options.type;
    }
}

Highcharts.downloadURL = function (dataURL, filename) {
    // Emulate toBlob behavior for long URLs
    if (dataURL.length > 2000000) {
        dataURL = Highcharts.dataURLtoBlob(dataURL);
        if (!dataURL) {
            throw 'Data URL length limit reached';
        }
    }
    // Show result in an iframe instead of downloading
    addURLView(filename, dataURL);
};

Highcharts.Chart.prototype.exportTest = function (type) {
    this.exportChartLocal({
        type: type
    }, {
        title: {
            text: type
        },
        subtitle: {
            text: false
        }
    });
};

Highcharts.Chart.prototype.callbacks.push(function (chart) {
    if (!chart.options.chart.forExport) {
        var menu = chart.exportSVGElements && chart.exportSVGElements[0],
            oldHandler;
        chart.exportTest('image/png');
        chart.exportTest('image/jpeg');
        chart.exportTest('image/svg+xml');
        chart.exportTest('application/pdf');

        // Allow manual testing by resetting downloadURL handler when trying
        // to export manually
        if (menu) {
            oldHandler = menu.element.onclick;
            menu.element.onclick = function () {
                Highcharts.downloadURL = oldDownloadURL;
                oldHandler.call(this);
            };
        }
    }
});

/* End of automation code */


Highcharts.chart('container', {
    exporting: {
        chartOptions: { // specific options for the exported image
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true
                    }
                }
            }
        },
        sourceWidth: 400,
        sourceHeight: 300,
        scale: 1,
        fallbackToExportServer: false,
        error: fallbackHandler
    },

    title: {
        text: 'Offline export'
    },

    subtitle: {
        text: 'Click the button to download as PNG, JPEG, SVG or PDF'
    },

    chart: {
        type: 'area'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 126.0, 148.5, 216.4, 194.1, 95.6, 54.4]
    }]

});
