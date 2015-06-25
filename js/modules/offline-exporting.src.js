/**
 * @license @product.name@ JS v@product.version@ (@product.date@)
 * Client side exporting module
 *
 * (c) 2015 Torstein Hønsi / Øystein Moseng
 *
 * License: www.highcharts.com/license
 */

// JSLint options:
/*global Highcharts, HighchartsAdapter, document, window, Blob, MSBlobBuilder */

(function (Highcharts) {

// Dummy object so we can reuse our canvas-tools.js without errors
// Is this needed now?
Highcharts.CanVGRenderer = {};

/**
 * Add a new method to the Chart object to perform a local download
 */
Highcharts.Chart.prototype.exportChartLocal = function (exportingOptions, chartOptions) {
	var chart = this,
		options = Highcharts.merge(chart.options.exporting, exportingOptions),
		webKit = navigator.userAgent.indexOf('WebKit') > -1 && navigator.userAgent.indexOf("Chrome") < 0, // Webkit and not chrome
		scale = options.scale || 2,
		chartCopyContainer,
		domurl = window.URL || window.webkitURL || window,
		images,
		imagesEmbedded = 0,
		el,
		i,
		l,
		fallbackToExportServer = function () {
			alert("Fallback to export server")
			if (options.fallbackToExportServer === false) {
				throw 'Fallback to export server disabled';
			}
			chart.exportChart(options);
		},
		// Get data:URL from image URL
		// Pass in callbacks to handle results. finallyCallback is always called at the end of the process. Supplying this callback is optional.
		// All callbacks receive two arguments: imageURL, and callbackArgs. callbackArgs is used only by callbacks and can contain whatever.
		imageToDataUrl = function (imageURL, callbackArgs, successCallback, taintedCallback, noCanvasSupportCallback, failedLoadCallback, finallyCallback) {
			var img = new Image();
			console.log("Rendering data URL to canvas")
			if (!webKit) {
				img.crossOrigin = 'Anonymous'; // For some reason Safari chokes on this attribute
			}
			img.onload = function () {
				var canvas = document.createElement('canvas'),
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
						console.log("DataURL", dataURL)
						successCallback(dataURL, callbackArgs);
					} catch (e) {
						if (e.name === 'SecurityError' || e.name === 'SECURITY_ERR' || e.message === 'SecurityError') {
							taintedCallback(imageURL, callbackArgs);
						} else {
							console.log(e);
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
				console.log("Creating Blob from SVG")
				// Safari requires data URI since it doesn't allow navigation to blob URLs
				if (!webKit) {
					return domurl.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset-utf-16'}));
				}
			} catch (e) {
				// Ignore
			}
			console.log("Blob creation failed, using Data URI")
			return ('data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg));
		},
		// Download contents by dataURL/blob
		download = function (dataURL, extension) {
			var a = document.createElement('a'),
				filename = (options.filename || 'chart') + '.' + extension,
				windowRef;

			// IE specific blob implementation
			if (navigator.msSaveOrOpenBlob) {
				console.log("Download using msSaveOrOpenBlob")
				navigator.msSaveOrOpenBlob(dataURL, filename);
				return;
			}

			if (typeof a.download !== 'undefined') {
				console.log("Downloading using <a>.download")
				a.href = dataURL;
				a.download = filename; // HTML5 download attribute
				a.target = '_blank';
				document.body.appendChild(a);						
				a.click();
				document.body.removeChild(a);
			} else {
				console.log("No download attribute, just opening data URL")
				console.log("Trying window.open")
				windowRef = window.open(dataURL, 'chart');
				if (typeof windowRef === 'undefined' || windowRef === null) {
					console.log("Failed, going for window.location.href")
					window.location.href = dataURL;
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
				if (navigator.msSaveOrOpenBlob) {
					console.log('Creating MSBlob from SVG')
					blob = new MSBlobBuilder();
					blob.append(svg);
					svgurl = blob.getBlob('image/svg+xml');
				} else {
					svgurl = svgToDataUrl(svg);
				}
				download(svgurl, 'svg');
			} else {
				// PNG download - create bitmap from SVG

				// Try to get PNG by rendering on canvas
				svgurl = svgToDataUrl(svg);
				imageToDataUrl(svgurl, { /* args */ }, function (imageURL) {
					// Success
					console.log('PNG creation succeeded')
					download(imageURL, 'png');
				
				}, function () {
					// Failed due to tainted canvas
					// Create new and untainted canvas
					var canvas = document.createElement('canvas'),
						ctx = canvas.getContext('2d'),
						imageWidth = svg.match(/^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/)[1] * scale,
						imageHeight = svg.match(/^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/)[1] * scale,
						downloadWithCanVG = function () {
							ctx.drawSvg(svg, 0, 0, imageWidth, imageHeight);
							try {
								download(navigator.msSaveOrOpenBlob ? canvas.msToBlob() : canvas.toDataURL('image/png'), 'png');
							} catch (e) {
								console.log('An error occurred:', e)
								fallbackToExportServer();
							}
						};

					canvas.width = imageWidth;
					canvas.height = imageHeight;

					if (window.canvg) {
						console.log("Using preloaded canvg")
						downloadWithCanVG();
					} else {
						// Must load canVG first
						console.log("Loading canVG")
						chart.showLoading();
						HighchartsAdapter.getScript(Highcharts.getOptions().global.canvasToolsURL, function () {
							chart.hideLoading();
							downloadWithCanVG();
						});
					}

				}, function () {
					// No canvas support
					console.log('No canvas support')
					fallbackToExportServer();

				}, function () {
					// Failed to load image
					console.log('Failed to load image')
					fallbackToExportServer();

				}, function () {
					// Finally
					try {
						domurl.revokeObjectURL(svgurl);
					} catch (e) {
						// Ignore
					}
				});
			}
		};

	console.log("WebKit:", webKit);

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

		// Success handler, we converted image to base64!
		function embeddedSuccess(imageURL, callbackArgs) {		
			console.log('Image embedded');
			++imagesEmbedded;

			// Change image href in chart copy
			callbackArgs.imageElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imageURL);

			// Start download when done with the last image
			if (imagesEmbedded === images.length) {
				initiateDownload();
			}
		}

		// Go through the images we want to embed
		for (i = 0, l = images.length; i < l; ++i) {
			console.log('Embedding image as base64')
			el = images[i];
			imageToDataUrl(el.getAttributeNS('http://www.w3.org/1999/xlink', 'href'), { imageElement: el },
				embeddedSuccess,
				function () { console.log('Tainted canvas'); fallbackToExportServer(); }, 
				function () { console.log('No canvas support'); fallbackToExportServer(); }, 
				function () { console.log('Failed to load source'); fallbackToExportServer(); }
			);
		}
	} catch (e) {
		console.log("An error occurred:", e)
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

}(Highcharts));
