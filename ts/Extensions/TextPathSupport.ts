import TreegraphSeries from '../Series/Treegraph/TreegraphSeries';
import Series from '../Core/Series/Series.js';
import U from '../Core/Utilities.js';

const {
    addEvent
} = U;

function hideOverlappingPolygons(event: Event): void {
    const serie = event.target as any;
    if (serie && serie.is('treegraph') && (serie as TreegraphSeries).links) {
        const links = (serie as TreegraphSeries).links;

        for (const link of links) {
            if (link.dataLabel?.text?.textPath) {
                // Todo: only hide when overlap
                link.dataLabel && link.dataLabel.hide();
            }
        }
    }
}

/** @private */
function compose(SeriesClass: typeof Series): void {
    addEvent(SeriesClass, 'afterRender', hideOverlappingPolygons);
}

const TextPathSupport = {
    compose
};

export default TextPathSupport;
