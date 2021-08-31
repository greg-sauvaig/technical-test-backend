import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import fs from "fs";
import { sample } from "./lib/logGenerator.js";

fs.mkdirSync("logs", { recursive: true });

const generateFile = () => {
  const id = uuidv4();
  const filename = `./logs/${id}.txt`;

  fs.writeFileSync(filename, sample(id));
};

_.times(1000, generateFile);

console.log("Generated 1000 files in ./logs");
