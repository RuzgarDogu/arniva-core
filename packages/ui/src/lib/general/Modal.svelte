<script>
	import { modalInit } from './modal.svelte.js';
	import Button from './Button.svelte';
	import { Icon } from '../icons';
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
	 * @property {string} [footerClass] Modal footer class
	 * @property {string} [headerClass] Modal header class
	 * @property {string} [bodyClass] Modal body class
	 * @property {() => void} [onclose] Modal close event
	 */

	/** @type {Props} */
	let {
		children,
		id = 'test',
		name = 'Arniva Cloud',
		title = '',
		footer,
		footerClass='',
		headerClass='',
		bodyClass='',
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
		<div class={['modal--header', headerClass].join(' ')}>
			{#if title}
				<div class="modal--title">{title}</div>
			{/if}
			<div class="modal--actions">
				<Button modalEnlarge color="transparent">
					<Icon icon="ic:baseline-crop-free" width="24" height="24" />
					<!-- <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracurrentColorerCarrier" stroke-linecurrentcap="round" stroke-linejoin="round"></g><g id="SVGRepo_icurrentColoronCarrier"> <path d="M4 9V5.6C4 5.03995 4 4.75992 4.10899 4.54601C4.20487 4.35785 4.35785 4.20487 4.54601 4.109C4.75992 4 5.03995 4 5.6 4L9 4M4 15V18.4C4 18.9601 4 19.2401 4.10899 19.454C4.20487 19.6422 4.35785 19.7951 4.54601 19.891C4.75992 20 5.03995 20 5.6 20L9 20M15 4H18.4C18.9601 4 19.2401 4 19.454 4.10899C19.6422 4.20487 19.7951 4.35785 19.891 4.54601C20 4.75992 20 5.03995 20 5.6V9M20 15V18.4C20 18.9601 20 19.2401 19.891 19.454C19.7951 19.6422 19.6422 19.7951 19.454 19.891C19.2401 20 18.9601 20 18.4 20H15" stroke="currentColor" stroke-width="2" stroke-linecurrentcap="round" stroke-linejoin="round"></path> </g></svg> -->
				</Button>
				<Button modalDismiss color="transparent">
					<Icon icon="ic:baseline-close" width="24" height="24" />
					<!-- <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg> -->
				</Button>
			</div>
		</div>
		{#if children}
			<div class={['modal--body', bodyClass].join(' ')}>
				{@render children()}
			</div>
		{/if}
		{#if footer}
			<div class={['modal--footer', footerClass].join(' ')}>
				{@render footer()}
			</div>
		{/if}
		<div class="modal--breadcrumb"></div>
	</div>
</div>

<style>
</style>
