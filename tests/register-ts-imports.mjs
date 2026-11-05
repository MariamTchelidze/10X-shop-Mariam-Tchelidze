import { registerHooks } from "node:module";

// Node-ის built-in TypeScript strip-ը იყენებს პროექტში გავრცელებულ extensionless import-ებსაც.
registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      const hasExtension = /\.[cm]?[jt]sx?$/.test(specifier);
      if (!(error instanceof Error) || !("code" in error) || error.code !== "ERR_MODULE_NOT_FOUND" || !specifier.startsWith(".") || hasExtension) {
        throw error;
      }
      return nextResolve(`${specifier}.ts`, context);
    }
  },
});
