<script module>
      import { defineMeta } from '@storybook/addon-svelte-csf';
      import { Card } from '@ui/general';

      const { Story } = defineMeta({
        title: 'UI/General/Card',
        component: Card,
        tags: ['autodocs'],
      });

</script>

<Story name="Default" args={{}}>
    <Card>
        <p>This is a card component</p>
      </Card>
</Story>