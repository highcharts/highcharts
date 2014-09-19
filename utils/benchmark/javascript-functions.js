
// Global variables
var folders, 
	results,
	rep,		// Repetitions of individual tests (used in runchart()).
	resultArr = [],
	allTotal = 0,
	testsRanArr = [],
	testsToRun = [],
	run = 'all';


/* Function used with onclick (buttons).
**/
	function buttonClick(clickedId) {

		var result,
			ids = clickedId.split('_');


		// [0]: group of the script to be loaded, also name of its folder.
		// all: Runs all scripts from all folders.
		// [1]: Specific or all scripts within the folder.
		if (ids[0] == 'all') {

			// Stores the press of this button.
			$.get('save-result.php', 
				{ 
					allclicked: 'yes'
				}
			);

			getScriptnames(folders[0], getScripts);

		} else if (ids[1] == 'all') {
			run = 'group';
			getScriptnames(ids[0], getScripts);

		} else {
			loadScript(ids[0]+'/'+ids[1]+'.js');
		}

		resultArr = [];
		testsRanArr = [];
		testsToRun = [];
	}


/* The function picks up filenames(scriptnames)
 * using ajax to call a php script. 
 * On success the function recursively calls itself when document is ready.
**/
	function getScriptnames(group, successCallback, callback) {

		callback = callback ? callback : false;
		$.get('dir-struct.php', 
			{ 
				group: group
			}, 
			function(data) {
				testsToRun[group] = data.length;
				successCallback(group, data, callback);
			},
			'json'
		);
	}

/* Function to be used as a callback for getScriptNames.
 * Creates new rows of individual tests if any
**/
	function createRows(group, tests, callback) {
		var list = document.getElementById('testList');

		$.each(tests, function(index) {
			id = tests[index].split('.');
			$(list).append(
				$('<li>').text(id[0]).append(
						$('<button>').attr('class', 'run').attr('id', group+'_'+id[0]).attr('onClick', 'buttonClick(this.id);').text('Run').add(
							$('<span>').attr('class', 'result').attr('id', group+id[0]+'Result').text('-')
						)
					)
				)
		});

		$(list).append(
			$('<li>').attr('class', 'total').text('Group Result').append(
				$('<span>').attr('class', 'result '+group+'Result').text('-')
				)
			);

		callback();
	}



/* This function recieves an array of testnames to be run.
 * Calls loadscript on each of the tests.
**/
function getScripts(group, tests) {

	if (tests.length) {
		$.each(tests, function(index) {
			loadScript(group+'/'+tests[index]);
		});
	} else if (run == 'all') {
		var groupIndex = array_search(group, folders);
		groupIndex++;
		window.location = 'index.php?run=all&groupIndex='+groupIndex+'&result=0';
	}
}

/* Using ajax this function finds the correct script
 * from a specific folder and returns it as text.
 * The callback converts the text to runable code,
 * and sends it to runChart().
**/
	function loadScript(test) {

		$.ajax({
			url: 'tests-js/'+test,
			success: function(data) {
				tst = new Function([], "return " + data);
				options = tst();
				runChart(options, test);
				},
			dataType: 'text'
		});
	}

/* Function that recieves options loaded by loadScript().
 * Loops through repetitions while destroying chart and starting new date every time.
 * total is not sent to displayresult before the last repetition.
**/ 
	function runChart(options, test) {

		var total = 0,
			start,
			series;

		for (var i = 1; i <= rep; i++) {

			if ($('#container').highcharts()) {
				$('#container').highcharts().destroy();
			}

			// Highstock removes options.series on destruction, probably a bug, but we throw in a workaround
			// here so we can test against older versions.
			if (options._constructor === 'StockChart') {
				if (options.series)	{
					series = options.series;
				} else if (series) {
					options.series = series;
				}
			}
			
			
			start = new Date();
			new Highcharts[options._constructor || 'Chart'](options, function() { 

				total = total ? total + Math.round((new Date() - start)) : Math.round((new Date() - start));



				if (i == rep) {
					displayResult(Math.round((total / rep)), test);
				}
			});
		}
	}


/* Function that prints result and total elements.
**/
	function displayResult(result, lastTest) {

		var groupTest = lastTest.split('.')[0],
			group = groupTest.split('/')[0],
			groupTest = groupTest.replace('/',''),
			groupIndex = array_search(group, folders);

		$.get('save-result.php', 
			{ 
				id: groupTest, 
				result: result
			}, 
			function() {
				// Adds the result of the individual test run to its array
				resultArr[group] = resultArr[group] ? resultArr[group] + result : result;
				testsRanArr[group] = testsRanArr[group] ? testsRanArr[group] + 1 : 1;

				if (testsRanArr[group] === testsToRun[group]) {
					groupIndex++;
					window.location = 'index.php?run='+run+'&groupIndex='+groupIndex+'&result='+resultArr[group];

				} else {
					$('#'+groupTest+'Result').html(result);
				}
			}
		);
	}

/* Function that updates results.
 * Results is made of the $_SESSION variable, set in index.php.
 * Adds up allTotal and displays it if its a number, 
 * then sets it to null incase further loads of the function.
 * Probably not very pretty..
**/

	function resultUpdate() {

		$.each(results, function(test, value) {
			if(typeof allTotal === 'number') {
				$.each(folders, function(index, folder) {
					if (test == folder) {
						allTotal = allTotal + parseInt(value);
					}
				});	
			}

			if($('#'+test+'Result').length) {
				$('#'+test+'Result').html(value);
			} else {
				$('.'+test+'Result').html(value);
			}

			
		});

		if (allTotal) {
			$('#allResult').html(allTotal);
		}
		allTotal = null;
	};

/* js equivalent to php's array_search.
**/
	function array_search (needle, haystack, argStrict) {
	// http://kevin.vanzonneveld.net
	// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +      input by: Brett Zamir (http://brett-zamir.me)
	// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// *     example 1: array_search('zonneveld', {firstname: 'kevin', middle: 'van', surname: 'zonneveld'});
	// *     returns 1: 'surname'
	// *     example 2: ini_set('phpjs.return_phpjs_arrays', 'on');
	// *     example 2: var ordered_arr = array({3:'value'}, {2:'value'}, {'a':'value'}, {'b':'value'});
	// *     example 2: var key = array_search(/val/g, ordered_arr); // or var key = ordered_arr.search(/val/g);
	// *     returns 2: '3'

	var strict = !!argStrict,
	key = '';

	if (haystack && typeof haystack === 'object' && haystack.change_key_case) { // Duck-type check for our own array()-created PHPJS_Array
		return haystack.search(needle, argStrict);
	}
	if (typeof needle === 'object' && needle.exec) { // Duck-type for RegExp
		if (!strict) { // Let's consider case sensitive searches as strict
			var flags = 'i' + (needle.global ? 'g' : '') +
			(needle.multiline ? 'm' : '') +
			(needle.sticky ? 'y' : ''); // sticky is FF only
			needle = new RegExp(needle.source, flags);
		}
		for (key in haystack) {
			if (needle.test(haystack[key])) {
				return key;
			}
		}
		return false;
	}

	for (key in haystack) {
		if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
			return key;
		}
	}
	return false;
	}

$(function () {
	$('form#setup select').each(function () {
		$(this).bind('change', function () {
			$('form#setup select').css('disabled', true);
			$('form#setup').submit();
		});
	})
})
