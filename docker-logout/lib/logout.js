"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io = require("@actions/io");
const ioUtil = require("@actions/io/lib/io-util");
const core = require("@actions/core");
const command_1 = require("@actions/core/lib/command");
function run() {
    let pathToDockerConfig = process.env['DOCKER_CONFIG'];
    if (pathToDockerConfig && ioUtil.exists(pathToDockerConfig)) {
        io.rmRF(pathToDockerConfig); // Deleting the docker config directory
        core.debug(`${pathToDockerConfig} has been successfully deleted`);
    }
    ;
    command_1.issueCommand('set-env', { name: 'DOCKER_CONFIG' }, '');
    console.log('DOCKER_CONFIG environment variable unset');
}
run();
