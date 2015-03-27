<?php
ini_set('display_errors', 1);

session_start();

@$path = $_GET['path'];
if (!preg_match('/^[a-z\-]+\/[a-z0-9\-\.]+\/[a-z0-9\-,]+$/', $path)) {
	die ('Invalid sample path input');
}


$fullpath = dirname(__FILE__) . '/../../samples/' . $path;


// Get source
$html = @file_get_contents("$fullpath/demo.html");
$css = @file_get_contents("$fullpath/demo.css");
$js = @file_get_contents("$fullpath/demo.js");

?><html>
<head>
	<style type="text/css">
		body {
			margin: 0;
		}
		h4 {
			border-bottom: 1px solid silver;
			margin: 0;
			padding: 0 5px;
			font-family: Arial, Verdana;
			font-size: 12px;
			color: white;
			background: #34343e;
		}
		.html .CodeMirror {
			height: 120px;
		}
		.css .CodeMirror {
			height: 120px;
		}

	</style>
	<script src="//cdnjs.cloudflare.com/ajax/libs/codemirror/4.0.3/codemirror.min.js"></script>
	<link href="//cdnjs.cloudflare.com/ajax/libs/codemirror/4.0.3/codemirror.min.css" rel="stylesheet" type="text/css" />
	<script src="//cdnjs.cloudflare.com/ajax/libs/codemirror/4.0.3/mode/javascript/javascript.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/codemirror/4.0.3/mode/xml/xml.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/codemirror/4.0.3/mode/htmlmixed/htmlmixed.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/codemirror/4.0.3/mode/css/css.min.js"></script>
	<script>

		function jsSize() {
			var el = document.querySelector('.js .CodeMirror');
			el.style.height = (document.body.offsetHeight - el.offsetTop - 20) + 'px';
		}
		window.onload = function () {
  			CodeMirror.fromTextArea(document.getElementById('html'), {
    			mode: "htmlmixed",
    			readOnly: true
  			});
  			if (document.getElementById('css')) {
				CodeMirror.fromTextArea(document.getElementById('css'), {
	    			mode: "css",
	    			readOnly: true
	  			});
			}
			CodeMirror.fromTextArea(document.getElementById('js'), {
    			mode: "javascript",
    			readOnly: true
  			});

  			jsSize();
		}
		window.resize = jsSize;

	</script>
</head>
<body>
	<h4>HTML</h4>
	<div class="html">
		<textarea id="html"><?php echo $html; ?></textarea>
	</div>

	<?php if ($css) : ?>
	<h4>CSS</h4>
	<div class="css">
		<textarea id="css"><?php echo $css; ?></textarea>
	</div>
	<?php endif ?>


	<h4>JavaScript</h4>
	<div class="js">
		<textarea id="js"><?php echo $js; ?></textarea>
	</div>
</body>
</html>