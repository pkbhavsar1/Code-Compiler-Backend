const { rejects } = require("assert");
const { exec } = require("child_process");
const fs = require("fs");
const { resolve } = require("path");
const path = require("path");

const outputPath = path.join(__dirname, "output");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);
  const codeFolder = path.join(__dirname,"code");
  const outputFolder = path.join(__dirname, "output")

  return new Promise((reject, resolve)=>{
    exec(
        // `cd ${codeFolder} && g++ ${filepath} -o ${outPath} && cd ${outputPath} && ./${jobId}.out`,
        `cd ${codeFolder} && g++ ${jobId}.cpp -o ${jobId}`,
        (error, stdout, stderr) => {
          if (error) {
            console.log("ERROR 1: ",error.message);
            reject(error.message);
          } else if(stderr){
            console.log("STD ERROR : ",stderr);
            reject(stderr.trim());
          }else{
            exec(`cd ${codeFolder} && move ${jobId}.exe ../output && cd ${outputFolder} && ${jobId}.exe`,
              (error, stderr, stdout)=>{
                if (error) {
                  // console.log("ERROR : ",error);
                  console.log("2ND ERROR");
                  reject(error.message);
                } else if(stderr){
                  // console.log("STD ERROR : ",stderr);
                  reject(stderr.trim());
                }else{
                  console.log("RESOLVED",stdout);
                  resolve(stdout.trim())
                }
              }
            )
          }
        }
      );
    });
  }

  module.exports={
    executeCpp,
  };
      // `cd ${codeFolder} && move ${jobId}.exe ../output && cd ${outputFolder} && ${jobId}.exe`,
