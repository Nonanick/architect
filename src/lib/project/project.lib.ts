const packageNameInvalidCharacters = /[^A-z0-9_\-@\.\/]/g;

function convertPackageNameToFolderPath(identifier: string) {
  return identifier
    .replace(/[^A-z0-9\-\_\.\/\\]/g, "")
    .replace(/\.\.|\.\/|\.\\/g, "")
    .toLocaleLowerCase();
}

function validatePackageName(name: string): true | string {
  if (name.match(packageNameInvalidCharacters)) {
    return "Package name contains invalid character in identifier!";
  }
}

function sanitizePackageName(name: string) {
  return name.replace(/ /g, "-").replace(packageNameInvalidCharacters, "");
}

function convertPackageNameToTitle(name: string) {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/[@]/g, "")
    .replace(/\//g, "-")
    .split(/[\/\-_\.]/)
    .map((pieces) => pieces.charAt(0).toLocaleUpperCase() + pieces.substr(1))
    .join(" ");
}

export const ProjectModule = {
  convertPackageNameToFolderPath,
  validatePackageName,
  sanitizePackageName,
  convertPackageNameToTitle,
};
