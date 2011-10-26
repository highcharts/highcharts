/**
 * @license @product.name@ JS v@product.version@ (@product.date@)
 * QWrap adapter
 *
 * @author Akira , WED Team
 *
 * Feel free to use and modify this script.
 * Highcharts license: www.highcharts.com/license.
 */

(function(){

var AH = QW.ArrayH,
	EH = QW.EventTargetH,
	CEH = QW.CustEventTargetH,
	Dom = QW.Dom,
	Anim = QW.Anim,
	Easing = QW.ElAnim.Easing,
	mix = QW.ObjectH.mix;

var _pathAnim;

HighchartsAdapter = {
	/**
	 * Initialize the adapter. This is run once as Highcharts is first run.
	 * @param {Object} pathAnim The helper object to do animations across adapters.
	 */
	init: function (pathAnim) {
		_pathAnim = pathAnim;
	},
	each  :  AH.forEach,
	grep  :  AH.filter,
	map   :  AH.map,
	merge :  function () { // the built-in prototype merge function doesn't do deep copy
		function doCopy(copy, original) {
			var value, key;
			
			for (key in original) {
				value = original[key];
				if (value && typeof value === 'object' && value.constructor !== Array &&
						typeof value.nodeType !== 'number') {
					copy[key] = doCopy(copy[key] || {}, value); // copy

				} else {
					copy[key] = original[key];
				}
			}
			return copy;
		}

		function merge() {
			var args = arguments,
				i,
				retVal = {};

			for (i = 0; i < args.length; i++) {
				retVal = doCopy(retVal, args[i]);

			}
			return retVal;
		}

		return merge.apply(this, arguments);
	},
	addEvent : function (el, eventType, fn){
		if(el.addEventListener || el.attachEvent){
			EH.on(el, eventType, fn);
		}else{
			CEH.createEvents(el, [eventType]);
			CEH.on(el, eventType, fn);
		}
	},
	removeEvent : function (el, eventType, fn) {
		if(el.addEventListener || el.attachEvent){
			EH.un(el, eventType, fn);
		}else{
			CEH.createEvents(el, [eventType]);
			CEH.un(el, eventType, fn);
		}		
	},
	fireEvent : function(el, type, eventArguments, defaultFunction){
		var event = mix({type:type, target:el}, eventArguments);
		if(el.addEventListener || el.attachEvent){
			EH.fire(el, type);
			if(defaultFunction){
				defaultFunction(event);
			}
		}
		else{
			CEH.createEvents(el, [type]);
			if(CEH.fire(el, type, eventArguments) && defaultFunction){
				defaultFunction(event);
			}
		}
	},
	animate : function(el, params, options){
		var attrs = {};
		var dur = options.duration || 500;
		var easing = options.easing || Easing.easeNone;
		var callback = options.callback;

		for (var key in params) {
			attrs[key] = {from: el.attr(key) || 0, to:params[key]};
		}
		if(el.__anim){
			el.__anim.cancel();
			el.__anim = null;
		}

		function step(per) {
			//console.log([per, key, from + easing(per, to-from)]);
			for(var key in attrs){
				if('d' == key){
					if(attrs[key].from){
						var value = _pathAnim.step(attrs[key].from.split(' ') , attrs[key].to, per, attrs[key].to);
						el.attr(key, value);
					}else if(per >= 1){
						el.attr(key, attrs[key].to);
					}
				}else{
					el.attr(key, attrs[key].from + easing(per, attrs[key].to-attrs[key].from));
				}
			}
		}
		var anim = new Anim(step,dur);
		if(callback){
			anim.on('end', callback);
		}
		el.__anim = anim;
		anim.start();
	},
	stop : function(el){
		if(el.__anim){
			el.__anim.cancel();
			el.__anim = null;
		}
	}
}
})();