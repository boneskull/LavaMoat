/**
 * This module should contain constants that are used in multiple places.
 *
 * _Type a string more than once? Make it a constant!_
 */

import path from 'node:path'

export const DEFAULT_POLICY_PATH = path.join(
  '.',
  'lavamoat',
  'node',
  'policy.json'
)

export const DEFAULT_POLICY_OVERRIDE_PATH = path.join(
  '.',
  'lavamoat',
  'node',
  'policy-override.json'
)
export const ENDO_ROOT_POLICY = 'root'
export const ENDO_WRITE_POLICY = 'write'
export const ENDO_WILDCARD_POLICY = 'any'
export const LAVAMOAT_PKG_POLICY_ROOT = '$root$'

export const RSRC_POLICY_PKGS = 'packages'
export const RSRC_POLICY_BUILTINS = 'builtins'
export const RSRC_POLICY_GLOBALS = 'globals'
