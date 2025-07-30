import { UnityWebglEvent } from './event'
import { unityLoader } from './loader'
import { isBrowser, isObject, omit, queryCanvas, log } from './utils'
import { UnityArguments } from './types/unity-arguments'
import { UnityInstance } from './types/unity-instance'
import { UnityConfig } from './types/unity-config'

type CanvasElementOrString = HTMLCanvasElement | string

function createUnityArgs(ctx: UnityWebgl, config: UnityConfig): UnityArguments {
	const unityArgs: UnityArguments = omit(config, ['loaderUrl'])
	unityArgs.print = function (msg: string) {
		ctx.emit('debug', msg)
	}
	unityArgs.printError = function (msg: string) {
		ctx.emit('error', msg)
	}
	return unityArgs
}

class UnityWebgl extends UnityWebglEvent {
	private _config: UnityConfig
	private _unity: UnityInstance | null = null
	private _loader: (() => void) | null = null
	private _canvas: HTMLCanvasElement | null = null

	constructor(canvas: CanvasElementOrString, config: UnityConfig)
	constructor(config: UnityConfig)
	constructor(canvas: CanvasElementOrString | UnityConfig, config?: UnityConfig) {
		super()
		if (!(typeof canvas === 'string' || canvas instanceof HTMLCanvasElement || isObject(canvas))) {
			throw new TypeError('Parameter canvas is not valid')
		}

		// config
		if (isObject(canvas)) {
			config = canvas as UnityConfig
		}
		if (
			!config ||
			!config.loaderUrl ||
			!config.dataUrl ||
			!config.frameworkUrl ||
			!config.codeUrl
		) {
			throw new TypeError('UnityConfig is not valid')
		}
		this._config = config

		// canvas
		if (typeof canvas === 'string' || canvas instanceof HTMLCanvasElement) {
			this.render(canvas)
		}
	}

	/**
	 * @deprecated Use `render()` instead.
	 */
	create(canvas: CanvasElementOrString): Promise<void> {
		return this.render(canvas)
	}

	/**
	 * Renders the UnityInstance into the target html canvas element.
	 * @param canvas The target html canvas element.
	 */
	render(canvas: CanvasElementOrString): Promise<void> {
		if (!isBrowser) return Promise.resolve()

		if (this._unity && this._canvas && this._loader) {
			log.warn('UnityInstance already created')
			return Promise.resolve()
		}

		return new Promise((resolve, reject) => {
			try {
				const $canvas = queryCanvas(canvas)
				if (!$canvas) {
					throw new Error('CanvasElement is not found')
				}
				this._canvas = $canvas
				const ctx = this
				// Create UnityInstance Arguments
				const unityArgs = createUnityArgs(this, this._config)

				this.emit('beforeMount', this)

				this._loader = unityLoader(this._config.loaderUrl, {
					resolve() {
						window
							.createUnityInstance($canvas, unityArgs, (val: number) => ctx.emit('progress', val))
							.then((ins: UnityInstance) => {
								ctx._unity = ins
								ctx.emit('mounted', ctx, ins)
								resolve()
							})
							.catch((err) => {
								throw err
							})
					},
					reject(err) {
						throw err
					},
				})
			} catch (err) {
				this._unity = null
				this.emit('error', err)
				reject(err)
			}
		})
	}

	/**
	 * Sends a message to the UnityInstance to invoke a public method.
	 * @param {string} objectName Unity scene name.
	 * @param {string} methodName public method name.
	 * @param {any} value an optional method parameter.
	 * @returns
	 */
	sendMessage(objectName: string, methodName: string, value?: any) {
		if (!this._unity) {
			log.warn('Unable to Send Message while Unity is not Instantiated.')
			return this
		}

		if (value === undefined || value === null) {
			this._unity.SendMessage(objectName, methodName)
		} else {
			const _value = typeof value === 'object' ? JSON.stringify(value) : value
			this._unity.SendMessage(objectName, methodName, _value)
		}
		return this
	}
	/**
	 * @deprecated Use `sendMessage()` instead.
	 */
	send(objectName: string, methodName: string, value?: any) {
		return this.sendMessage(objectName, methodName, value)
	}

	/**
	 * Asynchronously ask for the pointer to be locked on current canvas.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/requestPointerLock
	 */
	requestPointerLock(): void {
		if (!this._unity || !this._unity.Module.canvas) {
			log.warn('Unable to requestPointerLock while Unity is not Instantiated.')
			return
		}
		this._unity.Module.canvas.requestPointerLock()
	}

	/**
	 * Takes a screenshot of the canvas and returns a base64 encoded string.
	 * @param {string} dataType Defines the type of screenshot, e.g "image/jpeg"
	 * @param {number} quality Defines the quality of the screenshot, e.g 0.92
	 * @returns A base 64 encoded string of the screenshot.
	 */
	takeScreenshot(dataType?: string, quality?: any): string | undefined {
		if (!this._unity || !this._unity.Module.canvas) {
			log.warn('Unable to take Screenshot while Unity is not Instantiated.')
			return
		}

		return this._unity.Module.canvas.toDataURL(dataType, quality)
	}

	/**
	 * Enables or disabled the Fullscreen mode of the Unity Instance.
	 * @param {boolean} enabled
	 */
	setFullscreen(enabled: boolean) {
		if (!this._unity) {
			log.warn('Unable to set Fullscreen while Unity is not Instantiated.')
			return
		}

		this._unity.SetFullscreen(enabled ? 1 : 0)
	}

	/**
	 * Quits the Unity instance and clears it from memory so that Unmount from the DOM.
	 */
	unload(): Promise<void> {
		if (!this._unity) {
			log.warn('Unable to Quit Unity while Unity is not Instantiated.')
			return Promise.reject()
		}
		this.emit('beforeUnmount', this)

		// Unmount unity.loader.js from DOM
		if (typeof this._loader === 'function') {
			this._loader()
			this._loader = null
		}
		// Unmount unityInstance from memory
		return this._unity
			.Quit()
			.then(() => {
				this._unity = null
				this._canvas = null

				this.emit('unmounted')
				this.clear()
			})
			.catch((err) => {
				log.error('Unable to Unload Unity')
				this.emit('error', err)
				throw err
			})
	}

	/**
	 * 保障Unity组件可以安全卸载. 在unity实例从内存中销毁之前保障Dom存在.
	 *
	 * Warning! This is a workaround for the fact that the Unity WebGL instances
	 * which are build with Unity 2021.2 and newer cannot be unmounted before the
	 * Unity Instance is unloaded.
	 */
	unsafe_unload(): Promise<void> {
		try {
			if (!this._unity || !this._unity.Module.canvas) {
				log.warn('No UnityInstance found.')
				return Promise.reject()
			}
			// Re-attaches the canvas to the body element of the document. This way it
			// wont be removed from the DOM when the component is unmounted. Then the
			// canvas will be hidden while it is being unloaded.
			const canvas = this._unity.Module.canvas as HTMLCanvasElement
			document.body.appendChild(canvas)
			canvas.style.display = 'none'
			return this.unload().then(() => {
				canvas.remove()
			})
		} catch (e) {
			return Promise.reject(e)
		}
	}
}

export default UnityWebgl
export type { UnityArguments, UnityConfig, UnityInstance }
