<?php
ini_set('display_errors', 'on');

$keyedIssues = json_decode(file_get_contents('pages/keyed-issues.json'));
$issues = $keyedIssues->issues;

$keywords = array(
	array('legend'),
	array('tooltip'),
	array('dataLabel', 'data label'),
	array('export'),
	array('rangeSelector', 'range selector'),
	array('navigator', 'scroller', 'scrollbar'),
	array('android'),
	array('stacking', 'stack')
);
$foundKeywords = array();

// Create an array of opened issues by date and closed by date
$openedByDate = array();
$closedByDate = array();
foreach ($issues as $issue) {

	$opened = substr($issue->created_at, 0, 10);
	if (isset($openedByDate[$opened])) {
		$openedByDate[$opened]++;
	} else {
		$openedByDate[$opened] = 1;
	}


	$closed = substr($issue->closed_at, 0, 10);
	if ($closed) {
		if (isset($closedByDate[$closed])) {
			$closedByDate[$closed]++;
		} else {
			$closedByDate[$closed] = 1;
		}
	} else { // still open
		foreach ($keywords as $words) {
			foreach ($words as $word) {
				if (stristr($issue->title, $word)) {
					if (!isset($foundKeywords[$words[0]])) {
						$foundKeywords[$words[0]] = array();
					}
					$foundKeywords[$words[0]][] = $issue;
				}
			}
		}
		
	}
}

// Now create an array with the total number of open issues by date
$startDate = strtotime('2010-06-01');
$endDate = strtotime($keyedIssues->meta->since);
$openIssues = 0;
$openByDate = array();
for ($time = $startDate; $time < $endDate; $time += 24 * 3600) {

	$date = strftime('%Y-%m-%d', $time);
	$opened = isset($openedByDate[$date]) ? $openedByDate[$date] : 0;
	$closed = isset($closedByDate[$date]) ? $closedByDate[$date] : 0;

	$openIssues += $opened;
	$openIssues -= $closed;

	//echo $date . ', ' . $opened . ', ' . $closed . ', ' . $openIssues . "\n";
	$openByDate[] = array(($time + 7200) * 1000,  $openIssues);
}


// Create flags for tags
$tags = json_decode(file_get_contents('pages/tags.json'));
$plotLines = array();
foreach ($tags as $tag) {
	$date = substr($tag->date, 0, 10);
	$time = strtotime($date);
	$text = $tag->name;
	if ($text[0] === 'v') {
		$text = '<span style="color:#AA1919">Highcharts ' . substr($text, 1) . '</span>';
	} else {
		$text = '<span style="color:#8BBC21">Highstock ' . substr($text, 11) . '</span>';
	}

	if (isset($plotLines[$time])) {
		$plotLines[$time]['label']['text'] .= " / $text";
	} else {
		$plotLines[$time] = array(
			'value' => $time * 1000,
			'width' => 1,
			'color' => 'silver',
			'label' => array(
				'text' => $text
			)
		);
	}
}
$plotLines = array_values($plotLines);

?><html>
<head>

	<title>Issue statistics</title>

	<script src="http://www.highcharts.local/lib/jquery-1.10.1.js"></script>
	<script src="http://code.highcharts.local/stock/highstock.js"></script>
	<link rel="stylesheet" href="http://www.highcharts.com/templates/yoo_symphony/css/template.css"/>
	<script>
		$(function () {
			$('#container').highcharts('StockChart', {
				chart: {
					marginRight: 50
				},
				rangeSelector: {
					selected: 4
				},
				xAxis: {
					plotLines: <?php echo json_encode($plotLines) ?>
				},
				series: [{
					type: 'area',
					name: 'Open issues',
					fillOpacity: 0.1,
					data: <?php echo json_encode($openByDate) ?>
				}]
			});

			$('#import').click(function () {
				$(this).html('Loading from GitHub...');
				$.get('import.php', function () {
					location.reload();
				});
			})
		});
	</script>
	<style type="text/css">
		li {
			list-style: none;
		}
		li a {
			text-decoration: none;
		}
		.issue-number {
			display: inline-block;
			width: 50px;
			font-weight: bold;
		}
		.keyword {
			margin: 1em;
			width: 30%;
			float: left;
		}
	</style>
</head>
<body>
	<h1>Highcharts open issues by date</h1>

	<button id="import">Import</button>

	<div id="container" style="height: 500px"></div>

	<div id="keywords">
		<?php foreach ($foundKeywords as $word => $issues) : ?>
			<div class="keyword">
				<h2>Keyword:  <?php echo $word ?></h2>
				<ul>
					<?php foreach ($issues as $issue) : ?>
					<li>
						<a href="<?php echo $issue->html_url ?>"><span class="issue-number">#<?php echo $issue->number ?></span> <?php echo $issue->title ?></a>
						<?php foreach ($issue->labels as $label) : ?>
							<span style="background-color: <?php echo $label->color ?>; border-radius: 2px; color: white; padding: 2px"><?php echo $label->name ?></span>
						<?php endforeach ?>
					</li>
					<?php endforeach ?>
				</ul>
			</div>
		<?php endforeach ?>
	</div>
</body>
</html>
