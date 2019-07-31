import * as core from '@actions/core';
import { issueCommand } from '@actions/core/lib/command';
import * as path from 'path';
import * as fs from 'fs';
import * as io from '@actions/io';
import * as toolCache from '@actions/tool-cache';
import * as os from 'os';
import { ToolRunner } from "@actions/exec/lib/toolrunner";

function getKubeconfig(): string {
    const kubeconfig = core.getInput('kubeconfig');
    if (kubeconfig) {
        core.debug("Setting context using kubeconfig");
        return kubeconfig;
    }
    const clusterUrl = core.getInput('k8s-url', { required: true });
    core.debug("Found clusterUrl, creating kubeconfig using certificate and token");
    let token = Buffer.from(core.getInput('k8s-secret'), 'base64').toString();
    const kubeconfigObject = {
        "apiVersion": "v1",
        "kind": "Config",
        "clusters": [
            {
                "cluster": {
                    "server": clusterUrl
                }
            }
        ],
        "users": [
            {
                "user": {
                    "token": token
                }
            }
        ]
    };

    return JSON.stringify(kubeconfigObject);
}

function getExecutableExtension(): string {
    if (os.type().match(/^Win/)) {
        return '.exe';
    }

    return '';
}

async function getKubectlPath() {
    let kubectlPath = await io.which('kubectl', false);
    if (!kubectlPath) {
        const allVersions = toolCache.findAllVersions('kubectl');
        kubectlPath = allVersions.length > 0 ? toolCache.find('kubectl', allVersions[0]) : '';
        if (!kubectlPath) {
            throw new Error('Kubectl is not installed');
        }

        kubectlPath = path.join(kubectlPath, `kubectl${getExecutableExtension()}`);
    }
    return kubectlPath;
}

async function setContext() {
    let context = core.getInput('context');
    if (context) {
        const kubectlPath = await getKubectlPath();
        let toolRunner = new ToolRunner(kubectlPath, ['config', 'use-context', context]);
        await toolRunner.exec();
        toolRunner = new ToolRunner(kubectlPath, ['config', 'current-context']);
        await toolRunner.exec();
    }
}

async function run() {
    let kubeconfig = getKubeconfig();
    const runnerTempDirectory = process.env['RUNNER_TEMP']; // Using process.env until the core libs are updated
    const kubeconfigPath = path.join(runnerTempDirectory, `kubeconfig_${Date.now()}`);
    core.debug(`Writing kubeconfig contents to ${kubeconfigPath}`);
    fs.writeFileSync(kubeconfigPath, kubeconfig);
    issueCommand('set-env', { name: 'KUBECONFIG' }, kubeconfigPath);
    console.log('KUBECONFIG environment variable is set');
    await setContext();
}

run().catch(core.setFailed);