import {PullRequestInfo} from '../pullrequestinfo';
import {info, warning, debug} from '@actions/core';
import {GithubRebase} from './githubRebase';

/**
 * Uses [github-rebase](https://github.com/tibdex/github-rebase)
 * to rebase pull requests.
 */
export class Rebaser {
    private githubRebase: GithubRebase;

    constructor(githubRebase: GithubRebase) {
        this.githubRebase = githubRebase;
    }

    public async rebasePullRequests(pullRequests: PullRequestInfo[]): Promise<void> {
        for (const pullRequest of pullRequests) {
            await this.rebase(pullRequest);
        }
    }

    private async rebase(pullRequest: PullRequestInfo) {
        info(`Rebasing pull request ${JSON.stringify(pullRequest)}`);
        debug(
            `Starting rebase process for PR #${pullRequest.number} in ${pullRequest.ownerName}/${pullRequest.repoName}`,
        );
        debug(
            `PR details: mergeableState=${pullRequest.mergeableState}, rebaseable=${String(
                pullRequest.rebaseable,
            )}, draft=${String(pullRequest.draft)}`,
        );
        debug(`PR labels: ${JSON.stringify(pullRequest.labels)}`);

        try {
            debug(`Calling github-rebase library for PR #${pullRequest.number}`);
            const result = await this.githubRebase.rebasePullRequest(
                pullRequest.ownerName,
                pullRequest.number,
                pullRequest.repoName,
            );
            debug(`Rebase result: ${result}`);

            info(`${JSON.stringify(pullRequest)} was successfully rebased.`);
        } catch (e) {
            debug(`Error during rebase of PR #${pullRequest.number}: ${String(e)}`);
            // Log the full error object for debugging
            debug(`Full error details: ${JSON.stringify(e, Object.getOwnPropertyNames(e))}`);
            if (String(e).includes('Rebase aborted because the head branch changed')) {
                warning(`Rebase aborted because the head branch changed for ${JSON.stringify(pullRequest)}`);
                return;
            }
            throw new Error(`Error while rebasing for ${JSON.stringify(pullRequest)}: ${String(e)}`);
        }
    }
}
