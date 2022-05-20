var fs = require("fs");
var path = require("path");

const copyFileSync = (source, target) => {
  var targetFile = target;

  // If target is a directory, a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
};

const copyFolderRecursiveSync = (source, target) => {
  return new Promise((resolve, reject) => {
    try {
      let files = [];

      // Check if folder needs to be created or integrated
      let targetFolder = path.join(target, path.basename(source));
      if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
      }

      // Copy
      if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function (file) {
          let curSource = path.join(source, file);
          if (fs.lstatSync(curSource).isDirectory()) {
            copyFolderRecursiveSync(curSource, targetFolder);
          } else {
            copyFileSync(curSource, targetFolder);
          }
        });
        resolve("Done");
      }
    } catch (error) {
      reject(error);
    }
  });
};

const copyContentOfFolder = (source, target) => {
  return new Promise((resolve, reject) => {
    try {
      let files = [];

      // Copy
      if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function (file) {
          let curSource = path.join(source, file);
          if (fs.lstatSync(curSource).isDirectory()) {
            copyFolderRecursiveSync(curSource, target);
          } else {
            copyFileSync(curSource, target);
          }
        });
        resolve("Done");
      }
    } catch (error) {
      reject(error);
    }
  });
}

const deleteFolders = (path) => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file) => {
      const curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolders(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}


const updatePackageJSON = (projectName) => {
  const packageJsonPath = path.join(process.cwd(), `${projectName}/package.json`);
  const templatePackageJsonPath = path.join(__dirname, "template/package.json");
  const packageJson = require(packageJsonPath);
  const templatePackageJson = require(templatePackageJsonPath);
  packageJson.name = projectName;
  packageJson.description = `A Next.js project for ${projectName}`;
  if(templatePackageJson.dependencies){
    packageJson.dependencies = templatePackageJson.dependencies
  }
  if (templatePackageJson.devDependencies) {
    packageJson.devDependencies = templatePackageJson.devDependencies;
  }
  if (templatePackageJson.scripts) {
    packageJson.scripts = templatePackageJson.scripts;
  }
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

module.exports = {
  copyFolderRecursiveSync,
  copyFileSync,
  copyContentOfFolder,
  deleteFolders,
  updatePackageJSON
};
