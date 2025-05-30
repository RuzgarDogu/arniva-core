<script>
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
    import DatePicker from '$lib/forms/DatePicker.svelte';
    import TimePicker from '$lib/forms/TimePicker.svelte';

    let dt = $state("2025-03-26T00:00:00Z")
    let selectedTime = $state("12:30:45");

</script>
<h1>{dt}</h1>
<DatePicker
    bind:startDate={dt}
    />

<TimePicker bind:value={selectedTime} />
<h2>{selectedTime}</h2>