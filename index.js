const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const { generateFile } = require("./generateFile");
const { executeCpp } = require("./executeCpp");
const { executePython } = require("./executePython");

app.get("/", (req, res) => {
  res.json({ Hello: "World" });
});

app.post("/run", async (req, res) => {
  const { language = "cpp", code } = req.body;
  console.log(language);
  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body" });
  }

  const filePath = await generateFile(language, code);
  var output;
  try {
    if (language == "cpp") {
      output = await executeCpp(filePath);
      if (output.slice(0, 14) == "Command failed") {
        output = output.slice(192);
        console.log("OUTPUT 1 :", output);
      } else {
        output = output.split("\n")[1];
        console.log("OUTPUT 2");
      }
    } else {
      output = await executePython(filePath);
    }
    console.log("OUTPUT Python: ", output);
    return res.json({ filePath, output });
  } catch (error) {
    console.log("ERORR TRY CATCH", error);
    return res.status(500).json({ error });
  }
});

app.listen(5000, () => {
  console.log("Listing on port 5000");
});
