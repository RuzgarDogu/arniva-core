<script>
	import { Icon } from '$lib';
	
	console.log('IconList');
</script>

<div class="icon-demo">
	<h1>Icon Component Demo</h1>
	
	<div class="large-icon">
		<Icon icon="mdi:content-save" width={240} height={240} />
		<p>content-save (large)</p>
	</div>
	
	<h2>More Examples</h2>
	<div class="icon-grid">
		<div class="icon-container">
			<Icon icon="mdi:account" width={48} height={48} />
			<p>account</p>
		</div>
		<div class="icon-container">
			<Icon icon="mdi:access-point" width={48} height={48} />
			<p>access-point</p>
		</div>
		<div class="icon-container">
			<Icon icon="mdi:abacus" width={48} height={48} />
			<p>abacus</p>
		</div>
		<div class="icon-container">
			<Icon icon="mdi:account-alert" width={48} height={48} />
			<p>account-alert</p>
		</div>
	</div>
</div>

<style>
	.icon-demo {
		padding: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.large-icon {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 2rem 0;
	}
	
	.icon-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 2rem;
		margin: 2rem 0;
	}
	
	.icon-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
		border-radius: 8px;
		background-color: #f5f5f5;
		transition: transform 0.2s, box-shadow 0.2s;
	}
	
	.icon-container:hover {
		transform: translateY(-5px);
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
	}
	
	.icon-container p {
		margin-top: 0.5rem;
		font-size: 0.875rem;
		color: #555;
	}
	
	h1, h2 {
		margin-bottom: 1rem;
	}
</style>