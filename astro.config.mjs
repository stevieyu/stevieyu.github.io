import {defineConfig} from 'astro/config';
import starlight from '@astrojs/starlight';
import partytown from '@astrojs/partytown';
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

const IS_PROD = process.env.NODE_ENV === 'production';


// https://astro.build/config
export default defineConfig({
  site: 'https://stevie.top',
  prefetch: true,
  integrations: [
    // https://starlight.astro.build/
    starlight({
      title: 'Stevie Home',
      description: '个人主页',
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
            src: '/services.js',
            type: IS_PROD ? 'module' : 'text',
            defer: true
          }
        }
      ],
      customCss: [
        // Relative path to your custom CSS file
        './src/tailwind.css',
      ],
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN'
        }
      },
      social: {
        github: 'https://github.com/stevieyu'
      },
      sidebar: [{
        label: '便笺',
        autogenerate: {
          directory: 'notes'
        }
      }, {
        label: '例子',
        autogenerate: {
          directory: 'examples'
        }
      }],
      lastUpdated: true,
      editLink: {
        baseUrl: 'https://github.com/stevieyu/stevieyu.github.io/edit/master'
      }
    }),
    // https://docs.astro.build/en/guides/integrations-guide/partytown/
    // partytown(),
    tailwind({
      applyBaseStyles: false,
    }),
    // https://docs.astro.build/en/guides/integrations-guide/sitemap/
    // sitemap(),
  ],
  // https://docs.astro.build/en/guides/assets/#using-sharp
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },
});
