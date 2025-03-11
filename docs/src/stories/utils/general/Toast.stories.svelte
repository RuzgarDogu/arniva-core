<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Button } from '@ui/general';
	import { toast } from '@utils';

	const { Story } = defineMeta({
		title: 'Utils/General/Toast',
		argTypes: {
			position: {
				control: { type: 'select' },
				options: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
			},
			type: {
				control: { type: 'select' },
				options: ['success', 'info', 'danger', 'warning', 'default']
			},
			timeout: { control: 'number' },
			message: { control: 'text' },
			showCloseButton: { control: 'boolean' },
			closeOnClick: { control: 'boolean' },
			pauseOnHover: { control: 'boolean' },
			title: { control: 'text' },
			transition: {
				control: { type: 'select' },
				options: ['fade', 'slide', 'bounce']
			}
		}
	});
</script>

<Story
	name="Default Toast"
	exportName="Default"
	args={{
		position: 'top-right',
		timeout: 5000,
		message: 'This is a default message'
	}}
>
	{#snippet children(args)}
		<Button onClick={() => toast.show({ ...args })}>Show Toast</Button>
	{/snippet}
</Story>

<Story
	name="Success Toast With Title"
	exportName="SuccessToastWithTitle"
	args={{
		position: 'top-right',
		timeout: 5000,
		message: 'This is a success message',
		title: 'Success'
	}}
>
	{#snippet children(args)}
		<Button onClick={() => toast.success('Testing', { ...args })}>Show Toast</Button>
	{/snippet}
</Story>

<Story
	name="Bouncing Danger Toast"
	exportName="BouncingDangerToast"
	args={{
		position: 'top-left',
		timeout: 5000,
		title: 'Danger',
		transition: 'bounce'
	}}
>
	{#snippet children(args)}
		<Button onClick={() => toast.danger('This is a bouncing danger message', { ...args })}
			>Show Toast</Button
		>
	{/snippet}
</Story>
