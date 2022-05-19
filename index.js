#!/usr/bin/env node
"use strict";

const commander = require("commander");
const { exec } = require("child_process");
const packageJson = require("./package.json");
const cliSpinners = require("cli-spinners");
const process = require("process");
const readline = require("readline");
const chalk = require("chalk");
const path = require("path");
const {
  copyContentOfFolder,
  deleteFolders,
  updatePackageJSON,
} = require("./utils");

let projectName;

const error = chalk.bold.red;
const info = chalk.bold.blue;
const warning = chalk.hex("#FFA500");
const success = chalk.bold.greenBright;

const STEPS = [
  "Creating project...",
  "Updating folder structure...",
  "Installing dependencies...",
];

const init = async () => {
  const program = new commander.Command(packageJson.name)
    .version(packageJson.version)
    .description(packageJson.description)
    .arguments("<project-directory>")
    .action((name) => {
      projectName = name;
    })
    .parse(process.argv)
    .on("--help", () => {
      console.log("Fuck you bro");
    });

  if (!projectName) {
    program.help();
    return;
  }
  let i = 0;
  let stepCounter = 0;
  const timer = setInterval(() => {
    process.stdout.write(
      `\r ${info(
        `${cliSpinners.dots.frames[i++ % cliSpinners.dots.frames.length]}`
      )} ${info(STEPS[stepCounter])}`
    );
  }, cliSpinners.dots.interval);
  exec(
    `npx create-next-app ${projectName} --typescript`,
    (err, stdout, stderr) => {
      if (err) {
        console.error(error(err));
        return;
      }
      readline.clearLine(process.stdout, 0);
      console.log(warning(stderr));
      stepCounter++;
      deleteFolders(path.join(__dirname, `${projectName}/pages`));
      deleteFolders(path.join(__dirname, `${projectName}/styles`));
      deleteFolders(path.join(__dirname, `${projectName}/public`));

      updatePackageJSON(projectName);
      copyContentOfFolder(
        path.join(__dirname, "template/baseTemplate"),
        projectName
      )
        .then(() => {
          stepCounter++;
          readline.clearLine(process.stdout, 0);
          exec(`npm install`, (err, stdout, stderr) => {
            stepCounter++;
            readline.clearLine(process.stdout, 0);
            clearInterval(timer);
            console.log("\n");
            process.stdout.write(success("Successfully created project!"));
          });
        })
        .catch((err) => {
          readline.clearLine(process.stdout, 0);
          console.log(error(err));
          throw err;
        });
    }
  );
};

init();
//     clearInterval(timer);
// readline.clearLine(process.stdout, 0);
