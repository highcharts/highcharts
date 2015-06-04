$(function () {

    /**
     * Experimental Highcharts plugin to allow client-side download to PNG and SVG.
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
         * Add a new method to the Chart object to perform a local download
         */
        Highcharts.Chart.prototype.exportChartLocal = function (options) {

            var chart = this,
                chartCopyContainer,
                domurl = window.URL || window.webkitURL || window,
                images,
                fallbackToExportServer = function (imageURL, callbackArgs) {
                    console.log("Fallback to export server")
                },
                // Get data:URL from image URL
                // Pass in callbacks to handle results. finallyCallback is always called at the end of the process. Supplying this callback is optional.
                // All callbacks receive two arguments: imageURL, and callbackArgs. callbackArgs is used only by callbacks and can contain whatever.
                imageToDataUrl = function (imageURL, callbackArgs, successCallback, taintedCallback, noCanvasSupportCallback, failedLoadCallback, finallyCallback) {
                    var img = new Image();
                    img.crossOrigin = 'Anonymous';
                    img.onload = function () {
                        var canvas = document.createElement('canvas'),
                            ctx = canvas.getContext && canvas.getContext('2d'),
                            dataURL;

                        if (!ctx) {
                            noCanvasSupportCallback(imageURL, callbackArgs);
                        } else {
                            canvas.height = img.height;
                            canvas.width = img.width;
                            ctx.drawImage(img, 0, 0);
                            
                            // Now we try to get the contents of the canvas.
                            try {
                                dataURL = canvas.toDataURL('image/png');
                                successCallback(dataURL, callbackArgs);
                            } catch (e) {
                                if (e.name === 'SecurityError') {
                                    taintedCallback(imageURL, callbackArgs);
                                }
                            }
                        }
                        if (finallyCallback) {
                            finallyCallback(imageURL, callbackArgs);
                        }
                    };
                    img.onerror = function () {
                        failedLoadCallback(imageURL, callbackArgs);
                        if (finallyCallback) {
                            finallyCallback(imageURL, callbackArgs);
                        }
                    };
                    img.src = imageURL;
                },
                // Get blob URL from SVG code. Falls back to normal data URL.
                svgToDataUrl = function (svg, useMs) {
                    var blob;
                    if (useMs && navigator.msSaveOrOpenBlob) {
                        blob = new MSBlobBuilder;
                        blob.append(svg);
                        return blob.getBlob('image/svg+xml');
                    }
                    try {
                        return domurl.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset-utf-16'}));
                    } catch (e) {
                        return ('data:image/svg+xml,' + svg).replace(/#/g, '%23'); // Replace # characters. Required in Firefox
                    }
                },
                // Download contents by dataURL/blob
                download = function (dataURL, extension) {
                    var a = document.createElement('a');

                    console.log(dataURL)

                    // IE specific blob implementation
                    if (navigator.msSaveOrOpenBlob) {
                        console.log("Download using msSaveOrOpenBlob")
                        navigator.msSaveOrOpenBlob(dataURL, 'chart.' + extension);
                        return;
                    }

                    console.log("Downloading using <a>.download")
                    a.href = dataURL;
                    a.download = 'chart.' + extension; // HTML5 download attribute
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                },
                // Get data URL to an image of the chart and call download on it
                initiateDownload = function () {
                   
                    var svgurl;

                    // Get SVG of chart copy
                    svg = chart.sanitizeSVG(chartCopyContainer.innerHTML);

                    // Initiate download depending on file type
                    if (options && options.type === 'image/svg+xml') {
                        // SVG download
                        download(svgToDataUrl(svg, true), 'svg');
                    } else {
                        // PNG download - create bitmap from SVG

                        // Try to get PNG
                        svgurl = svgToDataUrl(svg, false);
                        imageToDataUrl(svgurl, { /* args */ }, function (imageURL, callbackArgs) {
                            // Success
                            console.log('we made it! PNG creation succeeded')
                            download(imageURL, 'png');
                        
                        }, function (imageURL, callbackArgs) {
                            // Tainted
                            console.log('we need the canVG logic here in order to get SVG->PNG via canvas')

                            // Create new and untainted canvas
                            var canvas = document.createElement('canvas'),
                                onRenderComplete = function () {
                                    download(navigator.msSaveOrOpenBlob ? canvas.msToBlob() : canvas.toDataURL('image/png'), 'png');
                                };

                            if (window.canvg) {
                                console.log("Using preloaded canvg")
                                window.canvg(canvas, svg, { renderCallback: onRenderComplete });
                            } else {
                                // Must load canVG first
                                console.log("Loading canVG")
                                chart.showLoading();
                                getScript(Highcharts.getOptions().global.canvasToolsURL, function () {
                                    chart.hideLoading();
                                    window.canvg(canvas, svg, { renderCallback: onRenderComplete });
                                });
                            }

                        }, function (imageURL, callbackArgs) {
                            // No canvas support
                            console.log('we do not support canvas, fallback to export server')

                        }, function (imageURL, callbackArgs) {
                            // Failed to load image
                            console.log('failed to load image, fallback to export server')

                        }, function (imageURL, callbackArgs) {
                            // Finally
                            try {
                                domurl.revokeObjectURL(svgurl);
                            } catch (e) {
                                // Ignore
                            }
                        });
                    }
                };

            // Hook into getSVG to get a copy of the chart copy's container
            Highcharts.wrap(Highcharts.Chart.prototype, 'getChartHTML', function (proceed) {
                chartCopyContainer = this.container.cloneNode(true);
                return proceed.apply(this, Array.prototype.slice.call(arguments, 1));
            });

            // Trigger hook to get chart copy
            chart.getSVG();
            images = chartCopyContainer.getElementsByTagName('image');

            // If there are no images to embed, just go ahead and start the download process
            if (!images.length) {
                initiateDownload();
            }

            // Go through the images we want to embed
            for (var i = 0, l = images.length, imagesEmbedded = 0, el; i < l; ++i) {
                el = images[i];
                imageToDataUrl(el.getAttributeNS('http://www.w3.org/1999/xlink', 'href'), { imageElement: el }, function (imageURL, callbackArgs) {
                    // Success handler, we converted image to base64!
                    ++imagesEmbedded;

                    // Change image href in chart copy
                    callbackArgs.imageElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imageURL);

                    // Star download when done with the last image
                    if (imagesEmbedded === images.length) {
                        initiateDownload();
                    }

                }, fallbackToExportServer, fallbackToExportServer, fallbackToExportServer);
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
            data: [29.9, 71.5, 106.4, 129.2, 144.0, {y: 176.0, marker: { symbol: 'url(http://upload.wikimedia.org/wikipedia/en/7/70/Example.png)'}}, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4,{y: 126.0, marker: { symbol: 'url(http://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg)'}}]
        }]

    });

});