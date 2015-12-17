/**
 * @license Highcharts JS v4.2.0 (2105-12-15)
 * Client side exporting module
 *
 * (c) 2015 Torstein Honsi / Oystein Moseng
 *
 * License: www.highcharts.com/license
 */

/*global MSBlobBuilder */
(function (factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else {
		factory(Highcharts);
	}
}(function (Highcharts) {

	var win = Highcharts.win,
		nav = win.navigator,
		doc = win.document;

	// Dummy object so we can reuse our canvas-tools.js without errors
	Highcharts.CanVGRenderer = {};


	/**
	 * Downloads a script and executes a callback when done.
	 * @param {String} scriptLocation
	 * @param {Function} callback
	 */
	function getScript(scriptLocation, callback) {
		var head = doc.getElementsByTagName('head')[0],
			script = doc.createElement('script');

		script.type = 'text/javascript';
		script.src = scriptLocation;
		script.onload = callback;

		head.appendChild(script);
	}

	/**
	 * Add a new method to the Chart object to perform a local download
	 */
	Highcharts.Chart.prototype.exportChartLocal = function (exportingOptions, chartOptions) {
		var chart = this,
			options = Highcharts.merge(chart.options.exporting, exportingOptions),
			webKit = nav.userAgent.indexOf('WebKit') > -1 && nav.userAgent.indexOf('Chrome') < 0, // Webkit and not chrome
			scale = options.scale || 2,
			chartCopyContainer,
			domurl = win.URL || win.webkitURL || win,
			images,
			imagesEmbedded = 0,
			el,
			i,
			l,
			fallbackToExportServer = function () {
				if (options.fallbackToExportServer === false) {
					throw 'Fallback to export server disabled';
				}
				chart.exportChart(options);
			},
			// Get data:URL from image URL
			// Pass in callbacks to handle results. finallyCallback is always called at the end of the process. Supplying this callback is optional.
			// All callbacks receive two arguments: imageURL, and callbackArgs. callbackArgs is used only by callbacks and can contain whatever.
			imageToDataUrl = function (imageURL, callbackArgs, successCallback, taintedCallback, noCanvasSupportCallback, failedLoadCallback, finallyCallback) {
				var img = new win.Image();
				if (!webKit) {
					img.crossOrigin = 'Anonymous'; // For some reason Safari chokes on this attribute
				}
				img.onload = function () {
					var canvas = doc.createElement('canvas'),
						ctx = canvas.getContext && canvas.getContext('2d'),
						dataURL;

					if (!ctx) {
						noCanvasSupportCallback(imageURL, callbackArgs);
					} else {
						canvas.height = img.height * scale;
						canvas.width = img.width * scale;
						ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

						// Now we try to get the contents of the canvas.
						try {
							dataURL = canvas.toDataURL();
							successCallback(dataURL, callbackArgs);
						} catch (e) {
							// Failed - either tainted canvas or something else went horribly wrong
							if (e.name === 'SecurityError' || e.name === 'SECURITY_ERR' || e.message === 'SecurityError') {
								taintedCallback(imageURL, callbackArgs);
							} else {
								throw e;
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
			// Get blob URL from SVG code. Falls back to normal data URI.
			svgToDataUrl = function (svg) {
				try {
					// Safari requires data URI since it doesn't allow navigation to blob URLs
					// Firefox has an issue with Blobs and internal references, leading to gradients not working using Blobs (#4550)
					if (!webKit && nav.userAgent.toLowerCase().indexOf('firefox') < 0) {
						return domurl.createObjectURL(new win.Blob([svg], { type: 'image/svg+xml;charset-utf-16' }));
					}
				} catch (e) {
					// Ignore
				}
				return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
			},
			// Download contents by dataURL/blob
			download = function (dataURL, extension) {
				var a = doc.createElement('a'),
					filename = (options.filename || 'chart') + '.' + extension,
					windowRef;

				// IE specific blob implementation
				if (nav.msSaveOrOpenBlob) {
					nav.msSaveOrOpenBlob(dataURL, filename);
					return;
				}

				// Try HTML5 download attr if supported
				if (a.download !== undefined) {
					a.href = dataURL;
					a.download = filename; // HTML5 download attribute
					a.target = '_blank';
					doc.body.appendChild(a);
					a.click();
					doc.body.removeChild(a);
				} else {
					// No download attr, just opening data URI
					try {
						windowRef = win.open(dataURL, 'chart');
						if (windowRef === undefined || windowRef === null) {
							throw 1;
						}
					} catch (e) {
						// window.open failed, trying location.href
						win.location.href = dataURL;
					}
				}
			},
			// Get data URL to an image of the chart and call download on it
			initiateDownload = function () {
				var svgurl,
					blob,
					svg = chart.sanitizeSVG(chartCopyContainer.innerHTML); // SVG of chart copy

				// Initiate download depending on file type
				if (options && options.type === 'image/svg+xml') {
					// SVG download. In this case, we want to use Microsoft specific Blob if available
					try {
						if (nav.msSaveOrOpenBlob) {
							blob = new MSBlobBuilder();
							blob.append(svg);
							svgurl = blob.getBlob('image/svg+xml');
						} else {
							svgurl = svgToDataUrl(svg);
						}
						download(svgurl, 'svg');
					} catch (e) {
						fallbackToExportServer();
					}
				} else {
					// PNG download - create bitmap from SVG
					
					// First, try to get PNG by rendering on canvas
					svgurl = svgToDataUrl(svg);
					imageToDataUrl(svgurl, { /* args */ }, function (imageURL) {
						// Success
						try {
							download(imageURL, 'png');
						} catch (e) {
							fallbackToExportServer();
						}
					}, function () {
						// Failed due to tainted canvas
						// Create new and untainted canvas
						var canvas = doc.createElement('canvas'),
							ctx = canvas.getContext('2d'),
							imageWidth = svg.match(/^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/)[1] * scale,
							imageHeight = svg.match(/^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/)[1] * scale,
							downloadWithCanVG = function () {
								ctx.drawSvg(svg, 0, 0, imageWidth, imageHeight);
								try {
									download(nav.msSaveOrOpenBlob ? canvas.msToBlob() : canvas.toDataURL('image/png'), 'png');
								} catch (e) {
									fallbackToExportServer();
								}
							};

						canvas.width = imageWidth;
						canvas.height = imageHeight;
						if (win.canvg) {
							// Use preloaded canvg
							downloadWithCanVG();
						} else {
							// Must load canVG first
							chart.showLoading();
							getScript(Highcharts.getOptions().global.canvasToolsURL, function () {
								chart.hideLoading();
								downloadWithCanVG();
							});
						}
					},
					// No canvas support
					fallbackToExportServer,
					// Failed to load image
					fallbackToExportServer,
					// Finally
					function () {
						try {
							domurl.revokeObjectURL(svgurl);
						} catch (e) {
							// Ignore
						}
					});
				}
			},
			// Success handler, we converted image to base64!
			embeddedSuccess = function (imageURL, callbackArgs) {
				++imagesEmbedded;

				// Change image href in chart copy
				callbackArgs.imageElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imageURL);

				// Start download when done with the last image
				if (imagesEmbedded === images.length) {
					initiateDownload();
				}
			};

		// Hook into getSVG to get a copy of the chart copy's container
		Highcharts.wrap(Highcharts.Chart.prototype, 'getChartHTML', function (proceed) {
			chartCopyContainer = this.container.cloneNode(true);
			return proceed.apply(this, Array.prototype.slice.call(arguments, 1));
		});

		// Trigger hook to get chart copy
		chart.getSVGForExport(options, chartOptions);
		images = chartCopyContainer.getElementsByTagName('image');

		try {
			// If there are no images to embed, just go ahead and start the download process
			if (!images.length) {
				initiateDownload();
			}

			// Go through the images we want to embed
			for (i = 0, l = images.length; i < l; ++i) {
				el = images[i];
				imageToDataUrl(el.getAttributeNS('http://www.w3.org/1999/xlink', 'href'), { imageElement: el },
					embeddedSuccess,
					// Tainted canvas
					fallbackToExportServer,
					// No canvas support 
					fallbackToExportServer,
					// Failed to load source
					fallbackToExportServer
				);
			}
		} catch (e) {
			fallbackToExportServer();
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

}));
