/**
 * @license Highcharts JS v4.2.7 (2016-09-21)
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
		doc = win.document,
		domurl = win.URL || win.webkitURL || win,
		isMSBrowser = /Edge\/|Trident\/|MSIE /.test(nav.userAgent),
		loadEventDeferDelay = isMSBrowser ? 150 : 0; // Milliseconds to defer image load event handlers to offset IE bug

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

	// Download contents by dataURL/blob
	Highcharts.downloadURL = function (dataURL, filename) {
		var a = doc.createElement('a'),
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
					throw 'Failed to open window';
				}
			} catch (e) {
				// window.open failed, trying location.href
				win.location.href = dataURL;
			}
		}
	};

	// Get blob URL from SVG code. Falls back to normal data URI.
	Highcharts.svgToDataUrl = function (svg) {
		var webKit = nav.userAgent.indexOf('WebKit') > -1 && nav.userAgent.indexOf('Chrome') < 0; // Webkit and not chrome
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
	};

	// Get data:URL from image URL
	// Pass in callbacks to handle results. finallyCallback is always called at the end of the process. Supplying this callback is optional.
	// All callbacks receive four arguments: imageURL, imageType, callbackArgs and scale. callbackArgs is used only by callbacks and can contain whatever.
	Highcharts.imageToDataUrl = function (imageURL, imageType, callbackArgs, scale, successCallback, taintedCallback, noCanvasSupportCallback, failedLoadCallback, finallyCallback) {
		var img = new win.Image(),
			taintedHandler,
			loadHandler = function () {
				setTimeout(function () {
					var canvas = doc.createElement('canvas'),
						ctx = canvas.getContext && canvas.getContext('2d'),
						dataURL;
					try {
						if (!ctx) {
							noCanvasSupportCallback(imageURL, imageType, callbackArgs, scale);
						} else {
							canvas.height = img.height * scale;
							canvas.width = img.width * scale;
							ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

							// Now we try to get the contents of the canvas.
							try {
								dataURL = canvas.toDataURL(imageType);
								successCallback(dataURL, imageType, callbackArgs, scale);
							} catch (e) {
								taintedHandler(imageURL, imageType, callbackArgs, scale);
							}
						}
					} finally {
						if (finallyCallback) {
							finallyCallback(imageURL, imageType, callbackArgs, scale);
						}
					}
				}, loadEventDeferDelay); // IE bug where image is not always ready despite calling load event.
			},
			// Image load failed (e.g. invalid URL)
			errorHandler = function () {
				failedLoadCallback(imageURL, imageType, callbackArgs, scale);
				if (finallyCallback) {
					finallyCallback(imageURL, imageType, callbackArgs, scale);
				}
			};

		// This is called on load if the image drawing to canvas failed with a security error.
		// We retry the drawing with crossOrigin set to Anonymous.
		taintedHandler = function () {
			img = new win.Image();
			taintedHandler = taintedCallback;
			img.crossOrigin = 'Anonymous'; // Must be set prior to loading image source
			img.onload = loadHandler;
			img.onerror = errorHandler;
			img.src = imageURL;
		};

		img.onload = loadHandler;
		img.onerror = errorHandler;
		img.src = imageURL;
	};

	// Get data URL to an image of an SVG and call download on it
	Highcharts.downloadSVGLocal = function (svg, filename, imageType, scale, failCallback, successCallback) {
		var svgurl,
			blob,
			objectURLRevoke = true,
			finallyHandler;

		// Initiate download depending on file type
		if (imageType === 'image/svg+xml') {
			// SVG download. In this case, we want to use Microsoft specific Blob if available
			try {
				if (nav.msSaveOrOpenBlob) {
					blob = new MSBlobBuilder();
					blob.append(svg);
					svgurl = blob.getBlob('image/svg+xml');
				} else {
					svgurl = Highcharts.svgToDataUrl(svg);
				}
				Highcharts.downloadURL(svgurl, filename);
				if (successCallback) {
					successCallback();
				}
			} catch (e) {
				failCallback();
			}
		} else {
			// PNG/JPEG download - create bitmap from SVG

			svgurl = Highcharts.svgToDataUrl(svg);
			finallyHandler = function () {
				try {
					domurl.revokeObjectURL(svgurl);
				} catch (e) {
					// Ignore
				}
			};
			// First, try to get PNG by rendering on canvas
			Highcharts.imageToDataUrl(svgurl, imageType, { /* args */ }, scale, function (imageURL) {
				// Success
				try {
					Highcharts.downloadURL(imageURL, filename);
					if (successCallback) {
						successCallback();
					}
				} catch (e) {
					failCallback();
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
							Highcharts.downloadURL(nav.msSaveOrOpenBlob ? canvas.msToBlob() : canvas.toDataURL(imageType), filename);
							if (successCallback) {
								successCallback();
							}
						} catch (e) {
							failCallback();
						} finally {
							finallyHandler();
						}
					};

				canvas.width = imageWidth;
				canvas.height = imageHeight;
				if (win.canvg) {
					// Use preloaded canvg
					downloadWithCanVG();
				} else {
					// Must load canVG first
					objectURLRevoke = true; // Don't destroy the object URL yet since we are doing things asynchronously. A cleaner solution would be nice, but this will do for now.
					getScript(Highcharts.getOptions().global.canvasToolsURL, function () {
						downloadWithCanVG();
					});
				}
			},
			// No canvas support
			failCallback,
			// Failed to load image
			failCallback,
			// Finally
			function () {
				if (objectURLRevoke) {
					finallyHandler();
				}
			});
		}
	};

	// Get SVG of chart prepared for client side export. This converts embedded images in the SVG to data URIs.
	// The options and chartOptions arguments are passed to the getSVGForExport function.
	Highcharts.Chart.prototype.getSVGForLocalExport = function (options, chartOptions, failCallback, successCallback) {
		var chart = this,
			images,
			imagesEmbedded = 0,
			chartCopyContainer,
			el,
			i,
			l,
			// Success handler, we converted image to base64!
			embeddedSuccess = function (imageURL, imageType, callbackArgs) {
				++imagesEmbedded;

				// Change image href in chart copy
				callbackArgs.imageElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imageURL);

				// When done with last image we have our SVG
				if (imagesEmbedded === images.length) {
					successCallback(chart.sanitizeSVG(chartCopyContainer.innerHTML));
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
			// If there are no images to embed, the SVG is okay now.
			if (!images.length) {
				successCallback(chart.sanitizeSVG(chartCopyContainer.innerHTML)); // Use SVG of chart copy
				return;
			}

			// Go through the images we want to embed
			for (i = 0, l = images.length; i < l; ++i) {
				el = images[i];
				Highcharts.imageToDataUrl(el.getAttributeNS('http://www.w3.org/1999/xlink', 'href'), 'image/png', { imageElement: el }, options.scale,
					embeddedSuccess,
					// Tainted canvas
					failCallback,
					// No canvas support
					failCallback,
					// Failed to load source
					failCallback
				);
			}
		} catch (e) {
			failCallback();
		}
	};

	/**
	 * Add a new method to the Chart object to perform a local download
	 */
	Highcharts.Chart.prototype.exportChartLocal = function (exportingOptions, chartOptions) {
		var chart = this,
			options = Highcharts.merge(chart.options.exporting, exportingOptions),
			imageType = options && options.type || 'image/png',
			fallbackToExportServer = function () {
				if (options.fallbackToExportServer === false) {
					if (options.error) {
						options.error();
					} else {
						throw 'Fallback to export server disabled';
					}
				} else {
					chart.exportChart(options);
				}
			},
			svgSuccess = function (svg) {
				var filename = (options.filename || 'chart') + '.' + (imageType === 'image/svg+xml' ? 'svg' : imageType.split('/')[1]);
				Highcharts.downloadSVGLocal(svg, filename, imageType, options.scale, fallbackToExportServer);
			};

		// If we have embedded images and are exporting to JPEG/PNG, Microsoft browsers won't handle it, so fall back
		if (isMSBrowser && imageType !== 'image/svg+xml' && chart.container.getElementsByTagName('image').length) {
			fallbackToExportServer();
			return;
		}

		chart.getSVGForLocalExport(options, chartOptions, fallbackToExportServer, svgSuccess);
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
		textKey: 'downloadJPEG',
		onclick: function () {
			this.exportChartLocal({
				type: 'image/jpeg'
			});
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
