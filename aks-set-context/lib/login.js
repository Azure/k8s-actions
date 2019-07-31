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
const client_1 = require("./client");
const querystring = require("querystring");
function getAzureAccessToken() {
    let creds = core.getInput('creds', { required: true });
    let authorityUrl = core.getInput('active-directory-authority-url', { required: true });
    let credsObject;
    try {
        credsObject = JSON.parse(creds);
    }
    catch (ex) {
        throw new Error('Credentials object is not a valid JSON');
    }
    let servicePrincipalId = credsObject["appId"];
    let servicePrincipalKey = credsObject["password"];
    let tenantId = credsObject["tenant"];
    if (!servicePrincipalId || !servicePrincipalKey || !tenantId) {
        throw new Error("Not all values are present in the creds object. Ensure appId, password and tenant are supplied");
    }
    return new Promise((resolve, reject) => {
        let webRequest = new client_1.WebRequest();
        webRequest.method = "POST";
        webRequest.uri = `${authorityUrl}/${tenantId}/oauth2/token/`;
        webRequest.body = querystring.stringify({
            resource: 'https://management.azure.com',
            client_id: servicePrincipalId,
            grant_type: "client_credentials",
            client_secret: servicePrincipalKey
        });
        webRequest.headers = {
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        };
        let webRequestOptions = {
            retriableStatusCodes: [400, 408, 409, 500, 502, 503, 504],
        };
        client_1.sendRequest(webRequest, webRequestOptions).then((response) => {
            if (response.statusCode == 200) {
                resolve(response.body.access_token);
            }
            else if ([400, 401, 403].indexOf(response.statusCode) != -1) {
                reject('ExpiredServicePrincipal');
            }
            else {
                reject('CouldNotFetchAccessTokenforAzureStatusCode');
            }
        }, (error) => {
            reject(error);
        });
    });
}
function getAKSKubeconfig(azureSessionToken) {
    let subscriptionId = core.getInput('subscription-id', { required: true });
    let resourceGroupName = core.getInput('resource-group', { required: true });
    let clusterName = core.getInput('cluster-name', { required: true });
    let cloudEnvironmentUrl = core.getInput('cloud-environment-url', { required: true });
    return new Promise((resolve, reject) => {
        var webRequest = new client_1.WebRequest();
        webRequest.method = 'GET';
        webRequest.uri = `${cloudEnvironmentUrl}/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.ContainerService/managedClusters/${clusterName}/accessProfiles/clusterAdmin?api-version=2017-08-31`;
        webRequest.headers = {
            'Authorization': 'Bearer ' + azureSessionToken,
            'Content-Type': 'application/json; charset=utf-8'
        };
        client_1.sendRequest(webRequest).then((response) => {
            let accessProfile = response.body;
            var kubeconfig = Buffer.from(accessProfile.properties.kubeConfig, 'base64');
            resolve(kubeconfig.toString());
        }).catch(reject);
    });
}
function getKubeconfig() {
    return __awaiter(this, void 0, void 0, function* () {
        let azureSessionToken = yield getAzureAccessToken();
        let kubeconfig = yield getAKSKubeconfig(azureSessionToken);
        return kubeconfig;
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let kubeconfig = yield getKubeconfig();
        const runnerTempDirectory = process.env['RUNNER_TEMP']; // Using process.env until the core libs are updated
        const kubeconfigPath = path.join(runnerTempDirectory, `kubeconfig_${Date.now()}`);
        core.debug(`Writing kubeconfig contents to ${kubeconfigPath}`);
        fs.writeFileSync(kubeconfigPath, kubeconfig);
        command_1.issueCommand('set-env', { name: 'KUBECONFIG' }, kubeconfigPath);
        console.log('KUBECONFIG environment variable is set');
    });
}
run().catch(core.setFailed);
