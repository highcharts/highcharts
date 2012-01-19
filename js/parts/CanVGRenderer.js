/* ****************************************************************************
 *                                                                            *
 * START OF ANDROID < 3 SPECIFIC CODE. THIS CAN BE REMOVED IF YOU'RE NOT      *
 * TARGETING THAT SYSTEM.                                                     *
 *                                                                            *
 *****************************************************************************/
var CanVGRenderer,
	CanVGController;

if (useCanVG) {
	/**
	 * The CanVGRenderer is empty from start to keep the source footprint small.
	 * When requested, the CanVGController downloads the rest of the source packaged
	 * together with the canvg library.
	 */
	CanVGRenderer = function () {
		// Empty constructor
	};

	/**
	 * Handles on demand download of canvg rendering support.
	 */
	CanVGController = (function () {
		// List of renderering calls
		var deferredRenderCalls = [];

		/**
		 * When downloaded, we are ready to draw deferred charts.
		 */
		function drawDeferred() {
			each(deferredRenderCalls, function (fn) {
				fn();
				erase(deferredRenderCalls, fn);
			});
		}

		return {
			push: function (func) {
				deferredRenderCalls.push(func);
			},
			download: function (scriptLocation) {
				var head = doc.getElementsByTagName('head')[0],
					scriptAttributes = {
						type: 'text/javascript',
						src: scriptLocation,
						onload: function () {
							drawDeferred();
						}
					};

				createElement('script', scriptAttributes, null, head);
			}
		};
	}());
} // end CanVGRenderer

/* ****************************************************************************
 *                                                                            *
 * END OF ANDROID < 3 SPECIFIC CODE                                           *
 *                                                                            *
 *****************************************************************************/

/**
 * General renderer
 */
Renderer = VMLRenderer || CanVGRenderer || SVGRenderer;
