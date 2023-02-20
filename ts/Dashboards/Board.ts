/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *  - Pawel Lysy
 *  - Karol Kolodziej
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type JSON from '../Core/JSON';

import DashboardAccessibility from './Accessibility/DashboardsAccessibility.js';
import Bindings from './Actions/Bindings.js';
import Globals from './Globals.js';
import EditMode from './EditMode/EditMode.js';
import Layout from './Layout/Layout.js';
import Serializable from './Serializable.js';
import Fullscreen from './EditMode/Fullscreen.js';
import U from '../Core/Utilities.js';
const {
    merge,
    addEvent,
    error,
    objectEach,
    uniqueKey,
    createElement
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Creates a dashboard with components like charts, tables, and HTML.
 *
 * @class
 * @name Board
 */
class Board implements Serializable<Board, Board.JSON> {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        renderTo: (string|globalThis.HTMLElement),
        options: Board.Options
    ) {
        this.options = merge(Board.defaultOptions, options);
        this.layouts = [];
        this.guiEnabled = (this.options.gui || {}).enabled;
        this.mountedComponents = [];
        this.id = uniqueKey();

        this.initContainer(renderTo);

        // Create layouts wrapper.
        this.layoutsWrapper = createElement(
            'div', {
                className: Globals.classNames.layoutsWrapper
            }, {},
            this.container
        );

        // Init edit mode.
        if (
            EditMode && !(
                this.options.editMode &&
                !this.options.editMode.enabled
            )
        ) {
            this.editMode = new EditMode(this, this.options.editMode);
        }

        // Init layouts from options.
        if (options.gui && this.options.gui) {
            this.setLayouts(this.options.gui);
        }

        // Init layouts from JSON.
        if (options.layoutsJSON && !this.layouts.length) {
            this.setLayoutsFromJSON(options.layoutsJSON);
        }

        // Init components from options.
        if (options.components) {
            this.setComponents(options.components);
        }

        // Init events.
        this.initEvents();

        // Add fullscreen support.
        this.fullscreen = new Fullscreen(this);

        this.index = Globals.boards.length;
        Globals.boards.push(this);

        // a11y module
        this.a11y = new DashboardAccessibility(this);
    }

    /* *
     *
     *  Properties
     *
     * */

    public container: globalThis.HTMLElement = void 0 as any;
    public boardWrapper: globalThis.HTMLElement = void 0 as any;
    public editMode?: EditMode;
    public fullscreen?: Fullscreen;
    public guiEnabled: (boolean|undefined);
    public id: string;
    public index: number;
    public layouts: Array<Layout>;
    public layoutsWrapper: globalThis.HTMLElement;
    public mountedComponents: Array<Bindings.MountedComponentsOptions>;
    public options: Board.Options;
    public a11y: DashboardAccessibility;

    /* *
     *
     *  Functions
     *
     * */

    private initEvents(): void {
        const board = this;

        addEvent(window, 'resize', function (): void {
            board.reflow();
        });
    }

    /**
     * Initialize the container for the dashboard.
     *
     * @param {string|Highcharts.HTMLDOMElement} [renderTo]
     * The DOM element to render to, or its id.
     *
     */
    public initContainer(
        renderTo: (string|globalThis.HTMLElement)
    ): void {
        const board = this;

        if (typeof renderTo === 'string') {
            renderTo = window.document.getElementById(renderTo) as HTMLElement;
        }

        // Display an error if the renderTo doesn't exist.
        if (!renderTo) {
            error(13, true);
        }

        // Clear the container from any content.
        renderTo.innerHTML = '';

        // Set the main wrapper container.
        board.boardWrapper = renderTo;

        // Add container for the board.
        board.container = createElement(
            'div', {
                className: Globals.classNames.boardContainer
            }, {},
            this.boardWrapper
        );
    }

    /**
     * Factory function for creating a new dashboard.
     *
     * @param  {(string|globalThis.HTMLElement)} [renderTo]
     * The DOM element to render to, or its id.
     *
     * @param  {Board.Options} options
     * The options for the dashboard.
     *
     * @return {Board}
     * The new dashboard.
     */
    public static board(
        renderTo: (string|globalThis.HTMLElement),
        options: Board.Options
    ): Board {
        return new Board(renderTo, options);
    }

    public setLayouts(guiOptions: Board.GUIOptions): void {
        const board = this,
            layoutsOptions = guiOptions.layouts;

        for (let i = 0, iEnd = layoutsOptions.length; i < iEnd; ++i) {
            board.layouts.push(
                new Layout(
                    board,
                    merge({}, guiOptions.layoutOptions, layoutsOptions[i])
                )
            );
        }
    }

    public setLayoutsFromJSON(json: Array<Layout.JSON>): void {
        const board = this;

        let layout;

        for (let i = 0, iEnd = json.length; i < iEnd; ++i) {
            layout = Layout.fromJSON(json[i], board);

            if (layout) {
                board.layouts.push(layout);
            }
        }
    }

    public addLayoutFromJSON(json: Layout.JSON): Layout|undefined {
        return Layout.fromJSON(json, this);
    }

    public setComponents(
        components: Array<Bindings.ComponentOptions>
    ): void {
        for (let i = 0, iEnd = components.length; i < iEnd; ++i) {
            Bindings.addComponent(components[i]);
        }
    }

    /**
     * Destroy the whole dashboard, its layouts and elements.
     */
    public destroy(): void {
        const board = this;

        // Destroy layouts.
        for (let i = 0, iEnd = board.layouts.length; i < iEnd; ++i) {
            board.layouts[i].destroy();
        }

        // Destroy container.
        board.container.remove();

        // @ToDo Destroy bindings.

        // Delete all properties.
        objectEach(board, function (val: unknown, key: string): void {
            delete (board as Record<string, any>)[key];
        });

        Globals.boards[this.index] = void 0;

        return;
    }

    /**
     * Export layouts from the local storage
     */
    public exportLocal(): void {
        localStorage.setItem(
            // Dashboard.prefix + this.id,
            Globals.classNamePrefix + '1', // temporary for demo test
            JSON.stringify(this.toJSON())
        );
    }

    public importLayoutLocal(id: string): Layout|undefined {
        return Layout.importLocal(id, this);
    }

    public getLayoutContainerSize(): string {
        const board = this,
            respoOptions = board.options.respoBreakpoints,
            cntWidth = (board.layoutsWrapper || {}).clientWidth;

        let size = Globals.respoBreakpoints.large;

        if (respoOptions) {
            if (cntWidth <= respoOptions.small) {
                size = Globals.respoBreakpoints.small;
            } else if (
                cntWidth > respoOptions.small &&
                cntWidth <= respoOptions.medium
            ) {
                size = Globals.respoBreakpoints.medium;
            }
        }

        return size;
    }

    public reflow(): void {
        const board = this,
            cntSize = board.getLayoutContainerSize();

        let layout, row, cell;

        if (board.editMode) {
            board.editMode.hideToolbars(['cell', 'row']);
            board.editMode.hideContextPointer();
        }

        for (let i = 0, iEnd = board.layouts.length; i < iEnd; ++i) {
            layout = board.layouts[i];

            for (let j = 0, jEnd = layout.rows.length; j < jEnd; ++j) {
                row = layout.rows[j];

                for (let k = 0, kEnd = row.cells.length; k < kEnd; ++k) {
                    cell = row.cells[k];
                    cell.reflow(cntSize);
                }
            }
        }
    }

    /**
     * Converts the given JSON to a class instance.
     *
     * @param {Serializable.JSON} json
     * JSON to deserialize as a class instance or object.
     *
     * @return {DataTable}
     * Returns the class instance or object, or throws an exception.
     */
    public fromJSON(
        json: Board.JSON
    ): Board {
        const options = json.options;

        return new Board(
            options.containerId,
            {
                layoutsJSON: options.layouts,
                componentOptions: options.componentOptions,
                respoBreakpoints: options.respoBreakpoints
            }
        );
    }


    /**
     * Converts the class instance to a class JSON.
     *
     * @return {Board.JSON}
     * Class JSON of this Dashboard instance.
     */
    public toJSON(): Board.JSON {
        const board = this,
            layouts = [];

        // Get layouts JSON.
        for (let i = 0, iEnd = board.layouts.length; i < iEnd; ++i) {
            layouts.push(board.layouts[i].toJSON());
        }

        return {
            $class: 'Board',
            options: {
                containerId: board.container.id,
                guiEnabled: board.guiEnabled,
                layouts: layouts,
                componentOptions: board.options.componentOptions,
                respoBreakpoints: board.options.respoBreakpoints
            }
        };
    }

}

/* *
 *
 *  Class Namespace
 *
 * */

namespace Board {

    /* *
     *
     *  Declarations
     *
     * */

    export interface Options {
        gui?: GUIOptions;
        editMode?: EditMode.Options;
        components?: Array<Bindings.ComponentOptions>;
        componentOptions?: Partial<Bindings.ComponentOptions>;
        layoutsJSON?: Array<Layout.JSON>;
        respoBreakpoints?: RespoBreakpoints;
    }

    export interface OptionsJSON extends JSON.Object {
        containerId: string;
        layouts: Array<Layout.JSON>;
        guiEnabled?: boolean;
        componentOptions?: Partial<Bindings.ComponentOptions>;
        respoBreakpoints?: RespoBreakpoints;
    }

    export interface RespoBreakpoints extends JSON.Object {
        small: number;
        medium: number;
        large: number;
    }

    export interface GUIOptions {
        enabled: boolean;
        layoutOptions: Partial<Layout.Options>;
        layouts: Array<Layout.Options>;
    }

    export interface JSON extends Serializable.JSON<'Board'> {
        options: OptionsJSON;
    }

    /* *
     *
     *  Constants
     *
     * */

    /**
     * Global Dashboard settings.
     *
     * @name Board.defaultOptions
     * @type {Board.Options}
     *//**
     * @product dashboard
     * @optionparent
     */
    export const defaultOptions: Board.Options = {
        gui: {
            enabled: true,
            layoutOptions: {
                rowClassName: void 0,
                cellClassName: void 0
            },
            layouts: []
        },
        componentOptions: {
            isResizable: true
        },
        components: [],
        respoBreakpoints: {
            small: 576,
            medium: 992,
            large: 1200
        }
    };


    /* *
     *
     *  Functions
     *
     * */

    /**
     * Import layouts from the local storage.
     *
     * @return {Board|undefined}
     * Returns the Dashboard instance or undefined.
     */
    export function importLocal(): (Board|undefined) {
        const dashboardJSON = localStorage.getItem(
            // Dashboard.prefix + this.id,
            Globals.classNamePrefix + '1' // temporary for demo test
        );

        if (dashboardJSON) {
            try {
                return Serializable
                    .fromJSON(JSON.parse(dashboardJSON)) as Board;
            } catch (e) {
                // nothing to do
            }
        }
    }

}

/* *
 *
 *  Registry
 *
 * */

Serializable.registerClassPrototype('Board', Board.prototype);

/* *
 *
 *  Default Export
 *
 * */

export default Board;
