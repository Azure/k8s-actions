"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const utils_1 = require("./utils");
function getImagePullSecrets(inputObject) {
    if (!inputObject || !inputObject.spec) {
        return;
    }
    try {
        if (utils_1.isEqual(inputObject.kind, 'cronjob')) {
            return inputObject.spec.jobTemplate.spec.template.spec.imagePullSecrets;
        }
        else if (utils_1.isEqual(inputObject.kind, 'pod')) {
            return inputObject.spec.imagePullSecrets;
        }
        else if (!!inputObject.spec.template && !!inputObject.spec.template.spec) {
            return inputObject.spec.template.spec.imagePullSecrets;
        }
    }
    catch (ex) {
        core.debug(`Fetching imagePullSecrets failed due to this error: ${JSON.stringify(ex)}`);
        return;
    }
}
function setImagePullSecrets(inputObject, newImagePullSecrets) {
    if (!inputObject || !inputObject.spec || !newImagePullSecrets) {
        return;
    }
    try {
        if (utils_1.isEqual(inputObject.kind, 'pod')) {
            if (newImagePullSecrets.length > 0) {
                inputObject.spec.imagePullSecrets = newImagePullSecrets;
            }
            else {
                delete inputObject.spec.imagePullSecrets;
            }
        }
        else if (utils_1.isEqual(inputObject.kind, 'cronjob')) {
            if (newImagePullSecrets.length > 0) {
                inputObject.spec.jobTemplate.spec.template.spec.imagePullSecrets = newImagePullSecrets;
            }
            else {
                delete inputObject.spec.jobTemplate.spec.template.spec.imagePullSecrets;
            }
        }
        else if (!!inputObject.spec.template && !!inputObject.spec.template.spec) {
            if (newImagePullSecrets.length > 0) {
                inputObject.spec.template.spec.imagePullSecrets = newImagePullSecrets;
            }
            else {
                delete inputObject.spec.template.spec.imagePullSecrets;
            }
        }
    }
    catch (ex) {
        core.debug(`Overriding imagePullSecrets failed due to this error: ${JSON.stringify(ex)}`);
    }
}
function substituteImageNameInSpecFile(currentString, imageName, imageNameWithNewTag) {
    if (currentString.indexOf(imageName) < 0) {
        core.debug(`No occurence of replacement token: ${imageName} found`);
        return currentString;
    }
    return currentString.split('\n').reduce((acc, line) => {
        const imageKeyword = line.match(/^ *image:/);
        if (imageKeyword) {
            const [currentImageName, currentImageTag] = line
                .substring(imageKeyword[0].length) // consume the line from keyword onwards
                .trim()
                .replace(/[',"]/g, '') // replace allowed quotes with nothing
                .split(':');
            if (currentImageName === imageName) {
                return acc + `${imageKeyword[0]} ${imageNameWithNewTag}\n`;
            }
        }
        return acc + line + '\n';
    }, '');
}
function updateContainerImagesInManifestFiles(contents, containers) {
    if (!!containers && containers.length > 0) {
        containers.forEach((container) => {
            let imageName = container.split(':')[0];
            if (imageName.indexOf('@') > 0) {
                imageName = imageName.split('@')[0];
            }
            if (contents.indexOf(imageName) > 0) {
                contents = substituteImageNameInSpecFile(contents, imageName, container);
            }
        });
    }
    return contents;
}
exports.updateContainerImagesInManifestFiles = updateContainerImagesInManifestFiles;
function updateImagePullSecrets(inputObject, newImagePullSecrets) {
    if (!inputObject || !inputObject.spec || !newImagePullSecrets) {
        return;
    }
    let newImagePullSecretsObjects;
    if (newImagePullSecrets.length > 0) {
        newImagePullSecretsObjects = Array.from(newImagePullSecrets, x => { return !!x ? { 'name': x } : null; });
    }
    else {
        newImagePullSecretsObjects = [];
    }
    let existingImagePullSecretObjects = getImagePullSecrets(inputObject);
    if (!existingImagePullSecretObjects) {
        existingImagePullSecretObjects = new Array();
    }
    existingImagePullSecretObjects = existingImagePullSecretObjects.concat(newImagePullSecretsObjects);
    setImagePullSecrets(inputObject, existingImagePullSecretObjects);
}
exports.updateImagePullSecrets = updateImagePullSecrets;
const workloadTypes = ['deployment', 'replicaset', 'daemonset', 'pod', 'statefulset', 'job', 'cronjob'];
function isWorkloadEntity(kind) {
    if (!kind) {
        core.debug('ResourceKindNotDefined');
        return false;
    }
    return workloadTypes.some((type) => {
        return utils_1.isEqual(type, kind);
    });
}
exports.isWorkloadEntity = isWorkloadEntity;
