"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const command_1 = require("@actions/core/lib/command");
const path = require("path");
const fs = require("fs");
const io = require("@actions/io");
const toolCache = require("@actions/tool-cache");
const os = require("os");
const toolrunner_1 = require("@actions/exec/lib/toolrunner");
function getKubeconfig() {
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
function getExecutableExtension() {
    if (os.type().match(/^Win/)) {
        return '.exe';
    }
    return '';
}
function getKubectlPath() {
    return __awaiter(this, void 0, void 0, function* () {
        let kubectlPath = yield io.which('kubectl', false);
        if (!kubectlPath) {
            const allVersions = toolCache.findAllVersions('kubectl');
            kubectlPath = allVersions.length > 0 ? toolCache.find('kubectl', allVersions[0]) : '';
            if (!kubectlPath) {
                throw new Error('Kubectl is not installed');
            }
            kubectlPath = path.join(kubectlPath, `kubectl${getExecutableExtension()}`);
        }
        return kubectlPath;
    });
}
function setContext() {
    return __awaiter(this, void 0, void 0, function* () {
        let context = core.getInput('context');
        if (context) {
            const kubectlPath = yield getKubectlPath();
            let toolRunner = new toolrunner_1.ToolRunner(kubectlPath, ['config', 'use-context', context]);
            yield toolRunner.exec();
            toolRunner = new toolrunner_1.ToolRunner(kubectlPath, ['config', 'current-context']);
            yield toolRunner.exec();
        }
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let kubeconfig = getKubeconfig();
        const runnerTempDirectory = process.env['RUNNER_TEMP']; // Using process.env until the core libs are updated
        const kubeconfigPath = path.join(runnerTempDirectory, `kubeconfig_${Date.now()}`);
        core.debug(`Writing kubeconfig contents to ${kubeconfigPath}`);
        fs.writeFileSync(kubeconfigPath, kubeconfig);
        command_1.issueCommand('set-env', { name: 'KUBECONFIG' }, kubeconfigPath);
        console.log('KUBECONFIG environment variable is set');
        yield setContext();
    });
}
run().catch(core.setFailed);
