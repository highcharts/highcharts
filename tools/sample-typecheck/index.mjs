// Keep the native compiler local to this workspace so root tsc stays on TS6.
// eslint-disable-next-line node/no-missing-import
export { API, DiagnosticCategory, formatDiagnostics } from 'typescript/sync';
