/**
 * @license Highcharts JS v3.0.1 (2012-11-02)
 *
 * (c) 20013-2014
 *
 * Author: Gert Vaartjes
 *
 * License: www.highcharts.com/license
 *
 * version: 2.0.1
 */

/*jslint white: true */
/*global window, require, phantom, console, $, document, Image, Highcharts, clearTimeout, clearInterval, options, cb, globalOptions, dataOptions, customCode */


(function () {
	"use strict";

	var config = {
			/* define locations of mandatory javascript files.
			 * Depending on purchased license change the HIGHCHARTS property to 
			 * highcharts.js or highstock.js 
			 */

			files: {
				highcharts: {
					JQUERY: 'jquery.1.9.1.min.js',
					HIGHCHARTS: 'highcharts.js',
					HIGHCHARTS_MORE: 'highcharts-more.js',
					HIGHCHARTS_DATA: 'data.js',
					HIGHCHARTS_DRILLDOWN: 'drilldown.js',
					HIGHCHARTS_FUNNEL: 'funnel.js',
					HIGHCHARTS_HEATMAP: 'heatmap.js',
					HIGHCHARTS_TREEMAP: 'treemap.js',
					HIGHCHARTS_3D: 'highcharts-3d.js',
					HIGHCHARTS_NODATA: 'no-data-to-display.js',
					// Uncomment below if you have both Highcharts and Highmaps license
					// HIGHCHARTS_MAP: 'map.js',
					HIGHCHARTS_SOLID_GAUGE: 'solid-gauge.js',
					BROKEN_AXIS: 'broken-axis.js'
				},
				highstock: {
					JQUERY: 'jquery.1.9.1.min.js',
					HIGHCHARTS: 'highstock.js',
					HIGHCHARTS_MORE: 'highcharts-more.js',
					HIGHCHARTS_DATA: 'data.js',
					HIGHCHARTS_DRILLDOWN: 'drilldown.js',
					HIGHCHARTS_FUNNEL: 'funnel.js',
					HIGHCHARTS_HEATMAP: 'heatmap.js',
					HIGHCHARTS_TREEMAP: 'treemap.js',
					HIGHCHARTS_3D: 'highcharts-3d.js',
					HIGHCHARTS_NODATA: 'no-data-to-display.js',
					// Uncomment below if you have both Highstock and Highmaps license
					// HIGHCHARTS_MAP: 'map.js',
					HIGHCHARTS_SOLID_GAUGE: 'solid-gauge.js',
					BROKEN_AXIS: 'broken-axis.js'
				},
				highmaps: {
					JQUERY: 'jquery.1.9.1.min.js',
					HIGHCHARTS: 'highmaps.js',
					HIGHCHARTS_DATA: 'data.js',
					HIGHCHARTS_DRILLDOWN: 'drilldown.js',
					HIGHCHARTS_HEATMAP: 'heatmap.js',
					HIGHCHARTS_NODATA: 'no-data-to-display.js'
				}
			},
			TIMEOUT: 5000 /* 5 seconds timout for loading images */
		},
		mapCLArguments,
		render,
		startServer = false,
		args,
		pick,
		SVG_DOCTYPE = '<?xml version=\"1.0" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">',
		dpiCorrection = 1.4,
		system = require('system'),
		fs = require('fs'),
		serverMode = false;

	pick = function () {
		var args = arguments, i, arg, length = args.length;
		for (i = 0; i < length; i += 1) {
			arg = args[i];
			if (arg !== undefined && arg !== null && arg !== 'null' && arg != '0') {
				return arg;
			}
		}
	};

	mapCLArguments = function () {
		var map = {},
			i,
			key;

		if (system.args.length < 1) {
			console.log('Commandline Usage: highcharts-convert.js -infile URL -outfile filename -scale 2.5 -width 300 -constr Chart -callback callback.js');
			console.log(', or run PhantomJS as server: highcharts-convert.js -host 127.0.0.1 -port 1234');
		}

		for (i = 0; i < system.args.length; i += 1) {
			if (system.args[i].charAt(0) === '-') {
				key = system.args[i].substr(1, i.length);
				if (key === 'infile' || key === 'callback' || key === 'dataoptions' || key === 'globaloptions' || key === 'customcode') {
					// get string from file
					try {
						map[key] = fs.read(system.args[i + 1]).replace(/^\s+/, '');
					} catch (e) {
						console.log('Error: cannot find file, ' + system.args[i + 1]);
						phantom.exit();
					}
				} else {
					map[key] = system.args[i + 1];
				}
			}
		}
		return map;
	};

	render = function (params, exitCallback) {

		var page = require('webpage').create(),
			messages = {},
			scaleAndClipPage,
			loadChart,
			createChart,
			input,
			constr,
			callback,
			width,
			output,
			outType,
			timer,
			renderSVG,
			convert,
			exit,
			interval,
            counter,
            imagesLoaded = false;

		messages.optionsParsed = 'Highcharts.options.parsed';
		messages.callbackParsed = 'Highcharts.cb.parsed';
		
		window.optionsParsed = false;
		window.callbackParsed = false;
        
		page.onConsoleMessage = function (msg) {
			console.log(msg);
            
			/*
			 * Ugly hack, but only way to get messages out of the 'page.evaluate()'
			 * sandbox. If any, please contribute with improvements on this!
			 */
			
			/* to check options or callback are properly parsed */
			if (msg === messages.optionsParsed) {
				window.optionsParsed = true;
			}

			if (msg === messages.callbackParsed) {
				window.callbackParsed = true;
			}
		};

		page.onAlert = function (msg) {
			console.log(msg);
		};

		/* scale and clip the page */
		scaleAndClipPage = function (svg) {
			/*	param: svg: The scg configuration object
			*/

			var zoom = 1,
				pageWidth = pick(params.width, svg.width),
				clipwidth,
				clipheight;

			if (parseInt(pageWidth, 10) == pageWidth) {
				zoom = pageWidth / svg.width;
			}

			/* set this line when scale factor has a higher precedence
			scale has precedence : page.zoomFactor = params.scale  ? zoom * params.scale : zoom;*/

			/* params.width has a higher precedence over scaling, to not break backover compatibility */
			page.zoomFactor = params.scale && params.width == undefined ? zoom * params.scale : zoom;

			clipwidth = svg.width * page.zoomFactor;
			clipheight = svg.height * page.zoomFactor;

			/* define the clip-rectangle */
			/* ignored for PDF, see https://github.com/ariya/phantomjs/issues/10465 */
			page.clipRect = {
				top: 0,
				left: 0,
				width: clipwidth,
				height: clipheight
			};

			/* for pdf we need a bit more paperspace in some cases for example (w:600,h:400), I don't know why.*/
			if (outType === 'pdf') {
				// changed to a multiplication with 1.333 to correct systems dpi setting
				clipwidth = clipwidth * dpiCorrection;
				clipheight = clipheight * dpiCorrection;
				// redefine the viewport
				page.viewportSize = { width: clipwidth, height: clipheight};
				// make the paper a bit larger than the viewport
				page.paperSize = { width: clipwidth + 2 , height: clipheight + 2 };
			}
		};

		exit = function (result) {
			if (serverMode) {
				//Calling page.close(), may stop the increasing heap allocation
				page.close();
			}
			exitCallback(result);
		};

		convert = function (svg) {
			var base64;
			scaleAndClipPage(svg);
			if (outType === 'pdf' || output !== undefined || !serverMode) {
				if (output === undefined) {
					// in case of pdf files
					output = config.tmpDir + '/chart.' + outType;
				}
				page.render(output);
				exit(output);
			} else {
				base64 = page.renderBase64(outType);
				exit(base64);
			}
		};
        
        function decrementImgCounter() {
            counter -= 1;
            if (counter < 1) {
                imagesLoaded = true;
            }
        }
        
        function loadImages(imgUrls) {
            var i, img;
            counter = imgUrls.length;
            for (i = 0; i < imgUrls.length; i += 1) {                    
                img = new Image();                    
                /* onload decrements the counter, also when error (perhaps 404), don't wait for this image to be loaded */
                img.onload = img.onerror = decrementImgCounter;                    
                /* force loading of images by setting the src attr.*/                    
                img.src = imgUrls[i];
            }
        }
        
		renderSVG = function (svg) {
			var svgFile;
			// From this point we have 'loaded' or 'created' a SVG
            
            // Do we have to load images?
            if (svg.imgUrls.length > 0) {
                loadImages(svg.imgUrls);
            } else  {
                 // no images present, no loading, no waiting
                imagesLoaded = true;
            }
            
			try {
				if (outType.toLowerCase() === 'svg') {
					// output svg
					svg = svg.html.replace(/<svg /, '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ').replace(/ href=/g, ' xlink:href=').replace(/<\/svg>.*?$/, '</svg>');
					// add xml doc type
					svg = SVG_DOCTYPE + svg;

					if (output !== undefined) {
						// write the file
						svgFile = fs.open(output, "w");
						svgFile.write(svg);
						svgFile.close();
						exit(output);
					} else {
						// return the svg as a string
						exit(svg);
					}

				} else {
					// output binary images or pdf
					if (!imagesLoaded) {
						// render with interval, waiting for all images loaded
						interval = window.setInterval(function () {
							if (imagesLoaded) {
								clearTimeout(timer);
								clearInterval(interval);
								convert(svg);
							}
						}, 50);

						// we have a 5 second timeframe..
						timer = window.setTimeout(function () {
							clearInterval(interval);
							exitCallback('ERROR: While rendering, there\'s is a timeout reached');
						}, config.TIMEOUT);
					} else {
						// images are loaded, render rightaway
						convert(svg);
					}
				}
			} catch (e) {
				console.log('ERROR: While rendering, ' + e);
			}
		};

		loadChart = function (input, outputType) {
			var nodeIter, nodes, elem, opacity, svgElem, imgs, imgUrls, imgIndex;

			document.body.style.margin = '0px';
			document.body.innerHTML = input;

			if (outputType === 'jpeg') {
				document.body.style.backgroundColor = 'white';
			}
            
			nodes = document.querySelectorAll('*[stroke-opacity]');

			for (nodeIter = 0; nodeIter < nodes.length; nodeIter += 1) {
				elem = nodes[nodeIter];
				opacity = elem.getAttribute('stroke-opacity');
				elem.removeAttribute('stroke-opacity');
				elem.setAttribute('opacity', opacity);
			}

			svgElem = document.getElementsByTagName('svg')[0];
            
            imgs = document.getElementsByTagName('image');
            imgUrls = [];
            
            for (imgIndex = 0; imgIndex < imgs.length; imgIndex = imgIndex + 1) {
                imgUrls.push(imgs[imgIndex].href.baseVal);
            }           
			
			return {
			    html: document.body.innerHTML,
			    width: svgElem.getAttribute("width"),
			    height: svgElem.getAttribute("height"),
                imgUrls: imgUrls
			};
		};

		createChart = function (constr, input, globalOptionsArg, dataOptionsArg, customCodeArg, outputType, callback, messages) {

			var $container, chart, nodes, nodeIter, elem, opacity, imgIndex, imgs, imgUrls;

            // dynamic script insertion
			function loadScript(varStr, codeStr) {
				var $script = $('<script>').attr('type', 'text/javascript');
				$script.html('var ' + varStr + ' = ' + codeStr);
				document.getElementsByTagName("head")[0].appendChild($script[0]);
				if (window[varStr] !== undefined) {
					console.log('Highcharts.' + varStr + '.parsed');
				}
			}

			function parseData(completeHandler, chartOptions, dataConfig) {
				try {
					dataConfig.complete = completeHandler;
					Highcharts.data(dataConfig, chartOptions);
				} catch (error) {
					completeHandler(undefined);
				}
			}

			if (input !== 'undefined') {
				loadScript('options', input);
			}

			if (callback !== 'undefined') {
				loadScript('cb', callback);
			}

			if (globalOptionsArg !== 'undefined') {
				loadScript('globalOptions', globalOptionsArg);
			}

			if (dataOptionsArg !== 'undefined') {
				loadScript('dataOptions', dataOptionsArg);
			}

			if (customCodeArg !== 'undefined') {
				loadScript('customCode', customCodeArg);
			}

			$(document.body).css('margin', '0px');

			if (outputType === 'jpeg') {
				$(document.body).css('backgroundColor', 'white');
			}

			$container = $('<div>').appendTo(document.body);
			$container.attr('id', 'container');

			// disable animations
			Highcharts.SVGRenderer.prototype.Element.prototype.animate = Highcharts.SVGRenderer.prototype.Element.prototype.attr;
			Highcharts.setOptions({ 
				plotOptions: {
					series: {
						animation: false
					}
				}
			});

			if (!options.chart) {
				options.chart = {};
			}

			options.chart.renderTo = $container[0];

			// check if witdh is set. Order of precedence:
			// args.width, options.chart.width and 600px

			// OLD. options.chart.width = width || options.chart.width || 600;
			// Notice we don't use commandline parameter width here. Commandline parameter width is used for scaling.

			options.chart.width = (options.exporting && options.exporting.sourceWidth) || options.chart.width || 600;
			options.chart.height = (options.exporting && options.exporting.sourceHeight) || options.chart.height || 400;

			// Load globalOptions
			if (globalOptions) {
				Highcharts.setOptions(globalOptions);
			}

			// Load data
			if (dataOptions) {
				parseData(function completeHandler(opts) {
					// Merge series configs
					if (options.series) {
						Highcharts.each(options.series, function (series, i) {
							options.series[i] = Highcharts.merge(series, opts.series[i]);
						});
					}

					var mergedOptions = Highcharts.merge(opts, options);

					// Run customCode
					if (customCode) {
						customCode(mergedOptions);
					}

					chart = new Highcharts[constr](mergedOptions, cb);

				}, options, dataOptions);
			} else {
				chart = new Highcharts[constr](options, cb);				
			}

			/* remove stroke-opacity paths, used by mouse-trackers, they turn up as
			*  as fully opaque in the PDF
			*/
			nodes = document.querySelectorAll('*[stroke-opacity]');

			for (nodeIter = 0; nodeIter < nodes.length; nodeIter += 1) {
				elem = nodes[nodeIter];
				opacity = elem.getAttribute('stroke-opacity');
				elem.removeAttribute('stroke-opacity');
				elem.setAttribute('opacity', opacity);
			}
            
            imgs = document.getElementsByTagName('image');
            imgUrls = [];
            
            for (imgIndex = 0; imgIndex < imgs.length; imgIndex = imgIndex + 1) {
                imgUrls.push(imgs[imgIndex].href.baseVal);
            }
            
			return {				
				html: $('div.highcharts-container')[0].innerHTML,
				width: chart.chartWidth,
				height: chart.chartHeight,
                imgUrls: imgUrls
			};
		};

		if (params.length < 1) {
			exit("Error: Insufficient parameters");
		} else {
			input = params.infile;
			output = params.outfile;

			if (output !== undefined) {
				outType = pick(output.split('.').pop(),'png');
			} else {
				outType = pick(params.type,'png');
			}

			constr = pick(params.constr, 'Chart');
			callback = params.callback;
			width = params.width;

			if (input === undefined || input.length === 0) {
				exit('Error: Insuficient or wrong parameters for rendering');
			}

			page.open('about:blank', function (status) {
				var svg,
					globalOptions = params.globaloptions,
					dataOptions = params.dataoptions,
					customCode = 'function customCode(options) {\n' + params.customcode + '}\n',
					jsFile,
					jsFiles;

				/* Decide if we have to generate a svg first before rendering */
				if (input.substring(0, 4).toLowerCase() === "<svg" || input.substring(0, 5).toLowerCase() === "<?xml"
					|| input.substring(0, 9).toLowerCase() === "<!doctype") {
					//render page directly from svg file
					svg = page.evaluate(loadChart, input, outType);
					page.viewportSize = { width: svg.width, height: svg.height };
					renderSVG(svg);
				} else {
					/**
					 * We have a js file, let's render serverside from Highcharts options and grab the svg from it
					 */

					 // load our javascript dependencies based on the constructor
					 if (constr === 'Map') {
						 jsFiles = config.files.highmaps;
					 } else if (constr === 'StockChart')
					    jsFiles = config.files.highstock;
					 else {
						jsFiles = config.files.highcharts;
					}

					// load necessary libraries
					for (jsFile in jsFiles) {
						if (jsFiles.hasOwnProperty(jsFile)) {
							page.injectJs(jsFiles[jsFile]);
						}
					}

					// load chart in page and return svg height and width
					svg = page.evaluate(createChart, constr, input, globalOptions, dataOptions, customCode, outType, callback, messages);

					if (!window.optionsParsed) {
						exit('ERROR: the options variable was not available or couldn\'t be parsed, does the infile contain an syntax error? Input used:' + input);
					}

					if (callback !== undefined && !window.callbackParsed) {
						exit('ERROR: the callback variable was not available, does the callback contain an syntax error? Callback used: ' + callback);
					}
					renderSVG(svg);
				}
			});
		}
	};

	startServer = function (host, port) {
		var server = require('webserver').create();

		server.listen(host + ':' + port,
			function (request, response) {
				var jsonStr = request.postRaw || request.post,
					params,
					msg;
				try {
					params = JSON.parse(jsonStr);
					if (params.status) {
						// for server health validation
						response.statusCode = 200;
						response.write('OK');
						response.close();
					} else {
						render(params, function (result) {
							response.statusCode = 200;
							response.write(result);
							response.close();
						});
					}
				} catch (e) {
					msg = "Failed rendering: \n" + e;
					response.statusCode = 500;
					response.setHeader('Content-Type', 'text/plain');
					response.setHeader('Content-Length', msg.length);
					response.write(msg);
					response.close();
				}
			}); // end server.listen

		// switch to serverMode
		serverMode = true;

		console.log("OK, PhantomJS is ready.");
	};

	args = mapCLArguments();

	// set tmpDir, for output temporary files.
	if (args.tmpdir === undefined) {
		config.tmpDir = fs.workingDirectory + '/tmp';
	} else {
		config.tmpDir = args.tmpdir;
	}

	// exists tmpDir and is it writable?
	if (!fs.exists(config.tmpDir)) {
		try{
			fs.makeDirectory(config.tmpDir);
		} catch (e) {
			console.log('ERROR: Cannot create temp directory for ' + config.tmpDir);
		}
	}


	if (args.host !== undefined && args.port !== undefined) {
		startServer(args.host, args.port);
	} else {
		// presume commandline usage
		render(args, function (msg) {
			console.log(msg);
			phantom.exit();
		});
	}
}());
