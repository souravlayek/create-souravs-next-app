#!/usr/bin/env node
"use strict";

const headingString = `
███▄    █ ▓█████ ▒██   ██▒▄▄▄█████▓▄▄▄██▀▀▀██████     ██▓███   ██▀███   ▒█████
██ ▀█   █ ▓█   ▀ ▒▒ █ █ ▒░▓  ██▒ ▓▒  ▒██ ▒██    ▒    ▓██░  ██▒▓██ ▒ ██▒▒██▒  ██▒
▓██  ▀█ ██▒▒███   ░░  █   ░▒ ▓██░ ▒░  ░██ ░ ▓██▄      ▓██░ ██▓▒▓██ ░▄█ ▒▒██░  ██▒
▓██▒  ▐▌██▒▒▓█  ▄  ░ █ █ ▒ ░ ▓██▓ ░▓██▄██▓  ▒   ██▒   ▒██▄█▓▒ ▒▒██▀▀█▄  ▒██   ██░
▒██░   ▓██░░▒████▒▒██▒ ▒██▒  ▒██▒ ░ ▓███▒ ▒██████▒▒   ▒██▒ ░  ░░██▓ ▒██▒░ ████▓▒░
░ ▒░   ▒ ▒ ░░ ▒░ ░▒▒ ░ ░▓ ░  ▒ ░░   ▒▓▒▒░ ▒ ▒▓▒ ▒ ░   ▒▓▒░ ░  ░░ ▒▓ ░▒▓░░ ▒░▒░▒░
░ ░░   ░ ▒░ ░ ░  ░░░   ░▒ ░    ░    ▒ ░▒░ ░ ░▒  ░ ░   ░▒ ░       ░▒ ░ ▒░  ░ ▒ ▒░
  ░   ░ ░    ░    ░    ░    ░      ░ ░ ░ ░  ░  ░     ░░         ░░   ░ ░ ░ ░ ▒
        ░    ░  ░ ░    ░           ░   ░       ░                 ░         ░ ░

`;

const { exec } = require("child_process");
const cliSpinners = require("cli-spinners");
const process = require("process");
const readline = require("readline");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const inquirer = require("inquirer");
const clear = require("clear");
const { copyContentOfFolder, deleteFolders, deleteFile } = require("./utils");

const error = chalk.bold.red;
const info = chalk.bold.blue;
const warning = chalk.hex("#FFA500");
const success = chalk.bold.greenBright;

const showError = (msg) => {
  console.log("");
  console.log(error(msg));
  console.log("");
};
const showWarning = (msg) => {
  console.log("");
  console.log(warning(msg));
  console.log("");
};
const showSuccess = (msg) => {
  console.log("");
  console.log(success(msg));
  console.log("");
};
const showInfo = (msg) => {
  console.log("");
  console.log(info(msg));
  console.log("");
};

const chooseLanguage = async () => {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "type",
          message: "Select a language?",
          choices: ["Javascript", "Typescript"],
        },
      ])
      .then((res) => {
        resolve({
          status: "success",
          answers: res,
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const formInput = async (isTS = false) => {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "projectName",
          message: "Project Name",
          default: "my-project",
          validate: (input) => {
            if (input.includes(" ")) {
              return "There must not be any spaces in the project name";
            }
            if (input.length > 30) {
              return "Project name must be less than 30 characters";
            }
            if (input.length < 3) {
              return "Project name must be at least 3 characters";
            }
            if (input.match(/\d+$/)) {
              return "Project shouldn't contain Numbers";
            }
            if (input.match(/[A-Z]/)) {
              return "Project shouldn't contain Capital Letters";
            }
            if (!input.match(/^[A-Za-z0-9-_]+$/)) {
              return "Project shouldn't contain Special Characters";
            }
            return true;
          },
        },
        {
          type: "input",
          name: "description",
          message: "Project Description",
          default: "This is a next js project",
        },
        ...(isTS
          ? [
              {
                type: "list",
                name: "stateManagement",
                message: "State Management",
                choices: ["Redux", "ContextAPI", "None"],
              },
            ]
          : []),
      ])
      .then((answers) => {
        resolve({
          status: "success",
          answers,
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const greet = () => {
  console.log("");
  console.log(success(headingString));
  console.log(
    success.bold(
      "Best way to start your next project is with nextJS, this is a simple starter kit to get you started quickly."
    )
  );
  console.log("");
  console.log(info.bold("Please Help me by answering few questions"));
  console.log("");
};

const commandExecutor = async (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      }
      if (stderr) {
        showWarning(stderr);
      }
      resolve({
        status: "success",
        stdout,
        stderr,
      });
    });
  });
};

const readyPrompt = inquirer.createPromptModule();

const checkIsUserReady = async () => {
  return new Promise((resolve, reject) => {
    readyPrompt({
      type: "confirm",
      name: "ready",
      message: "Are you ready to start?",
      default: true,
    })
      .then((answers) => {
        resolve({
          isReady: answers.ready,
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const installDependencies = async (projectPath, isYarnPresent) => {
  const res = await commandExecutor(
    `cd ${projectPath} && ${isYarnPresent ? "yarn" : "npm"} install`
  );
  if (res.status === "success") {
    return true;
  } else {
    return false;
  }
};

const createBaseProject = async (projectName, isJS = false) => {
  if (isJS) {
    const res = await commandExecutor(`npx create-next-app ${projectName}`);
    if (res.status === "success") {
      return true;
    }
  }
  const res = await commandExecutor(
    `npx create-next-app ${projectName} --typescript`
  );
  if (res.status === "success") {
    return true;
  }
  return false;
};

const clearBaseFolders = async (projectPath) => {
  deleteFolders(path.join(projectPath, "pages"));
  deleteFolders(path.join(projectPath, "public"));
  deleteFolders(path.join(projectPath, "styles"));
  deleteFile(path.join(projectPath, ".eslintrc.json"));
};

const checkYarnPresence = (projectPath) => {
  const yarnPath = path.join(projectPath, "yarn.lock");
  if (fs.existsSync(yarnPath)) {
    return true;
  }
  return false;
};

const initGit = async (projectPath) => {
  const res = await commandExecutor(`cd ${projectPath} && git init`);
  if (res.status === "success") {
    return true;
  }
  return false;
};

let STEP_COUNTER = 0;
let i = 0;

const STEPS = [
  "Creating project folder",
  "Creating folder structure based on your requirements",
  "Initializing git",
  "Installing dependencies",
];

const init = async () => {
  greet();
  try {
    const res = await checkIsUserReady();
    if (res.isReady) {
      const languageSelected = await chooseLanguage();
      if (languageSelected.status !== "success") {
        throw Error("Something went wrong");
      }
      const { type } = languageSelected.answers;
      const formResponse = await formInput(type !== "Javascript");
      if (formResponse.status !== "success") {
        throw Error("Something went wrong");
      }
      const {
        projectName,
        description,
        stateManagement = "None",
      } = formResponse.answers;
      const isRedux = stateManagement === "Redux";
      const isContextAPI = stateManagement === "ContextAPI";
      const isNone = stateManagement === "None";
      const isJS = type === "Javascript";

      clear();
      const timer = setInterval(() => {
        process.stdout.write(
          `\r ${info(
            `${cliSpinners.dots.frames[i++ % cliSpinners.dots.frames.length]}`
          )} ${info(STEPS[STEP_COUNTER])}`
        );
      }, cliSpinners.dots.interval);

      const isSuccessFullyCreated = await createBaseProject(projectName, isJS);
      if (!isSuccessFullyCreated) {
        showError("Something went wrong while creating the project");
        clearInterval(timer);
        clear();
        return;
      }

      STEP_COUNTER++;
      readline.clearLine(process.stdout, 0);

      const templatePath = path.join(__dirname, "template");
      const projectPath = path.join(process.cwd(), projectName);

      clearBaseFolders(projectPath);

      if (isNone) {
        const baseTemplatePath = path.join(
          templatePath,
          isJS ? "js/base" : "base"
        );
        const contentCopyActionResponse = await copyContentOfFolder(
          baseTemplatePath,
          projectPath
        );
        if (contentCopyActionResponse.status !== "success") {
          showError("Something went wrong while copying the content");
          clearInterval(timer);
          clear();
          return;
        }
      }
      if (isRedux) {
        const reduxTemplatePath = path.join(templatePath, "redux");
        const contentCopyActionResponse = await copyContentOfFolder(
          reduxTemplatePath,
          projectPath
        );
        if (contentCopyActionResponse.status !== "success") {
          showError("Something went wrong while copying the content");
          clearInterval(timer);
          clear();
          return;
        }
      }
      if (isContextAPI) {
        const contextApiTemplatePath = path.join(templatePath, "context");
        const contentCopyActionResponse = await copyContentOfFolder(
          contextApiTemplatePath,
          projectPath
        );
        if (contentCopyActionResponse.status !== "success") {
          showError("Something went wrong while copying the content");
          clearInterval(timer);
          clear();
          return;
        }
      }
      const packageJsonPath = path.join(
        process.cwd(),
        projectName,
        "package.json"
      );
      const myPackageJSON = JSON.parse(
        fs.readFileSync(packageJsonPath, "utf8")
      );

      myPackageJSON.name = projectName;
      myPackageJSON.description = description;

      fs.writeFileSync(packageJsonPath, JSON.stringify(myPackageJSON, null, 2));

      STEP_COUNTER++;
      readline.clearLine(process.stdout, 0);

      const isInitGitSuccess = await initGit(projectPath);
      if (!isInitGitSuccess) {
        showError("Something went wrong while initializing git");
        clearInterval(timer);
        clear();
        return;
      }

      STEP_COUNTER++;
      readline.clearLine(process.stdout, 0);
      const isYarnPresent = checkYarnPresence(projectPath);
      const isDependenciesInstalled = await installDependencies(
        projectPath,
        isYarnPresent
      );

      if (!isDependenciesInstalled) {
        showError("Something went wrong while installing dependencies");
        clearInterval(timer);
        clear();
        return;
      }

      clearInterval(timer);
      clear();

      showSuccess(`${projectName} project created successfully`);
      showInfo(
        `To start your project, run ${warning.bold(
          `cd ${projectName}`
        )} and ${warning.bold(`${isYarnPresent ? "yarn" : "npm run"} dev`)}`
      );
    } else {
      showError("Bye!");
    }
  } catch (error) {
    showError("Something went wrong");
    console.log(error);
    process.exit(1);
  }
};

init();

// create base project with typescript
// change package json
// update files and folder structure
// install dependencies
// inform user about readme
// success message with start command
