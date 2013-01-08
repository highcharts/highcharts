<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<spring:eval expression="@appProps['webapp.url']" var="url"/>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<title>Highcharts export server</title>
<link rel="stylesheet" type="text/css" href="resources/css/demo.css" />
<link rel="stylesheet" type="text/css"
	href="resources/lib/codemirror/codemirror.css" />
<script src="http://code.jquery.com/jquery-1.8.2.min.js"></script>
<script src="resources/lib/codemirror/codemirror.js"></script>
<script src="resources/lib/codemirror/mode/javascript/javascript.js"></script>
<script src="resources/lib/codemirror/mode/xml/xml.js"></script>
<script>
	$(document).ready(function() {

		var enableEditor = function(id) {
			if (id === 'options') {
				CodeMirror.fromTextArea($('textarea#options')[0], {
					lineNumbers : true,
					matchBrackets : true,
					tabMode : "indent",
					mode : "text/javascript",
					lineWrapping : true
				});
			} else {
				// options for svg editor
				CodeMirror.fromTextArea($('textarea#svg')[0], {
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

		// syntax coloring, indent from codemirror
		// callback editor
		CodeMirror.fromTextArea($('textarea#callback')[0], {
			id : 'test',
			lineNumbers : true,
			matchBrackets : true,
			tabMode : "indent",
			mode : "text/javascript",
			lineWrapping : true
		});

	});
</script>
</head>
<body>
	<div id="top">
		<a href="http://www.highcharts.com" title="Highcharts Home Page"
			id="logo"><img alt="Highcharts Home Page"
			src="resources/Highcharts-icon-160px.png" border="0"></a>
		<h1>Highcharts Export Server</h1>
	</div>
	<div id="wrap">
		<form id="exportForm" action="${url}" method="POST">
			<p>Use this page to experiment with the different options.</p>

			<input id="options" title="Highcharts config object" type="radio"
				name="content" value="options"> <label for="options"
				class="radio">Highcharts config object (JSON)</label> <input
				id="svg" title="svg xml content" type="radio" name="content"
				value="svg"> <label for="svg" class="radio">SVG
				(XML) </label>

			<div id="options">
				<label id="options" for="options">Options</label>
				<div id="oneline" class="info">Specify here your Highcharts
					configuration object.</div>
				<textarea id="options" name="options" rows="12" cols="30"><%@include
						file="/WEB-INF/jspf/config.js"%></textarea>
			</div>
			<div id="svg"></div>
			<label for="type">Image file format</label> <select name="type">
				<option value="image/png">image/png</option>
				<option value="image/jpeg">image/jpeg</option>
				<option value="image/svg+xml">image/svg+xml</option>
				<option value="application/pdf">application/pdf</option>
			</select> <br /> <label for="width">Width</label>
			<div class="info">The exact pixelwidth of the exported image.
				Defaults to chart.width or 600px. Maximum width is set to 2000px</div>
			<input id="width" name="width" type="text" value="" /> <br/> <label
				for="scales">Scale</label> <input id="scale" name="scale"
				type="text" value="" />
			<div class="info">Give in a scaling factor for a higher image
				resolution. Maximum scaling is set to 4x. Remember that the width parameter has a higher
				precedence over scaling.</div>
			<br /> <label for="constructor">Constructor</label>
			<div class="info">
				This will be either 'Chart' or 'StockChart' depending on if <br />you
				want a Highcharts or an HighStock chart.
			</div>
			<select name="constr">
				<option value="Chart">Chart</option>
				<option value="StockChart">StockChart</option>
			</select> </br> <br /> <label for="callback">Callback</label>
			<div id="oneline" class="info">The callback will be fired after
				the chart is created.</div>
			<textarea id="callback" name="callback" rows="12" cols="30" /><%@include
					file="/WEB-INF/jspf/callback.js"%>
			</textarea>
			<input id="submit" type="submit" value="Generate Image">
		</form>
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
