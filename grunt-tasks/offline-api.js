/*global grunt*/
/*jslint node: true, white: true */

(function () {
	"use strict";	
	module.exports = function (grunt) {

		var request = require('request'),
			fs = require('fs'),
			domain = 'http://api.highcharts.com',
			apiUrl = domain + '/',
			outputPattern = './build/dist/PRODUCT/api',
			output,
			downloadCount = 0;

		function downloadFile(url, filename, callback) {

			var r = request(url, function(error) {
				if (error) {
					grunt.log.writeln('Oops, failed loading ' + url);
				}
			}),
			ws = fs.createWriteStream(filename);
			r.pipe(ws);
			r.on('end', callback);
			r.on('error', function () {
				grunt.log.writeln('Oops, failed appending to file ' + filename);
			});
		}

		/**
		 * Function for downloading options and objects as JSON and saving it as a javascript array
		 */
		function downloadJSON(product, filename) {
			var types = ['option','object'],
				url;

			function appendToFile(type, filename) {
				return function(error, response, json) {
					var js;
					if (!error && response.statusCode === 200) {
						js = 'offline.' + product + '.' + type + ' = ' + json + ';\n';
						fs.appendFile(filename, js, function (err) {
							if (err) {
								console.log('ERROR in appendToFile: ' + err);
							} else {
								console.log('Done writing ' + type + ' JSON to file');
								downloadCount = downloadCount -1;
							}
						});
					}
				};
			}

			if (arguments.length === 0) {
				grunt.log.writeln(this.name + ", please specify a highcharts product as argument");
			} else {
				types.forEach(function(type) {
					// insert this before the resturned json; var offline.highcharts.[option/object]
					url = apiUrl + product + '/' + type + '/dump.json';
					console.log('requesting: ' + url);
					downloadCount = downloadCount +1;
					request(url, appendToFile(type, filename));
				});
			}
		}

		/* 
		 * This task detect page assets and download them and saves them to a folder. 
		 * Also rewrites links in the html file to point them to the offline files.
		 * Call this taks like this: $> grunt downloadAPI:highcharts:4.0.3
		 */
		grunt.registerTask('download-api', 'Download the Highcharts API.', function (product, version) {

			var done = this.async(),
				matches,
				match,
				idx,
				src,
				deleteFolderRecursive;				

			function complete() {
				done();
			}

			// thanks to SO http://stackoverflow.com/questions/12627586/is-node-js-rmdir-recursive-will-it-work-on-non-empty-directories/12761924#12761924
			deleteFolderRecursive = function(path) {
				var files = [];
				if( fs.existsSync(path) ) {
					files = fs.readdirSync(path);
					files.forEach(function(file,index){
						var curPath = path + "/" + file;
						if(fs.lstatSync(curPath).isDirectory()) { // recurse
							deleteFolderRecursive(curPath);
						} else { // delete file
							fs.unlinkSync(curPath);
						}
					});
					fs.rmdirSync(path);
				}
			};

			function modifyHtml(html) {
				return html.replace('<link href="http://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,700,900" rel="stylesheet" type="text/css">','')
				.replace('runDB = true','runDB = false')
				.replace('<h1>Options Reference</h1>','<h1>Options Reference v.'+ version + '</h1>');
			}

			function download(origin, destination) {
				console.log('Downloading: ' + origin + ' ...')
				downloadFile(origin, destination, function(){ 
					downloadCount--;
					console.log('Downloaded ' + origin.split('/').pop())
					if (downloadCount == 0) {
						console.log('Your API is build and ready to use.');
						complete();
					}
				});
			};

			function determineLocalPath(origin, type, relative) {
				if (relative) {
					return  type + '/' + origin.split('/').pop();
				}
				return output + '/' + type + '/' + origin.split('/').pop()
			}

			function downloadAssets(assets) {
				var type,
					downloadToFolder = function (assetsForType, type) {
						return function () {
							var filesidx,
								origin,
								filename;
							
							for(filesidx = 0; filesidx < assetsForType.length; filesidx++) {
								downloadCount++;
								origin = assetsForType[filesidx];
								// download and save it locally
								download(origin, determineLocalPath(origin, type));
							}

							// we had to wait for the "out/js" folder being created.
							if (type === 'js') {
								// dowmload the option and object structure dumps
								// from the API web application 
								filename = output + '/js/' + product + '.json';
								console.log('downloading JSON to ' + filename)
								downloadJSON(product, filename); 
							}
						}
					};

				// some extra thing to download, mainly used by internal links in css files
				assets.images.push(apiUrl + 'resources/images/sprite.png')
				assets['css/images'].push('http://code.jquery.com/ui/1.10.3/themes/smoothness/images/ui-bg_flat_75_ffffff_40x100.png');
				assets['css/images'].push('http://code.jquery.com/ui/1.10.3/themes/smoothness/images/ui-bg_glass_75_dadada_1x400.png');
				assets.fonts.push('http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/fonts/fontawesome-webfont.woff');

				// create the directories and start downloading
				for (type in assets) {
					if (assets.hasOwnProperty(type)) {
						console.log('create dir ' + type)
						fs.mkdir(output + '/' + type, downloadToFolder(assets[type], type));
					}
				}
			}

			function modifyPage(filename) {
				fs.readFile(filename, function (err, data) {
					var assets = {
						js: [],
						css: [],
						'css/images': [],
						images: [],
						fonts: []
					},
					html = '' + data,
					extension,
					imageExtensions = ['svg','png', 'ico'],
					src,
					link,
					links = [];

					if (err) {
						grunt.log.writeln('Error while reading ' + filename);
					}

					// Do some trics, modify content, remove unwanted html, etc.
					html = modifyHtml(html);

					matches = html.match(/(href|src)="([^"]*")/g);

					for(idx = 0; idx < matches.length; idx++) {
						match = matches[idx];
						src = match.split('=')[1].replace(/\"/g, '');

						// fix relative links
						if (/^\/[A-z]/g.test(src)) {
							link = domain + src;
						} else if (/(?!\/\/)^[A-z]*\//g.test(src)) {
							link = apiUrl + src;
						} else {
							link = src;
						}

						extension = src.split('.').pop();

						// js, css files go in here 
						if (assets.hasOwnProperty(extension)){
							assets[extension].push(link);
							html = html.replace(src,determineLocalPath(src, extension, true));
						} 
						// imagelinks go in here
						if (imageExtensions.indexOf(extension) > -1) {
							assets.images.push(link);
							html = html.replace(src,determineLocalPath(src, 'images', true));	
						}
					}

					downloadAssets(assets);

					// rewrite the modified html page
					fs.writeFile(filename, html, function (err) {
						if (err) {
							throw err;
						}
					});
				});	
			}

			function savePage() {
				var filename = output + '/' + product + '.html';
				// save the api page as local html and scrape the page.
				downloadFile(apiUrl + product, filename, function() {
					modifyPage(filename)
				});
			} 

			function init() {
				// find outputfolder for api files
				output = outputPattern.replace('PRODUCT', product);
				// this method is synchronized
				deleteFolderRecursive(output);
				// start with making outputfolder and then download
				fs.mkdir(output, savePage);
			}

			init();
		});
	};
}());
