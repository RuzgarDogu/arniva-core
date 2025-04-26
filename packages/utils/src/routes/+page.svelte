<script>
	import { hello, toast, spinner, confirm, convertTime } from '$lib';

	// hello('emre');


// Using await
function testConfirm() {
  confirm({
    title: "Delete item",
    text: "Are you sure you want to delete this item?",
    info: "This action cannot be undone",
	transition: 'slide'
  }).then((isConfirmed) => {
	console.log("isConfirmed", isConfirmed);
  });
  
}

	function testSpinner() {
		spinner.show('divSpinner', {
			container: '#container',
			color: '#fff',
			adaptSize: true,
			sizeFactor: 0.7, // Use 70% of available space
			minSize: 12, // Minimum 12px
			sizeMargin: 8, // Keep 8px margin within container
			position: 'absolute'
			// type: 'crescent'
		});
		spinner.show('buttonSpinner', {
			container: '#spinnerTest',
			color: '#fff',
			adaptSize: true,
			sizeFactor: 0.7, // Use 70% of available space
			minSize: 12, // Minimum 12px
			sizeMargin: 8, // Keep 8px margin within container
			position: 'relative',
			type: 'crescent'
		});
		spinner.show('bodySpinner', {
			container: 'red',
			color: 'transparent',
			backgroundColor: 'var(--ar-accent-color)',
			adaptSize: true,
			sizeFactor: 0.7, // Use 70% of available space
			minSize: 12, // Minimum 12px
			sizeMargin: 8, // Keep 8px margin within container
			position: 'fixed'
			// type: 'crescent'
		});
		setTimeout(() => {
			spinner.hide('bodySpinner');
			spinner.hide('buttonSpinner');
			spinner.hide('divSpinner');
		}, 3000);
	}

	let updated_at = "2025-04-27T09:34:12.317879Z";

	const options = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		timeZoneName: 'short'
	};


</script>

<h1>{convertTime(updated_at)}</h1>
<h2>{convertTime(updated_at, { format: 'US', separator: '/' })}</h2>
<h2>{convertTime(updated_at, { format: 'US', separator: '.', date: true, time: true })}</h2>
<h2>{convertTime(updated_at, { format: 'US', separator: '-', date: true, time: false })}</h2>
<h2>{convertTime(updated_at, { format: 'EU', separator: '.', date: true, time: false })}</h2>
<h2>{convertTime(updated_at, { format: 'ISO', separator: '-', date: true, time: false })}</h2>
<div id="container">
	<h1>Welcome to your library project</h1>
	<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
	<p>
		Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
	</p>
</div>

<div style="margin-bottom: 30px;">
	<button onclick={() => toast.danger('deneme', { duration: 3000, position: 'top-right' })}
		>Toast Test</button
	>
</div>
<div style="margin-bottom: 30px;">
	<button id="spinnerTest" onclick={testSpinner}>Spinner</button>
</div>
<div style="margin-bottom: 30px;">
	<button id="spinnerTest" onclick={testConfirm}>Confirm</button>
</div>

<style>
	#container {
		width: 100%;
		position: relative;
	}
	button {
		padding: 10px 15px;
		background-color: blueviolet;
		border: none;
		border-radius: 5px;
		display: flex;
		gap: 10px;
		align-items: center;
		box-sizing: border-box;
		color: white;
	}
</style>
