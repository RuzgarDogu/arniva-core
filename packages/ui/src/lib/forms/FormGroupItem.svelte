<script>
	/**
	 * @typedef {Object<string, any>} Props
	 * @property {any} children Slot for component
	 * @property {string} [label] Label for the group item
	 * @property {boolean} [required] Is the group item required?
	 */

	/** @type {Props} */
	let { children, label = '', required = false } = $props();
	
	// Get the label position from context
	import { getContext } from 'svelte';
	const labelPosition = getContext('formGroupLabelPosition') || 'top';
</script>

{#if labelPosition === 'left'}
	<!-- For left labels, we use table rows -->
	<tr class="form-group-item">
		<td class="form-group-item--label">
			{label}
			{#if required}
				<span class="required">*</span>
			{/if}
		</td>
		<td class="form-group-item--input">
			{@render children?.()}
		</td>
	</tr>
{:else}
	<!-- For top labels, we use divs -->
	<div class="form-group-item">
		<div class="form-group-item--label">
			{label}
			{#if required}
				<span class="required">*</span>
			{/if}
		</div>
		<div class="form-group-item--input">
			{@render children?.()}
		</div>
	</div>
{/if}
