import {debug, info, warning, error} from '@actions/core';

/**
 * Utility functions for standardized logging across the application.
 * These functions help provide consistent, detailed diagnostic information.
 */

/**
 * Logs detailed information about an error.
 *
 * @param message A descriptive message about where/when the error occurred
 * @param err The error object
 * @param context Optional additional context information
 */
export function logError(message: string, err: unknown, context?: Record<string, unknown>): void {
    error(`ERROR: ${message}`);

    // Log the error message
    error(`Error message: ${String(err)}`);

    // Log the stack trace if available
    if (err instanceof Error && err.stack) {
        error(`Stack trace: ${err.stack}`);
    }

    // Log all properties of the error object
    try {
        error(`Error details: ${JSON.stringify(err, Object.getOwnPropertyNames(err))}`);
    } catch (jsonError) {
        error(`Could not stringify error: ${String(jsonError)}`);
    }

    // Log additional context if provided
    if (context) {
        try {
            error(`Error context: ${JSON.stringify(context)}`);
        } catch (jsonError) {
            error(`Could not stringify context: ${String(jsonError)}`);
        }
    }
}

/**
 * Logs detailed debug information.
 *
 * @param component The component/module name for context
 * @param message The debug message
 * @param data Optional data to include in the log
 */
export function logDebug(component: string, message: string, data?: unknown): void {
    const prefix = component ? `[${component}] ` : '';

    debug(`${prefix}${message}`);

    if (data !== undefined) {
        try {
            if (typeof data === 'string') {
                debug(`${prefix}Data: ${data}`);
            } else {
                debug(`${prefix}Data: ${JSON.stringify(data)}`);
            }
        } catch (jsonError) {
            debug(`${prefix}Could not stringify data: ${String(jsonError)}`);
        }
    }
}

/**
 * Logs information about a pull request.
 *
 * @param component The component/module name for context
 * @param message A descriptive message
 * @param pullRequest The pull request information
 */
export function logPullRequestInfo(
    component: string,
    message: string,
    pullRequest: {
        number: number;
        ownerName: string;
        repoName: string;
        [key: string]: unknown;
    },
): void {
    const prefix = component ? `[${component}] ` : '';
    const prId = `PR #${pullRequest.number} in ${pullRequest.ownerName}/${pullRequest.repoName}`;

    info(`${prefix}${message} - ${prId}`);

    // Log detailed PR information at debug level
    try {
        debug(`${prefix}Pull request details: ${JSON.stringify(pullRequest)}`);
    } catch (jsonError) {
        debug(`${prefix}Could not stringify pull request: ${String(jsonError)}`);
    }
}

/**
 * Logs a warning with context information.
 *
 * @param component The component/module name for context
 * @param message The warning message
 * @param data Optional data to include in the log
 */
export function logWarning(component: string, message: string, data?: unknown): void {
    const prefix = component ? `[${component}] ` : '';

    warning(`${prefix}${message}`);

    if (data !== undefined) {
        try {
            if (typeof data === 'string') {
                debug(`${prefix}Warning data: ${data}`);
            } else {
                debug(`${prefix}Warning data: ${JSON.stringify(data)}`);
            }
        } catch (jsonError) {
            debug(`${prefix}Could not stringify warning data: ${String(jsonError)}`);
        }
    }
}
