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
 *
 * */

import Chart from '../../Core/Chart/Chart.js';
import Component from './Component.js';
import U from '../../Core/Utilities.js';
const {
    isArray,
    isNumber,
    isObject,
    merge,
    objectEach,
    pick,
    splat
} = U;

class ThresholdComponent extends Component {
    public static defaultOptions = merge(
        Component.defaultOptions,
        {
            valueName: 'value'
        }
    );

    public options: ThresholdComponent.ComponentOptions;
    public component?: Component;
    public sync: Component['sync'];
    private undoOptions?: AnyRecord;

    constructor(options: Partial<ThresholdComponent.ComponentOptions>) {
        options = merge(
            ThresholdComponent.defaultOptions,
            options
        );
        super(options);

        this.options = options as ThresholdComponent.ComponentOptions;

        this.type = 'threshold';
        this.sync = new Component.Sync(
            this,
            this.syncHandlers
        );
    }

    public render(): this {
        super.render();

        const { options } = this;
        const { valueName } = options;
        let componentOptions = options.options || {};

        const value = pick(
            options.value,
            componentOptions[valueName || '']
        );

        let CurrentComponent = options.component;

        if (options.thresholds && isNumber(value)) {
            let baseComponent = true;
            let start: number|undefined;
            let end = 0;

            const sortedThresholds = options.thresholds.slice().sort(
                (a, b): number =>
                    pick(a.min, a.max, Number.MIN_VALUE) -
                    pick(b.min, a.max, Number.MIN_VALUE)
            );

            for (let i = sortedThresholds.length - 1; i >= 0; i--) {
                const threshold = sortedThresholds[i];

                if (
                    value >= pick(threshold.min, Number.MIN_VALUE) &&
                    value <= pick(threshold.max, Number.MAX_VALUE)
                ) {
                    if (threshold.component) {
                        if (baseComponent) {
                            if (threshold.component !== CurrentComponent) {
                                baseComponent = false;
                                CurrentComponent = threshold.component;
                                start = i;
                            }
                        } else if (threshold.component === CurrentComponent) {
                            start = i;
                        }
                    }
                    if (!end) {
                        end = i + 1;
                    }
                }
            }

            if (end) {
                componentOptions = merge(
                    baseComponent ? componentOptions : {},
                    ...sortedThresholds
                        .slice(start, end)
                        .map((t): any => t.options)
                );
            }
        }

        componentOptions = merge(
            valueName && isNumber(options.value) ?
                { [valueName]: options.value } :
                {},
            {
                parentElement: options.parentElement
            },
            componentOptions
        );

        if (this.component instanceof CurrentComponent) {
            if (this.undoOptions) {
                if (
                    !componentOptions.chartOptions &&
                    this.undoOptions.chartOptions
                ) {
                    this.undoOptions.chartOptions = null;
                }
                this.component.update(this.undoOptions);
            }
            this.undoOptions = ThresholdComponent.currentOptions(
                componentOptions,
                this.component.options
            );

            this.component.update(componentOptions);
        } else {
            this.undoOptions = ThresholdComponent.currentOptions(
                componentOptions,
                (CurrentComponent as any).defaultOptions
            );

            this.parentElement.innerHTML = '';
            this.component = new CurrentComponent(componentOptions).render();
        }

        return this;
    }

    public redraw(): this {
        super.redraw();
        return this.render();
    }

    public update(options: Partial<ThresholdComponent.ComponentOptions>): this {
        super.update(options);
        return this.redraw();
    }
}

namespace ThresholdComponent {
    export type ComponentType = ThresholdComponent;

    export type ComponentConstructor = new (...a: any[]) => Component;

    export interface ComponentOptions extends Component.ComponentOptions {
        component: ComponentConstructor;
        options?: AnyRecord;
        thresholds?: Array<ThresholdOptions>;
        value?: number;
        valueName?: string;
    }

    export interface ThresholdOptions {
        component?: ComponentConstructor;
        max?: number;
        min?: number;
        options?: AnyRecord;
    }

    /**
     * Get the current values for a given set of options.
     *
     * @private
     */
    export function currentOptions(
        options: AnyRecord,
        curr: AnyRecord
    ): AnyRecord {
        const ret = {};

        /**
         * Recurse over a set of options and its current values,
         * and store the current values in the ret object.
         */
        function getCurrent(
            options: AnyRecord,
            curr: AnyRecord,
            ret: AnyRecord
        ): void {
            objectEach(options, function (val, key): void {
                if (
                    Chart.prototype.collectionsWithUpdate.indexOf(key) > -1 &&
                    isArray(curr[key])
                ) {
                    val = splat(val);

                    ret[key] = [];

                    // Iterate over collections like series, xAxis or yAxis and
                    // map the items by index.
                    for (
                        let i = 0;
                        i < Math.max(val.length, curr[key].length);
                        i++
                    ) {
                        if (curr[key][i]) {
                            if (val[i] === void 0) {
                                ret[key][i] = curr[key][i];
                            } else {
                                ret[key][i] = {};
                                getCurrent(
                                    val[i],
                                    curr[key][i],
                                    ret[key][i]
                                );
                            }
                        }
                    }
                } else if (isObject(val)) {
                    ret[key] = isArray(val) ? [] : {};
                    getCurrent(val, curr[key] || {}, ret[key]);
                } else if (typeof curr[key] === 'undefined') {
                    ret[key] = null;
                } else {
                    ret[key] = curr[key];
                }
            });
        }

        getCurrent(options, curr, ret);

        return ret;
    }
}

export default ThresholdComponent;
