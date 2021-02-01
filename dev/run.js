const SvelteUiBundler = require('./run.ui.bundler');
const TranspileApp = require('./run.tsc.app');
const ElectronApp = require('./run.open.app');

// ------- # Svelte UI Bundler
const BundleSvelteUI = SvelteUiBundler();
BundleSvelteUI.stdout.on("data", (data) => {
  if (String(data).match(/Your application is ready~!/i)) {
    console.log("\u001b[35m[Bundler]:\u001b[0m", "\nSvelte UI Bundler is ready and in watch mode!", "");
  }
});

// ------- # Typescript App Transpiler
console.log("");
TranspileAppProccess = TranspileApp();
TranspileAppProccess.stdout.on("data", (data) => {
  if (String(data).match(/Found [0-9]+ errors. Watching for file changes./i)) {
    console.log("");
    console.log("[Transpiler]:\u001b[32m", "\nReady and in watch mode!\n> Starting Electron App!", "\u001b[0m");
    launchElectronApp();
  }
});

// -------- # Electron App runner
function launchElectronApp() {
  ElectronAppRunner = ElectronApp();
  ElectronAppRunner.stdout.on("data", (data) => {
    if (!String(data).match(/\[nodemon\]/)) {
      console.log("\u001b[34m[AppRunner]:\n\u001b[0m", data, "\u001b[0m");
    }
  });
}
