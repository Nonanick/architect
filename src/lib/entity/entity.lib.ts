const packageNameInvalidCharacters = /[^A-z0-9_\.]/g;

export default {
  SanitizeEntityName(name: string) {
    return name.replace(/[ -]/g, "_").replace(packageNameInvalidCharacters, "");
  },
  ConvertEntityNameToTitle(name: string) {
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/[@]/g, "")
      .replace(/\//g, "-")
      .split(/[\/\-_\.]/)
      .map((pieces) => pieces.charAt(0).toLocaleUpperCase() + pieces.substr(1))
      .join(" ");
  }
};