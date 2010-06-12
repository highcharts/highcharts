<?php 
// The x value is the current JavaScript time, which is the Unix time multiplied by 1000.
$x = time() * 1000;
// The y value is a random number
$y = rand(0, 100);

// Return it in the form of a JavaScript array
echo "[$x, $y]";
?>