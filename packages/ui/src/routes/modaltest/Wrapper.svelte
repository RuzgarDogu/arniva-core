<script>
    import { Button, Modal } from '$lib';
</script>
<div style="height: 500px;">

    <h1>Modal Test</h1>
	<Button modal="testModal" color="primary" style="margin-bottom: 20px;">Open Modal</Button>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam vero quibusdam delectus blanditiis error esse minima assumenda sit ratione veniam. Quae maiores dicta mollitia sunt et cumque iste, quas repellendus ratione perspiciatis amet.</p>
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
		<Button color="danger" style="margin-bottom: 20px;">Go Somewhere</Button>
	</Modal>
</div>