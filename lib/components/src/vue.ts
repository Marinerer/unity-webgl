import {
	defineComponent,
	PropType,
	ref,
	h,
	isVue2,
	computed,
	onMounted,
	onBeforeUnmount,
} from 'vue-demi'
import type UnityWebgl from 'unity-webgl'

let unityInstanceIdentifier: number = 0

function cssUnit(val: string | number): string | number {
	return isNaN(val as unknown as number) ? val : val + 'px'
}

export default defineComponent({
	name: 'UnityWebglComponent',
	props: {
		unity: {
			type: Object as PropType<UnityWebgl>,
		},
		width: {
			type: [String, Number] as PropType<string | number>,
			default: '100%',
		},
		height: {
			type: [String, Number] as PropType<string | number>,
			default: '100%',
		},
		tabindex: {
			type: [Number, String] as PropType<number | string>,
		},
	},
	setup(props) {
		const canvas = ref(null)
		unityInstanceIdentifier++

		const canvasStyle = computed(() => {
			return {
				width: cssUnit(props.width),
				height: cssUnit(props.height),
			}
		})
		const attrs: Record<string, string | number> = {
			id: `unity-canvas-${unityInstanceIdentifier}`,
		}
		if (props.tabindex || props.tabindex === 0) {
			attrs.tabindex = props.tabindex
		}

		onMounted(() => {
			if (canvas.value) {
				props.unity?.render(canvas.value)
			}
		})
		onBeforeUnmount(() => {
			props.unity?.unsafe_unload()
		})

		return () =>
			h(
				'canvas',
				isVue2
					? {
							ref: canvas,
							attrs,
							style: canvasStyle.value,
						}
					: {
							ref: canvas,
							style: canvasStyle.value,
							...attrs,
						}
			)
	},
})
