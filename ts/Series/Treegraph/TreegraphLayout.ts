import TreegraphSeries from './TreegraphSeries';
import TreegraphPoint from './TreegraphPoint';

interface TreegraphLink extends TreegraphPoint {
    toNode: TreegraphNode;
    fromNode: TreegraphNode;
}

interface TreegraphNode extends TreegraphPoint {
    mod: number;
    thread: TreegraphNode | null;
    ancestor: TreegraphNode;
    shift: number;
    change: number;
    preX: number;
    relativeXPosition: number;
    linksFrom: TreegraphLink[];
    linksTo: TreegraphLink[];
    xPosition: number;
    yPosition: number;
}
// Walker algorythm of positioning the nodes in the treegraph improved by
// Buchheim to run in the linear time. Basic algorithm consists of post order
// traversal, which starts from going bottom up (first walk), and then pre order
// traversal top to bottom (second walk) where adding all of the modifiers is
// performed. http://dirk.jivas.de/papers/buchheim02improving.pdf
function walkerAlgorythm(series: TreegraphSeries): void {
    const nodes = series.nodes as TreegraphNode[];
    initValues(nodes);
    const root = nodes[0];
    if (root) {
        calculateInitialX(root, 0);
        firstWalk(root);
        secondWalk(root, -root.preX);
    }
}
// Init the values of the node. probably redundant, since this can be performed
// in the init of the chart, but might be useful for repositioning of the nodes
// on the update.
function initValues(nodes: TreegraphNode[]): void {
    nodes.forEach((node: TreegraphNode): void => {
        node.mod = 0;
        node.ancestor = node;
        node.thread = null;
        node.shift = 0;
        node.change = 0;
    });
}

// Adds the value to each node, which indicates, what is his sibling number.
function calculateInitialX(node: TreegraphNode, index: number): void {
    node.linksFrom.forEach((link, index): void => {
        calculateInitialX(link.toNode, index);
    });
    node.relativeXPosition = index;
}

// Get the parent of current node or return null for root of the tree.
function getParent(node: TreegraphNode): TreegraphNode | null {
    return node.linksTo[0] ? node.linksTo[0].fromNode : null;
}
// Check if the node is a leaf, so if it has any children.
function isLeaf(node: TreegraphNode): boolean {
    return !node.linksFrom.length;
}

function getFirstChild(node: TreegraphNode): TreegraphNode | null {
    return node.linksFrom[0] ? node.linksFrom[0].toNode : null;
}

// recursive post order traversal of the tree, where the initial position of the
// node is calculated.
function firstWalk(node: TreegraphNode): void {
    let leftSibling = null;
    let siblingDistance = node.series.siblingDistance;
    // if the node is a tree, set it's position based on the left siblings.
    if (isLeaf(node)) {
        leftSibling = getLeftSibling(node);
        if (leftSibling) {
            node.preX = leftSibling.preX + siblingDistance;
            node.mod = node.preX;
        } else {
            node.preX = 0;
        }
    } else {
        let defaultAncestor = getLeftMostChild(node) as TreegraphNode;
        // if the node has children perform the recursive first walk for its
        // children, and then calculate its shift in the apportion function
        // (most crucial part part ofthe algorythm)
        node.linksFrom.forEach(function (link): void {
            firstWalk(link.toNode);
            apportion(link.toNode, defaultAncestor);
        });
        executeShifts(node);

        let leftChild = getLeftMostChild(node) as TreegraphNode;
        let rightChild = getRightMostChild(node) as TreegraphNode;
        // set the position of the parent as a middle point of its children and
        // move it by the value of the leftSibling (if it exists)
        let midPoint = (leftChild.preX + rightChild.preX) / 2;
        leftSibling = getLeftSibling(node);

        if (leftSibling) {
            node.preX = leftSibling.preX + siblingDistance;
            node.mod = node.preX - midPoint;
        } else {
            node.preX = midPoint;
        }
    }
}

// set the final xPosition of the node as its preX value and sum of
// all if it's parents' modifiers
function secondWalk(node: TreegraphNode, modSum: number): void {
    node.xPosition = node.preX + modSum;
    node.linksFrom.forEach(function (link): void {
        secondWalk(link.toNode, modSum + node.mod);
    });
}

// get the node's first child (if it exists)
function getLeftMostChild(node: TreegraphNode): TreegraphNode | null {
    return node.linksFrom[0] && node.linksFrom[0].toNode;
}

// get the node's last child (if it exists)
function getRightMostChild(node: TreegraphNode): TreegraphNode | null {
    return (
        node.linksFrom[node.linksFrom.length - 1] &&
        node.linksFrom[node.linksFrom.length - 1].toNode
    );
}

// get nodes left sibling (if it exists)
function getLeftSibling(node: TreegraphNode): TreegraphNode | null {
    let parent = getParent(node);
    if (!parent) {
        return null;
    }
    const children = parent.linksFrom;
    return children[node.relativeXPosition - 1] ?
        children[node.relativeXPosition - 1].toNode :
        null;
}

// get node's first sibling.
function getLeftMostSibling(node: TreegraphNode): TreegraphNode | null {
    let parent = getParent(node);
    if (!parent) {
        return null;
    }
    const children = parent.linksFrom;
    return children[0] ? children[0].toNode : null;
}

// shift all children of the current node from right to left.
function executeShifts(node: TreegraphNode): void {
    let shift = 0,
        change = 0;
    for (let i = node.linksFrom.length - 1; i >= 0; i--) {
        let link = node.linksFrom[i];
        let childNode = link.toNode;
        childNode.preX += shift;
        childNode.mod += shift;
        change += childNode.change;
        shift += childNode.shift + change;
    }
}

// Core of the algorythm. A new subtree is combined with a previous subtrees.
// The threads are used to traverse the tree through its inside and outside
// contours. When the two inside contours conflict we compute the left one of
// the greates uncommon ancestors using the function ancestor and we call
// moveSubtree to shift the subtree and prepare the shifts of smaller subtrees,
// and finally we add final thread (a bit of magic happens there)

function apportion(node: TreegraphNode, defaultAncestor: TreegraphNode): void {
    let leftSibling = getLeftSibling(node),
        rightIntNode,
        rightOutNode,
        leftIntNode,
        leftOutNode,
        rightIntMod,
        rightOutMod,
        leftIntMod,
        leftOutMod;
    if (leftSibling) {
        rightIntNode = rightOutNode = node;
        leftIntNode = leftSibling as TreegraphNode;
        leftOutNode = getLeftMostSibling(rightIntNode) as TreegraphNode;
        rightIntMod = rightIntNode.mod as number;
        rightOutMod = rightOutNode.mod as number;
        leftIntMod = leftIntNode.mod as number;
        leftOutMod = leftOutNode.mod as number;

        leftIntNode = nextRight(leftIntNode);
        rightIntNode = nextLeft(rightIntNode);

        while (leftIntNode && rightIntNode) {
            leftIntNode = nextRight(leftIntNode) as TreegraphNode;
            leftOutNode = nextRight(
                leftOutNode as TreegraphNode
            ) as TreegraphNode;
            rightIntNode = nextLeft(rightIntNode) as TreegraphNode;
            rightOutNode = nextLeft(
                rightOutNode as TreegraphNode
            ) as TreegraphNode;

            rightOutNode.ancestor = node;
            let siblingDistance = node.series.siblingDistance;
            let shift =
                leftIntNode.preX +
                leftIntMod -
                (rightIntNode.preX + rightIntMod) +
                siblingDistance;

            if (shift > 0) {
                moveSubtree(
                    getAncestor(leftIntNode, node, defaultAncestor),
                    node,
                    shift
                );
                rightIntMod += shift;
                rightOutMod += shift;
            }

            leftIntMod += leftIntNode.mod;
            rightIntMod += rightIntNode.mod;
            leftOutMod += leftOutNode.mod;
            rightOutMod += rightOutNode.mod;
        }
        if (
            nextRight(leftIntNode as TreegraphNode) &&
            nextRight(rightOutNode) === null
        ) {
            rightOutNode.thread = nextRight(leftIntNode as TreegraphNode);
            rightOutNode.mod += leftIntMod - rightOutMod;
        }
        if (
            nextLeft(rightIntNode as TreegraphNode) &&
            nextLeft(leftOutNode) === null
        ) {
            leftOutNode.thread = nextLeft(rightIntNode as TreegraphNode);
            leftOutNode.mod += rightIntMod - leftOutMod;
        }
        defaultAncestor = node;
    }
}

// get the next left node which is either first child or thread
function nextLeft(node: TreegraphNode): TreegraphNode | null {
    return getLeftMostChild(node) || node.thread;
}

// get the next right node which is either last child or thread
function nextRight(node: TreegraphNode): TreegraphNode | null {
    return getRightMostChild(node) || node.thread;
}

// Shifts the subtree from leftNode to rightNode.
function moveSubtree(
    leftNode: TreegraphNode,
    rightNode: TreegraphNode,
    shift: number
): void {
    let subtrees = rightNode.relativeXPosition - leftNode.relativeXPosition;
    rightNode.change -= shift / subtrees;
    rightNode.shift += shift;
    leftNode.change += shift / subtrees;
    rightNode.preX += shift;
    rightNode.mod += shift;
}

// return the left one of the greatest uncommon ancestors of a leftInternal node
// and it's right neighbor
function getAncestor(
    leftIntNode: TreegraphNode,
    node: TreegraphNode,
    defaultAncestor: TreegraphNode
): TreegraphNode {
    let leftAnc = leftIntNode.ancestor;
    if (leftAnc.linksTo[0].fromNode === node.linksTo[0].fromNode) {
        return leftIntNode.ancestor;
    }
    return defaultAncestor;
}

export { walkerAlgorythm };
