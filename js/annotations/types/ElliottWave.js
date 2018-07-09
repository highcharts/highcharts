'use strict';
import H from '../../parts/Globals.js';
import '../../parts/Utilities.js';

var Annotation = H.Annotation,
    CrookedLine = Annotation.types['crooked-line'];

function ElliottWave() {
    CrookedLine.apply(this, arguments);
}

H.extendAnnotation(ElliottWave, CrookedLine, {
    addLabels: function () {
        H.each(this.getPointsOptions(), function (point, i) {
            var label = this.initLabel(H.merge(
                point.label, {
                    text: this.options.typeOptions.labels[i],
                    point: function (target) {
                        return target.annotation.points[i];
                    }
                }
            ), false);

            point.label = label.options;
        }, this);
    }
}, {
    typeOptions: {
        labels: ['(0)', '(A)', '(B)', '(C)', '(D)', '(E)'],
        line: {
            strokeWidth: 1
        }
    },

    labelOptions: {
        align: 'center',
        allowOverlap: true,
        crop: true,
        overflow: 'none',
        type: 'rect',
        backgroundColor: 'none',
        borderWidth: 0,
        y: -5
    }
});

Annotation.types['elliott-wave'] = ElliottWave;

export default ElliottWave;
