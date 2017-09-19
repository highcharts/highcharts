import H from '../parts/Globals.js';
var each = H.each,
	extend = H.extend,
	isBoolean = function (x) {
		return typeof x === 'boolean';
	},
	pick = H.pick;
// TODO Combine buildTree and buildNode with setTreeValues
// TODO Remove logic from Treemap and make it utilize this mixin.
var setTreeValues = function setTreeValues(tree, options) {
	var idRoot = options.idRoot,
		mapIdToNode = options.mapIdToNode,
		nodeRoot = mapIdToNode[idRoot],
		levelIsConstant = options.levelIsConstant,
		points = options.points,
		point = points[tree.i],
		optionsPoint = point && point.options || {},
		childrenTotal = 0,
		children = [],
		value,
		visible = (
			idRoot === tree.id ||
			(isBoolean(options.visible) ? options.visible : false)
		);
	// First give the children some values
	each(tree.children, function (child) {
		child = setTreeValues(child, {
			idRoot: options.idRoot,
			levelIsConstant: options.levelIsConstant,
			mapIdToNode: options.mapIdToNode,
			points: options.points,
			visible: visible
		});
		children.push(child);
		if (child.visible) {
			childrenTotal += child.val;
		}
	});
	visible = childrenTotal > 0 || visible;
	// Set the values
	value = pick(optionsPoint.value, childrenTotal);
	extend(tree, {
		children: children,
		childrenTotal: childrenTotal,
		isLeaf: tree.visible && !childrenTotal,
		levelDynamic: tree.level - (levelIsConstant ?  nodeRoot.level : 0),
		name: pick(point && point.name, ''),
		val: value,
		visible: visible
	});
	return tree;
};

var result = {
	setTreeValues: setTreeValues
};
export default result;
