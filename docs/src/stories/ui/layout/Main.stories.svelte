<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { Main, Navbar, Content } from '@ui/layout';

    // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
    const { Story } = defineMeta({
      title: 'UI/Layout/Main',
      component: Main,
      tags: ['autodocs'],
    });
  </script>
  
  <Story name="Light Main">
    <Main>
        <Navbar style="padding: 1rem;">
          Top Navigation comes here
        </Navbar>
        <Content style="min-height: 200px;">
          Content comes here
        </Content>
      </Main>
  </Story>
  
