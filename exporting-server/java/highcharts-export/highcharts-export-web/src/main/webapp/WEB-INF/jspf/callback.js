function(chart) {
	chart.renderer.label('This label is added in the callback', 100, 100)
	.attr({
		fill : '#90ed7d',
		padding: 10,
		r: 10,
		zIndex: 10
	})
	.css({
		color: 'black',
		width: '100px'
	})
	.add();
}