<script>
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
    import { FormGroup, FormGroupItem, FormGroupColumn, Input, Select } from '$lib';
</script>

<h3>Labels on Top - Single Column</h3>
<FormGroup noBorder style="margin-bottom: 30px;" labelPosition="top">
    <FormGroupItem label="Name" required>
        <Input placeholder="Fill in your name" type="text" />
    </FormGroupItem>
    <FormGroupItem label="Email address" required>
        <Input type="email" />
    </FormGroupItem>
    <FormGroupItem label="Password" required>
        <Input type="password" />
    </FormGroupItem>
    <FormGroupItem label="Country">
        <Select>
            <option value="1">USA</option>
            <option value="2">Canada</option>
            <option value="3">Mexico</option>
        </Select>
    </FormGroupItem>
</FormGroup>

<h3>Labels on Left - Single Column (Perfect Input Alignment)</h3>
<FormGroup noBorder style="margin-bottom: 30px;" labelPosition="left">
    <FormGroupItem label="Name" required>
        <Input placeholder="Fill in your name" type="text" />
    </FormGroupItem>
    <FormGroupItem label="Email address" required>
        <Input type="email" />
    </FormGroupItem>
    <FormGroupItem label="Password" required>
        <Input type="password" />
    </FormGroupItem>
    <FormGroupItem label="Country of residence">
        <Select>
            <option value="1">USA</option>
            <option value="2">Canada</option>
            <option value="3">Mexico</option>
        </Select>
    </FormGroupItem>
</FormGroup>

<h3>Labels on Left - Two Columns (Perfect Input Alignment in Each Column)</h3>
<FormGroup columns={2} noBorder style="margin-bottom: 30px;" labelPosition="left">
    <FormGroupColumn>
        <FormGroupItem label="Name" required>
            <Input placeholder="Fill in your name" type="text" />
        </FormGroupItem>
        <FormGroupItem label="Password" required>
            <Input type="password" />
        </FormGroupItem>
    </FormGroupColumn>
    <FormGroupColumn>
        <FormGroupItem label="Email address" required>
            <Input type="email" />
        </FormGroupItem>
        <FormGroupItem label="Country of residence">
            <Select>
                <option value="1">USA</option>
                <option value="2">Canada</option>
                <option value="3">Mexico</option>
            </Select>
        </FormGroupItem>
    </FormGroupColumn>
</FormGroup>

<h3>Labels on Top - Three Columns</h3>
<FormGroup columns={3} noBorder style="margin-bottom: 30px;" labelPosition="top">
    <FormGroupColumn>
        <FormGroupItem label="Name" required>
            <Input placeholder="Fill in your name" type="text" />
        </FormGroupItem>
        <FormGroupItem label="Password" required>
            <Input type="password" />
        </FormGroupItem>
    </FormGroupColumn>
    <FormGroupColumn>
        <FormGroupItem label="Email address" required>
            <Input type="email" />
        </FormGroupItem>
        <FormGroupItem label="Country of residence">
            <Select>
                <option value="1">USA</option>
                <option value="2">Canada</option>
                <option value="3">Mexico</option>
            </Select>
        </FormGroupItem>
    </FormGroupColumn>
    <FormGroupColumn>
        <FormGroupItem label="Website" required>
            <Input type="text" />
        </FormGroupItem>
        <FormGroupItem label="City of residence">
            <Select>
                <option value="1">Kocaeli</option>
                <option value="2">Istanbul</option>
                <option value="3">Ankara</option>
                <option value="3">Muğla</option>
            </Select>
        </FormGroupItem>
    </FormGroupColumn>
</FormGroup>