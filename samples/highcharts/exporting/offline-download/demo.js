$(function () {

    /**
     * Experimental Highcharts plugin to allow download to PNG (through canvg) and SVG
     * using the HTML5 download attribute.
     * 
     * WARNING: This plugin uses the HTML5 download attribute which is not generally 
     * supported. See http://caniuse.com/#feat=download for current uptake.
     *
     * TODO:
     * - Find a flowchart at Dropbox\Highsoft\Teknisk\Docs. The flowchart has not been updated to fit the new logic of implementing FileSaver ourselves.
     * - Existing code was abandoned in the middle of a revamp, probably needs cleanup.
     * - Implement "FileSaver.js"-like functionality for cross-browser support. Where Blob would need to be pulled in (old FF/Opera/Safari), emit error msg.
     * - Option to fall back to online export server on missing support. Display error to user if option disabled and there is no support.
     */
    (function (Highcharts) {

        // Dummy object so we can reuse our canvas-tools.js without errors
        Highcharts.CanVGRenderer = {};

        /**
         * Downloads a script and executes a callback when done.
         * @param {String} scriptLocation
         * @param {Function} callback
         */
        function getScript(scriptLocation, callback) {
            var head = document.getElementsByTagName('head')[0],
                script = document.createElement('script');

            script.type = 'text/javascript';
            script.src = scriptLocation;
            script.onload = callback;

            head.appendChild(script);
        }

        /**
         * Add a new method to the Chart object to invoice a local download
         */
        Highcharts.Chart.prototype.exportChartLocal = function (options) {

            var chart = this,
                svg = this.getSVG(),
                canvas,
                canvasCxt,
                a,
                href,
                extension,
                createCanvas = function () {
                    canvas = document.createElement('canvas');
                    canvas.width = svg.match(/^<svg.*?width="(\d+)/)[1];
                    canvas.height = svg.match(/^<svg.*?height="(\d+)/)[1];
                },
                download = function () {

                    var blob;

                    a = document.createElement('a');
                    if (typeof a.download !== 'undefined') {

                        console.log("Downloading using <a>.downlaod")

                        // HTML5 download attribute
                        a.href = href.replace(/#/g, '%23'); // Escape direct # characters. Required in Firefox
                        a.download = 'chart.' + extension;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);

                    } else {

                        // Here try blob -> objectURL, then data:uri, then fall back to export server/error 

                        // IE specific blob implementation
                        if (navigator.msSaveOrOpenBlob) { 

                            console.log("Download using msSaveOrOpenBlob")

                            // Get PNG blob
                            if (extension === 'png') {
                                blob = canvas.msToBlob();

                            // Get SVG blob
                            } else {
                                blob = new MSBlobBuilder;
                                blob.append(svg);
                                blob = blob.getBlob('image/svg+xml');
                            }

                            navigator.msSaveOrOpenBlob(blob, 'chart.' + extension);
                        }
                    }
                },
                // Function to render SVG to canvas. Calls download() when done.
                downloadCanvas = function () {
                    var useBlob = navigator.userAgent.indexOf('WebKit') === -1,
                        image = new Image(),
                        domurl,
                        blob,
                        svgurl;

                    extension = 'png';

                    // Firefox runs Blob. Safari requires the object URL. Chrome accepts both
                    // but seems to be slightly faster with object URL.
                    if (useBlob) {
                        domurl = window.URL || window.webkitURL || window;
                        blob = new Blob([svg], { type: 'image/svg+xml;charset-utf-16'});
                        svgurl = domurl.createObjectURL(blob);
                    }

                    // This is fired after the image has been created
                    image.onload = function() {

                        canvasCxt.drawImage(image, 0, 0);
                        if (useBlob) {
                            domurl.revokeObjectURL(svgurl);
                        }

                        // Now we try to get the contents of the canvas.
                        try {                            
                            href = canvas.toDataURL('image/png');
                            download();
                        } catch (e) {                            

                            // Tainted canvas, need canVG
                            if (e.name === 'SecurityError') {

                                // Create new and untainted canvas
                                createCanvas();

                                if (window.canvg) {
                                    console.log("Using preloaded canvg")
                                    window.canvg(canvas, svg);
                                    href = canvas.toDataURL('image/png');
                                    download();
                                } else {
                                    // Must load canVG first
                                    console.log("Loading canVG")
                                    chart.showLoading();
                                    getScript(Highcharts.getOptions().global.canvasToolsURL, function () {
                                        chart.hideLoading();
                                        window.canvg(canvas, svg);
                                        href = canvas.toDataURL('image/png');
                                        download();
                                    });
                                }
                            }
                        }

                    }
                    image.src = useBlob ? svgurl : 'data:image/svg+xml,' + svg;
                };

            // Initiate download depending on file type
            if (options && options.type === 'image/svg+xml') {
                // SVG download
                href = 'data:' + options.type + ',' + svg;
                extension = 'svg';
                download();
            } else {
                // PNG download

                // Create an empty canvas of same size as SVG source
                createCanvas();

                // Check if browser supports canvas rendering
                canvasCxt = canvas.getContext && canvas.getContext('2d');
                if (canvasCxt) {
                    downloadCanvas();
                } else {
                    console.log("Error, canvas not supported. Fallback to export server."); // TODO!
                }
            }
        };


        // Extend the default options to use the local exporter logic
        Highcharts.getOptions().exporting.buttons.contextButton.menuItems = [{
            textKey: 'printChart',
            onclick: function () {
                this.print();
            }
        }, {
            separator: true
        }, {
            textKey: 'downloadPNG',
            onclick: function () {
                this.exportChartLocal();
            }
        }, {
            textKey: 'downloadSVG',
            onclick: function () {
                this.exportChartLocal({
                    type: 'image/svg+xml'
                });
            }
        }];
    }(Highcharts));


    $('#container').highcharts({

        title: {
            text: 'Offline export'
        },

        subtitle: {
            text: 'Click the button to download as PNG'
        },

        chart: {
            type: 'area'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, {y: 176.0, marker: { symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)' }}, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]

    });

});