/*
 * @adonisjs/ace
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { logger } from '@poppinss/cliui'
import { CommandFlagException } from '../Exceptions/CommandFlagException'
import { InvalidCommandException } from '../Exceptions/InvalidCommandException'
import { CommandArgumentException } from '../Exceptions/CommandArgumentException'

/**
 * Handles the command errors and prints them to the console.
 */
export function handleError(
	error: any,
	callback?: (error: any, loggerFn: typeof logger) => void | Promise<void>
) {
	if (error instanceof CommandArgumentException) {
		logger.error(`Missing argument "${error.argumentName}"`)
		return
	}

	if (error instanceof CommandFlagException) {
		const message = `Expected "${error.argumentName}" to be a valid "${error.exceptedType}"`
		logger.error(message)
		return
	}

	if (error instanceof InvalidCommandException) {
		logger.error(`"${error.commandName}" command not found`)

		if (error.suggestions && error.suggestions.length) {
			console.log('\n  Did you mean one of these?\n')
			error.suggestions.forEach(({ commandName }) => {
				console.log(`  ${logger.colors.yellow(commandName)}`)
			})
			console.log('')
		}
		return
	}

	if (typeof callback === 'function') {
		callback(error, logger)
	} else {
		logger.fatal(error)
	}
}
