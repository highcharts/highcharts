import type { NavigatorOptions } from './NavigatorOptions';
import type { SeriesOptions } from '../../Core/Series/SeriesOptions';
import Chart from '../../Core/Chart/Chart.js';
import Navigator from './Navigator.js';
import G from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
import Axis from '../../Core/Axis/Axis.js';
import StandaloneNavigatorDefaults from './StandaloneNavigatorDefaults.js';
const {
    merge,
    addEvent,
    fireEvent,
    pick
} = U;

declare module '../../Core/GlobalsLike.d.ts' {
    interface GlobalsLike {
        navigators: Array<StandaloneNavigator>;
    }
}

type StandaloneNavigatorOptions = {
    navigator: NavigatorOptions;
    width: number;
    height: number;
    min: number;
    max: number;
    colors: [];
};

class StandaloneNavigator {

    public eventsToUnbind: Array<Function> = [];
    public navigator: Navigator;
    public boundAxes: Array<Axis> = [];
    public options: StandaloneNavigatorOptions;

    public static navigator(
        renderTo: (string|globalThis.HTMLElement),
        options: DeepPartial<StandaloneNavigatorOptions>
    ): StandaloneNavigator {
        const mergedOptions = merge(
            (G as any).getOptions(),
            StandaloneNavigatorDefaults,
            options
        ) as StandaloneNavigatorOptions;

        const nav = new StandaloneNavigator(renderTo, mergedOptions);

        if (!G.navigators) {
            G.navigators = [nav];
        } else {
            G.navigators.push(nav);
        }

        return nav;
    }


    constructor(
        element: (string | globalThis.HTMLElement),
        options: StandaloneNavigatorOptions
    ) {
        this.options = options;
        const chart = new Chart(element, options);

        this.navigator = new Navigator(chart);
        chart.navigator = this.navigator;
        this.initNavigator();
    }

    public bind(axisOrChart: Axis | Chart): void {
        const nav = this;
        const axis = (axisOrChart instanceof Chart) ?
            axisOrChart.xAxis[0] :
            axisOrChart;

        if (!(axis instanceof Axis)) {
            return;
        }

        const { min, max } = this.navigator.xAxis;

        this.boundAxes.push(axis);

        axis.series.forEach((series): void => {
            if (series.options.showInNavigator) {
                nav.addSeries(series.options);
            }
        });

        axis.setExtremes(min, max);
    }

    public destroy(): void {
        // Disconnect events
        this.eventsToUnbind.forEach((f): void => {
            f();
        });
        this.boundAxes.length = 0;
        this.eventsToUnbind.length = 0;
        this.navigator.destroy();
        this.navigator.chart.destroy();
    }

    public update(
        newOptions: Partial<StandaloneNavigatorOptions>,
        redraw?: boolean
    ):void {
        this.options = merge(this.options, newOptions);

        this.navigator.chart.update(this.options, redraw);
    }

    public unbind(axisOrChart?: Chart | Axis): void {
        if (!axisOrChart) {
            this.boundAxes.length = 0;
            return;
        }

        const axis = (axisOrChart instanceof Axis) ?
            axisOrChart :
            axisOrChart.xAxis[0];

        this.boundAxes = this.boundAxes.filter((a): boolean => a !== axis);
    }

    public addSeries(seriesOptions: SeriesOptions): void {
        this.navigator.chart.addSeries(merge(
            seriesOptions,
            { showInNavigator: pick(seriesOptions.showInNavigator, true) }
        ));

        this.navigator.setBaseSeries();
    }

    public initNavigator(): void {
        const nav = this.navigator;
        nav.top = 0;
        nav.xAxis.setScale();
        nav.yAxis.setScale();
        nav.xAxis.render();
        nav.yAxis.render();
        nav.series?.forEach((s): void => {
            s.translate();
            s.render();
            s.redraw();
        });

        const { min, max } = this.getInitialExtremes();
        nav.render(min, max);

        this.eventsToUnbind.push(
            addEvent(
                this.navigator.chart.xAxis[0],
                'setExtremes',
                (e): void => {
                    const { min, max } = e as { min: number, max: number };

                    this.boundAxes.forEach((axis): void => {
                        axis.setExtremes(min, max);
                    });
                }
            )
        );
    }

    public getRange(): Axis.ExtremesObject {
        const { min, max } = this.navigator.chart.xAxis[0].getExtremes(),
            { userMin, userMax, min: dataMin, max: dataMax } =
                this.navigator.xAxis.getExtremes();

        return {
            min: pick(min, dataMin),
            max: pick(max, dataMax),
            dataMin,
            dataMax,
            userMin,
            userMax
        };
    }

    public setRange(min?: number, max?: number): void {
        fireEvent(
            this.navigator,
            'setRange',
            { min, max, trigger: 'navigator' }
        );
    }

    public getInitialExtremes(): { min: number, max: number } {
        const { min, max } = this.options,
            { min: defaultMin, max: defaultMax } =
                this.navigator.xAxis.getExtremes();

        return {
            min: min || defaultMin,
            max: max || defaultMax
        };
    }
}

export default StandaloneNavigator;
