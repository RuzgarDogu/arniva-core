<script>
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
    import {
		Button,
		Switch,
		Table,
		Thead,
		Tbody,
		Trow,
		InputGroup,
		Dropdown,
		DropdownContent,
		Accordion,
		AccordionItem,
		Input,
		Tab,
		TabItem,
		Badge,
		Alert,
		ListGroup,
		ListGroupItem,
		FormGroup,
		FormGroupItem,
		Select,
		Card,
		CardHeader,
		CardFooter,
		CardBody,
		Modal,
		DatePicker,
		Checkbox,
		Radio,
		Range
	} from '$lib';

    let arr = $state([1,2])

</script>
<Button modal="modalMd" color="primary" style="margin-bottom: 20px;">
    Medium Modal
</Button>


<Modal id="modalMd" title="Medium Modal" size="md">
	
    <Tab style="margin-bottom: 30px;">
        <TabItem title="Tab Item 1">
            <FormGroup noBorder style="margin-bottom: 30px;">
                <FormGroupItem label="name" required>
                    <Input placeholder="Fill in your name" type="text" />
                </FormGroupItem>
                <FormGroupItem label="email" required>
                    <Input type="email" />
                </FormGroupItem>
                <FormGroupItem label="password" required>
                    <Input type="password" />
                </FormGroupItem>
                <FormGroupItem label="select">
                    <Select>
                        <option value="1">Test 1</option>
                        <option value="2">Test 2</option>
                        <option value="3">Test 3</option>
                    </Select>
                </FormGroupItem>
            </FormGroup>
        </TabItem>
        <TabItem title="Tab Item 2">
            <p>Tab Item 2 Content</p>
        </TabItem>
        <TabItem title="Tab Item 3">
            <Card>
                {#each arr as item}
                    <p>Item {item}</p>
                {/each}
                <Button onClick={() => arr.push(arr.length + 1)}>Add Item</Button>
            </Card>
        </TabItem>
        {#snippet right()}
            <Dropdown>
                <Button color="secondary" square dropdown>
                    <svg
                        width="16px"
                        height="16px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
                            id="SVGRepo_tracurrentColorerCarrier"
                            stroke-linecurrentcap="round"
                            stroke-linejoin="round"
                        ></g><g id="SVGRepo_icurrentColoronCarrier">
                            <path d="M4 18V6" stroke="currentColor" stroke-width="1.5" stroke-linecurrentcap="round"
                            ></path>
                            <path
                                d="M20 6V18"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecurrentcap="round"
                            ></path>
                            <path
                                d="M12 10C16.4183 10 20 8.20914 20 6C20 3.79086 16.4183 2 12 2C7.58172 2 4 3.79086 4 6C4 8.20914 7.58172 10 12 10Z"
                                stroke="currentColor"
                                stroke-width="1.5"
                            ></path>
                            <path
                                d="M20 12C20 14.2091 16.4183 16 12 16C7.58172 16 4 14.2091 4 12"
                                stroke="currentColor"
                                stroke-width="1.5"
                            ></path>
                            <path
                                d="M20 18C20 20.2091 16.4183 22 12 22C7.58172 22 4 20.2091 4 18"
                                stroke="currentColor"
                                stroke-width="1.5"
                            ></path>
                        </g></svg
                    >
                </Button>
                <DropdownContent>
                    <Button list label="Option 1" />
                    <Button list label="Option 2" />
                    <Button list label="Option 3" />
                </DropdownContent>
            </Dropdown>
        {/snippet}
    </Tab>

</Modal>


