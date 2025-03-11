<script>
	import Icon from '@iconify/svelte';

	/**
	 * @typedef {Object<string, any>} Props
	 * @property {string} icon The icon name or icon data.
	 * @property {boolean} [inline] Changes vertical alignment.
	 * @property {string|number} [width] Icon width.
	 * @property {string|number} [height] Icon height.
	 * @property {boolean} [hFlip] Flips icon horizontally.
	 * @property {boolean} [vFlip] Flips icon vertically.
	 * @property {string} [flip] Alternative to hFlip and vFlip.
	 * @property {number|string} [rotate] Rotates icon.
	 * @property {string} [color] Changes icon color.
	 * @property {Function} [onLoad] Callback that is called when icon data has been loaded.
	 */

	/** @type {Props} */
	let { icon, inline, width, height, hFlip, vFlip, flip, rotate, color } = $props();
</script>

<Icon {icon} {inline} {width} {height} {hFlip} {vFlip} {flip} {rotate} {color} />
