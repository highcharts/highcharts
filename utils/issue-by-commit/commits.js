
/* eslint-disable */
var ren,
	paths = [];

var mainFrame = window.parent.document.querySelector('frame#main'),
	mainLocation = mainFrame && mainFrame.contentWindow.location.href,
	isComparing = mainLocation && mainLocation.indexOf('view.php') > -1;

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

$(function() {
	var $active,
		month,
		commits,
		parentHierarchy = {};

	if (isComparing) {
		document.body.className = 'compare';

		$('#close').click(function () {
			window.parent.parent.document.querySelector('frameset')
				.setAttribute('cols', '400, *');
		});
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

		/*var items = [],
			item = [];
		log = log.split('\n');

		// On each commit, start new item
		log.forEach(function (line) {

			if (/commit [a-f0-9]{40}/.test(line)) {
				if (item.length) {
					items.push(item.join('\n'));
				}
				item.length = 0;
			}
			item.push(line);
		});
		items.push(item.join('\n'));*/

		$.each(log.split('\n'), function(i, line) {
			
			/*var commit = item.match(/commit ([a-f0-9]{40})/)[1],
				$li = $('<li>').appendTo('#ul').data({ commit: commit }),
				date = item.match(/Date:   ([^\n]+)/)[1],
				message = item.match(/     ([^\n]+)/)[1],
				dateObj = new Date(date),
				branchI = parseInt(item.indexOf('*'), 10) / 2;
				*/

			if (line.indexOf('<br>') > -1) {
				line = line.split('<br>');
				
				var graph = line[0],
					commit = line[1],
					$li = $('<li>').appendTo('#ul').data({ commit: commit }),
					date = line[2],
					dateObj = new Date(
						date.substr(0, 4),
						date.substr(5, 2) - 1,
						+date.substr(8, 2),
						+date.substr(11, 2),
						date.substr(14, 2)
					),
					message = line[3],
					parents = line[4].split(' '),
					branchI = graph.indexOf('*') / 2,
					indentLevel = graph.length / 2;
				
				if (dateObj.getMonth() !== month) {
					$('<h3>' + ['January', 'February', 'March', 'April', 'May',
							'June', 'July', 'August', 'September', 'October',
							'November', 'December'][dateObj.getMonth()] +
						 ' ' + dateObj.getFullYear() + '</h3>')
						.appendTo($li);
					month = dateObj.getMonth();
				}

				// Parents
				/*if (parentHierarchy[commit] !== undefined) {
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
				}*/
				
				var par = $('<div>')
					.attr({
						'class': 'parents',
						title: 'hash: '+ commit + ', parent: ' +
							parents.join(', '),
						id: 'dot-' + commit
					})
					.data({
						hash: commit,
						parents: parents,
						left: branchI * 10,
						color: colors[branchI]
					})
					.html('<div class="disc" style="background-color: ' +
						colors[branchI] + 
						';margin-left:' + (branchI * 10) + 'px"></div>')
					.appendTo($li);

				$('<a>')
					.attr({
						href: isComparing ? 
							mainLocation + '&rightcommit=' + commit :
							'main.php?commit='+ commit,
						target: 'main',
						'class': 'message'
					})
					.css({
						marginLeft: 20 + 10 * indentLevel
					})
					.click(function() {
						$active && $active.removeClass('active').addClass('visited');
						$(this).addClass('active');
						$active = $(this);
					})
					.html(message)
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
					.css({
						marginLeft: 20 + 10 * indentLevel
					})
					.appendTo($li);
			}
		});

		drawGraph();
	});

	$(window).bind('resize', drawGraph);
});