/* *
 *
 *  Grid HeaderIconManager class
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Mikkel Espolin Birkeland
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type HeaderCell from './HeaderCell';

import GridUtils from '../../GridUtils.js';
import Globals from '../../Globals.js';
import FilterPopup from './FilterPopup.js';
import GridIcons from '../../../Icons/GridIcons.js';

const { makeHTMLElement } = GridUtils;

/* *
 *
 *  Declarations
 *
 * */

/**
 * Configuration for a header icon.
 */
interface HeaderIconConfig {
    /**
     * The icon name from GridIcons registry.
     */
    icon: string;

    /**
     * Whether the icon is enabled/visible.
     */
    enabled: boolean;

    /**
     * Click handler for the icon.
     */
    onClick?: (event: MouseEvent, headerCell: HeaderCell) => void;

    /**
     * CSS class name for the icon container.
     */
    className?: string;

    /**
     * Tooltip text for the icon.
     */
    tooltip?: string;

    /**
     * Icon size in pixels.
     */
    size?: number;

    /**
     * Whether the icon should be visible by default or only on hover.
     */
    alwaysVisible?: boolean;

    /**
     * Whether the icon is currently in an active state (e.g., filter applied,
     * sorting active). Active icons are always visible.
     */
    isActive?: boolean;

    /**
     * Custom state data for the icon (e.g., sorting order).
     */
    state?: any;

    /**
     * Function to update icon based on state changes.
     */
    onStateChange?: (
        iconElement: HTMLElement,
        state: any,
        headerCell: HeaderCell
    ) => void;
}

/**
 * Registry of icon types with their default configurations.
 */
interface HeaderIconRegistry {
    [key: string]: Partial<HeaderIconConfig>;
}

/* *
 *
 *  Class
 *
 * */

/**
 * Generic manager for header icons in Grid table headers.
 * Provides a unified API for adding, configuring, and managing icons
 * like filters, sorting, menus, etc.
 */
class HeaderIconManager {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * The header cell that owns this icon manager.
     */
    public headerCell: HeaderCell;

    /**
     * Container element for all icons.
     */
    public iconContainer: HTMLElement;

    /**
     * Registry of configured icons.
     */
    private iconConfigs: Map<string, HeaderIconConfig> = new Map();

    /**
     * Registry of created icon elements.
     */
    private iconElements: Map<string, HTMLElement> = new Map();

    /**
     * Default icon registry with predefined configurations.
     */
    private static readonly defaultIconRegistry: HeaderIconRegistry = {
        filter: {
            icon: 'filter',
            enabled: true,
            className: 'headerCellFilterIcon',
            size: 20,
            alwaysVisible: false,
            tooltip: 'Filter column',
            onClick: (event: MouseEvent, headerCell: HeaderCell): void => {
                const iconManager = headerCell.iconManager;
                if (iconManager) {
                    iconManager.toggleFilterPopup();
                }
            }
        },

        sort: {
            icon: 'chevronSelector',
            enabled: true,
            className: 'headerCellSortIcon',
            size: 20,
            alwaysVisible: false,
            tooltip: 'Sort column'
        },

        menu: {
            icon: 'menu',
            enabled: false,
            className: 'headerCellMenuIcon',
            size: 20,
            alwaysVisible: false,
            tooltip: 'Column menu'
        }
    };

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs a HeaderIconManager for the given header cell.
     *
     * @param headerCell
     * The header cell that will contain the icons.
     */
    constructor(headerCell: HeaderCell) {
        this.headerCell = headerCell;
        this.iconContainer = this.createIconContainer();
    }

    /* *
     *
     *  Methods
     *
     * */

    /**
     * Creates the main container element for all icons.
     */
    private createIconContainer(): HTMLElement {
        return makeHTMLElement('div', {
            className: Globals.getClassName('headerCellIcons')
        });
    }

    /**
     * Registers or updates an icon configuration.
     *
     * @param id
     * Unique identifier for the icon.
     *
     * @param config
     * Configuration for the icon.
     */
    public registerIcon(id: string, config: Partial<HeaderIconConfig>): void {
        const defaultConfig = HeaderIconManager.defaultIconRegistry[id] || {};
        const fullConfig: HeaderIconConfig = {
            icon: 'filter',
            enabled: true,
            size: 20,
            alwaysVisible: false,
            ...defaultConfig,
            ...config
        };

        this.iconConfigs.set(id, fullConfig);

        // If icon container is already rendered, update the display
        if (this.iconContainer.parentElement) {
            this.renderIcon(id);
        }
    }

    /**
     * Creates and renders a specific icon.
     *
     * @param id
     * The icon identifier to render.
     */
    private renderIcon(id: string): void {
        const config = this.iconConfigs.get(id);
        if (!config || !config.enabled) {
            // Remove icon if it exists but is disabled
            const existingIcon = this.iconElements.get(id);
            if (existingIcon && existingIcon.parentElement) {
                existingIcon.parentElement.removeChild(existingIcon);
                this.iconElements.delete(id);
            }
            return;
        }

        // Remove existing icon element if it exists
        const existingIcon = this.iconElements.get(id);
        if (existingIcon && existingIcon.parentElement) {
            existingIcon.parentElement.removeChild(existingIcon);
        }

        // Create icon container - use the configured class name directly
        const iconWrapper = makeHTMLElement('span', {
            className: Globals.getClassName(
                config.className as any || 'headerCellFilterIcon'
            )
        });

        // Create button
        const button = makeHTMLElement('button', {
            className: config.isActive ? 'hcg-button active' : 'hcg-button'
        }) as HTMLButtonElement;
        button.type = 'button';
        // Start unfocusable, will be made focusable when needed
        button.tabIndex = -1;

        if (config.tooltip) {
            button.title = config.tooltip;
            button.setAttribute('aria-label', config.tooltip);
        }

        // Create icon using GridIcons
        const iconElement = GridIcons.createGridIcon(
            config.icon as GridIcons.GridIconName,
            config.size || 20
        );

        button.appendChild(iconElement);
        iconWrapper.appendChild(button);

        // Add click handler
        if (config.onClick) {
            button.addEventListener('click', (event: MouseEvent): void => {
                event.stopPropagation();
                if (config.onClick) {
                    config.onClick(event, this.headerCell);
                }
            });

            // Add keyboard event handler for accessibility
            button.addEventListener('keydown', (event: KeyboardEvent): void => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    event.stopPropagation();
                    if (config.onClick) {
                        // Create a synthetic MouseEvent for consistency
                        const syntheticEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        config.onClick(syntheticEvent, this.headerCell);
                    }
                }
            });
        }

        // Set visibility behavior
        if (!config.alwaysVisible && !config.isActive) {
            iconWrapper.style.display = 'none';
        }

        // Apply state if provided
        if (typeof config.state !== 'undefined' && config.onStateChange) {
            config.onStateChange(iconWrapper, config.state, this.headerCell);
        }

        this.iconContainer.appendChild(iconWrapper);
        this.iconElements.set(id, iconWrapper);
    }

    /**
     * Renders all registered icons into the container.
     */
    public renderIcons(): void {
        // Clear existing icons
        this.iconContainer.innerHTML = '';
        this.iconElements.clear();

        // Render all configured icons
        for (const [id] of this.iconConfigs) {
            this.renderIcon(id);
        }
    }

    /**
     * Updates the state of a specific icon.
     *
     * @param id
     * The icon identifier.
     *
     * @param state
     * New state data for the icon.
     */
    public updateIconState(id: string, state: any): void {
        const config = this.iconConfigs.get(id);
        const element = this.iconElements.get(id);

        if (config && element) {
            config.state = state;
            if (config.onStateChange) {
                config.onStateChange(element, state, this.headerCell);
            }
        }
    }

    /**
     * Sets the active state of a specific icon.
     * Active icons are always visible, even without hover.
     *
     * @param id
     * The icon identifier.
     *
     * @param isActive
     * Whether the icon is in an active state.
     */
    public setIconActive(id: string, isActive: boolean): void {
        const config = this.iconConfigs.get(id);
        const element = this.iconElements.get(id);

        if (config && element) {
            config.isActive = isActive;

            // Update active CSS class on button
            const button = element.querySelector('.hcg-button');
            if (button) {
                if (isActive) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            }

            // Add/remove active indicator for filter icon
            if (id === 'filter') {
                this.toggleActiveIndicator(element, isActive);
            }

            // Update visibility immediately
            if (isActive) {
                element.style.display = 'flex';
            } else if (!config.alwaysVisible) {
                element.style.display = 'none';
            }

            // Update container class to show when has active icons
            this.updateContainerActiveState();
        }
    }

    /**
     * Enables or disables a specific icon.
     *
     * @param id
     * The icon identifier.
     *
     * @param enabled
     * Whether the icon should be enabled.
     */
    public setIconEnabled(id: string, enabled: boolean): void {
        const config = this.iconConfigs.get(id);
        if (config) {
            config.enabled = enabled;
            this.renderIcon(id);
        }
    }

    /**
     * Gets the current configuration for an icon.
     *
     * @param id
     * The icon identifier.
     *
     * @returns
     * The icon configuration or undefined if not found.
     */
    public getIconConfig(id: string): HeaderIconConfig | undefined {
        return this.iconConfigs.get(id);
    }

    /**
     * Gets the HTML element for a specific icon.
     *
     * @param id
     * The icon identifier.
     *
     * @returns
     * The icon element or undefined if not found.
     */
    public getIconElement(id: string): HTMLElement | undefined {
        return this.iconElements.get(id);
    }

    /**
     * Shows or hides icons based on hover state.
     * This is typically called from header cell hover events.
     * Active icons remain visible regardless of hover state.
     *
     * @param show
     * Whether to show the icons.
     */
    public setIconsVisible(show: boolean): void {
        for (const [id, element] of this.iconElements) {
            const config = this.iconConfigs.get(id);
            if (config && !config.alwaysVisible) {
                // Active icons should always be visible
                if (config.isActive) {
                    element.style.display = 'flex';
                } else {
                    element.style.display = show ? 'flex' : 'none';
                }
            }
        }
    }

    /**
     * Removes all icons and cleans up the manager.
     */
    public destroy(): void {
        this.iconContainer.innerHTML = '';
        this.iconConfigs.clear();
        this.iconElements.clear();
    }

    /**
     * Updates the container CSS class to show when it has active icons.
     * This ensures the container remains visible when it contains active icons.
     */
    private updateContainerActiveState(): void {
        const hasActiveIcons = Array.from(this.iconConfigs.values()).some(
            (config): boolean => config.isActive === true
        );

        if (hasActiveIcons) {
            this.iconContainer.classList.add('has-active-icons');
        } else {
            this.iconContainer.classList.remove('has-active-icons');
        }
    }

    /**
     * Gets the icon container element.
     */
    public getContainer(): HTMLElement {
        return this.iconContainer;
    }

    /**
     * Enables or disables keyboard navigation for icon buttons.
     * This controls whether the buttons can be focused via Tab or
     * programmatically.
     *
     * @param enabled
     * Whether keyboard navigation should be enabled.
     */
    public setKeyboardNavigationEnabled(enabled: boolean): void {
        const buttons = this.iconContainer.querySelectorAll('.hcg-button');
        buttons.forEach((button): void => {
            (button as HTMLButtonElement).tabIndex = enabled ? 0 : -1;
        });
    }

    /**
     * Gets the first focusable icon button in the container.
     *
     * @returns
     * The first button element or null if none exist.
     */
    public getFirstFocusableButton(): HTMLButtonElement | null {
        return this.iconContainer.querySelector('.hcg-button') as
            HTMLButtonElement;
    }

    /**
     * Gets all focusable icon buttons in the container.
     *
     * @returns
     * Array of button elements.
     */
    public getAllButtons(): HTMLButtonElement[] {
        return Array.from(
            this.iconContainer.querySelectorAll('.hcg-button')
        );
    }

    /**
     * Toggles the active indicator (small dot) for an icon.
     * This creates a visual indicator that shows when a feature is
     * active.
     *
     * @param iconElement
     * The icon wrapper element.
     *
     * @param show
     * Whether to show or hide the active indicator.
     */
    private toggleActiveIndicator(
        iconElement: HTMLElement,
        show: boolean
    ): void {
        const button = iconElement.querySelector('.hcg-button');
        if (!button) {
            return;
        }

        // Remove existing indicator if it exists
        const existingIndicator = button.querySelector('.hcg-active-indicator');
        if (existingIndicator) {
            button.removeChild(existingIndicator);
        }

        if (show) {
            // Create active indicator dot
            const indicator = makeHTMLElement('div', {
                className: 'hcg-active-indicator'
            });

            // Create the dot SVG
            const dotIcon = GridIcons.createGridIcon(
                'activeIndicator',
                6,
                'hcg-active-indicator-icon'
            );

            indicator.appendChild(dotIcon);
            button.appendChild(indicator);
        }
    }

    /**
     * Toggles the filter popup for this header cell.
     */
    public toggleFilterPopup(): void {
        const tHeader = this.headerCell.tableHeader;

        // Initialize filter popup if it doesn't exist
        if (!tHeader.filterPopup) {
            tHeader.filterPopup = new FilterPopup(this.headerCell);
        }

        const filterIcon = this.getIconElement('filter');
        if (!filterIcon) {
            return;
        }

        tHeader.filterPopup.toggle(filterIcon);
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default HeaderIconManager;
