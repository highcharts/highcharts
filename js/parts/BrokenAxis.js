wrap(Axis.prototype, 'init', function (proceed, chart, userOptions) {

	var breaks;

	proceed.call(this, chart, userOptions);

	breaks = this.options.breaks;
	if (breaks) {

		// Make the axis use val2lin and lin2val for post translation
		this.postTranslate = true;

		this.val2lin = function (val) {
			var brk;

			for (var i = 0; i < breaks.length; i++) {
				brk = breaks[i];
				if (val >= brk.to) {
					val -= brk.to - brk.from;
				} else if (val >= brk.from) {
					val -= val - brk.from;
				}
			}
			return val;
		}

		this.lin2val = function (val) {
			return val;
		}

		// POC of increasing the translation slope to achieve the correct min and max
		this.setAxisTranslation = function (saveOld) {
			Axis.prototype.setAxisTranslation.call(this, saveOld);

			this.transA *= 1.3;
		}
	}

});