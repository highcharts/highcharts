/* *
 *
 *  Highcharts UI Kit module
 *
 *  (c) 2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

// Responsive layout handling
const respMediaQuery = window.matchMedia('(max-width: 800px)');

// Current state of the media query
let isPhone = respMediaQuery.matches;

// List of callback functions to notify on layout change
const respCallbacks: ((matches: boolean) => void)[] = [];

// Listen for changes in the media query and notify callbacks
respMediaQuery.addEventListener('change', (): void => {
    // Update the current state
    isPhone = respMediaQuery.matches;

    // Notify all registered callbacks
    for (const callback of respCallbacks) {
        // Call the callback with the new state
        // eslint-disable-next-line node/callback-return
        callback(isPhone);
    }
});

/**
 * Check if the current layout matches the phone layout.
 *
 * @function isPhoneLayout
 *
 * @return {boolean} True if the current layout matches the phone layout.
 */
export const isPhoneLayout = (): boolean => isPhone;

/**
 * Register a callback function to be invoked when the layout changes. The
 * callback receives a boolean indicating whether the new layout matches the
 * phone layout.
 *
 * @function respListen
 *
 * @param {(fn: (matches: boolean) => void)} fn Callback function to be invoked
 * on layout change.
 *
 * @return {void}
 */
export const respListen = (fn: (matches: boolean) => void): void => {
    respCallbacks.push(fn);
};

/**
 * Append multiple children to a parent element. Children can be strings, which
 * will be wrapped in a span, HTMLElements, or false (which will be ignored).
 *
 * @function appendEl
 *
 * @param {HTMLElement} parent The parent HTMLElement to which children will
 * be appended.
 * @param {...(HTMLElement | string | false)} children A variable number of
 * children, which can be strings, HTMLElements, or false.
 *
 * @return {HTMLElement} The parent HTMLElement after appending the children.
 */
export const appendEl = (
    parent: HTMLElement,
    ...children: (HTMLElement | string | false)[]
): HTMLElement => {
    // Iterate over each child
    for (const child of children) {
    // Skip false children
        if (child !== false) {
            // Append string as span element or HTMLElement directly
            parent.appendChild(
                typeof child === 'string' ? createEl('span', '', child) : child
            );
        }
    }

    // Return the parent element for chaining
    return parent;
};

/**
 * Create an HTML element with optional class, inner content, and ID.
 *
 * @function createEl
 *
 * @param {string} type The type of HTML element to create.
 * @param {string} [className] Optional class name to assign to the element.
 * @param {HTMLElement | string | number | boolean} [inner] Optional inner
 * content, which can be a string, number, boolean, or HTMLElement.
 * @param {string} [id] Optional ID to assign to the element.
 *
 * @return {HTMLElement} The created HTMLElement.
 */
export const createEl = (
    type: string,
    className?: string,
    inner?: HTMLElement | string | number | boolean,
    id?: string
): HTMLElement => {
    // Create the specified HTML element
    const node = document.createElement(type);

    // Set the class name if provided
    if (className) {
        node.className = className;
    }

    // Set the ID if provided
    if (id !== void 0) {
        node.id = id;
    }

    // Set the inner content if provided
    if (inner !== void 0 && inner !== null) {
        if (inner instanceof HTMLElement) {
            // Use appendEl to handle appending the HTMLElement
            appendEl(node, inner);
        } else if (node instanceof HTMLInputElement) {
            // Set value for input elements
            node.value = `${inner}`;
        } else {
            // Set innerHTML for other elements
            node.innerHTML = `${inner}`;
        }
    }

    // Return the created element
    return node;
};

/**
 * Create an input HTML element with specified type, class, and value.
 *
 * @function createInputEl
 *
 * @param {string} type The type of input element to create (e.g., 'text',
 * 'checkbox').
 * @param {string} [className] Optional class name to assign to the input
 * element.
 * @param {string} [value] Optional value to assign to the input element.
 *
 * @return {HTMLInputElement} The created HTMLInputElement.
 */
export const createInputEl = (
    type: string,
    className?: string,
    value?: string
): HTMLInputElement => {
    // Create the specified HTML element
    const node = createEl('input', className) as HTMLInputElement;

    // Set the input type
    node.type = type;

    // Set the value if provided
    if (value) {
        node.value = value;
    }

    // Return the created element
    return node;
};

/**
 * Set multiple attributes on an HTMLElement.
 *
 * @function setAttr
 *
 * @param {HTMLElement} node The HTMLElement on which attributes will be set.
 * @param {Record<string, unknown>} attr An object containing attribute
 * key-value pairs to set on the element.
 *
 * @return {HTMLElement} The HTMLElement with the set attributes for chaining.
 */
export const setAttr = (
    node: HTMLElement,
    attr: Record<string, unknown>
): HTMLElement => {
    // Set attributes on the node
    for (const [key, value] of Object.entries(attr)) {
    // Only set if value is not null or undefined
        if (value !== void 0 && value !== null) {
            // Assign property or attribute
            if (key in node) {
                // Set as property if it exists on the element
                (node as any)[key] = value;
            } else {
                // Set as attribute otherwise
                node.setAttribute(key, String(value));
            }
        }
    }

    // Return the node for chaining
    return node;
};

/**
 * Apply CSS styles to a single HTMLElement or an array of HTMLElements.
 *
 * @function applyStyle
 *
 * @template T - The target type (HTMLElement | HTMLElement[]).
 *
 * @param {T} node The HTMLElement or array of HTMLElements to which styles
 * will be applied.
 * @param {Record<string, string | number>} style An object containing CSS
 * property-value pairs to apply.
 *
 * @return {T} The original HTMLElement or array of HTMLElements for chaining.
 */
export const applyStyle = <T extends HTMLElement | HTMLElement[]>(
    node: T,
    style: Record<string, string | number>
): T => {
    // Normalize to array for easier handling and apply styles to each element
    for (const element of Array.isArray(node) ? node : [node]) {
        for (const [key, value] of Object.entries(style)) {
            // Convert camelCase to kebab-case for CSS property names
            element.style.setProperty(
                key.replace(/([A-Z])/g, '-$1').toLowerCase(),
                `${value}`
            );
        }
    }

    // Return the original node(s) for chaining
    return node;
};

/**
 * Attach an event listener to a target element or a newly created span element
 * if a string selector is provided. Returns an object containing the element
 * and a cleanup function to remove the event listener.
 *
 * @function addEvent
 *
 * @template T - The target type (HTMLElement or Window).
 *
 * @param {T | string} target The target HTMLElement, Window, or a string
 * selector.
 * @param {string} eventName The name of the event to listen for.
 * @param {(event: Event, target: T) => void} callback The callback function
 * to execute when the event is triggered. It receives the event object and the
 * target element as arguments.
 *
 * @return {{ element: T; removeEvent: () => void }} An object containing the
 * target element and an 'removeEvent' function to remove the event listener.
 */
export const addEvent = <T extends HTMLElement | Window>(
    target: T | string,
    eventName: string,
    callback: (event: Event, target: T) => void
): { element: T; removeEvent: () => void } => {
    // If target is a string
    if (typeof target === 'string') {
    // Create a span element
        target = createEl('span', '', target) as T;
    }

    // Wrap callback in the event handler
    const handler: EventListener = (event: Event): void =>
        callback(event, target);

    // Attach the event listener
    target.addEventListener(eventName, handler);

    // Return element and cleanup function
    return {
        element: target,
        removeEvent: (): void => target.removeEventListener(eventName, handler)
    };
};

/**
 * Attach an event listener that is triggered only once on the target element or
 * a newly created span element if a string selector is provided. After the
 * event is triggered, the listener is removed automatically.
 *
 * @function once
 *
 * @template T - The target type (HTMLElement or Window).
 *
 * @param {T | string} target The target HTMLElement, Window, or a string
 * selector.
 * @param {string} eventName The name of the event to listen for.
 * @param {(event: Event, target: T) => void} callback The callback function
 * to execute when the event is triggered. It receives the event object and
 * the target element as arguments.
 *
 * @return {T} The target element for chaining.
 */
export const once = <T extends HTMLElement | Window>(
    target: T | string,
    eventName: string,
    callback: (event: Event, target: T) => void
): T => {
    // Use addEvent to attach the event listener
    const handlerObj = addEvent(
        target,
        eventName,
        (event: Event, target: T): void => {
            // Call the provided callback
            // eslint-disable-next-line node/callback-return
            callback(event, target);

            // Remove the event listener after it has been called once
            handlerObj.removeEvent();
        }
    );

    // Return the target element for chaining
    return handlerObj.element;
};

/**
 * Get the size (width and height) of an HTMLElement by computing its styles.
 *
 * @function getNodeSize
 *
 * @param {HTMLElement} node The HTMLElement whose size is to be retrieved.
 *
 * @return { height: number; width: number } An object containing the width
 * and height of the element as numbers.
 */
export const getNodeSize = (
    node: HTMLElement
): { height: number; width: number } => {
    // Get computed styles of the node
    const style = window.getComputedStyle(node);

    // Return width and height as numbers
    return {
        width: parseFloat(style.getPropertyValue('width').replace('px', '')),
        height: parseFloat(style.getPropertyValue('height').replace('px', ''))
    };
};

/**
 * Get the position (x and y coordinates) of an HTMLElement relative to the
 * document.
 *
 * @function getNodePos
 *
 * @param {HTMLElement} node The HTMLElement whose position is to be
 * retrieved.
 *
 * @return { x: number; y: number } An object containing the x and y
 * coordinates of the element relative to the document.
 */
export const getNodePos = (node: HTMLElement): { x: number; y: number } => {
    // Get the bounding client rectangle of the node
    const rect = node.getBoundingClientRect();

    // Return the position adjusted for scroll
    return {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY
    };
};

/**
 * Add one or more classes to an HTMLElement using classList.
 *
 * @function addClass
 *
 * @param {HTMLElement} node The HTMLElement to which classes will be added.
 * @param {...string} classes A variable number of class names to add to the
 * element.
 *
 * @return {HTMLElement} The HTMLElement with the added classes for chaining.
 */
export const addClass = (
    node: HTMLElement,
    ...classes: string[]
): HTMLElement => {
    // Use classList to add multiple classes
    node.classList.add(...classes);

    // Return the node for chaining
    return node;
};

/**
 * Remove one or more classes from an HTMLElement using classList.
 *
 * @function removeClass
 *
 * @param {HTMLElement} node The HTMLElement from which classes will be
 * removed.
 * @param {...string} classes A variable number of class names to remove from
 * the element.
 *
 * @return {HTMLElement} The HTMLElement with the removed classes for chaining.
 */
export const removeClass = (
    node: HTMLElement,
    ...classes: string[]
): HTMLElement => {
    // Use classList to remove multiple classes
    node.classList.remove(...classes);

    // Return the node for chaining
    return node;
};

/**
 * Toggle one or more classes on an HTMLElement using classList.
 *
 * @function toggleClass
 *
 * @param {HTMLElement} node The HTMLElement on which classes will be
 * toggled.
 * @param {...string} classes A variable number of class names to toggle on
 * the element.
 *
 * @return {HTMLElement} The HTMLElement with the toggled classes for chaining.
 */
export const toggleClass = (
    node: HTMLElement,
    ...classes: string[]
): HTMLElement => {
    // Use classList to toggle multiple classes
    for (const cl of classes) {
        node.classList.toggle(cl);
    }

    // Return the node for chaining
    return node;
};

/**
 * Executes a callback once the given HTMLElement is attached to the DOM.
 *
 * @function whenHasParent
 *
 * @param {HTMLElement} node The element to watch for attachment.
 * @param {(node: HTMLElement) => void} fn Callback executed once the element
 * has a parent.
 *
 * @return {void}
 */
export const whenHasParent = (
    node: HTMLElement,
    fn: (node: HTMLElement) => void
): void => {
    // Function to check if the node has a parent
    const checkParent = (): void => {
        if (node.parentElement) {
            // Execute callback when parent is found
            return fn(node);
        }

        // Check again after delay
        setTimeout(checkParent, 100);
    };

    // Start checking
    checkParent();
};

export default {
    isPhoneLayout,
    respListen,
    appendEl,
    createEl,
    createInputEl,
    applyStyle,
    addEvent,
    once,
    setAttr,
    getNodeSize,
    getNodePos,
    addClass,
    removeClass,
    toggleClass,
    whenHasParent
};
