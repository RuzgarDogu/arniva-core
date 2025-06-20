<script>
    /** @type {{ data: import('./$types').PageData }} */

    import Wrapper from './Wrapper.svelte';
    import { Button, Modal, Dropdown, DropdownContent, Tab, TabItem } from '$lib';
    let { data } = $props();
</script>

<!-- <Wrapper /> -->

<div style="height: 500px;">
	<Button modal="testModal2" color="primary" style="margin-bottom: 20px;">Open Modal</Button>
	<Modal 
  onopen={() => console.log('Modal opened')}
  onclose={() => console.log('Modal closed')}
  title="Working Example"
  id="testModal2"
  size="lg"
>



<div>

<Tab>
	<TabItem title="Geçerlilik Bilgileri">
		<Button modal="testModal" color="primary" style="margin-bottom: 20px;">Open Modal</Button>


<Modal
devMode={false}
title="Working Example"
id="testModal"
size="lg"
>
	<h3>Test Title</h3>
	<p>
		Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, beatae ipsa alias
		repellendus impedit distinctio laboriosam, voluptatem reiciendis repellat perferendis sed
		quo unde ratione quam consequuntur corporis molestiae. Magni veritatis, iusto harum
		nostrum quasi aut minima quidem dolor placeat nulla saepe consequuntur quibusdam qui
		blanditiis labore deleniti! Blanditiis, obcaecati. Nulla!
	</p>
	
	<Tab>
	<TabItem title="Test Tab">
		Test Tab
	</TabItem>
	<TabItem title="Test Tab 2">
		Test Tab 2
	</TabItem>
</Tab>

</Modal>



	</TabItem>
	<TabItem title="New Modal Test">
        New Modal Test
	</TabItem>
</Tab>
</div>





	</Modal>
</div>