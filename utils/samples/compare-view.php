<?php 
	ini_set('display_errors', 'true');

	require_once('functions.php');
	$path = $_GET['path'];
	$mode = @$_GET['mode'];
	$i = $_GET['i'];
	$continue = @$_GET['continue'];
	$rightcommit = @$_GET['rightcommit'];
	$commit = @$_GET['commit']; // Used from Phantom test

	if (file_exists('temp/compare.json')) {
		$compare = json_decode(file_get_contents('temp/compare.json'));
		$comment = @$compare->$path->comment;
	}

	$nightly = json_decode(file_get_contents('nightly/nightly.json'));
	$nightly = $nightly->results->$path;

	$details = file_get_contents("../../samples/$path/demo.details");
	$isUnitTest = file_exists("../../samples/$path/unit-tests.js") || strstr($details, 'qunit') ? true : false;
	$isManual = (strstr($details, 'requiresManualTesting: true') !== false);
	$skipTest = (strstr($details, 'skipTest: true') !== false);

	if ($isUnitTest) {
		$bodyClass = 'single-col unit';
	} elseif ($isManual) {
		$bodyClass = 'single-col manual';
	} else {
		$bodyClass = 'visual';
	}


	$browser = getBrowser();
	$browserKey = $browser['parent'];



?><!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Compare SVG</title>
		
		<script src="cache.php?file=http://code.jquery.com/jquery-1.7.js"></script>
		<script src="cache.php?file=http://ejohn.org/files/jsdiff.js"></script>

		<script src="cache.php?file=http://www.highcharts.com/lib/canvg-1.1/rgbcolor.js"></script>
		<script src="cache.php?file=http://www.highcharts.com/lib/canvg-1.1/canvg.js"></script>
		<link rel="stylesheet" type="text/css" href="style.css"/>

		
		<script type="text/javascript">
			var diff,
				path = '<?php echo $path ?>',
				commentHref = 'compare-comment.php?path=<?php echo $path ?>&i=<?php echo $i ?>&diff=',
				commentFrame,
				leftSVG,
				rightSVG,
				leftVersion,
				rightVersion,
				chartWidth,
				chartHeight,
				error,
				mode = '<?php echo $mode ?>',
				i = '<?php echo $i ?>',
				_continue = '<?php echo $continue ?>',
				isManual = <?php echo ($isManual ? 'true' : 'false'); ?>,
				rightcommit = <?php echo ($rightcommit ? "'$rightcommit'" : 'false'); ?>,
				commit = <?php echo ($commit ? "'$commit'" : 'false'); ?>,
				isUnitTest = <?php echo $isUnitTest ? 'true' : 'false'; ?>;


			function showCommentBox() {
				commentHref = commentHref.replace('diff=', 'diff=' + (typeof diff !== 'function' ? diff : '') + '&focus=false');
				if (!commentFrame) {
					commentFrame = $('<iframe>')
						.attr({
							id: 'comment-iframe',
							src: commentHref
						})
						.appendTo('#comment-placeholder');
				}
			}


			$(function() {
				// the reload button
				$('#reload').click(function() {
					location.reload();
				});

				$('#comment').click(function () {
					location.href = commentHref;
				});

				$('#commits').click(function () {
					var frameset = window.parent.document.querySelector('frameset'),
						frame = window.parent.document.getElementById('commits-frame'),
						checked;

					$(this).toggleClass('active');
					checked = $(this).hasClass('active');

					if (checked) {
						window.parent.commits = {};

						if (!frame) {
							frame = window.parent.document.createElement('frame');
							frame.setAttribute('id', 'commits-frame');
							frame.setAttribute('src', '/issue-by-commit/commits.php');
						} else {
							frame.contentWindow.location.reload();
						}

						frameset.setAttribute('cols', '400, *, 400');
						frameset.appendChild(frame);
					} else {
						frameset.setAttribute('cols', '400, *');
					}

				});

				$(window).bind('keydown', parent.keyDown);

				$('#svg').click(function () {
					$(this).css({
						height: 'auto',
						cursor: 'default'
					});
				});
				
				hilightCurrent();


				if (isManual) {
					showCommentBox();
				}

				if ((isUnitTest || isManual) && rightcommit) {
					report += 'Testing commit <a href="http://github.com/highcharts/highcharts/commit/' + rightcommit + '" target="_blank">' + rightcommit + '</a>';
					$('#report').css({
						color: 'gray',
						display: 'block'
					}).html(report);
				}
			});

				
			function markList(className, difference) {

				// Process the difference and set global 
				if (typeof difference === 'number') {
					diff = difference.toFixed(2);
				} else {
					diff = difference || 0;
				}

				if (window.parent.frames[0]) {
					var contentDoc = window.parent.frames[0].document,
						li = contentDoc.getElementById('li<?php echo $i ?>'),
						background = 'none';
					
					if (li) {
						$(li).removeClass("identical");
						$(li).removeClass("different");
						$(li).removeClass("approved");
						$(li).addClass(className);
						
						
						// remove dissimilarity index and add new 
						$('.dissimilarity-index', li).remove();
						
						if (difference !== undefined) {

							<?php if (isset($comment) && $comment->symbol == 'check') : ?>
							if (diff.toString() === '<?php echo $comment->diff ?>') {
								$(li).addClass('approved');
							}
							<?php endif; ?>
							
							// Compare to reference
							/*
							if (difference.reference) {
								diff += ' ('+ difference.reference.toFixed(2) + ')';
								if (difference.dissimilarityIndex.toFixed(2) === difference.reference.toFixed(2)) {
									background = "#a4edba";
								}
							}
							*/
							$span = $('<a>')
								.attr({
									'class': 'dissimilarity-index',
									href: location.href.replace(/continue=true/, '').replace(/rightcommit/, 'bogus'),
									target: 'main',
									<?php if ($isUnitTest) : ?>
									title: 'How many unit tests passed out of the total' ,
									<?php else : ?>
									title: 'Difference between exported images. The number in parantheses is the reference diff, ' + 
										'generated on the first run after clearing temp dir cache.' ,
									<?php endif; ?>
									'data-diff': diff
								})
								.css({
									background: background
								})
								.html(diff)
								.appendTo(li);

							showCommentBox();

						} else {
							$span = $('<a>')
								.attr({
									'class': 'dissimilarity-index',
									href: location.href.replace(/continue=true/, '').replace(/rightcommit/, 'bogus'),
									target: 'main',
									title: 'Compare'
								})
								.html('<i class="<?php echo ($isUnitTest ? 'icon-puzzle-piece' : 'icon-columns'); ?>"></i>')
								.appendTo(li);

						}
						
						if (_continue) {
							$(contentDoc.body).animate({
								scrollTop: $(li).offset().top - 300
							}, 0);
						}
					}
					
				}				
			}
			
			function hilightCurrent() {
				
				var contentDoc = window.parent.frames[0].document,
					li = contentDoc.getElementById('li<?php echo $i ?>');
				
				// previous
				if (contentDoc.currentLi) {
					$(contentDoc.currentLi).removeClass('hilighted');
				}
				$(li).addClass('hilighted');
				
				contentDoc.currentLi = li;
					
			}

			/**
			 * Pad a string to a given length
			 * @param {String} s
			 * @param {Number} length
			 */
			function pad(s, length, left) {
				var padding;

				if (s.length > length) {
					s = s.substring(0, length);
				}

				padding = new Array((length || 2) + 1 - s.length).join(' ');

				return left ? padding + s : s + padding;
			}

			
			function proceed() {
				var i = '<?php echo $i ?>';						
				if (window.parent.frames[0] && i !== '' && _continue === 'true' ) {
					var contentDoc = window.parent.frames[0].document,
						href,
						next;

					i = parseInt(i);
						
					if (!contentDoc || !contentDoc.getElementById('i' + i)) {
						return;
					}
					
					while (i++) {
						next = contentDoc.getElementById('i' + i);
						if (next) {
							href = next.href;
						} else {
							window.location.href = 'view.php';
							return;
						}
						
						if (!contentDoc.getElementById('i' + i) || /batch/.test(contentDoc.getElementById('i' + i).className)) {
							break;
						}
					}
					
					href = href.replace("view.php", "compare-view.php") + '&continue=true';
					
					window.location.href = href; 

				// Else, log the result. This is picked up when running in PhantomJS (phantomtest.js script).
				} else {
					if (typeof diff === 'function') { // leaks from jsDiff
						diff = 0;
					}
					console.log([
						'@proceed',
						pad(path, 60, false),
						diff ? pad(String(diff), 5, true) : '    .' // Only a dot when success
					].join(' '));
				}		
			}
				
			function onIdentical() {
				$.get('compare-update-report.php', {
					path: path,
					diff: 0,
					commit: commit || '',
					rightcommit: rightcommit || ''
				});
				markList("identical");
				proceed();
			}
			
			function onDifferent(diff) {
				// Save it for refreshes
				$.get('compare-update-report.php', {
					path: path,
					diff: diff,
					commit: commit || '',
					rightcommit: rightcommit || ''
				});
				markList("different", diff);
				proceed();
			}
			
			function onLoadTest(which, svg) {

				chartWidth = parseInt(svg.match(/width=\"([0-9]+)\"/)[1]);
				chartHeight = parseInt(svg.match(/height=\"([0-9]+)\"/)[1]);

				if (which == 'left') {
					leftSVG = svg;
				} else {
					rightSVG = svg;
				}
				if (leftSVG && rightSVG) {
					onBothLoad();
				}
			}

			function wash(svg) {
				if (typeof svg === "string") {
					return svg
						.replace(/</g, '&lt;')
						.replace(/>/g, '&gt;')
						.replace(/&lt;del&gt;/g, '<del>')
						.replace(/&lt;\/del&gt;/g, '</del>')
						.replace(/&lt;ins&gt;/g, '<ins>')
						.replace(/&lt;\/ins&gt;/g, '</ins>');
				} else {
					return "";
				}
			}

			function activateOverlayCompare(isCanvas) {

				var isCanvas = isCanvas || false,
					$button = $('button#overlay-compare'),
					$leftImage = isCanvas ? $('#cnvLeft') : $('#left-image'),
					$rightImage = isCanvas ? $('#cnvRight') : $('#right-image'),
					showingRight,
					toggle = function () {

						// Initiate
						if (showingRight === undefined) {

							$('#preview').css({ 
								height: $('#preview').height()
							});

							$rightImage
								.css({
									left: $rightImage.offset().left,
									position: 'absolute'
								})
								.animate({
									left: 0
								});
							$leftImage.css('position', 'absolute');
							
							$button.html('Showing right. Click to show left');
							showingRight = true;

						// Show left
						} else if (showingRight) {
							$rightImage.hide();
							$button.html('Showing left. Click to show right');
							showingRight = false;
						} else {
							$rightImage.show();
							$button.html('Showing right. Click to show left.');
							showingRight = true;
						}
					};
				$('#preview').css({
					width: 2 * chartWidth + 20
				});

				$button
					.css('display', '')
					.click(toggle);
				$leftImage.click(toggle);
				$rightImage.click(toggle);
			}
			
			var report = "",
				startLocalServer = '<pre>$ cd GitHub/highcharts.com/exporting-server/java/highcharts-export/highcharts-export-web\n' +
					'$ mvn jetty:run</pre>';
			function onBothLoad() {

				var out,
					identical;

				if (error) {
					report += "<br/>" + error;
					$('#report').html(report)
						.css('background', '#f15c80');
					onDifferent('Error');
					return;
				}
				
				// remove identifier for each iframe
				if (leftSVG && rightSVG) {
					leftSVG = leftSVG
						.replace(/which=left/g, "")
						.replace(/Created with [a-zA-Z0-9\.@\- ]+/, "Created with ___");
						
					rightSVG = rightSVG
						.replace(/which=right/g, "")
						.replace(/Created with [a-zA-Z0-9\.@\- ]+/, "Created with ___");
				}

				if (leftSVG === rightSVG) {
					identical = true;
					onIdentical();
				}

				if (mode === 'images') {
					if (rightSVG.indexOf('NaN') !== -1) {
						report += "<div>The generated SVG contains NaN</div>";
						$('#report').html(report)
							.css('background', '#f15c80');
						onDifferent('Error');

					} else if (identical) {
						report += "<br/>The generated SVG is identical";
						$('#report').html(report)
							.css('background', "#a4edba");

					} else {
						report += "<div>The generated SVG is different, checking exported images...</div>";
						
						$('#report').html(report)
							.css('background', 'gray');
						
						/***
							CANVAS BASED COMPARISON						
						***/						
						function canvasCompare(source1, canvas1, source2, canvas2, width, height) {
							var converted = [],
								diff = 0,
								canvasWidth = chartWidth || 400, 
								canvasHeight = chartHeight || 300;

							// converts the svg into canvas
							//		- source: the svg string
							//		- target: the id of the canvas element to render to
							//		- callback: function to call after conversion
							//
							function convert(source, target, callback) {
								var useBlob = navigator.userAgent.indexOf('WebKit') === -1,
									context = document.getElementById(target).getContext('2d'),
									image = new Image(),
									data,
									domurl,
									blob,
									svgurl;

								// Firefox runs Blob. Safari requires the data: URL. Chrome accepts both
								// but seems to be slightly faster with data: URL.
								if (useBlob) {
									domurl = window.URL || window.webkitURL || window;
									blob = new Blob([source], { type: 'image/svg+xml;charset-utf-16'});
									svgurl = domurl.createObjectURL(blob);
								}

								// This is fired after the image has been created
								image.onload = function() {
									context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
									data = context.getImageData(0, 0, canvasWidth, canvasHeight).data;
									if (useBlob) {
										domurl.revokeObjectURL(svgurl);
									}
									callback(data);
								}
								image.src = useBlob ? 
									svgurl :
									'data:image/svg+xml,' + source;
							};

							// compares 2 canvas images
							function compare(data1, data2) {
								var	i = data1.length,
									diff = 0,
									// Tune the diff so that identical = 0 and max difference is 100. The max
									// diff can be tested by comparing a rectangle of fill rgba(0, 0, 0, 0) against
									// a rectange of fill rgba(255, 255, 255, 1).
									dividend = 4 * 255 * canvasWidth * canvasHeight / 100;
								while (i--) {
									diff += Math.abs(data1[i] - data2[i]); // loops over all reds, greens, blues and alphas
								}
								diff /= dividend;

								if (diff < 0.005) {
									diff = 0;
								}
								return diff;
							}

							// called after converting svgs to canvases
							function startCompare(data) {
								converted.push(data);
								// only compare if both have been converted								
								if (converted.length == 2) {									
									var diff = compare(converted[0], converted[1]);

									if (diff === 0) {
										identical = true;
										report += '<div>The exported images are identical</div>'; 									
										onIdentical();
									} else if (diff === undefined) {
										report += '<div>Canvas Comparison Failed</div>';
										onDifferent('Error');
									} else {
										report += '<div>The exported images are different (dissimilarity index: '+ diff.toFixed(2) +')</div>';									
										onDifferent(diff);
									}

									// lower section to overlay images to visually compare the differences
									activateOverlayCompare(true);
									
									$('#report').html(report).css('background', identical ? "#a4edba" : '#f15c80');
								}
							}
						
							
							$('#preview canvas')
								.attr({
									width: chartWidth,
									height: chartHeight
								})
								.css({
									width: chartWidth + 'px',
									height: chartHeight + 'px',
									display: ''
								});
							
							// start converting
							if (navigator.userAgent.indexOf('Trident') !== -1) {
								try {
									canvg(canvas1, source1, {
										scaleWidth: canvasWidth,
										scaleHeight: canvasHeight
									});
									startCompare(document.getElementById(canvas1).getContext('2d').getImageData(0, 0, canvasWidth, canvasHeight).data);
									canvg(canvas2, source2, {
										scaleWidth: canvasWidth,
										scaleHeight: canvasHeight
									});
									startCompare(document.getElementById(canvas2).getContext('2d').getImageData(0, 0, canvasWidth, canvasHeight).data);
								} catch (e) {
									onDifferent('Error');
									report += '<div>Error in canvg, try Chrome or Safari.</div>';
									$('#report').html(report).css('background', '#f15c80');
								}

							} else {
								convert(source1, canvas1, startCompare);
								convert(source2, canvas2, startCompare);
							}
						}					
						
						/***
							AJAX & PHP BASED COMPARISON
						***/
						/*
						function ajaxCompare() {
							$.ajax({
								type: 'POST', 
								url: 'compare-images.php', 
								data: {
									leftSVG: leftSVG,
									rightSVG: rightSVG,
									path: "<?php echo $path ?>".replace(/\//g, '--')	
								}, 
								error: function (xhr) {
									report += '<div>' +	xhr.responseText + '</div>'
									onDifferent('Error');
									$('#report').html(report)
										.css('background', identical ? "#a4edba" : '#f15c80');
								},
								success: function (data) {
									if (data.fallBackToOnline) {
										report += '<div>Preferred export server not started, fell back to export.highcharts.com. ' +
											'Start local server like this: ' + startLocalServer + '</div>';
									}

									if (data.dissimilarityIndex === 0) {
										identical = true;
										
										report += '<div>The exported images are identical</div>'; 
										
										onIdentical();
										
									} else if (data.dissimilarityIndex === undefined) {
										report += '<div><b>Image export failed. Is the exporting server responding? If running local server, start it like this:</b>' +
											startLocalServer + '</div>'
										onDifferent('Error');
										
									} else {
										report += '<div>The exported images are different (dissimilarity index: '+ data.dissimilarityIndex.toFixed(2) +')</div>';
										
										onDifferent(data);
									}
									
									$('#preview').html('<h4>Generated images (click to compare)</h4><img id="left-image" src="'+ data.sourceImage.url +'?' + (+new Date()) + '"/>' +
										'<img id="right-image" src="'+ data.matchImage.url + '?' + (+new Date()) + '"/>');

									activateOverlayCompare();
									
									$('#report').html(report)
										.css('background', identical ? "#a4edba" : '#f15c80');
								},
								dataType: 'json'
							});
						}
						*/
						// Browser sniffing for compare capabilities
						canvasCompare(leftSVG, 'cnvLeft', rightSVG, 'cnvRight', 400, 300);
						/*
						if (navigator.userAgent.indexOf('Trident') !== -1) {
							ajaxCompare();
						} else {
							canvasCompare(leftSVG, 'cnvLeft', rightSVG, 'cnvRight', 400, 300);
						}*/
						
					}
				} else {
					if (leftVersion === rightVersion) {
						console.log("Warning: Left and right versions are equal.");
					}
					
					report += '<div>Left version: '+ leftVersion +'; right version: '+ 
						(rightcommit ? '<a href="http://github.com/highcharts/highcharts/commit/' + rightcommit + '" target="_blank">' + 
							rightcommit + '</a>' : rightVersion) +
						'</div>';
					
					report += identical ?
						'<div>The innerHTML is identical</div>' :
						'<div>The innerHTML is different, testing generated SVG...</div>';
						
					$('#report').html(report)
						.css('background', identical ? "#a4edba" : '#f15c80');
						
					if (!identical) {
						// switch to image mode
						leftSVG = rightSVG = undefined;
						mode = 'images';
						$("#iframe-left")[0].contentWindow.compareSVG();				
						$("#iframe-right")[0].contentWindow.compareSVG();
					}
				}
						
				// Show the diff
				if (!identical) {
					//out = diffString(wash(leftSVG), wash(rightSVG)).replace(/&gt;/g, '&gt;\n');
					try {
						out = diffString(
							leftSVG.replace(/>/g, '>\n'),
							rightSVG.replace(/>/g, '>\n')
						);
						$("#svg").html('<h4 style="margin:0 auto 1em 0">Generated SVG (click to view)</h4>' + wash(out));
					} catch (e) {
						$("#svg").html('Error diffing SVG');
					}
				}

				/*report +=  '<br/>Left length: '+ leftSVG.length + '; right length: '+ rightSVG.length +
					'; Left version: '+ leftVersion +'; right version: '+ rightVersion;*/
				
			}
		</script>
		
	</head>
	<body class="<?php echo $bodyClass ?>">
		
		<div><?php echo @$warning ?></div>
		<div class="top-bar">
			
			<h2 style="margin: 0"><?php echo $path ?></h2> 
			
			<div style="text-align: right">
				<a class="button" id="commits" style="margin-left: 1em" >Test by commit</a>
				<button id="comment" style="margin-left: 1em"><i class="icon-comment"></i> Comment</button>
				<button id="reload" style="margin-left: 1em">Reload</button>
			</div>
		</div>

		<div style="margin: 1em">

			<?php if ($skipTest) { ?>
			<script>onIdentical(); </script>
			<div class="test-report" style="background: #a4edba; color: black">
				<p>This sample has been marked <code>skipTest: true</code> in the demo.details file.</p>
				<p>It means that the sample exists only for demonstration in the docs or the API,
					and that the feature we are testing is either covered by a unit test or 
					another visual sample.</p>
			</div>

			<?php } else { ?>

			<div id="report" class="test-report"></div>

			<?php
			if ($nightly) {
				$changes = array();
				foreach ($nightly->changes as $change) {
					$changes[] = "<a target='_blank' href='https://github.com/highcharts/highcharts/commit/{$change->hash}'>{$change->hash}</a>";
				}
				$changes = join($changes, ', ');
				echo "
				<div class='nightly'>This test was affected by
				$changes
				</div>
				";
			}
			?>
			
			<div id="comment-placeholder"></div>
			<div id="frame-row">
				<?php if (!$isUnitTest && !$isManual) : ?>
				<iframe id="iframe-left" src="compare-iframe.php?which=left&amp;<?php echo $_SERVER['QUERY_STRING'] ?>"></iframe>
				<?php endif; ?>
				<iframe id="iframe-right" src="compare-iframe.php?which=right&amp;<?php echo $_SERVER['QUERY_STRING'] ?>"></iframe>
				
			</div>
			<pre id="svg"></pre>
			
			<div id="preview">
				<canvas id="cnvLeft" style="display:none"></canvas>
				<canvas id="cnvRight" style="display:none"></canvas>
			</div>
			<button id="overlay-compare" style="display:none">Compare overlaid</button>
		
			<?php } ?>
		</div>
		
	</body>
</html>
