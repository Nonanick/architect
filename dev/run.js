const SvelteUiBundler = require('./run.ui.bundler');
const TranspileApp = require('./run.app.tsc');
const ElectronApp = require('./run.app.electron');

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
  console.log("-", data);
  if (String(data).match(/Found [0-9]+ errors. Watching for file changes./i)) {
    console.log("");
    console.log("[Transpiler]:\u001b[32m", "\nReady and in watch mode!", "\u001b[0m");

    if (!process.argv.includes('--no-app') && !alreadyLaunched) {
      console.log("Launching Electron!");
      launchElectronApp();
    }
  }

});

let alreadyLaunched = false;
// -------- # Electron App runner
function launchElectronApp() {
  alreadyLaunched = true;
  ElectronApp();
}
