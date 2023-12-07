import fs from 'node:fs/promises'
import { Module } from 'node:module'
import path from 'node:path'

/**
 * Resolves a module from a given directory
 * @overload
 * @param {string} cwd - The directory to resolve from
 * @param {string} moduleId - The module to resolve
 * @returns {string} The resolved module
 */

/**
 * Resolves a module from the current working directory
 * @overload
 * @param {string} moduleId - The module to resolve
 * @returns {string} The resolved module
 */

/**
 * Resolves a module from the given directory or from the current working directory
 * @param {string} cwdOrModuleId - The directory to resolve from or the module to resolve
 * @param {string} [allegedModuleId] - The module to resolve
 * @returns {string} The resolved module
 */
export function resolveFrom(cwdOrModuleId, allegedModuleId) {
  const moduleId = allegedModuleId ? allegedModuleId : cwdOrModuleId
  let cwd = allegedModuleId ? cwdOrModuleId : process.cwd()

  if (!path.isAbsolute(cwd)) {
    cwd = path.resolve(cwd)
  }

  const require = Module.createRequire(path.join(cwd, 'dummy.js'))
  return require.resolve(moduleId)
}

/**
 * Reads a JSON file
 *
 * @template [T=unknown]
 * @param {string|URL} filepath
 * @returns {Promise<T>}
 */
export async function readJsonFile(filepath) {
  const json = await fs.readFile(filepath, 'utf8')
  return JSON.parse(json)
}

/**
 * Makes a path absolute if it isn't already
 *
 * @param {string} filepath - Path to make absolute
 * @param {string} [cwd] - Current working directory
 * @returns {string}
 */
export function absolutify(filepath, cwd = process.cwd()) {
  return path.isAbsolute(filepath) ? filepath : path.resolve(cwd, filepath)
}
