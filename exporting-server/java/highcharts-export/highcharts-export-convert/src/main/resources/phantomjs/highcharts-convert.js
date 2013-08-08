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
/*global window, require, phantom, console, $, document, Image, Highcharts, clearTimeout, clearInterval, options, cb */


(function () {
	"use strict";

	var config = {
			/* define locations of mandatory javascript files */
			HIGHCHARTS: 'highstock.js',
			HIGHCHARTS_MORE: 'highcharts-more.js',
			HIGHCHARTS_DATA: 'data.js',
			JQUERY: 'jquery.1.9.1.min.js',
			TIMEOUT: 2000 /* 2 seconds timout for loading images */
		},
		mapCLArguments,
		render,
		startServer = false,
		args,
		pick,
		SVG_DOCTYPE = '<?xml version=\"1.0" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">',
		dpiCorrection = 1.4,
		system = require('system'),
		fs = require('fs');

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
						map[key] = fs.read(system.args[i + 1]);
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

	render = function (params, runsAsServer, exitCallback) {

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
			outputExtension,
			svgInput,
			svg,
			svgFile,
			timer,
			renderSVG,
			convert,
			exit,
			interval;

		messages.imagesLoaded = 'Highcharts.images.loaded';
		messages.optionsParsed = 'Highcharts.options.parsed';
		messages.callbackParsed = 'Highcharts.cb.parsed';
		window.imagesLoaded = false;
		window.optionsParsed = false;
		window.callbackParsed = false;

		page.onConsoleMessage = function (msg) {
			//console.log(msg);

			/*
			 * Ugly hack, but only way to get messages out of the 'page.evaluate()'
			 * sandbox. If any, please contribute with improvements on this!
			 */

			if (msg === messages.imagesLoaded) {
				window.imagesLoaded = true;
			}
			/* more ugly hacks, to check options or callback are properly parsed */
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
			if (outputExtension === 'pdf') {
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
			if (runsAsServer) {
				//Calling page.close(), may stop the increasing heap allocation
				page.close();
			}
			exitCallback(result);
		};

		convert = function (svg) {
			var base64;
			scaleAndClipPage(svg);
			if (outputExtension === 'pdf' || !runsAsServer) {
				page.render(output);
				exit(output);
			} else {
				base64 = page.renderBase64(outputExtension);
				exit(base64);
			}
		};

		renderSVG = function (svg) {
			// From this point we have loaded/or created a SVG
			try {
				if (outputExtension.toLowerCase() === 'svg') {
					// output svg
					svg = svg.html.replace(/<svg /, '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ').replace(/ href=/g, ' xlink:href=').replace(/<\/svg>.*?$/, '</svg>');
					// add xml doc type
					svg = SVG_DOCTYPE + svg;

					if (!runsAsServer) {
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
					if (!window.imagesLoaded) {
						// render with interval, waiting for all images loaded
						interval = window.setInterval(function () {
							console.log('waiting');
							if (window.imagesLoaded) {
								clearTimeout(timer);
								clearInterval(interval);
								convert(svg);
							}
						}, 50);

						// we have a 3 second timeframe..
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

		loadChart = function (input, outputFormat, messages) {
			var nodeIter, nodes, elem, opacity, counter, svgElem;

			document.body.style.margin = '0px';
			document.body.innerHTML = input;

			function loadingImage() {
				console.log('Loading image ' + counter);
				counter -= 1;
				if (counter < 1) {
					console.log(messages.imagesLoaded);
				}
			}

			function loadImages() {
				var images = document.getElementsByTagName('image'), i, img;

				if (images.length > 0) {

					counter = images.length;

					for (i = 0; i < images.length; i += 1) {
						img = new Image();
						img.onload = loadingImage;
						/* force loading of images by setting the src attr.*/
						img.src = images[i].href.baseVal;
					}
				} else {
					// no images set property to:imagesLoaded = true
					console.log(messages.imagesLoaded);
				}
			}

			if (outputFormat === 'jpeg') {
				document.body.style.backgroundColor = 'white';
			}


			nodes = document.querySelectorAll('*[stroke-opacity]');

			for (nodeIter = 0; nodeIter < nodes.length; nodeIter += 1) {
				elem = nodes[nodeIter];
				opacity = elem.getAttribute('stroke-opacity');
				elem.removeAttribute('stroke-opacity');
				elem.setAttribute('opacity', opacity);
			}

			// ensure all image are loaded
			loadImages();

			svgElem = document.getElementsByTagName('svg')[0];

			return {
			    html: document.body.innerHTML,
			    width: svgElem.getAttribute("width"),
			    height: svgElem.getAttribute("height")
			};
		};

		createChart = function (width, constr, input, globalOptionsArg, dataOptionsArg, customCodeArg, outputFormat, callback, messages) {

			var $container, chart, nodes, nodeIter, elem, opacity, counter;

			// dynamic script insertion
			function loadScript(varStr, codeStr) {
				var $script = $('<script>').attr('type', 'text/javascript');
				$script.html('var ' + varStr + ' = ' + codeStr);
				document.getElementsByTagName("head")[0].appendChild($script[0]);
				if (window[varStr] !== undefined) {
					console.log('Highcharts.' + varStr + '.parsed');
				}
			}

			// are all images loaded in time?
			function loadingImage() {
				console.log('loading image ' + counter);
				counter -= 1;
				if (counter < 1) {
					console.log(messages.imagesLoaded);
				}
			}

			function loadImages() {
				// are images loaded?
				var $images = $('svg image'), i, img;

				if ($images.length > 0) {

					counter = $images.length;

					for (i = 0; i < $images.length; i += 1) {
						img = new Image();
						img.onload = loadingImage;
						/* force loading of images by setting the src attr.*/
						img.src = $images[i].getAttribute('href');
					}
				} else {
					// no images set property to all images
					// loaded
					console.log(messages.imagesLoaded);
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

			if (outputFormat === 'jpeg') {
				$(document.body).css('backgroundColor', 'white');
			}

			$container = $('<div>').appendTo(document.body);
			$container.attr('id', 'container');



			// disable animations
			Highcharts.SVGRenderer.prototype.Element.prototype.animate = Highcharts.SVGRenderer.prototype.Element.prototype.attr;

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

					// ensure images are all loaded
					loadImages();
				}, options, dataOptions);
			} else {
				chart = new Highcharts[constr](options, cb);

				// ensure images are all loaded
				loadImages();
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

			return {
				//html: $container[0].firstChild.innerHTML,
				html: $('div.highcharts-container')[0].innerHTML,
				width: chart.chartWidth,
				height: chart.chartHeight
			};
		};

		if (params.length < 1) {
			// TODO: log when using as server
			exit("Error: Insuficient parameters");
		} else {
			input = params.infile;
			output = pick(params.outfile, "chart.png");
			constr = pick(params.constr, 'Chart');
			callback = params.callback;
			width = params.width;

			if (input === undefined || input.lenght === 0) {
				exit('Error: Insuficient or wrong parameters for rendering');
			}

			outputExtension = output.split('.').pop();

			/* Decide if we have to generate a svg first before rendering */
			svgInput = input.substring(0, 4).toLowerCase() === "<svg" ? true : false;

			page.open('about:blank', function (status) {
				var svg,
					globalOptions = params.globaloptions,
					dataOptions = params.dataoptions,
					customCode = 'function customCode(options) {\n' + params.customcode + '}\n';


				if (svgInput) {
					//render page directly from svg file
					svg = page.evaluate(loadChart, input, outputExtension, messages);
					page.viewportSize = { width: svg.width, height: svg.height };
					renderSVG(svg);
				} else {
					// We have a js file, let highcharts create the chart first and grab the svg

					// load necessary libraries
					page.injectJs(config.JQUERY);
					page.injectJs(config.HIGHCHARTS);
					page.injectJs(config.HIGHCHARTS_MORE);
					page.injectJs(config.HIGHCHARTS_DATA);

					// load chart in page and return svg height and width
					svg = page.evaluate(createChart, width, constr, input, globalOptions, dataOptions, customCode, outputExtension, callback, messages);

					if (!window.optionsParsed) {
						exit('ERROR: the options variable was not available, contains the infile an syntax error? see' + input);
					}

					if (callback !== undefined && !window.callbackParsed) {
						exit('ERROR: the callback variable was not available, contains the callbackfile an syntax error? see' + callback);
					}
					renderSVG(svg);
				}
			});
		}
	};

	startServer = function (host, port) {
		var server = require('webserver').create(),
			service = server.listen(host + ':' + port,
				function (request, response) {
					var jsonStr = request.post,
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
							render(params, true, function (result) {
								// TODO: set response headers?
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
				});

		console.log("OK, PhantomJS is ready.");
	};

	args = mapCLArguments();

	if (args.port !== undefined) {
		startServer(args.host, args.port);
	} else {
		// presume commandline usage
		render(args, false, function (msg) {
			console.log(msg);
			phantom.exit();
		});
	}
}());
