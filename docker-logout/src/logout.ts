import * as io from '@actions/io';
import * as ioUtil from '@actions/io/lib/io-util';
import * as core from '@actions/core';
import { issueCommand } from '@actions/core/lib/command';

function run() {
    let pathToDockerConfig = process.env['DOCKER_CONFIG'];
    if (pathToDockerConfig && ioUtil.exists(pathToDockerConfig)) {
        io.rmRF(pathToDockerConfig); // Deleting the docker config directory
        core.debug(`${pathToDockerConfig} has been successfully deleted`);
    };
    issueCommand('set-env', { name: 'DOCKER_CONFIG' }, '');
    console.log('DOCKER_CONFIG environment variable unset');
}

run();