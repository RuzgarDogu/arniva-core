<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { Layout, Aside, Main, Navbar, Content } from '@ui/layout';
  
    // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
    const { Story } = defineMeta({
      title: 'UI/Layout/Layout',
      component: Layout,
      argTypes: {
        theme: {
            control: { type: 'select' },
            options: ['light', 'dark'],
        }
      }
    });
  </script>
  
  <Story name="Example" args={{ theme: 'light' }}>
    <Layout theme="light" style="max-height: 300px;">
        <Aside style="padding: 1rem;">
            Sidebar comes here
        </Aside>
        <Main>
          <Navbar style="padding: 0.5rem 1rem;">
            Navigation comes here
          </Navbar>
          <Content>
            Content Comes here
          </Content>
        </Main>
      </Layout>
  </Story>
  
