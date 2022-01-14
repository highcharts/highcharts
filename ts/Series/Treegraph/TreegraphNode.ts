import TreegraphPoint from './TreegraphPoint.js';

class TreegraphNode extends TreegraphPoint {
    public mod: number = void 0 as any;
    public thread?: TreegraphNode;
    public ancestor: TreegraphNode = void 0 as any;
    public shift: number = void 0 as any;
    public change: number = void 0 as any;
    public preX: number = void 0 as any;
    public relativeXPosition: number = void 0 as any;
    public xPosition: number = void 0 as any;
    public yPosition: number = void 0 as any;

    // get the next left node which is either first child or thread
    public nextLeft(this: TreegraphNode): TreegraphNode | undefined {
        return this.getLeftMostChild() || this.thread;
    }

    // get the next right node which is either last child or thread
    public nextRight(this: TreegraphNode): TreegraphNode | undefined {
        return this.getRightMostChild() || this.thread;
    }
    // return the left one of the greatest uncommon ancestors of a leftInternal
    // node and it's right neighbor
    public getAncestor(
        this: TreegraphNode,
        leftIntNode: TreegraphNode,
        defaultAncestor: TreegraphNode
    ): TreegraphNode {
        let leftAnc = leftIntNode.ancestor;
        if (leftAnc.linksTo[0].fromNode === this.linksTo[0].fromNode) {
            return leftIntNode.ancestor;
        }
        return defaultAncestor;
    }
    // get node's first sibling.
    public getLeftMostSibling(this: TreegraphNode): TreegraphNode | null {
        let parent = this.getParent();
        if (!parent) {
            return null;
        }
        const children = parent.linksFrom;
        return children[0] ? (children[0].toNode as TreegraphNode) : null;
    }
    // get nodes left sibling (if it exists)
    public getLeftSibling(this: TreegraphNode): TreegraphNode | null {
        let parent = this.getParent();
        if (!parent) {
            return null;
        }
        const children = parent.linksFrom;
        return children[this.relativeXPosition - 1] ?
            (children[this.relativeXPosition - 1].toNode as TreegraphNode) :
            null;
    }

    // get the node's first child (if it exists)
    public getLeftMostChild(this: TreegraphNode): TreegraphNode | null {
        return this.linksFrom[0] && (this.linksFrom[0].toNode as TreegraphNode);
    }

    // get the node's last child (if it exists)
    public getRightMostChild(this: TreegraphNode): TreegraphNode | null {
        return (
            this.linksFrom[this.linksFrom.length - 1] &&
            (this.linksFrom[this.linksFrom.length - 1].toNode as TreegraphNode)
        );
    }

    // Get the parent of current node or return null for root of the tree.
    public getParent(this: TreegraphNode): TreegraphNode | null {
        return this.linksTo[0] ?
            (this.linksTo[0].fromNode as TreegraphNode) :
            null;
    }
    // Check if the node is a leaf, so if it has any children.
    public isLeaf(this: TreegraphNode): boolean {
        return !this.linksFrom.length;
    }

    public getFirstChild(this: TreegraphNode): TreegraphNode | null {
        return this.linksFrom[0] ?
            (this.linksFrom[0].toNode as TreegraphNode) :
            null;
    }
}

export default TreegraphNode;
