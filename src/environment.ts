// biome-ignore lint/complexity/useLiteralKeys: Node types require bracket access when noPropertyAccessFromIndexSignature is enabled
export const isCI = (): boolean => process.env["CI"] === "true";
