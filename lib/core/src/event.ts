import { isBrowser } from './utils'

interface EventListener {
	(...args: any[]): void
	_?: EventListener
}
type EventListenerOptions = {
	once?: boolean
}
type EventMap = Record<string, EventListener[]>

export class UnityWebglEvent {
	private _e: EventMap // event map

	constructor() {
		this._e = {}
		if (isBrowser) {
			// Register Unity event trigger to the window object
			window.dispatchUnityEvent = (name: string, ...args: any[]) => {
				if (!name.startsWith('unity:')) {
					name = `unity:${name}`
				}
				this.emit.apply(this, [name, ...args])
			}
		}
	}

	/**
	 * Register event listener
	 * @param name event name
	 * @param listener event listener
	 * @param options event listener options
	 */
	on(name: string, listener: EventListener, options?: EventListenerOptions) {
		if (typeof listener !== 'function') {
			throw new TypeError('listener must be a function')
		}

		if (!this._e[name]) {
			this._e[name] = []
		}

		if (options?.once) {
			const onceListener = (...args: any[]) => {
				this.off(name, onceListener)
				listener.apply(this, args)
			}
			onceListener._ = listener

			this._e[name].push(onceListener)
		} else {
			this._e[name].push(listener)
		}
		return this
	}

	/**
	 * Remove event listener
	 * @param name event name
	 * @param listener event listener
	 */
	off(name: string, listener?: EventListener) {
		if (!listener) {
			delete this._e[name]
		} else {
			const listeners = this._e[name]
			if (listeners) {
				this._e[name] = listeners.filter((l) => l !== listener && l._ !== listener)
			}
		}
		return this
	}

	/**
	 * Dispatch event
	 * @param name event name
	 * @param args event args
	 */
	emit(name: string, ...args: any[]) {
		if (!this._e[name]) {
			console.warn(`No listener for event ${name}`)
			return this
		}

		this._e[name].forEach((listener) => listener(...args))
		return this
	}

	/**
	 * clear all event listeners
	 */
	protected clear() {
		this._e = {}
	}

	/**
	 * Register event listener for unity client
	 * @param name event name
	 * @param listener event listener
	 */
	addUnityListener(name: string, listener: EventListener, options?: EventListenerOptions) {
		if (!name.startsWith('unity:')) {
			name = `unity:${name}`
		}
		return this.on(name, listener, options)
	}

	/**
	 * Remove event listener from unity client
	 * @param name event name
	 * @param listener event listener
	 */
	removeUnityListener(name: string, listener?: EventListener) {
		if (!name.startsWith('unity:')) {
			name = `unity:${name}`
		}
		return this.off(name, listener)
	}
}
