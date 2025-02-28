<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Modal, Button } from '@ui/general';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'UI/General/Modal',
		component: Modal,
		tags: ['autodocs']
	});
</script>

<Story
	name="Default Modal"
	args={{
		devMode: true,
		title: 'Modal Title'
	}}
>
	{#snippet children(args)}
		<Modal {...args}>
			<h3>Test Title</h3>
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, beatae ipsa alias
				repellendus impedit distinctio laboriosam, voluptatem reiciendis repellat perferendis sed
				quo unde ratione quam consequuntur corporis molestiae. Magni veritatis, iusto harum nostrum
				quasi aut minima quidem dolor placeat nulla saepe consequuntur quibusdam qui blanditiis
				labore deleniti! Blanditiis, obcaecati. Nulla!
			</p>
			<Button color="danger" style="margin-bottom: 20px;">Go Somewhere</Button>
		</Modal>
	{/snippet}
</Story>

<Story
	name="Working Example"
	args={{
		devMode: false,
		title: 'Working Example',
		id: 'testModal',
		size: 'lg',
		onclose: () => alert('Modal closed')
	}}
>
	{#snippet children(args)}
		<div style="height: 500px;">
			<Button modal="testModal" color="primary" style="margin-bottom: 20px;">Open Modal</Button>
			<Modal {...args}>
				<h3>Test Title</h3>
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, beatae ipsa alias
					repellendus impedit distinctio laboriosam, voluptatem reiciendis repellat perferendis sed
					quo unde ratione quam consequuntur corporis molestiae. Magni veritatis, iusto harum
					nostrum quasi aut minima quidem dolor placeat nulla saepe consequuntur quibusdam qui
					blanditiis labore deleniti! Blanditiis, obcaecati. Nulla!
				</p>
				<Button color="danger" style="margin-bottom: 20px;">Go Somewhere</Button>
			</Modal>
		</div>
	{/snippet}
</Story>
