/**
 * Limits for regex check to prevent overload of regex engine.
 */
const enum RegexLimits {
    shortLimit = 1000,
    svgLimit = 1e8
}

export default RegexLimits;
