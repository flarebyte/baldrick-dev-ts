import fs from "fs-extra";
import { PackageJson } from "./model";
import { paths } from "./path-helper";


export const readPackageJsonSync = (): PackageJson => {
    const appPackageJson: PackageJson = fs.readJSONSync(paths.appPackageJson);
    return appPackageJson;
}
