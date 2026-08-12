/* eslint-env browser */
/* eslint-disable require-unicode-regexp */

(function (window) {
    var CANVAS_WIDTH = 600,
        CANVAS_HEIGHT = 400;

    /*
     * Display the tooltip so it gets part of the comparison.
     */
    function prepareShot(chart) {
        if (
            chart &&
            chart.series &&
            chart.series[0]
        ) {
            var points = chart.series[0].nodes || // Network graphs, sankey etc
                    chart.series[0].points || [],
                i = points.length;

            while (i--) {
                if (
                    points[i]?.visible &&
                    !points[i].isNull &&
                    !( // Map point with no extent, like Aruba
                        points[i].shapeArgs &&
                        points[i].shapeArgs.d &&
                        points[i].shapeArgs.d.length === 0
                    ) &&
                    points[i].series.options.enableMouseTracking !== false &&
                    typeof points[i].onMouseOver === 'function'
                ) {
                    points[i].onMouseOver();
                    break;
                }
            }

            // Breaks inside foreign objects are considered tainted canvas
            [].forEach.call(
                chart.container.querySelectorAll('foreignObject br'),
                function (br) {
                    br.parentNode.replaceChild(document.createElement('div'), br);
                }
            );

            // Replace images in foreign objects
            [].forEach.call(
                chart.container.querySelectorAll('foreignObject img'),
                function (img) {
                    const div = document.createElement('div');
                    div.style.width = '16px';
                    div.style.height = '16px';
                    div.style.position = 'inline-block';
                    div.style.backgroundColor = '#ddd';
                    img.parentNode.replaceChild(div, img);
                }
            );
        }
    }

    function prettyXML(svg) {
        svg = svg
            .replace(/>/g, '>\n')

            // Don't introduce newlines inside tspans or links, it will make the
            // text render differently
            .replace(/<tspan([^>]*)>\n/g, '<tspan$1>')
            .replace(/<\/tspan>\n/g, '</tspan>')
            .replace(/<a([^>]*)>\n/g, '<a$1>')
            .replace(/<\/a>\n/g, '</a>');

        return svg;
    }

    function getSVG(chart) {
        var svg;
        if (chart) {
            var container = chart.container;
            prepareShot(chart);
            svg = container.querySelector('svg')
                .outerHTML
                .replace(
                    /<svg /,
                    '<svg xmlns:xlink="http://www.w3.org/1999/xlink" '
                );

            if (chart.styledMode) {
                var highchartsCSS = document.getElementById('highcharts.css');
                if (highchartsCSS) {
                    svg = svg
                        // Get the typography styling right
                        .replace(
                            ' class="highcharts-root" ',
                            ' class="highcharts-root highcharts-container" ' +
                                'style="width:auto; height:auto" '
                        )

                        // Insert highcharts.css
                        .replace(
                            '</defs>',
                            '<style>' + highchartsCSS.innerText + '</style></defs>'
                        );
                }

                var demoCSS = document.getElementById('demo.css');
                if (demoCSS) {
                    svg = svg
                        // Insert demo.css
                        .replace(
                            '</defs>',
                            '<style>' + demoCSS.innerText + '</style></defs>'
                        );
                }
            }

            // Renderer samples
        } else {
            if (document.getElementsByTagName('svg').length) {
                svg = document.getElementsByTagName('svg')[0].outerHTML;
            }
        }

        return prettyXML(svg);
    }

    function compare(data1, data2) {
        var i = data1.length,
            diff = 0,
            pixels = [],
            pixel;

        // Loops over all reds, greens, blues and alphas
        while (i--) {
            pixel = Math.floor(i / 4);
            if (Math.abs(data1[i] - data2[i]) !== 0 && !pixels[pixel]) {
                pixels[pixel] = true;
                diff++;
            }
        }

        return diff;
    }

    // Ported from the offline-exporting module
    function svgToDataUrl(svg) {
        var DOMURL = (window.URL || window.webkitURL || window);

        // Webkit and not chrome
        var userAgent = window.navigator.userAgent;
        var webKit = (
            userAgent.indexOf('WebKit') > -1 &&
            userAgent.indexOf('Chrome') < 0
        );

        try {
            // Safari requires data URI since it doesn't allow navigation to
            // blob URLs. ForeignObjects also don't work well in Blobs in Chrome
            // (#14780).
            if (!webKit && svg.indexOf('<foreignObject') === -1) {
                return DOMURL.createObjectURL(new window.Blob([svg], {
                    type: 'image/svg+xml;charset-utf-16'
                }));
            }
        } catch {
            // Ignore
        }
        return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
    }

    function svgToPixels(svg, canvas) {
        var DOMURL = (window.URL || window.webkitURL || window);
        var ctx = canvas.getContext && canvas.getContext('2d');

        var img = new Image(CANVAS_WIDTH, CANVAS_HEIGHT);
        img.src = svgToDataUrl(svg);

        return new Promise(function (resolve, reject) {
            img.onload = function () {
                ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                resolve(ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data);
                DOMURL.revokeObjectURL(img.src);
            };
            img.onerror = function () {
                DOMURL.revokeObjectURL(img.src);
                reject(new Error('Error loading SVG on canvas.'));
            };
        });
    }

    function createCanvas(id) {
        var canvas = document.createElement('canvas');
        canvas.setAttribute('id', id);
        canvas.setAttribute('width', CANVAS_WIDTH);
        canvas.setAttribute('height', CANVAS_HEIGHT);
        return canvas;
    }

    window.VisualComparator = {
        CANVAS_WIDTH: CANVAS_WIDTH,
        CANVAS_HEIGHT: CANVAS_HEIGHT,
        prepareShot: prepareShot,
        getSVG: getSVG,
        compare: compare,
        svgToPixels: svgToPixels,
        createCanvas: createCanvas
    };
}(window));
