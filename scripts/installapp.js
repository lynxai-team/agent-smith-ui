// create-app.js
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import fs from "node:fs";
import path from "node:path";
import { homedir } from 'os';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import yaml from "yaml";

function createDirectoryIfNotExists(dirPath, recursive = false) {
    const resolvedDirPath = path.resolve(dirPath);
    if (!fs.existsSync(resolvedDirPath)) {
        fs.mkdirSync(resolvedDirPath, { recursive: recursive });
    }
}

function createConfigFile(confDir) {
    createDirectoryIfNotExists(confDir);
    const fp = path.join(confDir, "config.yml");
    const fc = {
        backends: {
            default: "llamacpp",
            local: ["llamacpp"],
            llamacpp_oai: {
                type: "openai",
                url: "http://localhost:8080/v1"
            }
        },
        promptfile: "",
    };
    const txt = yaml.stringify(fc);
    if (fs.existsSync(fp)) {
        const err = `Config file ${fp} already exists`;
        console.log(err);
        //throw new Error(err);
    }
    try {
        fs.writeFileSync(fp, txt, { encoding: 'utf8' });
        console.log(`Config file created at ${fp}`);
    } catch (e) {
        throw new Error(`Error creating config file at ${fp}: ${e}`);
    }
    return fp;
}

function getConfigPath(appName, filename = "config.yml") {
    let confDir;
    let dbPath;
    if (process.platform === 'win32') {
        confDir = join(process.env.APPDATA, appName);
        dbPath = join(process.env.APPDATA, appName, filename);
    } else if (process.platform === 'darwin') {
        confDir = join(homedir(), 'Library', 'Application Support', appName);
        dbPath = join(homedir(), 'Library', 'Application Support', appName, filename);
    } else { // Linux, BSD, etc.
        confDir = join(homedir(), '.config', appName);
        dbPath = join(homedir(), '.config', appName, filename);
    }
    return { confDir: confDir, dbPath: dbPath };
}

function checkConfFile(confDir) {
    const fp = path.join(confDir, "config.yml");
    if (!fs.existsSync(fp)) {
        createConfigFile(confDir);
    }
}

function openConfFile(confDir) {
    const fp = path.join(confDir, "config.yml");
    const conf = fs.readFileSync(fp, { encoding: 'utf8' });
    const txt = yaml.parse(conf);
    if (!fs.existsSync(fp)) {
        const err = `Config file ${fp} does not exist`;
        throw new Error(err);
    }
    return txt;
}

function updateConfigFile(conf, confDir) {
    const fp = path.join(confDir, "config.yml");
    const txt = yaml.stringify(conf);
    if (!fs.existsSync(fp)) {
        const err = `Config file ${fp} does not exist`;
        throw new Error(err);
    }
    try {
        fs.writeFileSync(fp, txt, { encoding: 'utf8' });
    } catch (e) {
        throw new Error(`Error creating config file at ${fp}: ${e}`);
    }
    return fp;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appName = process.argv[2];

if (!appName) {
    console.error('Please provide an app package as an argument');
    process.exit(1);
}
const appDir = join(__dirname, '../src/apps');
const appFile = join(appDir, `${appName}.js`);

try {
    const { confDir } = getConfigPath("agent-smith");
    checkConfFile(confDir);
    await mkdir(appDir, { recursive: true });
    await writeFile(appFile, `import { AppComponent, AppSidebar } from "@agent-smith/app-${appName}";
export default { AppComponent, AppSidebar };
`);
    console.log(`Created app file: ${appFile}`);

    // update conf    
    const conf = openConfFile(confDir);
    if (!conf?.apps) {
        conf.apps = {};
    }
    conf.apps[appName] = `@agent-smith/app-${appName}`;
    const fp = path.join(__dirname, `../../agent-smith-apps/${appName}/features`);
    if (!conf?.features) {
        conf.features = [];
    }
    if (!conf.features.includes(fp)) {
        console.log("Adding features dirs:", fp);
        conf.features.push(fp);
    }

    console.log("Updating config file");
    updateConfigFile(conf, confDir);

    console.log("Updating features db");
    execSync('lm conf', { stdio: 'inherit' });

    // Update package.json to add the dependency
    const packagePath = join(__dirname, '../package.json');
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));

    // Add the dependency
    const dependencyName = `@agent-smith/app-${appName}`;
    const dependencyValue = `file:../agent-smith-apps/${appName}`;

    packageJson.dependencies[dependencyName] = dependencyValue;

    // Write back to package.json
    writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log(`Added dependency to package.json: ${dependencyName}: ${dependencyValue}`);

    // Run build command
    console.log('Updating build...');
    execSync('npm install', { stdio: 'inherit' });
    execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
    console.error('Error creating app:', error);
    process.exit(1);
}