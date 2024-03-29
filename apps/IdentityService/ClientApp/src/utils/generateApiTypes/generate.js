/* eslint-disable */

/**
 * this file is not written in typescript
 * because ts-node dependency breaks the IdentityService.Admin
 * build
 */
const path = require("path");
const { generateApi } = require("swagger-typescript-api");

generateApi({
  name: "IdentityService.type.ts",
  url: "https://localhost:2001/swagger/v1/swagger.json",
  templates: path.resolve(__dirname, "./templates"),
  output: path.resolve(__dirname, "../../api/types/IdentityService"),
  generateClient: false,
  generateResponses: true,
  generateRouteTypes: true,
  disableStrictSSL: true,
});
