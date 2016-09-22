<?php 

session_start();
require_once('../settings.php');
require_once('Git.php');

try {
	Git::set_bin(Settings::$git);
	$repo = Git::open(dirname(__FILE__) . '/../../');
	$branches = $repo->list_branches();
} catch (Exception $e) {
	$error = "Error connecting to the local git repo <b>highcharts.com</b>. Make sure git is running.<br/><br>" . $e->getMessage();
}
if (@$_POST['branch']) {
	try {
		$_SESSION['branch'] = @$_POST['branch'];
		$_SESSION['after'] = @$_POST['after'];
		$_SESSION['before'] = @$_POST['before'];
		$activeBranch = $repo->active_branch();
		$repo->checkout($_SESSION['branch']);
		$repo->run('log > ' . sys_get_temp_dir() . '/log.txt --format="%h|%ci|%s|%p" ' .
			//'--first-parent --after={' . $_SESSION['after'] . '} --before={' . $_SESSION['before'] . '}');
			'--after={' . $_SESSION['after'] . '} --before={' . $_SESSION['before'] . '}');
		$repo->checkout($activeBranch);


		$commitsKey = join(array($_SESSION['branch'],$_SESSION['after'],$_SESSION['before']), ',');
	} catch (Exception $e) {
		$error = $e->getMessage();
	}
}

// Move the log file back from temp dir
if (!is_dir('../samples/temp')) {
	mkdir('../samples/temp');
}
copy(sys_get_temp_dir() . '/log.txt', '../samples/temp/log.txt');

?>
<html>
	
	<head>
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>
		<script type="text/javascript" src="http://code.highcharts.com/highcharts.js"></script>
		
		<script type="text/javascript">
			var ren,
				paths = [];

			var mainFrame = window.parent.document.querySelector('frame#main'),
				mainLocation = mainFrame && mainFrame.contentWindow.location.href,
				isComparing = mainLocation && mainLocation.indexOf('compare-view') > -1;
			
			// Draw the lines connecting the dots
			function drawGraph() {

				var h = $('#ul').height();
				
				// First time
				if (!ren) {
					ren = new Highcharts.Renderer(
						$('#graph')[0],
						300,
						h
					);
				// Update
				} else { 
					$.each(paths, function (i, path) {
						paths[i] = path.destroy();
					});
					paths.length = 0;
				}
				$('div.parents').each(function (i, item) {
					var $dot = $(item),
						doffset = $dot && $dot.offset(),
						parents = $(item).data('parents');

					$.each(parents, function (i, parent) {
						var $parentDot = $('#dot-' + parent),
							poffset = $parentDot && $parentDot.offset(),
							path,
							dLeft,
							pLeft,
							color;

						if (doffset && poffset) {

							dLeft = Math.round($dot.data('left')) + 9;
							pLeft = Math.round($parentDot.data('left')) + 9;

							// Straight line
							if (dLeft === pLeft) {
								path = ['M', dLeft, doffset.top,
									'L', pLeft, poffset.top];
								color = $dot.data('color');

							// Curve, merge
							} else if (dLeft < pLeft) {
								path = ['M', dLeft, doffset.top,
									'C', dLeft, doffset.top + 10,
									pLeft, doffset.top + 10,
									pLeft, doffset.top + 20,
									'L',
									pLeft, poffset.top];
								color = $parentDot.data('color');

							// Curve, fork
							} else {
								path = ['M', dLeft, doffset.top,
									'L', dLeft, poffset.top - 20,
									'C', dLeft, poffset.top - 10,
									pLeft, poffset.top - 10,
									pLeft, poffset.top];
								color = $dot.data('color');
							}

							paths.push(ren.path(path)
								.attr({
									'stroke-width': 2,
									stroke: color
								})
								.add());
						}
					});
				});
			};

			/**
			 * Indent the text to reveal the graph
			 */
			function indent() {
				var $rightMost,
					marginLeft;
				$('div.parents').each(function (i, item) {
					var $dot = $(item),
						doffset = $dot && $dot.offset(),
						parents = $(item).data('parents');

					$.each(parents, function (i, parent) {
						var $parentDot = $('#dot-' + parent),
							poffset = $parentDot && $parentDot.offset(),
							dLeft,
							pLeft;

						if ($rightMost === undefined) {
							$rightMost = $dot;
						}
								
							
						if (doffset && poffset) {
							dLeft = Math.round($rightMost.data('left'));
							pLeft = Math.round($parentDot.data('left'));
							
							if (pLeft >= dLeft)  {
								$rightMost = $parentDot;
							}
						}

						marginLeft = $rightMost.data('left');
						$dot.parent().find('a').css('marginLeft', marginLeft + 20);
						$dot.parent().find('span.date').css('marginLeft', marginLeft + 20);


						if ($rightMost[0] === $dot[0]) {
							$rightMost = undefined;
						}
					});
				});

			}

			$(function() {
				var $active,
					month,
					commits,
					parentHierarchy = {};

				if (isComparing) {
					document.body.className = 'compare';
				}

				var colors = [
					   '#2f7ed8', 
					   '#0d233a', 
					   '#8bbc21', 
					   '#910000', 
					   '#1aadce', 
					   '#492970',
					   '#f28f43', 
					   '#77a1e5', 
					   '#c42525', 
					   '#a6c96a',
					   '#2f7ed8', 
					   '#0d233a', 
					   '#8bbc21', 
					   '#910000', 
					   '#1aadce', 
					   '#492970',
					   '#f28f43', 
					   '#77a1e5', 
					   '#c42525', 
					   '#a6c96a'
					],
					branchCounter = 0;

				
			
				$.get('../samples/temp/log.txt?d' + (new Date()).getTime(), function(log) {
					log = log.split('\n');
					$.each(log, function(i, line) {
						
						if (line.length) {
							line = line.split('|');

							var commit = line[0],
								$li = $('<li>').appendTo('#ul').data({ commit: commit }),
								date = line[1],
								dateObj = new Date(date.substr(0, 4), date.substr(5, 2) - 1, +date.substr(8, 2), +date.substr(11, 2), date.substr(14, 2)),
								parents = line[3].split(' '),
								branchI;
							
							if (dateObj.getMonth() !== month) {
								$('<h3>' + ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][dateObj.getMonth()] +
									 ' ' + dateObj.getFullYear() + '</h3>')
									.appendTo($li);
								month = dateObj.getMonth();
							}

							// Parents
							if (parentHierarchy[commit] !== undefined) {
								branchI = parentHierarchy[commit];
							} else {
								branchI = branchCounter++;
							}
							if (parentHierarchy[parents[0]] !== undefined) {
								branchCounter--;
							} else {
								parentHierarchy[parents[0]] = branchI;
							}
							if (parents[1]) {
								parentHierarchy[parents[1]] = branchCounter++;
							}
							var marginLeft = branchI * 10;

							var par = $('<div>')
								.attr({
									'class': 'parents',
									title: 'hash: '+ commit + ', parent: ' + parents.join(', '),
									id: 'dot-' + commit
								})
								.data({
									hash: commit,
									parents: parents,
									left: marginLeft,
									color: colors[branchI]
								})
								.html('<div class="disc" style="background-color: '+ colors[branchI] + 
									';margin-left:' + marginLeft + 'px"></div>')
								.appendTo($li);

							$('<a>')
								.attr({
									href: isComparing ? 
										mainLocation + '&rightcommit=' + commit :
										'main.php?commit='+ commit,
									target: 'main',
									'class': 'message'
								})
								.click(function() {
									$active && $active.removeClass('active').addClass('visited');
									$(this).addClass('active');
									$active = $(this);
								})
								.html(line[2])
								.appendTo($li);

							var statusTexts = {
								'status-none': 'Not inspected',
								'status-good': 'Good',
								'status-bad': 'Bad'
							},
							status = window.parent.commits[commit] || 'status-none';
							$('<div class="status"></div>')
								.addClass(status) // get from parent
								.html(statusTexts[status])
								.click(function () {
									var $this = $(this),
										newClass;

									if ($this.hasClass('status-none')) {
										newClass = 'status-good';
										$this.removeClass('status-none');
									} else if ($this.hasClass('status-good')) {
										newClass = 'status-bad';
										$this.removeClass('status-good');
									} else if ($this.hasClass('status-bad')) {
										newClass = 'status-none';
										$this.removeClass('status-bad');
									}

									if (newClass) {
										$this.addClass(newClass)
											.html(statusTexts[newClass]);
									}

									// Store for refresh
									window.parent.commits[$this.parent().data('commit')] = newClass;
								})
								.appendTo($li);

							$('<span class="date">' + date + '</span>')
								.appendTo($li);
						}
							
					});


					indent();
					drawGraph();
				});

				$(window).bind('resize', drawGraph);
			});
		</script>
		
		<style type="text/css">
			* {
				font-size: 0.95em;
				font-family: Arial, sans-serif;
			}
			h3 {
				font-size: 16pt;
				background: white;
			}
			ul {
				margin: 150px 1em 1em 1em;
				padding-left: 10px;
				
			}
			
			a {
				text-decoration: none;
				border-right: 10px solid white;
				background: rgba(255,255,255,0.75);
			}

			a.visited {
				color: silver;
			}
			a.active {
				border-right-color: black;
			}
			
			body {
				margin: 0;
			}

			ul {
				list-style-type: none;
				position: relative;

			}

			ul li {
				padding: 0.5em 0;
				border-bottom: 1px solid silver;
				margin: 0;
			}
			.date {
				color: gray;
				display: block;
				background: white;
			}
			.parents {
				position: absolute;
			}
			.parents .disc {
				width: 10px;
				height: 10px;
				border-radius: 5px;
			}
			.message {
				display: block;
			}
			.status {
				float: right;
				cursor: pointer;
				color: silver;
				width: 100px;
				padding: 3px;
				border-radius: 3px;
				text-align: center;
			}
			.status.status-good {
				background: green;
				color: white;
			}
			.status.status-bad {
				background: red;
				color: white;
			}

			#topnav {
				position: fixed;
				z-index: 2;
				top: 0;
				box-shadow: 5px 5px 5px #888;
				background: white;
				width: 100%; 
				padding-top: 1em;
			}
			#topnav a, input[type="submit"] {
				background: white;
				color: black;
				cursor: pointer;
				border: 1px solid silver;
				border-radius: 5px;
				margin: 0.5em;
				padding: 0.5em;
			}
			#topnav span {
				padding-left: 5px;
			}
			#topnav div {
				padding: 1em;
				line-height: 1.5em;
			}
			#graph {
				position: absolute;
				width: 100%;
				left: 20px;
				top: 0;
			}
			#compare-header {
				display: none;
			}

			.compare #setdata {
				display: none;
			}
			.compare #compare-header {
				display: block;
				color: silver;
				font-style: italic;
				padding: 1em 1em 0 1em;
			}

			
		</style>
	</head>
	
	<body>
		<div id="topnav">
			
			<form method="post" action="commits.php">
			<div>
			Branch

			<select name="branch">
			<?php
			foreach ($branches as $branchOption) {
				$selected = ($branchOption == $_SESSION['branch']) ? 'selected="selected"' : '';
				echo "<option value='$branchOption' $selected>$branchOption</option>\n";
			}
			?>
			</select>
			from
			<input type="text" name="after" value="<?php echo $_SESSION['after'] ?>" />
			to
			<input type="text" name="before" value="<?php echo $_SESSION['before'] ?>" />
			
			<input type="submit" value="Submit"/>
			<a id="setdata" href="main.php" target="main">Change test data</a>
			</div>

			</form>
		</div>
		<div id="compare-header">
		Click commit messages to compare the left side (usually the latest stable version) on the left, with the actual commit on the right.
		</div>
		<div id="graph"></div>
		<ul id="ul"></ul>
		
	</body>
</html>