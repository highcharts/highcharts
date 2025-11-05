/* *
 *
 *  Grid Lang Update Config
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { UpdateConfig } from '../Update/UpdateScope';
import { UpdateScope } from '../Update/UpdateScope.js';
import Globals from '../Globals.js';
import U from '../../../Core/Utilities.js';

const { merge } = U;

/* *
 *
 *  Constants
 *
 * */

/**
 * Lang update configuration.
 */
export const LangUpdateConfig: UpdateConfig = {

    'locale': {
        scope: UpdateScope.REFLOW,
        options: ['locale'],
        priority: 0,
        handler: function (_module, newVal): void {
            this.locale = newVal;
            this.time.update({
                ...this.options?.time,
                locale: newVal
            });
        }
    },

    'pagination': {
        scope: UpdateScope.DOM_ELEMENT,
        options: ['pagination'],
        priority: 1,
        dependencies: ['lang.locale'],
        handler: function (_module, newVal): void {
            const pagination = this.pagination;

            if (!pagination || !pagination.contentWrapper) {
                // Pagination not enabled or not rendered - skip
                return;
            }

            // Merge new lang with existing (don't overwrite everything)
            merge(true, pagination.lang, newVal);

            // Update text content - no re-rendering!
            pagination.updatePageInfo();

            // Update button titles/aria-labels with new lang
            const {
                firstPage,
                previousPage,
                nextPage,
                lastPage,
                pageSizeLabel
            } = pagination.lang;
            const buttons = [
                { el: pagination.firstButton, text: firstPage },
                { el: pagination.prevButton, text: previousPage },
                { el: pagination.nextButton, text: nextPage },
                { el: pagination.lastButton, text: lastPage }
            ];

            buttons.forEach(({ el, text }): void => {
                if (el && text) {
                    el.title = text;
                    el.setAttribute('aria-label', text);
                }
            });

            // Update page size label
            if (pageSizeLabel) {
                const className = Globals.getClassName(
                    'paginationPageSizeContainer'
                );
                const label = pagination.contentWrapper.querySelector(
                    '.' + className + ' span'
                );
                if (label) {
                    label.innerHTML = pageSizeLabel;
                }
            }
        }
    },

    // Options stored only, no immediate UI update
    'stored': {
        scope: UpdateScope.NONE,
        options: [
            'accessibility',
            'columnFilteringConditions',
            'loading',
            'noData',
            'filter',
            'sortAscending',
            'sortDescending',
            'column',
            'setFilter'
        ]
    }
};

/* *
 *
 *  Default Export
 *
 * */

export default LangUpdateConfig;
