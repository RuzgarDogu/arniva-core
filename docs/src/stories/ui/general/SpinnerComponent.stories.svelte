<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { SpinnerComponent, Button } from '@ui/general';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'UI/General/Spinner (Component)',
		component: SpinnerComponent,
		tags: ['autodocs'],
        argTypes: {
            position: {
                control: {
                    type: 'select',
                    options: ['fixed', 'absolute', 'relative']
                }
            },
            color: {
                control: {
                    type: 'color'
                }
            },
            width: {
                control: {
                    type: 'text'
                }
            },
            height: {
                control: {
                    type: 'text'
                }
            },
            borderWidth: {
                control: {
                    type: 'text'
                }
            },
            backgroundColor: {
                control: {
                    type: 'color'
                }
            }
        }
	});

    let visible = $state(false);

    function showSpinner() {
        visible = true;
        setTimeout(() => {
            visible = false;
        }, 3000);
    }

</script>

<Story
	name="Default SpinnerComponent"
	args={{}}
/>

<Story
	name="Absolute SpinnerComponent"
	args={{
        position: 'absolute',
        color: 'red',
        width: '50px',
        height: '50px',
        borderWidth: '2px',
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
    }}
>
{#snippet children(args)}
<div style="position: relative; margin-top: 30px; padding: 10px; border: 1px solid #ccc; display: flex; gap: 10px;">
	Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio exercitationem excepturi iste, nisi saepe facere ratione. Iusto quisquam neque dolorum sit eligendi odit tempore non veniam amet tempora voluptatibus id voluptates fugiat ipsa, molestiae iste earum sunt rerum nihil rem!
	<SpinnerComponent {...args}/>
</div>
{/snippet}
</Story>

<Story
	name="Fixed SpinnerComponent"
	args={{
        position: 'fixed',
        color: 'violet',
        width: '50px',
        height: '50px',
        borderWidth: '2px',
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
    }}
>
{#snippet children(args)}
<div>
    <Button onClick={showSpinner} label="Click to load spinner" />
    {#if visible}
	    <SpinnerComponent {...args}/>
    {/if}
</div>
{/snippet}
</Story>