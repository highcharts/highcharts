import type AnnotationChart from '../AnnotationChart';
import type AnnotationOptions from '../AnnotationOptions';

import Popup from './Popup.js';
import U from '../../../Core/Utilities.js';
const {
    createElement,
    pick
} = U;
import H from '../../../Core/Globals.js';
const { doc } = H;

class PopupToolbar extends Popup {
    public addForm(
        chart: AnnotationChart,
        options: AnnotationOptions,
        callback: Function
    ): void {
        const lang = this.lang,
            popupDiv = this.container,
            showForm = this.showForm,
            toolbarClass = 'highcharts-annotation-toolbar';

        // set small size
        if (popupDiv.className.indexOf(toolbarClass) === -1) {
            popupDiv.className += ' ' + toolbarClass;
        }

        // set position
        if (chart) {
            popupDiv.style.top = chart.plotTop + 10 + 'px';
        }

        // create label
        createElement('span', void 0, void 0, popupDiv).appendChild(
            doc.createTextNode(pick(
                // Advanced annotations:
                lang[options.langKey as any] || options.langKey,
                // Basic shapes:
                options.shapes && options.shapes[0].type,
                ''
            ))
        );

        // add buttons
        let button = this.addButton(
            popupDiv,
            lang.removeButton || 'Remove',
            'remove',
            popupDiv,
            callback
        );

        button.className += ' highcharts-annotation-remove-button';
        button.style['background-image' as any] = 'url(' +
            this.iconsURL + 'destroy.svg)';

        button = this.addButton(
            popupDiv,
            lang.editButton || 'Edit',
            'edit',
            popupDiv,
            (): void => {
                showForm.call(
                    this,
                    'annotation-edit',
                    chart,
                    options,
                    callback
                );
            }
        );

        button.className += ' highcharts-annotation-edit-button';
        button.style['background-image' as any] = 'url(' +
            this.iconsURL + 'edit.svg)';

    }
}

export default PopupToolbar;
