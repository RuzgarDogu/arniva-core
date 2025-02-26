<script>
	import { modalInit } from './modal.svelte.js';
	import Button from './Button.svelte';
	import { onMount } from 'svelte';

	/**
	 * @typedef {Object<string, any>} Props
	 * @property {any} [children] Modal content
	 * @property {string} [id] Modal id
	 * @property {string} [name] Modal name
	 * @property {string} [title] Modal title
	 * @property {any} [footer] Modal footer
	 * @property {boolean} [noPadding] Modal no padding
	 * @property {boolean} [devMode] Modal dev mode
	 * @property {() => void} [onclose] Modal close event
	 */

	/** @type {Props} */
	let {
		children,
		id = 'test',
		name = 'Arniva Cloud',
		title = '',
		footer,
		noPadding = false,
		onclose = null,
		devMode = false
	} = $props();

	/**
	 * @typedef {Object} SvelteInstance
	 * @property {function(string): void} handleStateChange
	 *
	 * @typedef {HTMLElement & {__svelteInstance?: SvelteInstance}} ModalElement
	 */

	/** @type {ModalElement} */
	let modal;
	onMount(() => {
		// Store component instance on the DOM element
		modal.__svelteInstance = {
			handleStateChange: (state) => {
				if (state === 'closing' && onclose) {
					onclose();
				}
			}
		};
	});

	export function hide() {
		modal.classList.add('closing');
	}

	export function show() {
		console.log('opening', modal);
		modal.classList.add('opening');
	}
</script>

<div
	class="modal"
	class:dev-mode={devMode}
	{id}
	data-ar-name={name}
	data-ar-title={title}
	class:modal--no-padding={noPadding}
	bind:this={modal}
	use:modalInit
>
	<div class="modal--content">
		<div class="modal--header">
			{#if title}
				<div class="modal--title">{title}</div>
			{/if}
			<div class="modal--actions">
				<Button modalEnlarge color="transparent">
					<svg
						width="18px"
						height="18px"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
							id="SVGRepo_tracerCarrier"
							stroke-linecap="round"
							stroke-linejoin="round"
						></g><g id="SVGRepo_iconCarrier">
							<path
								d="M13 11L22 2M22 2H16.6562M22 2V7.34375"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							></path>
							<path
								d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
							></path>
						</g></svg
					>
				</Button>
				<Button modalDismiss color="transparent">
					<svg
						width="18px"
						height="18px"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
							id="SVGRepo_tracerCarrier"
							stroke-linecap="round"
							stroke-linejoin="round"
						></g><g id="SVGRepo_iconCarrier">
							<path
								d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
								stroke="currentColor"
								stroke-width="1.5"
							></path>
							<path
								d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
							></path>
						</g></svg
					>
				</Button>
			</div>
		</div>
		{#if children}
			<div class="modal--body">
				{@render children()}
			</div>
		{/if}
		{#if footer}
			<div class="modal--footer">
				{@render footer()}
			</div>
		{/if}
		<div class="modal--breadcrumb"></div>
	</div>
</div>

<style>
</style>
