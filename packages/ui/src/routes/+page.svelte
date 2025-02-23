<script>
    /** @type {{ data: import('./$types').PageData }} */
    import { Button, Switch, Dropdown, DropdownContent, Accordion, AccordionItem, Input, Tab, TabItem, Badge, Alert, ListGroup, ListGroupItem, FormGroup, FormGroupItem, Select } from '$lib'
    let switchValue = false;

    function handleSwitchChange(value) {
        console.log('Switch value changed to:', value);
        let result = value ? 'ON' : 'OFF';
        // alert(`Switch value changed to: ${result}`);
    }
</script>
    <h1>Introduction</h1>
    <div style="margin-bottom: 20px;">
        <Button label="Button" color="primary" />
    </div>

    <div style="margin-bottom: 20px;">
        <Switch
        reverse
    trueText="Yes"
    falseText="No"
    label="Toggle Setting"
    value={switchValue}
    onChange={handleSwitchChange}
    name="my-switch"
    required
/>
    </div>

    <p>Welcome to <strong>ARNIVA-CORE</strong> – a collection of packages to streamline your Svelte development workflow that is 
        <Badge title="Awesome" color="success" rounded />
    </p>

    <Alert color="success" title="Testing" style="margin-bottom: 20px;">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda ipsa, est doloribus, quaerat temporibus modi eveniet at debitis a reprehenderit esse consequuntur saepe voluptatum pariatur iusto harum rem? Quis, consequuntur.
    </Alert>

    <ListGroup>
        <ListGroupItem>
            <p>List Item 1</p>
        </ListGroupItem>
        <ListGroupItem>
            <p>List Item 2</p>
        </ListGroupItem>
        <ListGroupItem>
            <p>List Item 3</p>
        </ListGroupItem>
    </ListGroup>



    <Accordion>
        <AccordionItem title="Accordion Item 1" list>
            <li>
                <a href="/">
                    <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 3L22 3" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M7.5 7C6.56538 7 6.09808 7 5.75 7.20096C5.52197 7.33261 5.33261 7.52197 5.20096 7.75C5 8.09808 5 8.56538 5 9.5L5 18.5C5 19.4346 5 19.9019 5.20096 20.25C5.33261 20.478 5.52197 20.6674 5.75 20.799C6.09808 21 6.56538 21 7.5 21C8.43462 21 8.90192 21 9.25 20.799C9.47803 20.6674 9.66739 20.478 9.79904 20.25C10 19.9019 10 19.4346 10 18.5L10 9.5C10 8.56538 10 8.09808 9.79904 7.75C9.66739 7.52197 9.47803 7.33261 9.25 7.20096C8.90192 7 8.43462 7 7.5 7Z" stroke="#1C274C" stroke-width="1.5"></path> <path d="M16.5 7C15.5654 7 15.0981 7 14.75 7.20096C14.522 7.33261 14.3326 7.52197 14.201 7.75C14 8.09808 14 8.56538 14 9.5L14 15.5C14 16.4346 14 16.9019 14.201 17.25C14.3326 17.478 14.522 17.6674 14.75 17.799C15.0981 18 15.5654 18 16.5 18C17.4346 18 17.9019 18 18.25 17.799C18.478 17.6674 18.6674 17.478 18.799 17.25C19 16.9019 19 16.4346 19 15.5L19 9.5C19 8.56538 19 8.09808 18.799 7.75C18.6674 7.52197 18.478 7.33261 18.25 7.20096C17.9019 7 17.4346 7 16.5 7Z" stroke="#1C274C" stroke-width="1.5"></path> </g></svg>
                    Menu Item 1
                </a>
            </li>
            <li>
                <a href="/">
                    <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 4C18.175 4.01211 19.3529 4.10856 20.1213 4.87694C21 5.75562 21 7.16983 21 9.99826V15.9983C21 18.8267 21 20.2409 20.1213 21.1196C19.2426 21.9983 17.8284 21.9983 15 21.9983H9C6.17157 21.9983 4.75736 21.9983 3.87868 21.1196C3 20.2409 3 18.8267 3 15.9983V9.99826C3 7.16983 3 5.75562 3.87868 4.87694C4.64706 4.10856 5.82497 4.01211 8 4" stroke="#1C274C" stroke-width="1.5"></path> <path d="M9 13.4L10.7143 15L15 11" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z" stroke="#1C274C" stroke-width="1.5"></path> </g></svg>
                    Menu Item 2
                </a>
            </li>
        </AccordionItem>
        <AccordionItem title="Accordion Item 2" list>
            <li>
                <a href="/">
                    <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 4.00195C18.175 4.01406 19.3529 4.11051 20.1213 4.87889C21 5.75757 21 7.17179 21 10.0002V16.0002C21 18.8286 21 20.2429 20.1213 21.1215C19.2426 22.0002 17.8284 22.0002 15 22.0002H9C6.17157 22.0002 4.75736 22.0002 3.87868 21.1215C3 20.2429 3 18.8286 3 16.0002V10.0002C3 7.17179 3 5.75757 3.87868 4.87889C4.64706 4.11051 5.82497 4.01406 8 4.00195" stroke="#1C274C" stroke-width="1.5"></path> <path d="M10.5 14L17 14" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M7 14H7.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M7 10.5H7.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M7 17.5H7.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M10.5 10.5H17" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M10.5 17.5H17" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z" stroke="#1C274C" stroke-width="1.5"></path> </g></svg>
                    Menu Item 3
                </a>
            </li>
            <li>
                <a href="/">
                    <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 6C2 3.79086 3.79086 2 6 2C8.20914 2 10 3.79086 10 6V18C10 20.2091 8.20914 22 6 22C3.79086 22 2 20.2091 2 18V6Z" stroke="#1C274C" stroke-width="1.5"></path> <path d="M9.99977 8.24268L13.3134 4.92902C14.8755 3.36692 17.4082 3.36692 18.9703 4.92902C20.5324 6.49112 20.5324 9.02378 18.9703 10.5859L9.30615 20.25" stroke="#1C274C" stroke-width="1.5"></path> <path d="M6 22L18 22C20.2091 22 22 20.2091 22 18C22 15.7909 20.2091 14 18 14L15.5 14" stroke="#1C274C" stroke-width="1.5"></path> <path d="M7 18C7 18.5523 6.55228 19 6 19C5.44772 19 5 18.5523 5 18C5 17.4477 5.44772 17 6 17C6.55228 17 7 17.4477 7 18Z" stroke="#1C274C" stroke-width="1.5"></path> </g></svg>
                    Menu Item 4
                </a>
            </li>
        </AccordionItem>
</Accordion>

    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis iusto pariatur eos repudiandae nemo maiores itaque porro, iste illum dicta? Perferendis recusandae asperiores commodi architecto sit consequuntur magnam, dolor illum laborum ullam sapiente quae non velit. Architecto id reiciendis recusandae fuga sequi sit voluptatem aspernatur provident ipsum aliquid, rerum repudiandae ad veniam dolorum facilis nemo iste possimus harum minus soluta? Fugiat at debitis adipisci asperiores laborum ea ipsa. Esse nostrum fugiat doloribus tenetur recusandae dolor atque soluta totam fugit sint est harum, neque molestias temporibus excepturi consequatur repellat dolores magni ipsam. Eius, facilis. Ad nam beatae dolorem molestias. Nam, magnam?</p>


    <Tab style="margin-bottom: 30px;">
        <TabItem title="Tab Item 1">
            <FormGroup style="margin-bottom: 30px;">
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
            <p>Tab Item 3 Content</p>
            <p>Tab Item 3 Content</p>
            <p>Tab Item 3 Content</p>
            <p>Tab Item 3 Content</p>
            <p>Tab Item 3 Content</p>
            <p>Tab Item 3 Content</p>
            <p>Tab Item 3 Content</p>
        </TabItem>
        {#snippet right()}
        <Dropdown>
            <Button color="secondary" square dropdown>
                <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracurrentColorerCarrier" stroke-linecurrentcap="round" stroke-linejoin="round"></g><g id="SVGRepo_icurrentColoronCarrier"> <path d="M4 18V6" stroke="currentColor" stroke-width="1.5" stroke-linecurrentcap="round"></path> <path d="M20 6V18" stroke="currentColor" stroke-width="1.5" stroke-linecurrentcap="round"></path> <path d="M12 10C16.4183 10 20 8.20914 20 6C20 3.79086 16.4183 2 12 2C7.58172 2 4 3.79086 4 6C4 8.20914 7.58172 10 12 10Z" stroke="currentColor" stroke-width="1.5"></path> <path d="M20 12C20 14.2091 16.4183 16 12 16C7.58172 16 4 14.2091 4 12" stroke="currentColor" stroke-width="1.5"></path> <path d="M20 18C20 20.2091 16.4183 22 12 22C7.58172 22 4 20.2091 4 18" stroke="currentColor" stroke-width="1.5"></path> </g></svg>
              </Button>
            <DropdownContent>
                <Button list label="Option 1" />
                <Button list label="Option 2" />
                <Button list label="Option 3" />
            </DropdownContent>
        </Dropdown>
        {/snippet}
    </Tab>

    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis iusto pariatur eos repudiandae nemo maiores itaque porro, iste illum dicta? Perferendis recusandae asperiores commodi architecto sit consequuntur magnam, dolor illum laborum ullam sapiente quae non velit. Architecto id reiciendis recusandae fuga sequi sit voluptatem aspernatur provident ipsum aliquid, rerum repudiandae ad veniam dolorum facilis nemo iste possimus harum minus soluta? Fugiat at debitis adipisci asperiores laborum ea ipsa. Esse nostrum fugiat doloribus tenetur recusandae dolor atque soluta totam fugit sint est harum, neque molestias temporibus excepturi consequatur repellat dolores magni ipsam. Eius, facilis. Ad nam beatae dolorem molestias. Nam, magnam?</p>

    <Dropdown>
        <Button dropdown>Dropdown Deneme</Button>
        <DropdownContent>
            <Button list label="Option 1" />
            <Button list label="Option 2" />
            <Button list label="Option 3" />
        </DropdownContent>
    </Dropdown>