<?php
ini_set('display_errors', 'on');

//define('EXPORT_SERVER', 'http://export.highcharts.com');
define('EXPORT_SERVER', 'http://localhost:8080/export/');

/**
 * Send a post request
 * @param $url
 * @param $params
 * @return unknown_type
 */

function post($url, $data) {
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_POST, true);
	
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
	$output = curl_exec($ch);
	$info = curl_getinfo($ch);
	curl_close($ch);
	
	return $output;
}

// http://www.thismayhem.com/php/comparing-images-with-php-gd/
function dissimilarityIndexCalculator($str_img,$str_match){
	
	//Try to make images from the urls, on fail return false.
	$img_source = @ImageCreateFromString($str_img);
	$img_match  = @ImageCreateFromString($str_match);
	if (!$img_source || !$img_match) return false;

	//Get image sizes.
	//list($int_img_source_width, $int_img_source_height)     = getimagesizefromstring ($str_img);
	//list($int_img_match_width, $int_img_match_height)   = getimagesizefromstring ($str_match);
	$int_img_source_width = imagesx($img_source);
	$int_img_source_height = imagesy($img_source);
	$int_img_match_width = imagesx($img_match);
	$int_img_match_height = imagesy($img_match);

	//Resample to 16px each
	$img_16source = imagecreatetruecolor(16,16);
	$img_16match  = imagecreatetruecolor(16,16);

	imagecopyresampled( $img_16source,
		$img_source,
		0, 0, 0, 0, 16, 16,
		$int_img_source_width,
		$int_img_source_width
	);
	imagecopyresampled( $img_16match,
		$img_match,
		0, 0, 0, 0, 16, 16,
		$int_img_match_width,
		$int_img_match_width
	);

	$difference = 0;
	for($x=0;$x < 16;$x++){
		for($y=0;$y < 16;$y++){

			//Get the color of the resulting image
			$arr_img_source_color[$x][$y] =
				imagecolorsforindex($img_16source,imagecolorat($img_16source,$x,$y));
			$arr_img_match_color[$x][$y]  =
				imagecolorsforindex($img_16match,imagecolorat($img_16match,$x,$y));

			//Calculate the index
			//echo $arr_img_source_color[$x][$y]['red']  ." - ". $arr_img_match_color['red'] ."\n";
			$difference  += abs($arr_img_source_color[$x][$y]['red']   - $arr_img_match_color[$x][$y]['red'])       +
			abs($arr_img_source_color[$x][$y]['green'] - $arr_img_match_color[$x][$y]['green']) +
			abs($arr_img_source_color[$x][$y]['blue']  - $arr_img_match_color[$x][$y]['blue']);
		}
	}
	
	$difference = $difference/256;

	//Return an array with the information
	$arr_return = array( 
		"dissimilarityIndex" => $difference,
		"sourceImage" => array( 
			"width"       => $int_img_source_width,
			"height"      => $int_img_source_height
			//"colors"    => $arr_img_source_color
		),
		"matchImage"  => array(
			"width"       => $int_img_match_width,
			"height"      => $int_img_match_height
			//"colors"    => $arr_img_match_color
		)
	);
	return $arr_return;
	
}

$leftSVG = $_POST['leftSVG'];
$rightSVG = $_POST['rightSVG'];

ini_set('magic_quotes_gpc', 'off');
if (get_magic_quotes_gpc()) {
	$leftSVG = stripslashes($leftSVG);
	$rightSVG = stripslashes($rightSVG);
}

$leftImage = post(EXPORT_SERVER, array(
	'width' => '300',
	'type' => 'image/png',
	'svg' => $leftSVG
));

$rightImage = post(EXPORT_SERVER, array(
	'width' => '300',
	'type' => 'image/png',
	'svg' => $rightSVG
));

$difference = dissimilarityIndexCalculator($leftImage, $rightImage);

// Check if temp folder exists?
if (!file_exists("temp")) {
	mkdir("temp");
}


// Save on disk for viewing
$filename = strftime('%Y-%m-%d-') . md5(rand());
file_put_contents("temp/left.png", $leftImage);
file_put_contents("temp/right.png", $rightImage);
$difference['sourceImage']['url'] = "temp/left.png";
$difference['matchImage']['url'] = "temp/right.png";

// compare to reference
$path = str_replace('--', '/', $_POST['path']);
$tempFile = 'temp/compare.json';
$compare = file_exists($tempFile) ? json_decode(file_get_contents($tempFile)) : new stdClass;
$browser = get_browser(null, true);
$key = $browser['parent'];

if (isset($compare->$path->$key)) {  
	$difference['reference'] = $compare->$path->$key;
} elseif (isset($difference['dissimilarityIndex'])) {
	@$compare->$path->$key = $difference['dissimilarityIndex'];
}
file_put_contents($tempFile, json_encode($compare));

echo json_encode($difference);

?>