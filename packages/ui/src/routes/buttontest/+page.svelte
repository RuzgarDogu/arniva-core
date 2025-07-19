<script>
    import { Button } from '$lib';
    const colors = [
        'primary', 'secondary', 'transparent', 'accent', 'danger', 'success', 'default', 'warning', 'light'
    ];
    const sizes = ['small', 'medium', 'large'];
</script>

<h1>Button Variants Test Page</h1>

<h2>Colors</h2>
<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
    {#each colors as color}
        <Button color={color} label={color} />
    {/each}
</div>

<h2>Sizes</h2>
<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
    {#each sizes as size}
        <Button size={size} label={size} />
    {/each}
</div>

<h2>Disabled</h2>
<Button label="Disabled" disabled={true} />

<h2>Rounded</h2>
<Button label="Rounded" rounded={true} />

<h2>Thin</h2>
<Button label="Thin" thin={true} />

<h2>Square</h2>
<Button label="Square" square={true} />

<h2>Link Button</h2>
<Button label="Link" link={true} url="https://example.com" />

<h2>Dropdown</h2>
<Button label="Dropdown" dropdown={true} />

<h2>List</h2>
<Button label="List" list={true} />

<h2>No Padding</h2>
<Button label="No Padding" noPadding={true} />

<h2>Auto Width</h2>
<Button label="Auto Width" autoWidth={true} />

<h2>Modal</h2>
<Button label="Open Modal" modal="testModal" />

<h2>Combinations</h2>
<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
    <Button color="primary" size="large" rounded={true} label="Primary Large Rounded" />
    <Button color="danger" thin={true} label="Danger Thin" />
    <Button color="success" square={true} label="Success Square" />
    <Button color="accent" disabled={true} label="Accent Disabled" />
    <Button color="warning" link={true} url="#" label="Warning Link" />
</div>