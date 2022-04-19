/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Utility functions for accessibility module.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../../Core/Globals.js';
var doc = H.doc, win = H.win;
import U from '../../Core/Utilities.js';
var css = U.css;
/* *
 *
 *  Functions
 *
 * */
/* eslint-disable valid-jsdoc */
/**
 * @private
 * @param {Highcharts.HTMLDOMElement} el
 * @param {string} className
 * @return {void}
 */
function addClass(el, className) {
    if (el.classList) {
        el.classList.add(className);
    }
    else if (el.className.indexOf(className) < 0) {
        // Note: Dumb check for class name exists, should be fine for practical
        // use cases, but will return false positives if the element has a class
        // that contains the className.
        el.className += ' ' + className;
    }
}
/**
 * @private
 * @param {Highcharts.HTMLDOMElement} el
 * @param {string} className
 * @return {void}
 */
function removeClass(el, className) {
    if (el.classList) {
        el.classList.remove(className);
    }
    else {
        // Note: Dumb logic that will break if the element has a class name that
        // consists of className plus something else.
        el.className = el.className.replace(new RegExp(className, 'g'), '');
    }
}
/**
 * Utility function to clone a mouse event for re-dispatching.
 * @private
 */
function cloneMouseEvent(e) {
    if (typeof win.MouseEvent === 'function') {
        return new win.MouseEvent(e.type, e);
    }
    // No MouseEvent support, try using initMouseEvent
    if (doc.createEvent) {
        var evt = doc.createEvent('MouseEvent');
        if (evt.initMouseEvent) {
            evt.initMouseEvent(e.type, e.bubbles, // #10561, #12161
            e.cancelable, e.view || win, e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, e.relatedTarget);
            return evt;
        }
    }
    return getFakeMouseEvent(e.type);
}
/**
 * Utility function to clone a touch event for re-dispatching.
 * @private
 */
function cloneTouchEvent(e) {
    var touchListToTouchArray = function (l) {
        var touchArray = [];
        for (var i = 0; i < l.length; ++i) {
            var item = l.item(i);
            if (item) {
                touchArray.push(item);
            }
        }
        return touchArray;
    };
    if (typeof win.TouchEvent === 'function') {
        var newEvent = new win.TouchEvent(e.type, {
            touches: touchListToTouchArray(e.touches),
            targetTouches: touchListToTouchArray(e.targetTouches),
            changedTouches: touchListToTouchArray(e.changedTouches),
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            altKey: e.altKey,
            metaKey: e.metaKey,
            bubbles: e.bubbles,
            cancelable: e.cancelable,
            composed: e.composed,
            detail: e.detail,
            view: e.view
        });
        if (e.defaultPrevented) {
            newEvent.preventDefault();
        }
        return newEvent;
    }
    var fakeEvt = cloneMouseEvent(e);
    fakeEvt.touches = e.touches;
    fakeEvt.changedTouches = e.changedTouches;
    fakeEvt.targetTouches = e.targetTouches;
    return fakeEvt;
}
/**
 * @private
 */
function escapeStringForHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}
/**
 * Get an element by ID
 * @private
 */
function getElement(id) {
    return doc.getElementById(id);
}
/**
 * Get a fake mouse event of a given type
 * @private
 */
function getFakeMouseEvent(type, position) {
    var pos = position || {
        x: 0,
        y: 0
    };
    if (typeof win.MouseEvent === 'function') {
        return new win.MouseEvent(type, {
            bubbles: true,
            cancelable: true,
            composed: true,
            view: win,
            detail: type === 'click' ? 1 : 0,
            screenX: pos.x,
            screenY: pos.y,
            clientX: pos.x,
            clientY: pos.y
        });
    }
    // No MouseEvent support, try using initMouseEvent
    if (doc.createEvent) {
        var evt = doc.createEvent('MouseEvent');
        if (evt.initMouseEvent) {
            evt.initMouseEvent(type, true, // Bubble
            true, // Cancel
            win, // View
            type === 'click' ? 1 : 0, // Detail
            // Coords
            pos.x, pos.y, pos.x, pos.y, 
            // Pressed keys
            false, false, false, false, 0, // button
            null // related target
            );
            return evt;
        }
    }
    return { type: type };
}
/**
 * Get an appropriate heading level for an element. Corresponds to the
 * heading level below the previous heading in the DOM.
 *
 * Note: Only detects previous headings in the DOM that are siblings,
 * ancestors, or previous siblings of ancestors. Headings that are nested below
 * siblings of ancestors (cousins et.al) are not picked up. This is because it
 * is ambiguous whether or not the nesting is for layout purposes or indicates a
 * separate section.
 *
 * @private
 * @param {Highcharts.HTMLDOMElement} [element]
 * @return {string} The heading tag name (h1, h2 etc).
 * If no nearest heading is found, "p" is returned.
 */
function getHeadingTagNameForElement(element) {
    var getIncreasedHeadingLevel = function (tagName) {
        var headingLevel = parseInt(tagName.slice(1), 10), newLevel = Math.min(6, headingLevel + 1);
        return 'h' + newLevel;
    };
    var isHeading = function (tagName) { return /H[1-6]/.test(tagName); };
    var getPreviousSiblingsHeading = function (el) {
        var sibling = el;
        while (sibling = sibling.previousSibling) { // eslint-disable-line
            var tagName = sibling.tagName || '';
            if (isHeading(tagName)) {
                return tagName;
            }
        }
        return '';
    };
    var getHeadingRecursive = function (el) {
        var prevSiblingsHeading = getPreviousSiblingsHeading(el);
        if (prevSiblingsHeading) {
            return getIncreasedHeadingLevel(prevSiblingsHeading);
        }
        // No previous siblings are headings, try parent node
        var parent = el.parentElement;
        if (!parent) {
            return 'p';
        }
        var parentTagName = parent.tagName;
        if (isHeading(parentTagName)) {
            return getIncreasedHeadingLevel(parentTagName);
        }
        return getHeadingRecursive(parent);
    };
    return getHeadingRecursive(element);
}
/**
 * Remove an element from the DOM.
 * @private
 * @param {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement} [element]
 * @return {void}
 */
function removeElement(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}
/**
 * Remove all child nodes from an element.
 * @private
 * @param {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement} [element]
 * @return {void}
 */
function removeChildNodes(element) {
    while (element.lastChild) {
        element.removeChild(element.lastChild);
    }
}
/**
 * Utility function. Reverses child nodes of a DOM element.
 * @private
 */
function reverseChildNodes(node) {
    var i = node.childNodes.length;
    while (i--) {
        node.appendChild(node.childNodes[i]);
    }
}
/**
 * Used for aria-label attributes, painting on a canvas will fail if the
 * text contains tags.
 * @private
 */
function stripHTMLTagsFromString(str) {
    return typeof str === 'string' ?
        str.replace(/<\/?[^>]+(>|$)/g, '') : str;
}
/**
 * Utility function for hiding an element visually, but still keeping it
 * available to screen reader users.
 * @private
 */
function visuallyHideElement(element) {
    css(element, {
        position: 'absolute',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        clip: 'rect(1px, 1px, 1px, 1px)',
        marginTop: '-3px',
        '-ms-filter': 'progid:DXImageTransform.Microsoft.Alpha(Opacity=1)',
        filter: 'alpha(opacity=1)',
        opacity: 0.01
    });
}
/* *
 *
 *  Default Export
 *
 * */
var HTMLUtilities = {
    addClass: addClass,
    cloneMouseEvent: cloneMouseEvent,
    cloneTouchEvent: cloneTouchEvent,
    escapeStringForHTML: escapeStringForHTML,
    getElement: getElement,
    getFakeMouseEvent: getFakeMouseEvent,
    getHeadingTagNameForElement: getHeadingTagNameForElement,
    removeChildNodes: removeChildNodes,
    removeClass: removeClass,
    removeElement: removeElement,
    reverseChildNodes: reverseChildNodes,
    stripHTMLTagsFromString: stripHTMLTagsFromString,
    visuallyHideElement: visuallyHideElement
};
export default HTMLUtilities;
