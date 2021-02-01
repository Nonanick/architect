const { exec } = require("child_process");

module.exports = function OpenArchitectApp() {

  console.log("\n\u001b[34m[AppRunner]:\u001b[0m", "Electron App is launching with nodemon!", "\u001b[0m");
  const ElectronAppRunner = exec("yarn nodemon --delay 1 --watch src/app --watch src/server --exec electron ./src/app/app.boot.js", (err, stdin, stdout) => {
    if (err) console.error(err);
  });

  ElectronAppRunner.on("error", (err) => {
    console.log("App Runner Error! ", err);
  });

  ElectronAppRunner.on("exit", (code, signal) => {
    console.log("App Runner ended with code", code, signal);
  });

  return ElectronAppRunner;

};