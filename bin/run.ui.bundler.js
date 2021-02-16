const { exec } = require("child_process");

module.exports = function SvelteUIBundler() {

  console.log("[Bundler]:\u001b[35m", "\nSvelte UI Bundler is launching!", "\u001b[0m");
  const BundleSvelteUI = exec(
    "npx rollup -c -w",
    {
      windowsHide: true
    },
    (err, stdout, stdin) => {
      if (err) { console.error(err); }
    },
  );
  BundleSvelteUI.on("error", (err) => {
    console.log("Svelte UI Bundler error!\n", err);
  });
  BundleSvelteUI.stderr.on("data", (errData) => {
    console.log("Svelte UI Bundler error!\n", errData);
  });
  BundleSvelteUI.on("exit", (code, signal) => {
    console.log("Bundler ended with code", code, signal);
  });

  return BundleSvelteUI;
};