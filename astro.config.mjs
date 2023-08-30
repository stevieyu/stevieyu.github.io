import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import prefetch from '@astrojs/prefetch';
import partytown from '@astrojs/partytown';
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
const IS_PROD = process.env.NODE_ENV === 'production';


// https://astro.build/config
export default defineConfig({
  site: 'https://stevie.top',
  integrations: [
  // https://docs.astro.build/en/guides/integrations-guide/sitemap/
  sitemap(),
  // https://docs.astro.build/en/guides/integrations-guide/prefetch/
  // prefetch({
  //   selector: "a[href^='/']"
  // }),
  // https://starlight.astro.build/
  starlight({
    title: 'Stevie',
    // logo: {
    // light: './src/assets/light-logo.svg',
    // dark: './src/assets/dark-logo.svg',
    // src: 'https://avatars.githubusercontent.com/u/8325201?v=4',
    // replacesTitle: true,
    // },
    head: [{
      tag: 'script',
      attrs: {
        src: '/services.js',
        type: IS_PROD ? 'module' : 'text',
        defer: true
      }
    }],
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
      label: 'Guides',
      items: [
      // Each item here is one entry in the navigation menu.
      {
        label: 'Example Guide',
        link: '/guides/example/'
      }]
    }, {
      label: 'Reference',
      autogenerate: {
        directory: 'reference'
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
    // applyBaseStyles: false,
  }),
  ],
  // https://docs.astro.build/en/guides/assets/#using-sharp
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },
  experimental: {
    // https://docs.astro.build/en/guides/view-transitions/#enabling-view-transitions-in-your-project
    viewTransitions: true,
    assets: true
  }
});