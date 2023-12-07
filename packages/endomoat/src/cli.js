#!/usr/bin/env node

/**
 * Main CLI entry point
 *
 *
 * @remarks
 * As tempting as it may be to try to move stuff out of here, it _will_ break
 * type inference, and you'll need to sort that out yourself.
 *
 * Regarding middleware: Any option which _does not_ either a) need other
 * options for postprocessing, or b) need to be asynchronous--should use
 * {@link yargs.coerce} instead.
 *
 * @packageDocumentation
 */

import path from 'node:path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import * as constants from './constants.js'
import { absolutify, resolveFrom } from './util.js'

yargs(hideBin(process.argv))
  /**
   * Default command (no command)
   */
  .command(
    '$0 [entryPath]',
    'Start the application',
    (yargs) =>
      yargs
        .options({
          policy: {
            alias: ['p', 'policyPath'],
            describe:
              'Filepath to the policy file, relative to the application directory',
            type: 'string',
            normalize: true,
            default: constants.DEFAULT_POLICY_PATH,
          },
          'policy-override': {
            alias: ['o', 'override'],
            describe:
              'Filepath to the policy override file, relative to the application directory',
            type: 'string',
            normalize: true,
            default: constants.DEFAULT_POLICY_OVERRIDE_PATH,
          },
          'endo-policy': {
            alias: ['e', 'endo'],
            describe:
              'Path to an Endo policy file, relative to application directory',
            normalize: true,
            conflicts: ['policy', 'policyOverride'],
          },
          cwd: {
            describe: 'The application directory',
            type: 'string',
            normalize: true,
            default: process.cwd(),
            defaultDescription: '(current directory)',
            // force absolute path
            coerce: path.resolve,
          },
        })
        .positional(
          'entryPath',
          /**
           * @remarks The `default` property value _must_ be a string, or TS
           * will think it can be `undefined`. If it's an empty string, the
           * `resolveEntryPath` middleware will attempt to resolve it automatically.
           */
          {
            describe: 'Path to the application entry point',
            type: 'string',
            normalize: false,
            defaultDescription: '(derived from package.json)',
            default: '',
          }
        ),
    /**
     * Default command handler.
     *
     * @remarks (That's "handler for the default command"--_not_ "default handler
     * for a command").
     */
    async (argv) => {
      const { run } = await import('./index.js')
      if (argv.endoPolicy) {
        const { readJsonFile } = await import('./util.js')
        const endoPolicy =
          /** @type {import('./policy-converter.js').LavaMoatEndoPolicy} */ (
            await readJsonFile(argv.endoPolicy)
          )
        await run(argv.entryPath, { endoPolicy })
      } else {
        const { loadPolicies: readAllPolicies } = await import('./policy.js')
        const policy = await readAllPolicies(argv.policy, argv.policyOverride)
        await run(argv.entryPath, policy)
      }
    },
    // middleware
    [
      /**
       * Resolves the entry point of the application (if needed)
       *
       * @todo In the case of an application with an `exports` field in its
       * `package.json`, I can envision a user providing a path to the entry
       * point file on disk--this is incorrect. The path must be a _key_ from
       * the `exports` field. We should help them by looking up the key from the
       * value.
       */
      function resolveEntryPath(argv) {
        argv.entryPath = argv.entryPath || resolveFrom(argv.cwd, '.')
      },

      /**
       * Ensures policy paths are absolute, resolved from `cwd`
       */
      function resolvePolicyPaths(argv) {
        argv.policy = absolutify(argv.policy)
        argv.policyOverride = absolutify(argv.policyOverride)
      },
    ]
  )
  .demandCommand(1)
  .showHelpOnFail(false)
  .version()
  .parse()
