<script>
	import { on } from "svelte/events";

	let {
		class: cls = '',
		element = $bindable(),
        onsubmit = () => {},
        children,
		...rest
	} = $props();

    function onSubmit(event) {
        if (!onsubmit) return;
        event.preventDefault();
        event.stopPropagation();
        onsubmit(event);
    }

</script>

<form
    class={['form', cls].join(' ')}
    {...rest}
    onsubmit={onSubmit}
>
    {@render children?.()}
</form>