<?php ini_set('display_errors', 'on'); ?>
<title>Issue import</title>
<?php

function getSSLPage($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
    //curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    	'User-Agent: highslide-software'
    ));
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_REFERER, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    $result = curl_exec($ch);
    curl_close($ch);
    return $result;
}

function showError($response) {
	if ($response->message) {
		echo "<div style='color:red; font-weight: bold'>$response->message</div>\n";
	} else {
		echo "<div style='color:red; font-weight: bold'>Unknown problem</div>\n";
	}
}

/*
function getTags() {

	$file = getSSLPage('https://api.github.com/repos/highslide-software/highcharts.com/tags');
	echo "\n<h2>Loaded tags</h2>\n";
	$tags = json_decode($file);

	if (is_array($tags)) {
		foreach ($tags as $tag) {
			$commitFile = "pages/" . $tag->commit->sha . '.json';
			if (!is_file($commitFile)) {
				file_put_contents(
					$commitFile, 
					getSSLPage('https://api.github.com/repos/highslide-software/highcharts.com/commits/' . $tag->commit->sha))
				);
			}
			$commit = json_decode(file_get_contents($commitFile));
			$tag->date = $commit->commit->author->date;
			echo "$tag->name <small>$tag->date</small><br/>";
		}
		file_put_contents("pages/tags.json", json_encode($tags));
	} else {
		showError($tags);
	}
}
*/
// Load issues

function rebuildHistory () {
	$states = array('open', 'closed');
	foreach ($states as $state) {
		$page = 1;
		$lastPage = $page + 9;


		while ($page <= $lastPage) {
			$file = getSSLPage("https://api.github.com/repos/highslide-software/highcharts.com/issues" .
				"?page=$page&state=$state");

			$issues = json_decode($file);
			if (is_array($issues)) {

				if (sizeof($issues) === 0) {
					echo "--- No more $state issues ---";
					break;
				}

				echo "\n<h2>Page: $state $page</h2>\n";
				
				foreach ($issues as $i => $issue) {
					echo '#' . $issue->number . ', ';
				}

				file_put_contents("pages/$state-$page.json", $file);
				$page++;
			} else {
				showError($issues);
				break;
			}
		}
	}
}

function incrementKeyedIssues($keyedIssues) {
	$states = array('open', 'closed');
	$since = $keyedIssues->meta->since;

	//$since = '2013-11-06T20:30:00Z';
	foreach ($states as $state) {
		$page = 1;
		$lastPage = $page + 19;


		while ($page <= $lastPage) {
			$file = getSSLPage("https://api.github.com/repos/highslide-software/highcharts.com/issues" .
				"?page=$page&state=$state&since=$since");

			$issues = json_decode($file);
			if (is_array($issues)) {

				if (sizeof($issues) === 0) {
					echo "<br/>--- No more $state issues ---";
					break;
				}

				echo "\n<h2>Page: $state $page</h2>\n";
				
				foreach ($issues as $i => $issue) {
					echo '#' . $issue->number . ', ';
					$number = $issue->number;
					$keyedIssues->issues->$number = $issue;
				}

				//file_put_contents("pages/$state-$page.json", $file);
				$page++;
			} else {
				if ($issues->message) {
					echo "<div style='color:red; font-weight: bold'>$issues->message</div>\n";
				} else {
					echo "<div style='color:red; font-weight: bold'>Unknown problem</div>\n";
				}
				break;
			}
		}
	}
	$keyedIssues->meta->since = strftime('%Y-%m-%dT%H:%M:%SZ', mktime());

	echo "<br/>Incremented to total " . sizeof($keyedIssues) . " issues.";
	return $keyedIssues;
}

function updateSinceLast () {


	echo "Loading issues since $since<br/>";
	
	// Add since:
	$keyedIssues = json_decode(file_get_contents('pages/keyed-issues.json'));
	$keyedIssues = incrementKeyedIssues($keyedIssues);

	file_put_contents(
		'pages/keyed-issues.json',
		json_encode($keyedIssues)
	);
}


function getKeyedIssuesFromDownloadedFiles() {
	$issues = array();
	$keyedIssues = array('issues' => array());
	$states = array('open', 'closed');

	foreach ($states as $state) {
		for ($page = 1; is_file("pages/$state-$page.json"); $page++) {

			$arr = json_decode(file_get_contents("pages/$state-$page.json"));

			$issues = array_merge($issues, $arr);
		}
	}
	foreach ($issues as $issue) {
		$number = $issue->number;
		$keyedIssues->issues->$number = $issue;
	}
	echo "Got " . sizeof($keyedIssues) . " issues from files.";
	return $keyedIssues;
	//echo json_encode($keyedIssues);
}

updateSinceLast();
//getTags();
//file_put_contents('pages/keyed-issues.json', json_encode(getKeyedIssuesFromDownloadedFiles()));

?>