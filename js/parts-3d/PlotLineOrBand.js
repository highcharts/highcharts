/**
* Extension for plotLines and plotBands
**/
wrap(Highcharts.PlotLineOrBand.prototype, 'renderLabel', function (proceed, optionsLabel, path, isBand, zIndex) {
	/*
	Path positions:

	- Horizontal axis: (P0 = P1 and P6 = P7)
			P0 _____ P6
			|		  |
			|		  |
			|		  |
			P2 _____ P5
		   /		 /
		  /			/
		 P3 _____ P4

	- Vertical axis: (P2 = P3 and P4 = P5)
		P7________P6
		|		  | \
		|		  |  \
		|		  |   \
		P0_______P1   P4
				   \   |
					\  |
					 \ |
					  P2 
	*/	

	var plotLine = this,
		axis = plotLine.axis,
		chart = axis.chart,
		align = optionsLabel.align || 'left',
		vAlign = optionsLabel.verticalAlign || 'top',
		xy,
		indexes = isBand ? [11, 14, 20] : [5, 8, 5], // For a plotLine, we can reuse the same indexes, because bounding box doesn't change
		pathLength = path.length,
		horizontal,
		vertical,
		alignPath = path;

	if (chart.is3d()) {
		// For horizontal xAxis, plotBand has different points order:
		if (axis.horiz) {
			horizontal = [path[1], path[pathLength - 2], (path[1] + path[pathLength - 2]) / 2 ];
			vertical = [
				path[2],
				path[8],
				path[indexes[2]],
				path[indexes[1] + 3],
				(path[2] + path[indexes[2]]) / 2,
				(path[8] + path[indexes[1] + 3]) / 2
			];
		} else {
			horizontal = [path[4], path[7], (path[4] + path[7]) / 2];
			vertical = [
				path[indexes[2]],
				path[5],
				path[indexes[1]],
				path[8],
				(path[indexes[2]] + path[indexes[1]]) / 2,
				(path[5] + path[8]) / 2
			];
		}

		// Create artifical bounding boxes:
		xy = {
			left: {
				top: [horizontal[0], vertical[0]],
				bottom: [horizontal[0], vertical[1]],
				middle: [horizontal[0], (vertical[0] + vertical[1]) / 2]
			},
			right: {
				top: [horizontal[1], vertical[2]],
				bottom: [horizontal[1], vertical[3]],
				middle: [horizontal[1], (vertical[2] + vertical[3]) / 2]
			},
			center: {
				top: [horizontal[2], vertical[4]],
				bottom: [horizontal[2], vertical[5]],
				middle: [horizontal[2], (vertical[4] + vertical[5]) / 2]
			}
		}[align][vAlign];

		alignPath = [null, xy[0], xy[1], null, xy[0], xy[1], xy[0], xy[1]]; // Imitate original path
	}

	proceed.call(this, optionsLabel, alignPath, isBand, zIndex);
});