import hasbin = require('hasbin');
import shell = require('shelljs');
import path = require('path');
import fs = require('fs');

function isNutmegComponent(workingDir: string): boolean {
  try {
    const meta = loadPackageJson(workingDir);
    return meta && meta.dependencies && meta.dependencies.hasOwnProperty('@nutmeg/element');
  } catch(e) {
    return false;
  }
}

function loadPackageJson(dir: string): { dependencies: {} } {
  const packagePath = path.resolve(dir, 'package.json');
  return JSON.parse(fs.readFileSync(packagePath).toString());
}

function hasYarn(): boolean {
  return hasbin.sync('yarn');
}

function exit(message: string, condition = true): void {
  if (condition) {
    console.error(message);
    process.exit(1);
  }
}

function commitToGit(): void {
  shell.exec('git init');
  shell.exec('git add .');
  shell.exec('git commit -m "Initial commit from @nutmeg/cli"');
}

function installDependencies(options: { withYarn: boolean, withDependencies: boolean }): void {
  if (!options.withDependencies) {
    console.log('Skipping dependencies');
  } else {
    const useYarn = hasYarn() && options.withYarn;
    console.log(`Installing dependencies with ${useYarn ? 'yarn' : 'npm'}`);
    if (useYarn) {
      shell.exec('yarn');
    } else {
      shell.exec('npm install --no-optional');
    }
  }
}

export {
  commitToGit,
  exit,
  hasYarn,
  installDependencies,
  isNutmegComponent,
};
