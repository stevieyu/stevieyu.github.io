import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Stevie',
      // logo: {
        // light: './src/assets/light-logo.svg',
        // dark: './src/assets/dark-logo.svg',
        // src: 'https://avatars.githubusercontent.com/u/8325201?v=4',
        // replacesTitle: true,
      // },
      head: [
        {
          tag: 'script',
          attrs: {
            src: '/turbo.js',
            type: 'module',
            defer: true
          }
        },
      ],
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN',
        },
      },    
      social: {
        github: 'https://github.com/stevieyu',
      },
      sidebar: [
        {
          label: 'Guides',
          items: [
            // Each item here is one entry in the navigation menu.
            { label: 'Example Guide', link: '/guides/example/' },
          ],
        },
        {
          label: 'Reference',
          autogenerate: { directory: 'reference' },
        },
      ],
      lastUpdated: true,
      editLink: {
        baseUrl: 'https://github.com/stevieyu/stevieyu.github.io/edit/master',
      }
    }),
  ],

  // Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
