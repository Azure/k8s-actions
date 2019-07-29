import * as toolCache from '@actions/tool-cache';
import * as core from '@actions/core';
import { ToolRunner, argStringToArray } from "@actions/exec/lib/toolrunner";

import * as path from 'path';
import * as os from 'os';
import * as io from '@actions/io';

let kubectlPath = "";

async function checkAndSetKubectlPath() {
    kubectlPath = await io.which('kubectl', false);
    if (kubectlPath) {
        return;
    }

    const allVersions = toolCache.findAllVersions('kubectl');
    kubectlPath = allVersions.length > 0 ? toolCache.find('kubectl', allVersions[0]) : '';
    if (!kubectlPath) {
        throw new Error('Kubectl is not installed');
    }

    kubectlPath = path.join(kubectlPath, `kubectl${getExecutableExtension()}`);
}

function getExecutableExtension(): string {
    if (os.type().match(/^Win/)) {
        return '.exe';
    }

    return '';
}

async function createSecret() {
    const typeOfSecret = core.getInput('secret-type', { required: true });
    const secretName = core.getInput('secret-name', { required: true });
    const namespace = core.getInput('namespace');

    await deleteSecret(namespace, secretName);

    let args;
    if (typeOfSecret === "docker-registry") {
        args = getDockerSecretArguments(secretName);
    }
    else if (typeOfSecret === "generic") {
        args = getGenericSecretArguments(secretName);
    }
    else {
        throw new Error('Invalid secret-type input. It should be either docker-registry or generic');
    }

    if (namespace) {
        args.push('-n', namespace);
    }

    const toolRunner = new ToolRunner(kubectlPath, args);
    const code = await toolRunner.exec();
    if (code != 0) {
        throw new Error('Secret create failed.')
    }
    core.setOutput('secret-name', secretName);
}

async function deleteSecret(namespace: string, secretName: string) {
    let args = ['delete', 'secret', secretName];

    if (namespace) {
        args.push('-n', namespace);
    }

    const toolRunner = new ToolRunner(kubectlPath, args, { failOnStdErr: false, ignoreReturnCode: true, silent: true });
    await toolRunner.exec();
    core.debug(`Deleting ${secretName} if already exist.`);
}

function getDockerSecretArguments(secretName: string): string[] {
    const userName = core.getInput('container-registry-username');
    const password = core.getInput('container-registry-password');
    const server = core.getInput('container-registry-url');
    let email = core.getInput('container-registry-email');

    let args = ['create', 'secret', 'docker-registry', secretName, '--docker-username', userName, '--docker-password', password];

    if (server) {
        args.push('--docker-server', server);
    }

    if (!email) {
        email = ' ';
    }

    args.push('--docker-email', email);
    return args;
}

function getGenericSecretArguments(secretName: string): string[] {
    const secretArguments = core.getInput('arguments');
    let args = ['create', 'secret', 'generic', secretName];
    args.push(...argStringToArray(secretArguments));
    return args;
}

function checkClusterContext() {
    if (!process.env["KUBECONFIG"]) {
        throw new Error('Cluster context not set. Use k8s-set-context/aks-set-context action to set cluster context');
    }
}

async function run() {
    checkClusterContext();
    await checkAndSetKubectlPath();
    await createSecret();
}

run().catch(core.setFailed);