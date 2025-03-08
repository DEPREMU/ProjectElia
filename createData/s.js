import { log } from "console";
import fs from "fs";

const destination = JSON.parse(
  fs.readFileSync("./createData/destination.json", "utf8")
);

const newDestination = {};

Object.entries(destination).forEach(([key, value]) => {
  //   newDestination[key] = { ...value, season: season };
});

fs.writeFileSync(
  "./createData/newDestination.json",
  JSON.stringify(newDestination)
);
