/* *
 *
 *  Grid worker-based querying helper
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Highsoft
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataTable from '../../../Data/DataTable.js';
import type {
    FilterCondition,
    SerializableCondition
} from '../../../Data/Modifiers/FilterModifierOptions.js';
import type {
    ColumnSortingOrder,
    WorkerQueryingOptions
} from '../Options.js';

/* *
 *
 *  Declarations
 *
 * */

export interface WorkerSortingState {
    columnId: string;
    order: ColumnSortingOrder;
}

export interface WorkerQueryRequest {
    columns: Record<string, DataTable.Column>;
    rowCount: number;
    sortings: WorkerSortingState[];
    filterCondition?: SerializableCondition;
}

/* *
 *
 *  Constants
 *
 * */

const SUPPORTED_OPERATORS = new Set([
    'and',
    'or',
    'not',
    'contains',
    'startsWith',
    'endsWith',
    '==',
    '===',
    '!=',
    '!==',
    '>',
    '>=',
    '<',
    '<=',
    'empty'
]);

const WORKER_SCRIPT = `
var columns = {};

function normalizeValue(value) {
  return value || 0;
}

function toStringValue(value, ignoreCase) {
  var text = '' + value;
  return ignoreCase ? text.toLowerCase() : text;
}

function getValue(columnId, index) {
  var column = columns[columnId];
  return column ? column[index] : undefined;
}

function matchCondition(condition, index) {
  if (!condition || !condition.operator) {
    return true;
  }

  var operator = condition.operator;
  if (operator === 'and') {
    for (var i = 0; i < condition.conditions.length; i++) {
      if (!matchCondition(condition.conditions[i], index)) {
        return false;
      }
    }
    return true;
  }
  if (operator === 'or') {
    for (var j = 0; j < condition.conditions.length; j++) {
      if (matchCondition(condition.conditions[j], index)) {
        return true;
      }
    }
    return false;
  }
  if (operator === 'not') {
    return !matchCondition(condition.condition, index);
  }

  var columnId = condition.columnId;
  var value = getValue(columnId, index);

  if (operator === 'empty') {
    return value === null || value === '' || typeof value === 'undefined';
  }

  if (
    operator === 'contains' ||
    operator === 'startsWith' ||
    operator === 'endsWith'
  ) {
    var ignoreCase = condition.ignoreCase !== false;
    var left = toStringValue(value, ignoreCase);
    var right = toStringValue(condition.value, ignoreCase);
    if (operator === 'contains') {
      return left.indexOf(right) !== -1;
    }
    if (operator === 'startsWith') {
      return left.indexOf(right) === 0;
    }
    return left.lastIndexOf(right) ===
      left.length - right.length;
  }

  if (operator === '==' || operator === '!=') {
    return operator === '==' ?
      value == condition.value :
      value != condition.value;
  }
  if (operator === '===' || operator === '!==') {
    return operator === '===' ?
      value === condition.value :
      value !== condition.value;
  }

  var leftNumber = normalizeValue(value);
  var rightNumber = normalizeValue(condition.value);
  if (operator === '>') {
    return leftNumber > rightNumber;
  }
  if (operator === '>=') {
    return leftNumber >= rightNumber;
  }
  if (operator === '<') {
    return leftNumber < rightNumber;
  }
  if (operator === '<=') {
    return leftNumber <= rightNumber;
  }

  return true;
}

function compareValues(a, b, order) {
  var aValue = normalizeValue(a);
  var bValue = normalizeValue(b);
  if (aValue < bValue) {
    return order === 'asc' ? -1 : 1;
  }
  if (aValue > bValue) {
    return order === 'asc' ? 1 : -1;
  }
  return 0;
}

function compareIndices(a, b, sortings) {
  for (var i = 0; i < sortings.length; i++) {
    var sort = sortings[i];
    var order = sort.order;
    if (!order) {
      continue;
    }
    var column = columns[sort.columnId];
    var result = compareValues(
      column ? column[a] : undefined,
      column ? column[b] : undefined,
      order
    );
    if (result) {
      return result;
    }
  }
  return a - b;
}

self.onmessage = function (event) {
  var data = event.data || {};
  if (data.type !== 'compute') {
    return;
  }

  columns = data.columns || {};
  var rowCount = data.rowCount || 0;
  var sortings = data.sortings || [];
  var filterCondition = data.filterCondition || null;

  var indices = new Array(rowCount);
  for (var i = 0; i < rowCount; i++) {
    indices[i] = i;
  }

  if (filterCondition) {
    var filtered = [];
    for (var j = 0; j < indices.length; j++) {
      var idx = indices[j];
      if (matchCondition(filterCondition, idx)) {
        filtered.push(idx);
      }
    }
    indices = filtered;
  }

  if (sortings.length) {
    indices.sort(function (a, b) {
      return compareIndices(a, b, sortings);
    });
  }

  self.postMessage({
    type: 'result',
    requestId: data.requestId,
    indices: indices
  });
};
`;

/* *
 *
 *  Helpers
 *
 * */

/**
 * Checks whether a filter condition is supported by the worker.
 *
 * @param condition
 * Filter condition to validate.
 *
 * @returns
 * Whether the condition can be handled by the worker.
 */
function isSupportedCondition(condition?: FilterCondition): boolean {
    if (!condition) {
        return true;
    }

    if (typeof condition === 'function') {
        return false;
    }

    const serializable = condition as SerializableCondition;

    if (!SUPPORTED_OPERATORS.has(serializable.operator)) {
        return false;
    }

    if (serializable.operator === 'and' || serializable.operator === 'or') {
        return serializable.conditions.every(isSupportedCondition);
    }

    if (serializable.operator === 'not') {
        return isSupportedCondition(serializable.condition);
    }

    return true;
}

/* *
 *
 *  Class
 *
 * */

class WorkerQuerying {
    private worker?: Worker;
    private requestId = 0;

    public static isSupported(): boolean {
        return (
            typeof Worker !== 'undefined' &&
            typeof Blob !== 'undefined' &&
            typeof URL !== 'undefined'
        );
    }

    public static canHandleCondition(condition?: FilterCondition): boolean {
        return isSupportedCondition(condition);
    }

    public static shouldUse(
        options: WorkerQueryingOptions | undefined,
        rowCount: number,
        hasQuerying: boolean
    ): boolean {
        if (!options?.enabled || !hasQuerying) {
            return false;
        }
        const minRows = options.minRows ?? 10000;
        return rowCount >= minRows;
    }

    public async computeIndices(
        request: WorkerQueryRequest
    ): Promise<number[] | null> {
        if (!WorkerQuerying.isSupported()) {
            return null;
        }
        const worker = this.getWorker();
        if (!worker) {
            return null;
        }

        const requestId = ++this.requestId;
        const executor = (
            resolve: (value: number[] | null) => void
        ): void => {
            const handleMessage = (event: MessageEvent): void => {
                const data = event.data;
                if (!data || data.requestId !== requestId) {
                    return;
                }
                worker.removeEventListener('message', handleMessage);
                worker.removeEventListener('error', handleError);
                resolve(Array.isArray(data.indices) ? data.indices : null);
            };

            const handleError = (): void => {
                worker.removeEventListener('message', handleMessage);
                worker.removeEventListener('error', handleError);
                resolve(null);
            };

            worker.addEventListener('message', handleMessage);
            worker.addEventListener('error', handleError);
            worker.postMessage({
                type: 'compute',
                requestId,
                columns: request.columns,
                rowCount: request.rowCount,
                sortings: request.sortings,
                filterCondition: request.filterCondition
            });
        };

        return new Promise<number[] | null>(executor);
    }

    private getWorker(): Worker | null {
        if (!WorkerQuerying.isSupported()) {
            return null;
        }

        if (!this.worker) {
            try {
                const blob = new Blob([WORKER_SCRIPT], {
                    type: 'text/javascript'
                });
                const url = URL.createObjectURL(blob);
                this.worker = new Worker(url);
            } catch {
                this.worker = void 0;
            }
        }

        return this.worker || null;
    }
}

export default WorkerQuerying;
