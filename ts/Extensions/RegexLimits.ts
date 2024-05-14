/**
 * Limits for regex check to prevent overload of regex engine.
 */
export const enum RegexLimits {
    shortLimit = 1000,
    svgLimit = 100000000
}
