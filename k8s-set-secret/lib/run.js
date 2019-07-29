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
const toolCache = require("@actions/tool-cache");
const core = require("@actions/core");
const toolrunner_1 = require("@actions/exec/lib/toolrunner");
const path = require("path");
const os = require("os");
const io = require("@actions/io");
let kubectlPath = "";
function checkAndSetKubectlPath() {
    return __awaiter(this, void 0, void 0, function* () {
        kubectlPath = yield io.which('kubectl', false);
        if (kubectlPath) {
            return;
        }
        const allVersions = toolCache.findAllVersions('kubectl');
        kubectlPath = allVersions.length > 0 ? toolCache.find('kubectl', allVersions[0]) : '';
        if (!kubectlPath) {
            throw new Error('Kubectl is not installed');
        }
        kubectlPath = path.join(kubectlPath, `kubectl${getExecutableExtension()}`);
    });
}
function getExecutableExtension() {
    if (os.type().match(/^Win/)) {
        return '.exe';
    }
    return '';
}
function createSecret() {
    return __awaiter(this, void 0, void 0, function* () {
        const typeOfSecret = core.getInput('secret-type', { required: true });
        const secretName = core.getInput('secret-name', { required: true });
        const namespace = core.getInput('namespace');
        yield deleteSecret(namespace, secretName);
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
        const toolRunner = new toolrunner_1.ToolRunner(kubectlPath, args);
        const code = yield toolRunner.exec();
        if (code != 0) {
            throw new Error('Secret create failed.');
        }
    });
}
function deleteSecret(namespace, secretName) {
    return __awaiter(this, void 0, void 0, function* () {
        let args = ['delete', 'secret', secretName];
        if (namespace) {
            args.push('-n', namespace);
        }
        const toolRunner = new toolrunner_1.ToolRunner(kubectlPath, args, { failOnStdErr: false, ignoreReturnCode: true, silent: true });
        yield toolRunner.exec();
        core.debug(`Deleting ${secretName} if already exist.`);
    });
}
function getDockerSecretArguments(secretName) {
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
function getGenericSecretArguments(secretName) {
    const secretArguments = core.getInput('arguments');
    let args = ['create', 'secret', 'generic', secretName];
    args.push(...toolrunner_1.argStringToArray(secretArguments));
    return args;
}
function checkClusterContext() {
    if (!process.env["KUBECONFIG"]) {
        throw new Error('Cluster context not set. Use k8ssetcontext action to set cluster context');
    }
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        checkClusterContext();
        yield checkAndSetKubectlPath();
        yield createSecret();
    });
}
run().catch(core.setFailed);
