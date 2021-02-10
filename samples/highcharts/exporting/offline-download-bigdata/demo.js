var nav = Highcharts.win.navigator,
    isMSBrowser = /Edge\/|Trident\/|MSIE /.test(nav.userAgent),
    isEdgeBrowser = /Edge\/\d+/.test(nav.userAgent),
    containerEl = document.getElementById('container'),
    parentEl = containerEl.parentNode;

function addText(text) {
    var heading = document.createElement('h2');
    heading.innerHTML = text;
    parentEl.appendChild(heading);
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


// NOTE: dataURL length limits in certain browsers. #6108

var arr = [];
for (var i = 0; i < 15000; i++) {
    arr.push(i);
}

Highcharts.chart('container', {
    exporting: {
        fallbackToExportServer: false,
        sourceWidth: 400,
        sourceHeight: 300,
        scale: 1,
        error: fallbackHandler
    },
    title: {
        text: 'Lots of data points, test PDF in particular'
    },
    series: [{
        data: arr
    }]
});
