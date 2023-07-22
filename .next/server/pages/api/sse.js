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
exports.id = "pages/api/sse";
exports.ids = ["pages/api/sse"];
exports.modules = {

/***/ "(api)/./src/pages/api/sse.ts":
/*!******************************!*\
  !*** ./src/pages/api/sse.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   connections: () => (/* binding */ connections),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nlet connections = {};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((req, res)=>{\n    const userId = Array.isArray(req.query.userId) ? req.query.userId[0] : req.query.userId;\n    if (!userId) {\n        res.status(400).send(\"User ID is missing\");\n        return;\n    }\n    res.setHeader(\"Cache-Control\", \"no-cache\");\n    res.setHeader(\"Content-Type\", \"text/event-stream\");\n    res.setHeader(\"Connection\", \"keep-alive\");\n    res.setHeader(\"Access-Control-Allow-Origin\", \"*\");\n    res.flushHeaders();\n    connections[userId] = res;\n    req.on(\"close\", ()=>{\n        delete connections[userId];\n    });\n});\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL3NzZS50cyIsIm1hcHBpbmdzIjoiOzs7OztBQUVBLElBQUlBLGNBQStDLENBQUM7QUFDcEQsaUVBQWUsQ0FBQ0MsS0FBcUJDO0lBQ25DLE1BQU1DLFNBQVNDLE1BQU1DLE9BQU8sQ0FBQ0osSUFBSUssS0FBSyxDQUFDSCxNQUFNLElBQ3pDRixJQUFJSyxLQUFLLENBQUNILE1BQU0sQ0FBQyxFQUFFLEdBQ25CRixJQUFJSyxLQUFLLENBQUNILE1BQU07SUFFcEIsSUFBSSxDQUFDQSxRQUFRO1FBQ1hELElBQUlLLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7UUFDckI7SUFDRjtJQUVBTixJQUFJTyxTQUFTLENBQUMsaUJBQWlCO0lBQy9CUCxJQUFJTyxTQUFTLENBQUMsZ0JBQWdCO0lBQzlCUCxJQUFJTyxTQUFTLENBQUMsY0FBYztJQUM1QlAsSUFBSU8sU0FBUyxDQUFDLCtCQUErQjtJQUM3Q1AsSUFBSVEsWUFBWTtJQUNoQlYsV0FBVyxDQUFDRyxPQUFPLEdBQUdEO0lBRXRCRCxJQUFJVSxFQUFFLENBQUMsU0FBUztRQUNkLE9BQU9YLFdBQVcsQ0FBQ0csT0FBTztJQUM1QjtBQUNGLEdBQUU7QUFFcUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mb3J0eV90d29fYmV0Ly4vc3JjL3BhZ2VzL2FwaS9zc2UudHM/YzYwNCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0QXBpUmVxdWVzdCwgTmV4dEFwaVJlc3BvbnNlIH0gZnJvbSBcIm5leHRcIjtcblxubGV0IGNvbm5lY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBOZXh0QXBpUmVzcG9uc2U+ID0ge307XG5leHBvcnQgZGVmYXVsdCAocmVxOiBOZXh0QXBpUmVxdWVzdCwgcmVzOiBOZXh0QXBpUmVzcG9uc2UpID0+IHtcbiAgY29uc3QgdXNlcklkID0gQXJyYXkuaXNBcnJheShyZXEucXVlcnkudXNlcklkKVxuICAgID8gcmVxLnF1ZXJ5LnVzZXJJZFswXVxuICAgIDogcmVxLnF1ZXJ5LnVzZXJJZDtcbiAgICBcbiAgaWYgKCF1c2VySWQpIHtcbiAgICByZXMuc3RhdHVzKDQwMCkuc2VuZChcIlVzZXIgSUQgaXMgbWlzc2luZ1wiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIHJlcy5zZXRIZWFkZXIoXCJDYWNoZS1Db250cm9sXCIsIFwibm8tY2FjaGVcIik7XG4gIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJ0ZXh0L2V2ZW50LXN0cmVhbVwiKTtcbiAgcmVzLnNldEhlYWRlcihcIkNvbm5lY3Rpb25cIiwgXCJrZWVwLWFsaXZlXCIpO1xuICByZXMuc2V0SGVhZGVyKFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luXCIsIFwiKlwiKTtcbiAgcmVzLmZsdXNoSGVhZGVycygpO1xuICBjb25uZWN0aW9uc1t1c2VySWRdID0gcmVzO1xuXG4gIHJlcS5vbihcImNsb3NlXCIsICgpID0+IHtcbiAgICBkZWxldGUgY29ubmVjdGlvbnNbdXNlcklkXTtcbiAgfSk7XG59O1xuXG5leHBvcnQgeyBjb25uZWN0aW9ucyB9O1xuIl0sIm5hbWVzIjpbImNvbm5lY3Rpb25zIiwicmVxIiwicmVzIiwidXNlcklkIiwiQXJyYXkiLCJpc0FycmF5IiwicXVlcnkiLCJzdGF0dXMiLCJzZW5kIiwic2V0SGVhZGVyIiwiZmx1c2hIZWFkZXJzIiwib24iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/sse.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./src/pages/api/sse.ts"));
module.exports = __webpack_exports__;

})();