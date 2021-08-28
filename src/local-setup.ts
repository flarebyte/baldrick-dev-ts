import { LocalSetup } from "./model";

export const readLocalSetup = (): LocalSetup => {
    const localSetup: LocalSetup = {
        rootFileNames: [],
        packageJson: {
            name: ''
        }
    }
    return localSetup;
}