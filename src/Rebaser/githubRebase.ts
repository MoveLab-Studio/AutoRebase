import {rebasePullRequest} from 'github-rebase/lib';
import {Octokit} from '@octokit/rest';
import {debug} from '@actions/core';

export interface GithubRebase {
    rebasePullRequest(owner: string, pullRequestNumber: number, repo: string): Promise<string>;
}

export class RealGithubRebase implements GithubRebase {
    private readonly octokit: Octokit;

    constructor(octokit: Octokit) {
        this.octokit = octokit;
    }

    public async rebasePullRequest(owner: string, pullRequestNumber: number, repo: string): Promise<string> {
        debug(`[GithubRebase] Starting rebase for PR #${pullRequestNumber} in ${owner}/${repo}`);

        try {
            // Log information about the PR before rebasing
            debug(`[GithubRebase] Fetching PR details before rebase`);
            try {
                const prDetails = await this.octokit.pulls.get({
                    owner,
                    repo,
                    pull_number: pullRequestNumber,
                });

                debug(`[GithubRebase] PR #${pullRequestNumber} details:`);
                debug(`  Base branch: ${prDetails.data.base.ref}`);
                debug(`  Head branch: ${prDetails.data.head.ref}`);
                debug(`  Head SHA: ${prDetails.data.head.sha}`);
                debug(`  Mergeable state: ${prDetails.data.mergeable_state}`);
                debug(`  Rebaseable: ${String(prDetails.data.rebaseable)}`);
            } catch (prError) {
                debug(`[GithubRebase] Error fetching PR details: ${String(prError)}`);
            }

            // Perform the actual rebase
            debug(`[GithubRebase] Calling github-rebase library`);
            const result = await rebasePullRequest({
                octokit: this.octokit,
                owner: owner,
                pullRequestNumber: pullRequestNumber,
                repo: repo,
            });

            debug(`[GithubRebase] Rebase completed successfully with result: ${result}`);
            return result;
        } catch (error) {
            debug(`[GithubRebase] Error during rebase: ${String(error)}`);

            // Try to extract more information about the error
            if (String(error).includes('Reference does not exist')) {
                debug(`[GithubRebase] This appears to be a missing reference error`);

                // Try to get information about the branches
                try {
                    debug(`[GithubRebase] Attempting to get more information about the branches`);
                    const pr = await this.octokit.pulls.get({
                        owner,
                        repo,
                        pull_number: pullRequestNumber,
                    });

                    const baseRef = pr.data.base.ref;
                    const headRef = pr.data.head.ref;

                    debug(`[GithubRebase] Base branch: ${baseRef}, Head branch: ${headRef}`);

                    // Check if base branch exists
                    try {
                        await this.octokit.git.getRef({
                            owner,
                            repo,
                            ref: `heads/${baseRef}`,
                        });
                        debug(`[GithubRebase] Base branch '${baseRef}' exists`);
                    } catch (baseError) {
                        debug(
                            `[GithubRebase] Base branch '${baseRef}' does not exist or is not accessible: ${String(
                                baseError,
                            )}`,
                        );
                    }

                    // Check if head branch exists
                    try {
                        const headOwner = pr.data.head.repo ? pr.data.head.repo.owner.login : owner;
                        const headRepo = pr.data.head.repo ? pr.data.head.repo.name : repo;

                        await this.octokit.git.getRef({
                            owner: headOwner,
                            repo: headRepo,
                            ref: `heads/${headRef}`,
                        });
                        debug(`[GithubRebase] Head branch '${headRef}' exists in ${headOwner}/${headRepo}`);
                    } catch (headError) {
                        debug(
                            `[GithubRebase] Head branch '${headRef}' does not exist or is not accessible: ${String(
                                headError,
                            )}`,
                        );
                    }
                } catch (prError) {
                    debug(`[GithubRebase] Could not get PR details to check branches: ${String(prError)}`);
                }
            }

            // Re-throw the error to be handled by the caller
            throw error;
        }
    }
}
