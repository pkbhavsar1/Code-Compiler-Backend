const { exec } = require("child_process");
const path = require("path");

const executePython = async (filepath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const codeFolder = path.join(__dirname, "code");

  return await new Promise ((reject, resolve) => {
     exec(`cd ${codeFolder} && python ${jobId}.py`, (error, stdout, stderr) => {
      if (error) {
        console.log("ERROR PYTHON: ", error.message);
        reject(error.message);
      } else if (stderr) {
        console.log("STD ERROR PYTHON: ", stderr);
        reject(stderr.trim());
      } else {
        console.log("STDOUT PYTHON:", stdout.trim());
        resolve(stdout.trim());
      }
    });
  });
};

module.exports = {
  executePython,
};
