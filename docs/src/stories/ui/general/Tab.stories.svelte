<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { Tab, TabItem, Dropdown, Button, DropdownContent } from '@ui/general';
  
    // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
    const { Story } = defineMeta({
      title: 'UI/General/Tab',
      component: Tab,
      tags: ['autodocs'],
    });
  </script>
  
  <Story name="Default List Group" args={{ }}>
    {#snippet children(args)}
    <Tab {...args}>
        <TabItem title="Tab Item 1">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi facilis officia maiores adipisci eveniet dolores in dignissimos quae rerum asperiores?</p>
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
    {/snippet}
  </Story>