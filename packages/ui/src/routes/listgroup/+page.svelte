<script>
    /** @type {{ data: import('./$types').PageData }} */

    import { ListGroup, ListGroupItem } from '$lib';

    let { data } = $props();
</script>

<ListGroup columns={2}>
	<ListGroupItem>
		<p>List Item 1</p>
	</ListGroupItem>
	<ListGroupItem>
		<p>List Item 2</p>
	</ListGroupItem>
	<ListGroupItem>
		<p>List Item 3</p>
	</ListGroupItem>
	<ListGroupItem>
		<p>List Item 4</p>
	</ListGroupItem>
	<ListGroupItem>
		<p>List Item 5</p>
	</ListGroupItem>
</ListGroup>