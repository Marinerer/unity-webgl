export const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined'

export const getType = (value: any) =>
	Object.prototype.toString.call(value).slice(8, -1).toLowerCase()

export const isObject = (value: any) => getType(value) === 'object'

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
	const result = { ...obj }
	keys.forEach((key) => {
		delete result[key]
	})
	return result
}

/**
 * query CanvasElement
 */
export function queryCanvas(canvas: string | HTMLCanvasElement): HTMLCanvasElement | null {
	if (canvas instanceof HTMLCanvasElement) {
		return canvas
	}
	return document.querySelector(canvas)
}

export const log = (() => {
	const prefix = '[unity-webgl]'
	const _log = (...args: any[]) => console.log(prefix, ...args)
	_log.warn = (...args: any[]) => console.warn(prefix, ...args)
	_log.error = (...args: any[]) => console.error(prefix, ...args)
	return _log
})()
