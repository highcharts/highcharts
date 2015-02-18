<?php 
	$path = $_GET['path'];
	$mode = @$_GET['mode'];
	$i = $_GET['i'];
	$continue = @$_GET['continue'];

	$compare = json_decode(file_get_contents('temp/compare.json'));
	$comment = @$compare->$path->comment;
	


	if (!get_browser(null, true)) {
		$warning = 'Unable to get the browser info. Make sure a php_browscap.ini file extists, see ' .
		'<a href="http://php.net/manual/en/function.get-browser.php">get_browser</a>.';
	} else {
		$browser = get_browser(null, true);
		$browserKey = @$browser['parent'];
		if (!$browserKey) {
			$warning = 'Unable to get the browser info. Make sure php_browscap.ini is updated, see ' .
			'<a target="_blank" href="http://php.net/manual/en/function.get-browser.php">get_browser</a>.';
		}
	}

?><!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Compare SVG</title>
		
		<script src="http://code.jquery.com/jquery-1.7.js"></script>
		<script src="http://ejohn.org/files/jsdiff.js"></script>
		<link rel="stylesheet" type="text/css" href="style.css"/>

		
		<script type="text/javascript">
			var diff,
				commentHref = 'compare-comment.php?path=<?php echo $path ?>&i=<?php echo $i ?>&diff=';
			$(function() {
				// the reload button
				$('#reload').click(function() {
					location.reload();
				});

				$('#comment').click(function () {
					location.href = commentHref;
				});

				$(window).bind('keydown', parent.keyDown);

				$('#svg').click(function () {
					$(this).css({
						height: 'auto',
						cursor: 'default'
					});
				});
				
				hilightCurrent();
			});
			var leftSVG,
				rightSVG,
				leftVersion,
				rightVersion,
				error,
				mode = '<?php echo $mode ?>',
				i = '<?php echo $i ?>'
				_continue = '<?php echo $continue ?>';
				
			function markList(className, difference) {
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
							if (typeof difference === 'object') {
								diff = difference.dissimilarityIndex.toFixed(2);

							} else {
								diff = difference;
							}

							<?php if ($comment->symbol == 'check') : ?>
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
									href: location.href.replace(/continue=true/, ''),
									target: 'main',
									title: 'Difference between exported images. The number in parantheses is the reference diff, generated on the first run after clearing temp dir cache.' ,
									'data-diff': diff
								})
								.css({
									background: background
								})
								.html(diff)
								.appendTo(li);


							commentHref = commentHref.replace('diff=', 'diff=' + diff);
							$('<iframe>')
								.attr({
									id: 'comment-iframe',
									src: commentHref
								})
								.appendTo('#comment-placeholder');


						} else {
							$span = $('<a>')
								.attr({
									'class': 'dissimilarity-index',
									href: location.href.replace(/continue=true/, ''),
									target: 'main',
									title: 'Compare'
								})
								.html('<i class="icon-columns"></i>')
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
			
			function proceed() {
				if (window.parent.frames[0] && i !== "" && _continue === 'true' ) {
					var contentDoc = window.parent.frames[0].document,
						i = <?php echo $i ?>,
						href,
						next;
						
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
				}		
			}
				
			function onIdentical() {
				$.get('compare-update-report.php', { path: '<?php echo $path ?>', diff: 0 });
				markList("identical");
				proceed();
			}
			
			function onDifferent(diff) {
				if (diff === 'Error') { // Otherwise, it is saved from compare-iframe.php
					$.get('compare-update-report.php', { path: '<?php echo $path ?>', diff: diff });
				}
				markList("different", diff);
				proceed();
			}
			
			function onLoadTest(which, svg) {
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

			function activateOverlayCompare() {

				var $button = $('button#overlay-compare'),
					$leftImage = $('#left-image'),
					$rightImage = $('#right-image'),
					showingRight,
					toggle = function () {

						// Initiate
						if (showingRight === undefined) {

							$('#preview').css({ height: $('#preview').height() })

							$leftImage.css('position', 'absolute');
							$rightImage
								.css({
									left: 300,
									position: 'absolute'
								})
								.animate({
									left: 0
								});
							;
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

				$button
					.css('display', '')
					.click(toggle);
				$leftImage.click(toggle);
				$rightImage.click(toggle);
			}
			
			var report = "";
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
						.replace(/Created with [a-zA-Z0-9\.@ ]+/, "Created with ___");
						
					rightSVG = rightSVG
						.replace(/which=right/g, "")
						.replace(/Created with [a-zA-Z0-9\.@ ]+/, "Created with ___");
				}

				if (leftSVG === rightSVG) {
					identical = true;
					onIdentical();
				}

				if (mode === 'images') {
					if (rightSVG.indexOf('NaN') !== -1) {
						report += "<br/>The generated SVG contains NaN";
						$('#report').html(report)
							.css('background', '#f15c80');
						onDifferent('Error');

					} else if (identical) {
						report += "<br/>The generated SVG is identical";
						$('#report').html(report)
							.css('background', "#a4edba");

					} else {
						report += "<br/>The generated SVG is different, checking exported images...";
						
						$('#report').html(report)
							.css('background', 'gray');
							
						$.ajax({
							type: 'POST', 
							url: 'compare-images.php', 
							data: {
								leftSVG: leftSVG,
								rightSVG: rightSVG,
								path: "<?php echo $path ?>".replace(/\//g, '--')	
							}, 
							success: function (data) {

								if (data.fallBackToOnline) {
									report += ' (Preferred export server not started, fell back to export.highcharts.com)';
								}

								if (data.dissimilarityIndex === 0) {
									identical = true;
									
									report += '<br/>The exported images are identical'; 
									
									onIdentical();
									
								} else if (data.dissimilarityIndex === undefined) {
									report += '<br/><br/><b>Image export failed. Is the exporting server responding? If running local server, start it like this:</b>' +
										'<pre>$ cd GitHub/highcharts.com/exporting-server/java/highcharts-export/highcharts-export-web\n' +
										'$ mvn jetty:run</pre>'
									onDifferent('Error');
									
								} else {
									report += '<br/>The exported images are different (dissimilarity index: '+ data.dissimilarityIndex.toFixed(2) +')';
									
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
				} else {
					if (leftVersion === rightVersion) {
						console.log("Warning: Left and right versions are equal.");
					}
					
					report += 'Left version: '+ leftVersion +'; right version: '+ rightVersion +'<br/>';
					
					report += identical ?
						'The innerHTML is identical' :
						'The innerHTML is different, testing generated SVG...';
						
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
					out = diffString(
						leftSVG.replace(/>/g, '>\n'),
						rightSVG.replace(/>/g, '>\n')
					)
					$("#svg").html('<h4 style="margin:0 auto 1em 0">Generated SVG (click to view)</h4>' + wash(out));
				}

				/*report +=  '<br/>Left length: '+ leftSVG.length + '; right length: '+ rightSVG.length +
					'; Left version: '+ leftVersion +'; right version: '+ rightVersion;*/
				
			}
		</script>
		<style type="text/css">
			.top-bar {
				color: white;
				font-family: Arial, sans-serif; 
				font-size: 0.8em; 
				padding: 0.5em; 
				height: 3.5em;
				background: #34343e;
				box-shadow: 0px 0px 8px #888;
			}
			
			.top-bar a {
				color: white;
				text-decoration: none;
				font-weight: bold;
			}
			
			#report {
				border-radius: 5px;
				color: white;
				margin-bottom: 0.5em;
				border: 1px solid silver;
				font-family: Arial, sans-serif; 
				font-size: 0.8em; 
				padding: 0.5em; 
				
			}
			#comment-iframe {
				height: 400px;
				border: 1px solid silver;
				position: fixed;
			}

			pre#svg {
				padding: 1em;
				border: 1px solid silver;
				background-color: #F8F8F8;
			}
			del {
				color: white;
				background-color: red;
				border-radius: 3px;
				padding: 0 3px;
			}
			ins {
				color: white;
				background-color: green;
				border-radius: 3px;
				padding: 0 3px;
			}
		</style>
		
	</head>
	<body style="margin: 0">
		
		<div><?php echo @$warning ?></div>
		<div class="top-bar">
			
			<h2 style="margin: 0"><?php echo $path ?></h2> 
			
			<div style="text-align: right">
				<button id="comment" style="margin-left: 1em"><i class="icon-comment"></i> Comment</button>
				<button id="reload" style="margin-left: 1em">Reload</button>
			</div>
		</div>

		<div style="margin: 1em">
		
		<div id="report"></div>
		
		<table>
			<tr>
				<td><iframe id="iframe-left" src="compare-iframe.php?which=left&amp;<?php echo $_SERVER['QUERY_STRING'] ?>" 
					style="width: 500px; height: 400px; border: 1px dotted gray"></iframe></td>
				<td><iframe id="iframe-right" src="compare-iframe.php?which=right&amp;<?php echo $_SERVER['QUERY_STRING'] ?>" 
					style="width: 500px; height: 400px; border: 1px dotted gray"></iframe></td>
				<td id="comment-placeholder"></id>
			</tr>
			<tr>
				<td colspan="2">
					<pre id="svg" style="overflow: hidden; width: 1000px; height: 10px; cursor: pointer;"></pre>
					<div id="preview" style="overflow: auto; width: 1000px; position: relative"></div>
					<button id="overlay-compare" style="display:none">Compare overlaid</button>
				</td>
			</tr>
		</table>
		
		
		
		</div>
		
	</body>
</html>
