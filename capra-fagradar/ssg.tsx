#!/usr/bin/env -S VITE_NODE=true vite-node --script
import { build } from 'vite';
import ssgPlugin from './ssg-for-vite.tsx';

try {
  console.log("Running Vite build with SSG setup (Static site generation)");

  const base = process.argv.slice(2).reduce((acc, arg) => {
    if (arg.startsWith('--base=')) {
      return arg.split('=')[1];
    }
    return acc;
  }, undefined);
  if(base) {
    console.log(`Using base: ${base}`);
  }

  console.log("");

  const routes = (await import('./src/routes')).default;

  // Hack so that we can have different options
  // for vite-node and for the build under
  process.env.VITE_NODE = false;

  const ssgPluginConfig = {
    routes,
    mainScript: '/ssg-main.tsx',
  }

  const viteConfig = (await import('./vite.config.ts')).default;

  let originalViteConfig =
    typeof viteConfig == 'function' ? viteConfig() : viteConfig;

  await build({
    ...originalViteConfig,
    plugins: [
      ssgPlugin(ssgPluginConfig),
      ...(originalViteConfig.plugins),
    ],
    base,
  });
} catch(e) {
  console.error(e);
  process.exit(1);
}
