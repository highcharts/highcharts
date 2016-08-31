<?php

require_once('../settings.php');
define('JQUERY_VERSION', isset($_SESSION['jQueryVersion']) ? $_SESSION['jQueryVersion'] : Settings::$jQueryVersion);


/**
 * getBrowser function from http://php.net/manual/en/function.get-browser.php#101125
 */
function getBrowser() { 
    $u_agent = $_SERVER['HTTP_USER_AGENT']; 
    $bname = 'Unknown';
    $platform = 'Unknown';
    $version= "";
    $ub = "";
    
    //First get the platform?
    if (preg_match('/linux/i', $u_agent)) {
        $platform = 'linux';
    }
    elseif (preg_match('/macintosh|mac os x/i', $u_agent)) {
        $platform = 'mac';
    }
    elseif (preg_match('/windows|win32/i', $u_agent)) {
        $platform = 'windows';
    }

    // Next get the name of the useragent yes seperately and for good reason
    if(preg_match('/MSIE/i',$u_agent) && !preg_match('/Opera/i',$u_agent)) 
    { 
        $bname = 'Internet Explorer'; 
        $ub = "MSIE"; 
    } 
    elseif(preg_match('/Firefox/i',$u_agent)) 
    { 
        $bname = 'Mozilla Firefox'; 
        $ub = "Firefox"; 
    } 
    elseif(preg_match('/Chrome/i',$u_agent)) 
    { 
        $bname = 'Google Chrome'; 
        $ub = "Chrome"; 
    } 
    elseif(preg_match('/PhantomJS/i',$u_agent)) 
    { 
        $bname = 'PhantomJS'; 
        $ub = "PhantomJS"; 
    } 
    elseif(preg_match('/Safari/i',$u_agent)) 
    { 
        $bname = 'Apple Safari'; 
        $ub = "Safari"; 
    } 
    elseif(preg_match('/Opera/i',$u_agent)) 
    { 
        $bname = 'Opera'; 
        $ub = "Opera"; 
    } 
    elseif(preg_match('/Netscape/i',$u_agent)) 
    { 
        $bname = 'Netscape'; 
        $ub = "Netscape"; 
    } 

    // finally get the correct version number
    $known = array('Version', $ub, 'other');
    $pattern = '#(?<browser>' . join('|', $known) .
    ')[/ ]+(?<version>[0-9.|a-zA-Z.]*)#';
    if (!preg_match_all($pattern, $u_agent, $matches)) {
        // we have no matching number just continue
    }

    // see how many we have
    $i = count($matches['browser']);
    if ($i != 1) {
        //we will have two since we are not using 'other' argument yet
        //see if version is before or after the name
        if (strripos($u_agent,"Version") < strripos($u_agent,$ub)){
            $version= $matches['version'][0];
        }
        else {
            $version= $matches['version'][1];
        }
    }
    else {
        $version= $matches['version'][0];
    }

    // check if we have a number
    if ($version==null || $version=="") {$version="?";}

    return array(
        'userAgent' => $u_agent,
        'name'      => $bname,
        'version'   => $version,
        'platform'  => $platform,
        'pattern'   => $pattern,
        'parent'    => $bname . ' ' . $version
    );
} 



function getFramework($framework) {

	if ($framework === 'standalone') {
		return '
			<script src="http://code.highcharts.local/adapters/standalone-framework.src.js"></script>
			<script src="http://code.jquery.com/jquery-1.7.2.js"></script>
			<script>
			/**
			 * Register Highcharts as a plugin in the respective framework
			 */
			$.fn.highcharts = function () {
				var constr = "Chart", // default constructor
					args = arguments,
					options,
					ret,
					chart;

				if (typeof args[0] === "string") {
					constr = args[0];
					args = Array.prototype.slice.call(args, 1); 
				}
				options = args[0];

				// Create the chart
				if (options !== undefined) {
					options.chart = options.chart || {};
					options.chart.renderTo = this[0];
					chart = new Highcharts[constr](options, args[1]);
					ret = this;
				}

				// When called without parameters or with the return argument, get a predefined chart
				if (options === undefined) {
					ret = Highcharts.charts[attr(this[0], "data-highcharts-chart")];
				}	

				return ret;
			};


			</script>
		';

	} else {
		$file = '../../lib/jquery-' . JQUERY_VERSION . '.js';
		if (file_exists($file)) {
			copy($file, '../draft/jquery-' . JQUERY_VERSION . '.js');
			return '
				<script src="../draft/jquery-' . JQUERY_VERSION . '.js"></script>
			';
		} else {
			return '
				<script src="cache.php?file=http://code.jquery.com/jquery-' . JQUERY_VERSION . '.js"></script>
			';
		}
	}
}
?>