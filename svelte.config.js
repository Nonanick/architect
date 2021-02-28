const sveltePreprocess = require('svelte-preprocess');

const options = {
  sourceMap: true, // "you would always want sourcemaps for the IDE" – dummdidumm
  defaults: {
    script: "ts",
    style: "css",
  },
};

module.exports = {
  preprocess: sveltePreprocess(options),
  svelteOptions: options
};