import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { rimraf } from 'rimraf'
import { rollupBuild } from './rollup.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
async function readJSON(path) {
	const result = await fs.readFile(path, 'utf-8')
	return JSON.parse(result)
}

function generateBanner(pkg) {
	return (
		'/*!\n' +
		` * ${pkg.name} v${pkg.version}\n` +
		` * Copyright (c) ${new Date().getFullYear()} Mariner<mengqing723@gmail.com>\n` +
		` * Released under the ${pkg.license} License.\n` +
		' */'
	)
}

;(async () => {
	const cwd = process.cwd()
	const isLib = cwd.endsWith('core')

	const pkg = await readJSON('package.json')
	const libPkg = isLib ? pkg : await readJSON('../core/package.json')
	const banner = generateBanner(libPkg)

	await rimraf('dist')

	const options = [].concat(pkg.buildOptions)
	for (const opt of options) {
		await rollupBuild(opt, { banner, pkg })
	}

	if (!isLib) {
		await fs.cp('dist', '../core/dist', { recursive: true })
	} else {
		await fs.cp('./README.md', '../../README.md', { force: true })
		await fs.cp('./README.zh_CN.md', '../../README.zh_CN.md', { force: true })
	}
})()
