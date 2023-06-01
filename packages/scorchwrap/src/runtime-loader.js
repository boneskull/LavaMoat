const fs = require("fs");
const path = require("path");

/** @type {import("webpack").LoaderDefinition} */
module.exports = function (source) {
  console.error("------------------runtime-loader", this.resourcePath)
  const options = this.getOptions();
  const runtimeCode = fs.readFileSync(
    path.join(__dirname, "runtime.js"),
    'utf8'
  );
  const runtimeWithPolicy = runtimeCode.replace(`'%%POLICY%%'`, JSON.stringify(options.policy));
  return runtimeWithPolicy;
};
