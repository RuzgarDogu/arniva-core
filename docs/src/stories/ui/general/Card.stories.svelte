<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Card, CardHeader, CardBody, CardFooter, Button } from '@ui/general';

	/**
	 ## Info
	 - The Card component is a container for content, with a shadow and rounded corners.
	 - It is used to group related elements together.
	 - It is a flexible and extensible content container.
	 - It includes options for headers and footers, a wide variety of content, contextual background colors, and powerful display options.
	 
	 ### Notice
	 > ⚠️ If there is no ```CardHeader```, ```CardFooter``` or ```CardBody```  component, the content will be displayed in the body of the card including paddings.
	 */
	const { Story } = defineMeta({
		title: 'UI/General/Card',
		component: Card,
		tags: ['autodocs']
	});
</script>

<Story name="Default" args={{}}>
	<Card>
		<p>This is a card component</p>
	</Card>
</Story>

<Story name="With Header & Footer" args={{}}>
	<Card>
		<CardHeader title="Card Title" />
		<CardBody>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus, veritatis iusto cumque
				sapiente porro ad animi itaque, impedit voluptates numquam sunt autem fugit corporis laborum
				vero eaque, quo temporibus dolores sequi commodi hic accusamus ducimus perferendis? Unde
				minima repellat voluptates vitae. Tempora quasi minima est, perspiciatis dicta sit nihil
				quaerat.
			</p>
			<p><a style="color:blue; text-decoration: none;" href="/">Have Questions?</a></p>
		</CardBody>
		<CardFooter border>
			<div style="display: flex; justify-content: space-between;">
				<div>
					<Button label="Submit" color="primary" size="small" />
					<Button label="Cancel" color="secondary" size="small" />
				</div>
				<Button label="Learn More" size="small" />
			</div>
		</CardFooter>
	</Card>
</Story>
