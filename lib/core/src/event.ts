import { UnityInstance } from './types/unity-instance'
import { isBrowser } from './utils'
import type UnityWebgl from './index'

interface EventListener {
	(...args: any[]): void
	_?: EventListener
}
type EventListenerOptions = {
	once?: boolean
}
type EventsMap = Record<string, EventListener[]>
interface UnityEventMap {
	beforeMount: (instance: UnityWebgl) => void
	mounted: (instance: UnityWebgl, unityInstance: UnityInstance) => void
	beforeUnmount: (instance: UnityWebgl) => void
	unmounted: () => void
	progress: (progress: number) => void
	debug: (msg: string) => void
	error: (error: string | Error) => void
}

export class UnityWebglEvent {
	private _e: EventsMap // events map

	constructor() {
		this._e = {}
		if (isBrowser) {
			// Register Unity event trigger to the window object
			window.dispatchUnityEvent = (name: string, ...args: any[]) => {
				if (!name.startsWith('unity:')) {
					name = `unity:${name}`
				}
				this.emit.call(this, name, ...args)
			}
		}
	}

	/**
	 * Register event listener
	 * @param name event name
	 * @param listener event listener
	 * @param options event listener options
	 */
	on<K extends keyof UnityEventMap>(
		name: K,
		listener: UnityEventMap[K],
		options?: EventListenerOptions
	): this
	on(name: string, listener: EventListener, options?: EventListenerOptions): this
	on<K extends keyof UnityEventMap>(
		name: string | K,
		listener: EventListener | UnityEventMap[K],
		options?: EventListenerOptions
	) {
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
	off<K extends keyof UnityEventMap>(name: K, listener: UnityEventMap[K]): this
	off(name: string, listener: EventListener): this
	off<K extends keyof UnityEventMap>(
		name: string | K,
		listener?: EventListener | UnityEventMap[K]
	) {
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
			// log.warn(`No listener for event ${name}`)
			return this
		}

		this._e[name].forEach((listener) => listener.apply(this, args))
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
		return this.off(name, listener as EventListener)
	}
}
