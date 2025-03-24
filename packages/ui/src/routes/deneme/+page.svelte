<script>
	/** @type {{ data: import('./$types').PageData }} */
	import { Button, Header, Card, SpinnerComponent } from '$lib/general';
</script>

<h1>DENEME: Welcome to your library project</h1>
<div>
	<Button label="asd" />
	<Header logo="/cloud_4305048.png" />
	<div style="margin-bottom: 10px;"></div>
	<Card>asd</Card>
</div>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<div style="position: relative; margin-top: 30px; padding: 10px; border: 1px solid #ccc; display: flex; gap: 10px;">
	Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio exercitationem excepturi iste, nisi saepe facere ratione. Iusto quisquam neque dolorum sit eligendi odit tempore non veniam amet tempora voluptatibus id voluptates fugiat ipsa, molestiae iste earum sunt rerum nihil rem!
	<SpinnerComponent id="divSpinner" />
	<SpinnerComponent id="divSpinner2" position='absolute' color="red" backgroundColor="yellow" />
</div>