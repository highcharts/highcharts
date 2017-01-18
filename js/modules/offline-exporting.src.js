/**
 * Client side exporting module
 *
 * (c) 2015 Torstein Honsi / Oystein Moseng
 *
 * License: www.highcharts.com/license
 */

'use strict';
import Highcharts from '../parts/Globals.js';
import '../parts/Chart.js';
import '../parts/Options.js';
/*global MSBlobBuilder */

var merge = Highcharts.merge,
	win = Highcharts.win,
	nav = win.navigator,
	doc = win.document,
	each = Highcharts.each,
	domurl = win.URL || win.webkitURL || win,
	isMSBrowser = /Edge\/|Trident\/|MSIE /.test(nav.userAgent),
	isEdgeBrowser = /Edge\/\d+/.test(nav.userAgent),
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
	script.onerror = function () {
		console.error('Error loading script', scriptLocation); // eslint-disable-line no-console
	};

	head.appendChild(script);
}

// Convert dataURL to Blob if supported, otherwise returns undefined
Highcharts.dataURLtoBlob = function (dataURL) {
	if (
		win.atob && 
		win.ArrayBuffer && 
		win.Uint8Array && 
		win.Blob && 
		domurl.createObjectURL
	) {
		// Try to convert data URL to Blob
		var parts = dataURL.match(/data:([^;]*)(;base64)?,([0-9A-Za-z+/]+)/),
			binStr = win.atob(parts[3]), // Assume base64 encoding
			buf = new win.ArrayBuffer(binStr.length),
			binary = new win.Uint8Array(buf),
			blob;

		for (var i = 0; i < binary.length; ++i) {
			binary[i] = binStr.charCodeAt(i);
		}

		blob = new win.Blob([binary], { 'type': parts[1] });
		return domurl.createObjectURL(blob);
	}
};

// Download contents by dataURL/blob
Highcharts.downloadURL = function (dataURL, filename) {
	var a = doc.createElement('a'),
		windowRef;

	// IE specific blob implementation
	if (nav.msSaveOrOpenBlob) {
		nav.msSaveOrOpenBlob(dataURL, filename);
		return;
	}

	// Some browsers have limitations for data URL lengths. Try to convert to
	// Blob or fall back.
	if (dataURL.length > 2000000) {
		dataURL = Highcharts.dataURLtoBlob(dataURL);
		if (!dataURL) {
			throw 'Data URL length limit reached';
		}
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

/**
 * Get data URL to an image of an SVG and call download on it
 *
 * options object:
 *		filename: Name of resulting downloaded file without extension
 *		type: File type of resulting download
 *		scale: Scaling factor of downloaded image compared to source
 *      libURL: URL pointing to location of dependency scripts to download on demand
 */
Highcharts.downloadSVGLocal = function (svg, options, failCallback, successCallback) {
	var svgurl,
		blob,
		objectURLRevoke = true,
		finallyHandler,
		libURL = options.libURL || Highcharts.getOptions().exporting.libURL,
		dummySVGContainer = doc.createElement('div'),
		imageType = options.type || 'image/png',
		filename = (options.filename || 'chart') + '.' + (imageType === 'image/svg+xml' ? 'svg' : imageType.split('/')[1]),
		scale = options.scale || 1;

	libURL = libURL.slice(-1) !== '/' ? libURL + '/' : libURL; // Allow libURL to end with or without fordward slash

	function svgToPdf(svgElement, margin) {
		var width = svgElement.width.baseVal.value + 2 * margin,
			height = svgElement.height.baseVal.value + 2 * margin,
			pdf = new win.jsPDF('l', 'pt', [width, height]);	// eslint-disable-line new-cap

		win.svg2pdf(svgElement, pdf, { removeInvalid: true });
		return pdf.output('datauristring');
	}

	function downloadPDF() {
		dummySVGContainer.innerHTML = svg;
		var textElements = dummySVGContainer.getElementsByTagName('text'),
			titleElements,
			svgData,
			svgElementStyle = dummySVGContainer.getElementsByTagName('svg')[0].style;
		// Workaround for the text styling. Making sure it does pick up the root element
		each(textElements, function (el) {
			// Workaround for the text styling. making sure it does pick up the root element
			each(['font-family', 'font-size'], function (property) {
				if (!el.style[property] && svgElementStyle[property]) {
					el.style[property] = svgElementStyle[property];
				}
			});
			el.style['font-family'] = el.style['font-family'] && el.style['font-family'].split(' ').splice(-1);
			// Workaround for plotband with width, removing title from text nodes
			titleElements = el.getElementsByTagName('title');
			each(titleElements, function (titleElement) {
				el.removeChild(titleElement);
			});
		});
		svgData = svgToPdf(dummySVGContainer.firstChild, 0);
		try {
			Highcharts.downloadURL(svgData, filename);
			if (successCallback) {
				successCallback();
			}
		} catch (e) {
			failCallback();
		}
	}

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
	} else if (imageType === 'application/pdf') {
		if (win.jsPDF && win.svg2pdf) {
			downloadPDF();
		} else {
			// Must load pdf libraries first
			objectURLRevoke = true; // Don't destroy the object URL yet since we are doing things asynchronously. A cleaner solution would be nice, but this will do for now.
			getScript(libURL + 'jspdf.js', function () {
				getScript(libURL + 'svg2pdf.js', function () {
					downloadPDF();
				});
			});
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
				getScript(libURL + 'rgbcolor.js', function () { // Get RGBColor.js first
					getScript(libURL + 'canvg.js', function () {
						downloadWithCanVG();
					});
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
		chartCopyOptions,
		el,
		i,
		l,
		// After grabbing the SVG of the chart's copy container we need to do sanitation on the SVG
		sanitize = function (svg) {
			return chart.sanitizeSVG(svg, chartCopyOptions);
		},
		// Success handler, we converted image to base64!
		embeddedSuccess = function (imageURL, imageType, callbackArgs) {
			++imagesEmbedded;

			// Change image href in chart copy
			callbackArgs.imageElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imageURL);

			// When done with last image we have our SVG
			if (imagesEmbedded === images.length) {
				successCallback(sanitize(chartCopyContainer.innerHTML));
			}
		};

	// Hook into getSVG to get a copy of the chart copy's container
	Highcharts.wrap(
		Highcharts.Chart.prototype,
		'getChartHTML',
		function (proceed) {
			var ret = proceed.apply(
				this,
				Array.prototype.slice.call(arguments, 1)
			);
			chartCopyOptions = this.options;
			chartCopyContainer = this.container.cloneNode(true);
			return ret;
		}
	);

	// Trigger hook to get chart copy
	chart.getSVGForExport(options, chartOptions);
	images = chartCopyContainer.getElementsByTagName('image');

	try {
		// If there are no images to embed, the SVG is okay now.
		if (!images.length) {
			successCallback(sanitize(chartCopyContainer.innerHTML)); // Use SVG of chart copy
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
		fallbackToExportServer = function () {
			if (options.fallbackToExportServer === false) {
				if (options.error) {
					options.error(options);
				} else {
					throw 'Fallback to export server disabled';
				}
			} else {
				chart.exportChart(options);
			}
		},
		svgSuccess = function (svg) {
			// If SVG contains foreignObjects all exports except SVG will fail,
			// as both CanVG and svg2pdf choke on this. Gracefully fall back.
			if (
				svg.indexOf('<foreignObject') > -1 && 
				options.type !== 'image/svg+xml'
			) {
				fallbackToExportServer();
			} else {
				Highcharts.downloadSVGLocal(svg, options, fallbackToExportServer);
			}
		};

	// Always fall back on:
	// - MS browsers: Embedded images JPEG/PNG, or any PDF
	// - Edge: PNG/JPEG all cases
	// - Embedded images and PDF
	if (
		(
			isMSBrowser &&
			(
				options.type === 'application/pdf' ||
				chart.container.getElementsByTagName('image').length &&
				options.type !== 'image/svg+xml'
			)
		) || (
			isEdgeBrowser && options.type !== 'image/svg+xml'
		) || (
			options.type === 'application/pdf' &&
			chart.container.getElementsByTagName('image').length
		)
	) {
		fallbackToExportServer();
		return;
	}

	chart.getSVGForLocalExport(options, chartOptions, fallbackToExportServer, svgSuccess);
};

// Extend the default options to use the local exporter logic
merge(true, Highcharts.getOptions().exporting, {
	libURL: 'https://code.highcharts.com/@product.version@/lib/',
	buttons: {
		contextButton: {
			menuItems: [{
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
			}, {
				textKey: 'downloadPDF',
				onclick: function () {
					this.exportChartLocal({
						type: 'application/pdf'
					});
				}
			}]
		}
	}
});
