const { exec } = require("child_process");
const chokidar = require('chokidar');
const path = require('path');
/**
 * @type import("child_process").ChildProcess | undefined
 */
let currentApp = undefined;

function OpenArchitectApp(url) {

  console.log("\n\u001b[34m[AppRunner]:\u001b[0m", "Electron App is launching!", "\u001b[0m");
  const ElectronAppRunner = exec(
    "electron ./src/app/esm.boot.js --dev "
    + (url != null ? "--url " + url : ""),
    (err) => {
      if (err) {
        console.error("Failed to execute electron app!", err);
      }
    }
  );

  ElectronAppRunner.on("error", (err) => {
    console.log("App Runner Error! ", err);
  });

  ElectronAppRunner.on("exit", (code, signal) => {
    console.log("App Runner ended with code", code, signal);
    OpenArchitectApp(url);
  });

  if (currentApp === undefined) {
    WatchForChanges();
  }

  currentApp = ElectronAppRunner;

  ElectronAppRunner.stdout.on("data", (data) => {
    console.log("\u001b[34m[AppRunner]:\n\u001b[0m", data, "\u001b[0m");
  });

  ElectronAppRunner.stderr.on("data", (data) => {
    console.log("\u001b[34m[AppRunner - ERROR]:\n\u001b[0m\u001b[31m", data, "\u001b[0m");
  });

  return ElectronAppRunner;

};

function WatchForChanges() {
  let batchUpdate;


  for (let subpath of ["app", "lib"]) {
    let p = path.resolve(
      __dirname, '..', 'src', subpath, '**/*'
    );
    chokidar
      .watch(p, {
        ignoreInitial: true
      })
      .on("all", (event, changed) => {
        console.log("FileWatcher reported a change!\n", event, '->', changed);

        if (batchUpdate === undefined && changed.match(/.js$/)) {
          console.log("Scheduling app restart!");
          batchUpdate = setTimeout(() => {
            console.log("Restarting Electron app!");
            try {
              if (currentApp !== undefined) {
                currentApp.stdin.write("SIGKILL");
              } else {
                OpenArchitectApp();
              }
            } catch (err) {
              console.error("Failed to launch Electron App!");
            }

            delete batchUpdate;
          }, 2000);
        }
      }
      );

  }
}

module.exports = OpenArchitectApp;