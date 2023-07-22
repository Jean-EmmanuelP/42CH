"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/auth/[...nextauth]";
exports.ids = ["pages/api/auth/[...nextauth]"];
exports.modules = {

/***/ "@next-auth/prisma-adapter":
/*!********************************************!*\
  !*** external "@next-auth/prisma-adapter" ***!
  \********************************************/
/***/ ((module) => {

module.exports = require("@next-auth/prisma-adapter");

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "next-auth":
/*!****************************!*\
  !*** external "next-auth" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("next-auth");

/***/ }),

/***/ "next-auth/providers/42-school":
/*!************************************************!*\
  !*** external "next-auth/providers/42-school" ***!
  \************************************************/
/***/ ((module) => {

module.exports = require("next-auth/providers/42-school");

/***/ }),

/***/ "next-auth/providers/google":
/*!*********************************************!*\
  !*** external "next-auth/providers/google" ***!
  \*********************************************/
/***/ ((module) => {

module.exports = require("next-auth/providers/google");

/***/ }),

/***/ "@t3-oss/env-nextjs":
/*!*************************************!*\
  !*** external "@t3-oss/env-nextjs" ***!
  \*************************************/
/***/ ((module) => {

module.exports = import("@t3-oss/env-nextjs");;

/***/ }),

/***/ "zod":
/*!**********************!*\
  !*** external "zod" ***!
  \**********************/
/***/ ((module) => {

module.exports = import("zod");;

/***/ }),

/***/ "(api)/./src/pages/api/auth/[...nextauth].ts":
/*!*********************************************!*\
  !*** ./src/pages/api/auth/[...nextauth].ts ***!
  \*********************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"next-auth\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _server_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ~/server/auth */ \"(api)/./src/server/auth.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_server_auth__WEBPACK_IMPORTED_MODULE_1__]);\n_server_auth__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (next_auth__WEBPACK_IMPORTED_MODULE_0___default()(_server_auth__WEBPACK_IMPORTED_MODULE_1__.authOptions));\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWlDO0FBQ1c7QUFFNUMsaUVBQWVBLGdEQUFRQSxDQUFDQyxxREFBV0EsQ0FBQ0EsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2ZvcnR5X3R3b19iZXQvLi9zcmMvcGFnZXMvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS50cz81MGExIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBOZXh0QXV0aCBmcm9tIFwibmV4dC1hdXRoXCI7XG5pbXBvcnQgeyBhdXRoT3B0aW9ucyB9IGZyb20gXCJ+L3NlcnZlci9hdXRoXCI7XG5cbmV4cG9ydCBkZWZhdWx0IE5leHRBdXRoKGF1dGhPcHRpb25zKTtcbiJdLCJuYW1lcyI6WyJOZXh0QXV0aCIsImF1dGhPcHRpb25zIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/auth/[...nextauth].ts\n");

/***/ }),

/***/ "(api)/./src/server/auth.ts":
/*!****************************!*\
  !*** ./src/server/auth.ts ***!
  \****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions),\n/* harmony export */   getServerAuthSession: () => (/* binding */ getServerAuthSession)\n/* harmony export */ });\n/* harmony import */ var _next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @next-auth/prisma-adapter */ \"@next-auth/prisma-adapter\");\n/* harmony import */ var _next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth */ \"next-auth\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_auth_providers_google__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-auth/providers/google */ \"next-auth/providers/google\");\n/* harmony import */ var next_auth_providers_google__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_auth_providers_google__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_auth_providers_42_school__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next-auth/providers/42-school */ \"next-auth/providers/42-school\");\n/* harmony import */ var next_auth_providers_42_school__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_auth_providers_42_school__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _env_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ~/env.mjs */ \"(api)/./src/env.mjs\");\n/* harmony import */ var _server_db__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ~/server/db */ \"(api)/./src/server/db.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_env_mjs__WEBPACK_IMPORTED_MODULE_4__, _server_db__WEBPACK_IMPORTED_MODULE_5__]);\n([_env_mjs__WEBPACK_IMPORTED_MODULE_4__, _server_db__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\n/**\n * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.\n *\n * @see https://next-auth.js.org/configuration/options\n */ const authOptions = {\n    callbacks: {\n        session: ({ session, user })=>({\n                ...session,\n                user: {\n                    ...session.user,\n                    id: user.id\n                }\n            })\n    },\n    adapter: (0,_next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_0__.PrismaAdapter)(_server_db__WEBPACK_IMPORTED_MODULE_5__.prisma),\n    providers: [\n        next_auth_providers_google__WEBPACK_IMPORTED_MODULE_2___default()({\n            clientId: _env_mjs__WEBPACK_IMPORTED_MODULE_4__.env.GOOGLE_CLIENT_ID,\n            clientSecret: _env_mjs__WEBPACK_IMPORTED_MODULE_4__.env.GOOGLE_CLIENT_SECRET\n        }),\n        next_auth_providers_42_school__WEBPACK_IMPORTED_MODULE_3___default()({\n            clientId: process.env.FORTY_TWO_CLIENT_ID,\n            clientSecret: process.env.FORTY_TWO_CLIENT_SECRET\n        })\n    ],\n    theme: {\n        colorScheme: \"dark\",\n        logo: \"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/1200px-42_Logo.svg.png\"\n    }\n};\n/**\n * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.\n *\n * @see https://next-auth.js.org/configuration/nextjs\n */ const getServerAuthSession = (ctx)=>{\n    return (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(ctx.req, ctx.res, authOptions);\n};\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvc2VydmVyL2F1dGgudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQTBEO0FBTXZDO0FBQ3FDO0FBQ0s7QUFDN0I7QUFDSztBQXVCckM7Ozs7Q0FJQyxHQUNNLE1BQU1NLGNBQStCO0lBQzFDQyxXQUFXO1FBQ1RDLFNBQVMsQ0FBQyxFQUFFQSxPQUFPLEVBQUVDLElBQUksRUFBRSxHQUFNO2dCQUMvQixHQUFHRCxPQUFPO2dCQUNWQyxNQUFNO29CQUNKLEdBQUdELFFBQVFDLElBQUk7b0JBQ2ZDLElBQUlELEtBQUtDLEVBQUU7Z0JBQ2I7WUFDRjtJQUNGO0lBQ0FDLFNBQVNYLHdFQUFhQSxDQUFDSyw4Q0FBTUE7SUFDN0JPLFdBQVc7UUFDVFYsaUVBQWNBLENBQUM7WUFDYlcsVUFBVVQseUNBQUdBLENBQUNVLGdCQUFnQjtZQUM5QkMsY0FBY1gseUNBQUdBLENBQUNZLG9CQUFvQjtRQUN4QztRQUNBYixvRUFBZ0JBLENBQUM7WUFDZlUsVUFBVUksUUFBUWIsR0FBRyxDQUFDYyxtQkFBbUI7WUFDekNILGNBQWNFLFFBQVFiLEdBQUcsQ0FBQ2UsdUJBQXVCO1FBQ25EO0tBQ0Q7SUFDREMsT0FBTztRQUNMQyxhQUFhO1FBQ2JDLE1BQU07SUFDUjtBQUNGLEVBQUU7QUFFRjs7OztDQUlDLEdBQ00sTUFBTUMsdUJBQXVCLENBQUNDO0lBSW5DLE9BQU92QiwyREFBZ0JBLENBQUN1QixJQUFJQyxHQUFHLEVBQUVELElBQUlFLEdBQUcsRUFBRXBCO0FBQzVDLEVBQUUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mb3J0eV90d29fYmV0Ly4vc3JjL3NlcnZlci9hdXRoLnRzPzIyYmIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJpc21hQWRhcHRlciB9IGZyb20gXCJAbmV4dC1hdXRoL3ByaXNtYS1hZGFwdGVyXCI7XG5pbXBvcnQgeyB0eXBlIEdldFNlcnZlclNpZGVQcm9wc0NvbnRleHQgfSBmcm9tIFwibmV4dFwiO1xuaW1wb3J0IHtcbiAgZ2V0U2VydmVyU2Vzc2lvbixcbiAgdHlwZSBOZXh0QXV0aE9wdGlvbnMsXG4gIHR5cGUgRGVmYXVsdFNlc3Npb24sXG59IGZyb20gXCJuZXh0LWF1dGhcIjtcbmltcG9ydCBHb29nbGVQcm92aWRlciBmcm9tIFwibmV4dC1hdXRoL3Byb3ZpZGVycy9nb29nbGVcIjtcbmltcG9ydCBGb3J0eVR3b1Byb3ZpZGVyIGZyb20gXCJuZXh0LWF1dGgvcHJvdmlkZXJzLzQyLXNjaG9vbFwiO1xuaW1wb3J0IHsgZW52IH0gZnJvbSBcIn4vZW52Lm1qc1wiO1xuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSBcIn4vc2VydmVyL2RiXCI7XG5cbi8qKlxuICogTW9kdWxlIGF1Z21lbnRhdGlvbiBmb3IgYG5leHQtYXV0aGAgdHlwZXMuIEFsbG93cyB1cyB0byBhZGQgY3VzdG9tIHByb3BlcnRpZXMgdG8gdGhlIGBzZXNzaW9uYFxuICogb2JqZWN0IGFuZCBrZWVwIHR5cGUgc2FmZXR5LlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9uZXh0LWF1dGguanMub3JnL2dldHRpbmctc3RhcnRlZC90eXBlc2NyaXB0I21vZHVsZS1hdWdtZW50YXRpb25cbiAqL1xuZGVjbGFyZSBtb2R1bGUgXCJuZXh0LWF1dGhcIiB7XG4gIGludGVyZmFjZSBTZXNzaW9uIGV4dGVuZHMgRGVmYXVsdFNlc3Npb24ge1xuICAgIHVzZXI6IHtcbiAgICAgIGlkOiBzdHJpbmc7XG4gICAgICAvLyAuLi5vdGhlciBwcm9wZXJ0aWVzXG4gICAgICAvLyByb2xlOiBVc2VyUm9sZTtcbiAgICB9ICYgRGVmYXVsdFNlc3Npb25bXCJ1c2VyXCJdO1xuICB9XG5cbiAgLy8gaW50ZXJmYWNlIFVzZXIge1xuICAvLyAgIC8vIC4uLm90aGVyIHByb3BlcnRpZXNcbiAgLy8gICAvLyByb2xlOiBVc2VyUm9sZTtcbiAgLy8gfVxufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIE5leHRBdXRoLmpzIHVzZWQgdG8gY29uZmlndXJlIGFkYXB0ZXJzLCBwcm92aWRlcnMsIGNhbGxiYWNrcywgZXRjLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9uZXh0LWF1dGguanMub3JnL2NvbmZpZ3VyYXRpb24vb3B0aW9uc1xuICovXG5leHBvcnQgY29uc3QgYXV0aE9wdGlvbnM6IE5leHRBdXRoT3B0aW9ucyA9IHtcbiAgY2FsbGJhY2tzOiB7XG4gICAgc2Vzc2lvbjogKHsgc2Vzc2lvbiwgdXNlciB9KSA9PiAoe1xuICAgICAgLi4uc2Vzc2lvbixcbiAgICAgIHVzZXI6IHtcbiAgICAgICAgLi4uc2Vzc2lvbi51c2VyLFxuICAgICAgICBpZDogdXNlci5pZCxcbiAgICAgIH0sXG4gICAgfSksXG4gIH0sXG4gIGFkYXB0ZXI6IFByaXNtYUFkYXB0ZXIocHJpc21hKSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgR29vZ2xlUHJvdmlkZXIoe1xuICAgICAgY2xpZW50SWQ6IGVudi5HT09HTEVfQ0xJRU5UX0lELFxuICAgICAgY2xpZW50U2VjcmV0OiBlbnYuR09PR0xFX0NMSUVOVF9TRUNSRVQsXG4gICAgfSksXG4gICAgRm9ydHlUd29Qcm92aWRlcih7XG4gICAgICBjbGllbnRJZDogcHJvY2Vzcy5lbnYuRk9SVFlfVFdPX0NMSUVOVF9JRCBhcyBzdHJpbmcsXG4gICAgICBjbGllbnRTZWNyZXQ6IHByb2Nlc3MuZW52LkZPUlRZX1RXT19DTElFTlRfU0VDUkVUIGFzIHN0cmluZ1xuICAgIH0pXG4gIF0sXG4gIHRoZW1lOiB7XG4gICAgY29sb3JTY2hlbWU6IFwiZGFya1wiLFxuICAgIGxvZ286IFwiaHR0cHM6Ly91cGxvYWQud2lraW1lZGlhLm9yZy93aWtpcGVkaWEvY29tbW9ucy90aHVtYi84LzhkLzQyX0xvZ28uc3ZnLzEyMDBweC00Ml9Mb2dvLnN2Zy5wbmdcIlxuICB9XG59O1xuXG4vKipcbiAqIFdyYXBwZXIgZm9yIGBnZXRTZXJ2ZXJTZXNzaW9uYCBzbyB0aGF0IHlvdSBkb24ndCBuZWVkIHRvIGltcG9ydCB0aGUgYGF1dGhPcHRpb25zYCBpbiBldmVyeSBmaWxlLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9uZXh0LWF1dGguanMub3JnL2NvbmZpZ3VyYXRpb24vbmV4dGpzXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRTZXJ2ZXJBdXRoU2Vzc2lvbiA9IChjdHg6IHtcbiAgcmVxOiBHZXRTZXJ2ZXJTaWRlUHJvcHNDb250ZXh0W1wicmVxXCJdO1xuICByZXM6IEdldFNlcnZlclNpZGVQcm9wc0NvbnRleHRbXCJyZXNcIl07XG59KSA9PiB7XG4gIHJldHVybiBnZXRTZXJ2ZXJTZXNzaW9uKGN0eC5yZXEsIGN0eC5yZXMsIGF1dGhPcHRpb25zKTtcbn07XG4iXSwibmFtZXMiOlsiUHJpc21hQWRhcHRlciIsImdldFNlcnZlclNlc3Npb24iLCJHb29nbGVQcm92aWRlciIsIkZvcnR5VHdvUHJvdmlkZXIiLCJlbnYiLCJwcmlzbWEiLCJhdXRoT3B0aW9ucyIsImNhbGxiYWNrcyIsInNlc3Npb24iLCJ1c2VyIiwiaWQiLCJhZGFwdGVyIiwicHJvdmlkZXJzIiwiY2xpZW50SWQiLCJHT09HTEVfQ0xJRU5UX0lEIiwiY2xpZW50U2VjcmV0IiwiR09PR0xFX0NMSUVOVF9TRUNSRVQiLCJwcm9jZXNzIiwiRk9SVFlfVFdPX0NMSUVOVF9JRCIsIkZPUlRZX1RXT19DTElFTlRfU0VDUkVUIiwidGhlbWUiLCJjb2xvclNjaGVtZSIsImxvZ28iLCJnZXRTZXJ2ZXJBdXRoU2Vzc2lvbiIsImN0eCIsInJlcSIsInJlcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./src/server/auth.ts\n");

/***/ }),

/***/ "(api)/./src/server/db.ts":
/*!**************************!*\
  !*** ./src/server/db.ts ***!
  \**************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _env_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ~/env.mjs */ \"(api)/./src/env.mjs\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_env_mjs__WEBPACK_IMPORTED_MODULE_1__]);\n_env_mjs__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log: _env_mjs__WEBPACK_IMPORTED_MODULE_1__.env.NODE_ENV === \"development\" ? [\n        \"query\",\n        \"error\",\n        \"warn\"\n    ] : [\n        \"error\"\n    ]\n});\nif (_env_mjs__WEBPACK_IMPORTED_MODULE_1__.env.NODE_ENV !== \"production\") globalForPrisma.prisma = prisma;\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvc2VydmVyL2RiLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBOEM7QUFDZDtBQUVoQyxNQUFNRSxrQkFBa0JDO0FBSWpCLE1BQU1DLFNBQ1hGLGdCQUFnQkUsTUFBTSxJQUN0QixJQUFJSix3REFBWUEsQ0FBQztJQUNmSyxLQUNFSix5Q0FBR0EsQ0FBQ0ssUUFBUSxLQUFLLGdCQUFnQjtRQUFDO1FBQVM7UUFBUztLQUFPLEdBQUc7UUFBQztLQUFRO0FBQzNFLEdBQUc7QUFFTCxJQUFJTCx5Q0FBR0EsQ0FBQ0ssUUFBUSxLQUFLLGNBQWNKLGdCQUFnQkUsTUFBTSxHQUFHQSIsInNvdXJjZXMiOlsid2VicGFjazovL2ZvcnR5X3R3b19iZXQvLi9zcmMvc2VydmVyL2RiLnRzP2FhNmYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSBcIkBwcmlzbWEvY2xpZW50XCI7XG5pbXBvcnQgeyBlbnYgfSBmcm9tIFwifi9lbnYubWpzXCI7XG5cbmNvbnN0IGdsb2JhbEZvclByaXNtYSA9IGdsb2JhbFRoaXMgYXMgdW5rbm93biBhcyB7XG4gIHByaXNtYTogUHJpc21hQ2xpZW50IHwgdW5kZWZpbmVkO1xufTtcblxuZXhwb3J0IGNvbnN0IHByaXNtYSA9XG4gIGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPz9cbiAgbmV3IFByaXNtYUNsaWVudCh7XG4gICAgbG9nOlxuICAgICAgZW52Lk5PREVfRU5WID09PSBcImRldmVsb3BtZW50XCIgPyBbXCJxdWVyeVwiLCBcImVycm9yXCIsIFwid2FyblwiXSA6IFtcImVycm9yXCJdLFxuICB9KTtcblxuaWYgKGVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPSBwcmlzbWE7XG4iXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwiZW52IiwiZ2xvYmFsRm9yUHJpc21hIiwiZ2xvYmFsVGhpcyIsInByaXNtYSIsImxvZyIsIk5PREVfRU5WIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./src/server/db.ts\n");

/***/ }),

/***/ "(api)/./src/env.mjs":
/*!*********************!*\
  !*** ./src/env.mjs ***!
  \*********************/
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   env: () => (/* binding */ env)\n/* harmony export */ });\n/* harmony import */ var _t3_oss_env_nextjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @t3-oss/env-nextjs */ \"@t3-oss/env-nextjs\");\n/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! zod */ \"zod\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_t3_oss_env_nextjs__WEBPACK_IMPORTED_MODULE_0__, zod__WEBPACK_IMPORTED_MODULE_1__]);\n([_t3_oss_env_nextjs__WEBPACK_IMPORTED_MODULE_0__, zod__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\nconst env = (0,_t3_oss_env_nextjs__WEBPACK_IMPORTED_MODULE_0__.createEnv)({\n    /**\n   * Specify your server-side environment variables schema here. This way you can ensure the app\n   * isn't built with invalid env vars.\n   */ server: {\n        DATABASE_URL: zod__WEBPACK_IMPORTED_MODULE_1__.z.string().url(),\n        NODE_ENV: zod__WEBPACK_IMPORTED_MODULE_1__.z.enum([\n            \"development\",\n            \"test\",\n            \"production\"\n        ]),\n        NEXTAUTH_SECRET:  false ? 0 : zod__WEBPACK_IMPORTED_MODULE_1__.z.string().min(1).optional(),\n        NEXTAUTH_URL: zod__WEBPACK_IMPORTED_MODULE_1__.z.preprocess(// This makes Vercel deployments not fail if you don't set NEXTAUTH_URL\n        // Since NextAuth.js automatically uses the VERCEL_URL if present.\n        (str)=>process.env.VERCEL_URL ?? str, // VERCEL_URL doesn't include `https` so it cant be validated as a URL\n        process.env.VERCEL ? zod__WEBPACK_IMPORTED_MODULE_1__.z.string().min(1) : zod__WEBPACK_IMPORTED_MODULE_1__.z.string().url()),\n        // Add `.min(1) on ID and SECRET if you want to make sure they're not empty\n        GOOGLE_CLIENT_ID: zod__WEBPACK_IMPORTED_MODULE_1__.z.string(),\n        GOOGLE_CLIENT_SECRET: zod__WEBPACK_IMPORTED_MODULE_1__.z.string()\n    },\n    /**\n   * Specify your client-side environment variables schema here. This way you can ensure the app\n   * isn't built with invalid env vars. To expose them to the client, prefix them with\n   * `NEXT_PUBLIC_`.\n   */ client: {\n    },\n    /**\n   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.\n   * middlewares) or client-side so we need to destruct manually.\n   */ runtimeEnv: {\n        DATABASE_URL: process.env.DATABASE_URL,\n        NODE_ENV: \"development\",\n        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,\n        NEXTAUTH_URL: process.env.NEXTAUTH_URL,\n        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,\n        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET\n    },\n    /**\n   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.\n   * This is especially useful for Docker builds.\n   */ skipValidation: !!process.env.SKIP_ENV_VALIDATION\n});\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvZW52Lm1qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBK0M7QUFDdkI7QUFFakIsTUFBTUUsTUFBTUYsNkRBQVNBLENBQUM7SUFDM0I7OztHQUdDLEdBQ0RHLFFBQVE7UUFDTkMsY0FBY0gsa0NBQUNBLENBQUNJLE1BQU0sR0FBR0MsR0FBRztRQUM1QkMsVUFBVU4sa0NBQUNBLENBQUNPLElBQUksQ0FBQztZQUFDO1lBQWU7WUFBUTtTQUFhO1FBQ3REQyxpQkFDRUMsTUFBcUMsR0FDakNULENBQWlCLEdBQ2pCQSxrQ0FBQ0EsQ0FBQ0ksTUFBTSxHQUFHTSxHQUFHLENBQUMsR0FBR0MsUUFBUTtRQUNoQ0MsY0FBY1osa0NBQUNBLENBQUNhLFVBQVUsQ0FDeEIsdUVBQXVFO1FBQ3ZFLGtFQUFrRTtRQUNsRSxDQUFDQyxNQUFRTCxRQUFRUixHQUFHLENBQUNjLFVBQVUsSUFBSUQsS0FDbkMsc0VBQXNFO1FBQ3RFTCxRQUFRUixHQUFHLENBQUNlLE1BQU0sR0FBR2hCLGtDQUFDQSxDQUFDSSxNQUFNLEdBQUdNLEdBQUcsQ0FBQyxLQUFLVixrQ0FBQ0EsQ0FBQ0ksTUFBTSxHQUFHQyxHQUFHO1FBRXpELDJFQUEyRTtRQUMzRVksa0JBQWtCakIsa0NBQUNBLENBQUNJLE1BQU07UUFDMUJjLHNCQUFzQmxCLGtDQUFDQSxDQUFDSSxNQUFNO0lBQ2hDO0lBRUE7Ozs7R0FJQyxHQUNEZSxRQUFRO0lBRVI7SUFFQTs7O0dBR0MsR0FDREMsWUFBWTtRQUNWakIsY0FBY00sUUFBUVIsR0FBRyxDQUFDRSxZQUFZO1FBQ3RDRyxVQTFDSjtRQTJDSUUsaUJBQWlCQyxRQUFRUixHQUFHLENBQUNPLGVBQWU7UUFDNUNJLGNBQWNILFFBQVFSLEdBQUcsQ0FBQ1csWUFBWTtRQUN0Q0ssa0JBQWtCUixRQUFRUixHQUFHLENBQUNnQixnQkFBZ0I7UUFDOUNDLHNCQUFzQlQsUUFBUVIsR0FBRyxDQUFDaUIsb0JBQW9CO0lBQ3hEO0lBQ0E7OztHQUdDLEdBQ0RHLGdCQUFnQixDQUFDLENBQUNaLFFBQVFSLEdBQUcsQ0FBQ3FCLG1CQUFtQjtBQUNuRCxHQUFHIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZm9ydHlfdHdvX2JldC8uL3NyYy9lbnYubWpzP2MzYjkiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlRW52IH0gZnJvbSBcIkB0My1vc3MvZW52LW5leHRqc1wiO1xuaW1wb3J0IHsgeiB9IGZyb20gXCJ6b2RcIjtcblxuZXhwb3J0IGNvbnN0IGVudiA9IGNyZWF0ZUVudih7XG4gIC8qKlxuICAgKiBTcGVjaWZ5IHlvdXIgc2VydmVyLXNpZGUgZW52aXJvbm1lbnQgdmFyaWFibGVzIHNjaGVtYSBoZXJlLiBUaGlzIHdheSB5b3UgY2FuIGVuc3VyZSB0aGUgYXBwXG4gICAqIGlzbid0IGJ1aWx0IHdpdGggaW52YWxpZCBlbnYgdmFycy5cbiAgICovXG4gIHNlcnZlcjoge1xuICAgIERBVEFCQVNFX1VSTDogei5zdHJpbmcoKS51cmwoKSxcbiAgICBOT0RFX0VOVjogei5lbnVtKFtcImRldmVsb3BtZW50XCIsIFwidGVzdFwiLCBcInByb2R1Y3Rpb25cIl0pLFxuICAgIE5FWFRBVVRIX1NFQ1JFVDpcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIlxuICAgICAgICA/IHouc3RyaW5nKCkubWluKDEpXG4gICAgICAgIDogei5zdHJpbmcoKS5taW4oMSkub3B0aW9uYWwoKSxcbiAgICBORVhUQVVUSF9VUkw6IHoucHJlcHJvY2VzcyhcbiAgICAgIC8vIFRoaXMgbWFrZXMgVmVyY2VsIGRlcGxveW1lbnRzIG5vdCBmYWlsIGlmIHlvdSBkb24ndCBzZXQgTkVYVEFVVEhfVVJMXG4gICAgICAvLyBTaW5jZSBOZXh0QXV0aC5qcyBhdXRvbWF0aWNhbGx5IHVzZXMgdGhlIFZFUkNFTF9VUkwgaWYgcHJlc2VudC5cbiAgICAgIChzdHIpID0+IHByb2Nlc3MuZW52LlZFUkNFTF9VUkwgPz8gc3RyLFxuICAgICAgLy8gVkVSQ0VMX1VSTCBkb2Vzbid0IGluY2x1ZGUgYGh0dHBzYCBzbyBpdCBjYW50IGJlIHZhbGlkYXRlZCBhcyBhIFVSTFxuICAgICAgcHJvY2Vzcy5lbnYuVkVSQ0VMID8gei5zdHJpbmcoKS5taW4oMSkgOiB6LnN0cmluZygpLnVybCgpXG4gICAgKSxcbiAgICAvLyBBZGQgYC5taW4oMSkgb24gSUQgYW5kIFNFQ1JFVCBpZiB5b3Ugd2FudCB0byBtYWtlIHN1cmUgdGhleSdyZSBub3QgZW1wdHlcbiAgICBHT09HTEVfQ0xJRU5UX0lEOiB6LnN0cmluZygpLFxuICAgIEdPT0dMRV9DTElFTlRfU0VDUkVUOiB6LnN0cmluZygpLFxuICB9LFxuXG4gIC8qKlxuICAgKiBTcGVjaWZ5IHlvdXIgY2xpZW50LXNpZGUgZW52aXJvbm1lbnQgdmFyaWFibGVzIHNjaGVtYSBoZXJlLiBUaGlzIHdheSB5b3UgY2FuIGVuc3VyZSB0aGUgYXBwXG4gICAqIGlzbid0IGJ1aWx0IHdpdGggaW52YWxpZCBlbnYgdmFycy4gVG8gZXhwb3NlIHRoZW0gdG8gdGhlIGNsaWVudCwgcHJlZml4IHRoZW0gd2l0aFxuICAgKiBgTkVYVF9QVUJMSUNfYC5cbiAgICovXG4gIGNsaWVudDoge1xuICAgIC8vIE5FWFRfUFVCTElDX0NMSUVOVFZBUjogei5zdHJpbmcoKS5taW4oMSksXG4gIH0sXG5cbiAgLyoqXG4gICAqIFlvdSBjYW4ndCBkZXN0cnVjdCBgcHJvY2Vzcy5lbnZgIGFzIGEgcmVndWxhciBvYmplY3QgaW4gdGhlIE5leHQuanMgZWRnZSBydW50aW1lcyAoZS5nLlxuICAgKiBtaWRkbGV3YXJlcykgb3IgY2xpZW50LXNpZGUgc28gd2UgbmVlZCB0byBkZXN0cnVjdCBtYW51YWxseS5cbiAgICovXG4gIHJ1bnRpbWVFbnY6IHtcbiAgICBEQVRBQkFTRV9VUkw6IHByb2Nlc3MuZW52LkRBVEFCQVNFX1VSTCxcbiAgICBOT0RFX0VOVjogcHJvY2Vzcy5lbnYuTk9ERV9FTlYsXG4gICAgTkVYVEFVVEhfU0VDUkVUOiBwcm9jZXNzLmVudi5ORVhUQVVUSF9TRUNSRVQsXG4gICAgTkVYVEFVVEhfVVJMOiBwcm9jZXNzLmVudi5ORVhUQVVUSF9VUkwsXG4gICAgR09PR0xFX0NMSUVOVF9JRDogcHJvY2Vzcy5lbnYuR09PR0xFX0NMSUVOVF9JRCxcbiAgICBHT09HTEVfQ0xJRU5UX1NFQ1JFVDogcHJvY2Vzcy5lbnYuR09PR0xFX0NMSUVOVF9TRUNSRVQsXG4gIH0sXG4gIC8qKlxuICAgKiBSdW4gYGJ1aWxkYCBvciBgZGV2YCB3aXRoIGBTS0lQX0VOVl9WQUxJREFUSU9OYCB0byBza2lwIGVudiB2YWxpZGF0aW9uLlxuICAgKiBUaGlzIGlzIGVzcGVjaWFsbHkgdXNlZnVsIGZvciBEb2NrZXIgYnVpbGRzLlxuICAgKi9cbiAgc2tpcFZhbGlkYXRpb246ICEhcHJvY2Vzcy5lbnYuU0tJUF9FTlZfVkFMSURBVElPTixcbn0pO1xuIl0sIm5hbWVzIjpbImNyZWF0ZUVudiIsInoiLCJlbnYiLCJzZXJ2ZXIiLCJEQVRBQkFTRV9VUkwiLCJzdHJpbmciLCJ1cmwiLCJOT0RFX0VOViIsImVudW0iLCJORVhUQVVUSF9TRUNSRVQiLCJwcm9jZXNzIiwibWluIiwib3B0aW9uYWwiLCJORVhUQVVUSF9VUkwiLCJwcmVwcm9jZXNzIiwic3RyIiwiVkVSQ0VMX1VSTCIsIlZFUkNFTCIsIkdPT0dMRV9DTElFTlRfSUQiLCJHT09HTEVfQ0xJRU5UX1NFQ1JFVCIsImNsaWVudCIsInJ1bnRpbWVFbnYiLCJza2lwVmFsaWRhdGlvbiIsIlNLSVBfRU5WX1ZBTElEQVRJT04iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./src/env.mjs\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./src/pages/api/auth/[...nextauth].ts"));
module.exports = __webpack_exports__;

})();