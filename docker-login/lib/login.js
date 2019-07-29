"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const io = require("@actions/io");
const command_1 = require("@actions/core/lib/command");
const path = require("path");
const fs = require("fs");
function run() {
    let username = core.getInput('username', { required: true });
    let password = core.getInput('password', { required: true });
    let loginServer = core.getInput('loginServer', { required: true });
    let email = core.getInput('email', { required: true });
    let authenticationToken = new Buffer(`${username}:${password}`).toString('base64');
    let config = {
        "auths": {
            [loginServer]: {
                auth: authenticationToken,
                email: email
            }
        }
    };
    const runnerTempDirectory = process.env['RUNNER_TEMPDIRECTORY']; // Using process.env until the core libs are updated
    const dirPath = path.join(runnerTempDirectory, `docker_login_${Date.now()}`);
    io.mkdirP(dirPath);
    const dockerConfigPath = path.join(dirPath, `config.json`);
    core.debug(`Writing docker config contents to ${dockerConfigPath}`);
    fs.writeFileSync(dockerConfigPath, JSON.stringify(config));
    command_1.issueCommand('set-env', { name: 'DOCKER_CONFIG' }, dirPath);
    console.log('DOCKER_CONFIG environment variable is set');
}
try {
    run();
}
catch (ex) {
    core.setFailed(ex);
}
