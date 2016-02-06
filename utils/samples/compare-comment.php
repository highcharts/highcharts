<?php 

$compare = json_decode(file_get_contents('temp/compare.json'));
$path = $_GET['path'];
$diff = $_GET['diff'];
$focus = @$_GET['focus'] === 'false' ? false : true;
$i = $_GET['i'];
$updateContents = false;


if (isset($_POST) && (@$_POST['submit'] || @$_POST['submit-actual'])) {
	$compare->$path->comment = (object) $_POST;
	file_put_contents('temp/compare.json', json_encode($compare, JSON_PRETTY_PRINT));
	$updateContents = true;
}

$comment = @$compare->$path->comment;


$symbols = array('check', 'exclamation-sign');
	
?><!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Comparison comment :: Highcharts Utils</title>
		<script src="cache.php?file=http://code.jquery.com/jquery.js"></script>
		<link type="text/css" rel="stylesheet" href="style.css" />
		
		<style type="text/css">
			.top-bar {
				display: none;
				color: white;
				font-family: Arial, sans-serif; 
				font-size: 0.8em; 
				padding: 0.5em; 
				height: 3.5em;
				background: #34343e;
				box-shadow: 0px 0px 8px #888;
			}
			
			.top-bar a {
				color: white;
				text-decoration: none;
				font-weight: bold;
			}
			td {
				font-size: 0.8em;
			}
			.desc {
				font-style: italic;
				color: #666;
			}

			input[type=text] {
				min-width: 200px;
			}
			textarea {
				vertical-align: top;
				min-width: 400px;
				height: 2em;
			}
			input[type=submit] {
				float: right;
			}

		</style>
		<script>

		$(function () {
			$('#submit-actual').click(function () {
				$('#diff').attr(
					'value',
					$(this).data('diff')
				);
			});
		});

		<?php if ($focus) : ?>
		$(function () {
			$('#title')[0].focus();
		});
		<? endif; ?>
		
		<?php if ($updateContents) : ?>
			if (window.parent.frames[0]) {
				var contentWin = (window.parent.parent || window.parent).frames[0],
					contentDoc = contentWin.document,
					li = contentDoc.getElementById('li<?php echo $i ?>');

				// Sample is different but approved
				<?php if ($comment->symbol === 'check' && $comment->diff == $diff): ?>
					$(li).addClass('approved');
				<?php else: ?>
					$(li).removeClass('approved');
				<?php endif; ?>

				$('.comment', li).html("<i class='icon-<?php echo $comment->symbol ?>' title='<?php echo $comment->title ?>'></i>" + 
					"<span class='comment-title'><?php echo $comment->title ?><br/>(Approved diff: <?php echo $comment->diff ?>)</span>");


				contentWin.countFails();
			}


		<?php endif ?>


		</script>
		
	</head>
	<body style="margin:0">


		<div class="top-bar">
			
			<h2 style="margin: 0; height: auto">Comparison Comment</h2>
			<div><?php echo $path ?></div>

		</div>

		<div style="margin: 10px">

			<small class="desc">If the symbol is "check" and the approved diff equals the reported diff, it will appear green in the list on the left.</small>
			<form action="" method="post">

				<table>
					<tr>
						<td>Symbol</td>
						<td>
							<select name="symbol">
								<?php 
								foreach ($symbols as $symbol) {
									$selected = $symbol == @$comment->symbol ? 'selected' : '';
									echo "
										<option name='symbol' $selected value='$symbol'>$symbol</option>
									";
								}
								?>
							</select>
						</td>
					<!-- /tr>
					<tr -->
						<td>Approved diff</td>
						<td><input type="text" id="diff" name="diff" value="<?php echo (@$comment->diff ? $comment->diff : $diff) ?>" /></td>
					<!-- /tr>
					<tr -->
						<td>Title</td>
						<td><textarea type="text" id="title" name="title"><?php echo @$comment->title ?></textarea></td>
					<!-- /tr>
					<tr -->
						<td></td>
						<td>
							<input type="submit" id="submit" name="submit" class="button" value="Approve" />

							<?php
							if (isset($comment) && $comment->diff != $diff) {
								echo "<input type='submit' name='submit-actual' id='submit-actual' data-diff='$diff' class='button' value='Approve $diff' />";
							}
							?>
						</td>
					</tr>
				</table>
			</form>
		</div>
	</body>
</html>
