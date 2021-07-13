import ControllableCircle from './ControllableCircle.js';
import type SVGElement from '../../../Core/Renderer/SVG/SVGElement';
import ControllableMixin from '../Mixins/ControllableMixin.js';
import U from '../../../Core/Utilities.js';
const { merge } = U;

class ControllableEllipse extends ControllableCircle {
    public static attrsMap = merge(ControllableCircle.attrsMap, {
        cx: 'cx',
        rx: 'rx',
        ry: 'ry',
        cy: 'cy'
    });

    public type = 'ellipse';
    public render(parent: SVGElement): void {
        const attrs = this.attrsFromOptions(this.options);

        const graphic = this.annotation.chart.renderer.createElement('ellipse');
        graphic.attr(attrs).add(parent);
        this.graphic = graphic;
        ControllableMixin.render.call(this);
    }
    public redraw(animation?: boolean): void {
        const position = this.anchor(this.points[0]).absolutePosition;

        if (position) {
            this.graphic[animation ? 'animate' : 'attr']({
                cx: position.x,
                cy: position.y,
                rx: this.options.rx,
                ry: this.options.ry
            });
        } else {
            this.graphic.attr({
                x: 0,
                y: -9e9
            });
        }

        this.graphic.placed = Boolean(position);

        ControllableMixin.redraw.call(this, animation);
    }

    public setRadius(rx: number, ry?: number): void {
        this.options.rx = rx;
        this.options.ry = ry || rx;
    }
}

export default ControllableEllipse;
