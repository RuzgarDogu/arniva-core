<script>
	/**
	 * @typedef {Object<string, any>} Props
	 * @property {any} children Slot for component
	 */

	/** @type {Props} */
	let { children } = $props();
	
	import { getContext } from 'svelte';
	const labelPosition = getContext('formGroupLabelPosition') || 'top';
</script>

{#if labelPosition === 'left'}
	<div class="form-group-column">
		<table class="form-group-table">
			<tbody>
				{@render children?.()}
			</tbody>
		</table>
	</div>
{:else}
	<div class="form-group-column">
		{@render children?.()}
	</div>
{/if}
