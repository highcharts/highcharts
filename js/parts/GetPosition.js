
/**
 * Loop up the node tree and add offsetWidth and offsetHeight to get the
 * total page offset for a given element. Used by Opera and iOS on hover and
 * all browsers on point click.
 * 
 * @param {Object} el
 * 
 */
function getPosition (el) {
	var p = { left: el.offsetLeft, top: el.offsetTop };
	while ((el = el.offsetParent))	{
		p.left += el.offsetLeft;
		p.top += el.offsetTop;
		if (el != doc.body && el != doc.documentElement) {
			p.left -= el.scrollLeft;
			p.top -= el.scrollTop;
		}
	}
	return p;
}

