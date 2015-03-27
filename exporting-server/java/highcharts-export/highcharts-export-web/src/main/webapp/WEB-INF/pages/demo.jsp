<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<title>Highcharts export server</title>
<link rel="stylesheet" type="text/css" href="resources/css/demo.css" />
<link rel="stylesheet" type="text/css" href="resources/css/codemirror.css" />
<script src="resources/js//jquery-1.11.0.min.js"></script>
<script src="resources/js/codemirror-compressed.js"></script>
<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Source+Sans+Pro:200,400,700,400italic" type="text/css" />
<script>
	var editors = [];

	$(document).ready(function() {

		var enableEditor = function(id) {
			if (id === 'options') {
				editors[0] = CodeMirror.fromTextArea($('textarea#options')[0], {
					lineNumbers : true,
					matchBrackets : true,
					tabMode : "indent",
					mode : "text/javascript",
					lineWrapping : true
				});
			} else {
				// options for svg editor
				editors[1] = CodeMirror.fromTextArea($('textarea#svg')[0], {
					lineNumbers : true,
					mode : {
						name : "xml",
						alignCDATA : true
					},
					matchBrackets : true,
					tabMode : "indent",
					lineWrapping : true
				});
			}
		};

		$('#preview').click(function () {
			runPOST();
			return false;
		});

		// attach eventhandler to radio fields
		$('input[type="radio"]').change(function() {
			var checked = this.id, other, html;
			// which editor is checked/ should be visible
			checked === 'svg' ? other = 'options' : other = 'svg';
			// get html source from the div outside of the form
			$('div#' + checked).html($('div#toggle').html());
			/* move the html of the previous editor outside the form,
			remove first Codemirror wrapper */
			$('div#' + other + ' div.CodeMirror-wrap').remove();

			$('div#toggle').html($('div#' + other).html());
			// empty the container which held the previous editor.
			$('div#' + other).html('');
			// enable codemirror for texarea
			enableEditor(checked);

		});

		// default radio #config is selected
		$('input#options').prop('checked', true);

		enableEditor('options');

		// callback editor
		editors[3] = CodeMirror.fromTextArea($('textarea#callback')[0], {
			id : 'test',
			lineNumbers : true,
			matchBrackets : true,
			tabMode : "indent",
			mode : "text/javascript",
			lineWrapping : true
		});

	});

	/**
	 * Preview an async generated image
	 */
	function preview (filename) {
		if ($('#type').val() === 'application/pdf') {

    		$('#container').html('<iframe style="width:600px;height:400px" src="./' + filename + '"></iframe>')
    	} else {
    		$('#container').html('<img src="./' + filename + '"/>');
    	}
	}

	/**
	 * Run a post and receive back an image URL async
	 */
    function runPOST() {

    	var dataString = 'async=true',
    		xdr,
			idx;

    	$('#container').html('Loading....');

		for(idx = 0; idx < editors.length; idx++) {
			// ensure saving to textarea before serializing the form
			if(editors[idx]) {
				editors[idx].save();
			}
		}

		$.each($('#exportForm').serializeArray(), function (i, pair) {
    		dataString += '&' + pair.name + '=' + pair.value;
    	});

    	if (window.XDomainRequest) {
            xdr = new XDomainRequest();
            xdr.open("post", './?' + dataString);
            xdr.onload = function () {
                preview(xdr.responseText);
            };
            xdr.send();
        } else {
            $.ajax({
                type: 'POST',
                data: dataString,
                url: './',
                success: function (data) {
                	preview(data);
                },
                error: function (err) {
                    $('#container').html('Error: ' + err.statusText);
                }
            });
        }

    }
</script>
</head>
<body>
	<div id="top">
		<a href="http://www.highcharts.com" title="Highcharts Home Page"
			id="logo"><img alt="Highcharts Home Page"
			src="http://www.highcharts.com/templates/highsoft_colorful/images/logo.svg" border="0"></a>
	</div>

	<div id="wrap">
		<form id="exportForm" action="./" method="POST">

			<h1>Highcharts Export Server</h1>
		
			<p>This page allows you to experiment with different options for the export server.</p>

			<div>
				<input id="options" title="Highcharts config object" type="radio"
					name="content" value="options"> 
				<label for="options"
					class="radio">Highcharts config object (JSON)</label> 
			</div>

			<div>
				<input id="svg" title="svg xml content" type="radio" name="content"
					value="svg"> 
				<label for="svg" class="radio">SVG
					(XML) </label>
			</div>

			<div id="options">
				<label id="options" for="options">Options</label>
				<div class="info">Your Highcharts
					configuration object.</div>
				<textarea id="options" name="options" rows="12" cols="30"><%@include
						file="/WEB-INF/jspf/config.js"%></textarea>
			</div>
			<div id="svg"></div>
			<label for="type">Image file format</label> 
			<select name="type" id="type">
				<option value="image/png">image/png</option>
				<option value="image/jpeg">image/jpeg</option>
				<option value="image/svg+xml">image/svg+xml</option>
				<option value="application/pdf">application/pdf</option>
			</select>

			<label for="width">Width</label>
			<div class="info">The exact pixel width of the exported image.
				Defaults to <code>chart.width</code> or <code>600px</code>. Maximum width is <code>2000px</code>.</div>
			
			<input id="width" name="width" type="text" value="" /> <br/> 

			<label for="scale">Scale</label>
			<div class="info">A scaling factor for a higher image
				resolution. Maximum scaling is set to 4x. Remember that the width parameter has a higher
				precedence over scaling.</div>
			<input id="scale" name="scale" 	type="text" value="" />

			
			
			<label for="constructor">Constructor</label>
			<div class="info">
				Either <code>Chart</code> or <code>StockChart</code> depending on what product you use.
			</div>
			<select name="constr">
				<option value="Chart">Chart</option>
				<option value="StockChart">StockChart</option>
			</select> </br> <br /> <label for="callback">Callback</label>
			<div class="info">The callback will be fired after
				the chart is created.</div>
			<textarea id="callback" name="callback" rows="12" cols="30" /><%@include
					file="/WEB-INF/jspf/callback.js"%>
			</textarea>


			<input id="submit" type="submit" value="Download">
			<input id="preview" type="submit" value="Preview" />
		</form>
	</div>
	<div id="result">
		<h4>Preview</h4>
		<div id="container"></div>
	</div>

	<div id="toggle">
		<label id="svg" for="svg">Svg Content</label>
		<div id="oneline" class="info">Paste in 'raw' svg markup.</div>
		<textarea id="svg" name="svg" rows="12" cols="30"><%@include
				file="/WEB-INF/jspf/lexl.svg"%>
		</textarea>
	</div>
</body>
</html>
