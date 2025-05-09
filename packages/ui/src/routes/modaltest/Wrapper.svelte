<script>
    import { Button, Modal, Tab, TabItem, FormGroup, FormGroupColumn, FormGroupItem, DatePicker, TimePicker } from '$lib';

	let startDateTest = $state('2025-02-01T00:00:00Z');
	let endDateTest = $state('2025-02-09T00:00:00Z');

	let selectedTime = "12:30:45";
  
  function handleTimeChange(time) {
    console.log("Time changed:", time);
  }

</script>
<div>
	<Button modal="testModal" color="primary" style="margin-bottom: 20px;">Open Modal</Button>
    <!-- <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam vero quibusdam delectus blanditiis error esse minima assumenda sit ratione veniam. Quae maiores dicta mollitia sunt et cumque iste, quas repellendus ratione perspiciatis amet.</p> -->
<h1>{startDateTest}</h1>
<h1>{endDateTest}</h1>
<!-- Basic usage -->
<TimePicker />

<!-- With default value -->
<TimePicker value={selectedTime} />

<!-- With onChange handler -->
<TimePicker onChange={handleTimeChange} />

<!-- With two-way binding -->
<TimePicker bind:value={selectedTime} />
<Tab>
	<TabItem title="Geçerlilik Bilgileri">
		<FormGroup noBorder labelPosition="left" columns={2}>
			<FormGroupColumn>
				<FormGroupItem label="Başlangıç Tarihi">
					<DatePicker isRange quickSelect bind:startDate={startDateTest} bind:endDate={endDateTest} />
				</FormGroupItem>
			</FormGroupColumn>
		</FormGroup>
	</TabItem>
</Tab>
</div>
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