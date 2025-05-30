<script>
    /** @type {{ data: import('./$types').PageData }} */

    import Wrapper from './Wrapper.svelte';
    import { Button, Modal, Dropdown, DropdownContent } from '$lib';
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


<Wrapper />

	</Modal>
</div>