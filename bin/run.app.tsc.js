const { exec } = require("child_process");

module.exports = function TranspileApp() {
  console.log("[Transpiler]:\u001b[32m", "\nTypescript transpiler is launching", "\u001b[0m");
  const TranspileAppProccess = exec(
    // Transpile using Typescript Compiler
    "tsc -p ./tsconfig.electron.json -w",
    (Error) => {
      if (err) { console.error(err); }
    }
  );
  TranspileAppProccess.stderr.on("data", (err) => {
    console.log("App transpiler error!", err);
  });
  TranspileAppProccess.on("error", (err) => {
    console.log("App Transpilation Error! ", err);
  });
  TranspileAppProccess.on("exit", (code, signal) => {
    console.log("Transpiler ended with code", code, signal);
  });

  return TranspileAppProccess;
};