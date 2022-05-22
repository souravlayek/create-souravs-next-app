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

`

const { Command } = require('commander');
const { exec } = require("child_process");
const packageJson = require("./package.json");
const cliSpinners = require("cli-spinners");
const process = require("process");
const readline = require("readline");
const chalk = require("chalk");
const path = require("path");
const inquirer = require("inquirer");
const clear = require('clear');
const {
  copyContentOfFolder,
  deleteFolders,
  updatePackageJSON,
} = require("./utils");


const error = chalk.bold.red;
const info = chalk.bold.blue;
const warning = chalk.hex("#FFA500");
const success = chalk.bold.greenBright;

const showError = (msg) => {
  console.log("")
  console.log(error(msg))
  console.log("")
}
const showWarning = (msg) => {
  console.log("")
  console.log(warning(msg))
  console.log("")
}
const showSuccess = (msg) => {
  console.log("")
  console.log(success(msg))
  console.log("")
}
const showSInfo = (msg) => {
  console.log("")
  console.log(info(msg))
  console.log("")
}


const STEPS = [
  "Creating project...",
  "Updating folder structure...",
  "Installing dependencies...",
];

// const init = async () => {
//   const program = new commander.Command(packageJson.name)
//     .version(packageJson.version)
//     .description(packageJson.description)
//     .argument('<project-name>', 'Project name')
//     .option('-r, --redux', 'Redux Configuration')
//     .action((name, options,command) => {
//       projectName = name;
//       console.log(name, options, command.opts());
//     })
//     .on('--help', () => {
//       console.log('')
//       console.log('  Examples:')
//       console.log('')
//       console.log('')
//     }).parse();
//   // if (!projectName) {
//   //   program.help();
//   //   return;
//   // }
//   return;
//   let i = 0;
//   let stepCounter = 0;

//   const timer = setInterval(() => {
//     process.stdout.write(
//       `\r ${info(
//         `${cliSpinners.dots.frames[i++ % cliSpinners.dots.frames.length]}`
//       )} ${info(STEPS[stepCounter])}`
//     );
//   }, cliSpinners.dots.interval);

//   exec(
//     `npx create-next-app ${projectName} --typescript`,
//     (err, stdout, stderr) => {
//       if (err) {
//         console.error(error(err));
//         return;
//       }
//       readline.clearLine(process.stdout, 0);
//       console.log(warning(stderr));
//       stepCounter++;
//       deleteFolders(path.join(__dirname, `${projectName}/pages`));
//       deleteFolders(path.join(__dirname, `${projectName}/styles`));
//       deleteFolders(path.join(__dirname, `${projectName}/public`));

//       updatePackageJSON(projectName);
//       copyContentOfFolder(
//         path.join(__dirname, "template/baseTemplate"),
//         projectName
//       )
//         .then(() => {
//           stepCounter++;
//           readline.clearLine(process.stdout, 0);
//           exec(`npm install`, (err, stdout, stderr) => {
//             stepCounter++;
//             readline.clearLine(process.stdout, 0);
//             clearInterval(timer);
//             console.log("\n");
//             process.stdout.write(success("Successfully created project!"));
//           });
//         })
//         .catch((err) => {
//           readline.clearLine(process.stdout, 0);
//           console.log(error(err));
//           throw err;
//         });
//     }
//   );
// };

// const cleanInit = async () => {
//   const program = new Command(packageJson.name);
// program.option('-r, --redux', 'Redux Configuration');
//   program.parse(process.argv);
//   console.log(process.argv)

//   const options = program.opts();
//   console.log(options);
//   if (options.redux === undefined) console.log("no redux");
//   else if (options.redux === true) console.log("add redux");
//   else console.log(`add redux type ${options.cheese}`);
// };

// cleanInit();
const formInput = async () => {
  return new Promise((resolve, reject) => {
    inquirer.prompt(
      [
        {
          type: "input",
          name: "projectName",
          message: "Project Name",
          default: "my-project",
          validate: (input) => {
            if(input.includes(" ")){
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
        {
          type: "list",
          name: 'stateManagement',
          message: 'State Management',
          choices: ['Redux', 'ContextAPI', 'None'],
        }
      ]
    ).then(answers => {
      resolve({
        status: 'success',
        answers,
      })
    }).catch(err => {
      reject(err)
    })
  })
}

const greet = () => {
  console.log("")
  console.log(success(headingString))
  console.log(success.bold('Best way to start your next project is with nextJS, this is a simple starter kit to get you started quickly.'))
  console.log("")
  console.log(info.bold("Please Help me by answering few questions"))
  console.log("")
}

const readyPrompt = inquirer.createPromptModule();

const checkIsUserReady = async () => {
  return new Promise((resolve, reject) => {
    readyPrompt({
      type: 'confirm',
      name: 'ready',
      message: 'Are you ready to start?',
      default: true,
    }).then(answers => {
      resolve({
        isReady: answers.ready,
      })
    }).catch(err => {
      reject(err)
    })
  })
}
const init = async () => {
  greet()
  try {
    const res = await checkIsUserReady();
    if(res.isReady) {
      const res = await formInput();
      if(res.status !== 'success') {
        throw Error("Something went wrong");
      }
      const { projectName, description, stateManagement } = res.answers;
      // perform future task here
      clear();
      console.log(res.answers)
    }else {
      showError("Bye!")
    }

  } catch (error) {
    showError("Something went wrong")
  }
}

init();


// create base project with typescript
// change package json
// update files and folder structure
// install dependencies
// inform user about readme
// success message with start command
