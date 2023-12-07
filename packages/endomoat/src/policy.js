import { mergePolicy } from 'lavamoat-core'
import * as constants from './constants.js'
import { readJsonFile } from './util.js'

/**
 * Reads a `policy.json` from disk
 *
 * @todo validate
 * @param {string|URL} [filepath]
 * @returns {Promise<import('lavamoat-core').LavaMoatPolicy>}
 */
export async function readPolicy(filepath = constants.DEFAULT_POLICY_PATH) {
  return readJsonFile(filepath)
}

/**
 * Reads a `policy-override.json` from disk
 *
 * @todo validate
 * @param {string|URL} [filepath]
 * @returns {Promise<import('lavamoat-core').LavaMoatPolicyOverrides|undefined>}
 */
export async function readPolicyOverride(
  filepath = constants.DEFAULT_POLICY_OVERRIDE_PATH
) {
  await null // eslint
  try {
    return await readPolicy(filepath)
  } catch (err) {
    if (/** @type {NodeJS.ErrnoException} */ (err).code === 'ENOENT') {
      return undefined
    }
    throw err
  }
}

/**
 * Merge a policy and overrides, if applicable.
 *
 * @param {import('lavamoat-core').LavaMoatPolicy} policy
 * @param {import('lavamoat-core').LavaMoatPolicyOverrides} [policyOverride]
 * @returns {import('lavamoat-core').LavaMoatPolicy}
 */
function mergePolicies(policy, policyOverride) {
  return mergePolicy(policy, policyOverride)
}

/**
 * Reads a policy and policy override from disk and merges them into a single policy.
 *
 * @param {string} [policyPath]
 * @param {string} [policyOverridePath]
 * @returns {Promise<import('lavamoat-core').LavaMoatPolicy>}
 */
export async function loadPolicies(
  policyPath = constants.DEFAULT_POLICY_PATH,
  policyOverridePath = constants.DEFAULT_POLICY_OVERRIDE_PATH
) {
  const policies = await Promise.all([
    readPolicy(policyPath),
    readPolicyOverride(policyOverridePath),
  ])

  return mergePolicies(...policies)
}
