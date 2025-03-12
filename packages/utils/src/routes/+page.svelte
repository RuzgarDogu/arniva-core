<script>
	import { hello, toast, spinner } from '$lib';
	// hello('emre');


	function testSpinner() {
		spinner.show('buttonSpinner', { 
			container: '#spinnerTest', 
			color: '#fff',
			adaptSize: true,
			sizeFactor: 0.7,  // Use 70% of available space
			minSize: 12,      // Minimum 12px
			sizeMargin: 8,     // Keep 8px margin within container
			// type: 'crescent'
			});
		spinner.show('bodySpinner', { 
			container: 'body', 
			color: 'blue',
			adaptSize: true,
			sizeFactor: 0.7,  // Use 70% of available space
			minSize: 12,      // Minimum 12px
			sizeMargin: 8,     // Keep 8px margin within container
			position: 'fixed',
			// type: 'crescent'
			});
		setTimeout(() => {
			spinner.hide('bodySpinner');
			spinner.hide('buttonSpinner');
		}, 3000);
	}

</script>

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<div style="margin-bottom: 30px;">
<button onclick={() => toast.danger('deneme', { duration: 3000, position: 'top-right' })}
	>Toast Test</button
>

</div>
<div style="margin-bottom: 30px;">
	<button id="spinnerTest" onclick={testSpinner}>Spinner</button>
</div>


<style>
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