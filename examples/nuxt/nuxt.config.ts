import './env/server';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'The Graph | Nuxt Subgraph Querying Example',
      link: [
        { rel: 'shortcut icon', type: 'image/x-icon', href: 'https://storage.googleapis.com/graph-web/favicon.png' },
      ],
      meta: [
        {
          name: 'description',
          content:
            'Demos how to query the Graph Network Arbitrum Subgraph published to The Graph Network using an API Key obtained on The Graph Studio in a Nuxt application',
        },
      ],
    },
  },
});
