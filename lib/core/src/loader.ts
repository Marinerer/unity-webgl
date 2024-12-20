import { isBrowser } from './utils'

type ScriptLoadedStatus = 'loaded' | 'error'
type UnityLoaderCallbackObj = {
	resolve: () => void
	reject: (error: Error) => void
}

/**
 * Loading Unity Loader Scripts
 * @param src script src
 * @param callbacks callbacks
 */
export function unityLoader(
	src: string,
	callbacks: UnityLoaderCallbackObj = {} as UnityLoaderCallbackObj
) {
	const { resolve, reject } = callbacks

	if (!isBrowser) return null
	if (!src) {
		reject && reject(new Error(`${src} not found.`))
		return null
	}

	function handler(code: ScriptLoadedStatus) {
		if (code === 'loaded') {
			resolve && resolve()
		} else {
			reject && reject(new Error(`${src} loading failure.`))
		}
	}

	let script: HTMLScriptElement | null = window.document.querySelector(`script[src="${src}"]`)

	if (!script) {
		script = window.document.createElement('script')
		script.async = true
		script.setAttribute('data-status', 'loading')

		function setAttrListener(status: ScriptLoadedStatus) {
			script?.setAttribute('data-status', status)
			handler(status)
		}
		script.addEventListener('load', () => setAttrListener('loaded'))
		script.addEventListener('error', () => setAttrListener('error'))

		script.src = src
		window.document.body.appendChild(script)
	} else {
		handler(script.getAttribute('data-status') === 'loaded' ? 'loaded' : 'error')
	}

	// Return cleanup function
	return function remove() {
		if (script && script.parentNode) {
			script.parentNode.removeChild(script)
		}
	}
}
