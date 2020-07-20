import { LANG } from "../_config";

/**
 * Build URLs needed for retain SPA logic,
 * in production we need to point to the path where the APP is deployed
 *
 * @param {*} path
 */
export function buildURI(path) {
    return process.env.PUBLIC_URL + path;
}

/**
 * Return page title
 *
 * @param {*} area
 */
export function buildPageTitle(area) {
    return area + " - " + LANG.APP_NAME;
}