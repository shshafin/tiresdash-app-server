"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const path_1 = __importDefault(require("path"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const routes_1 = __importDefault(require("./app/routes"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
// log the request
app.use((0, morgan_1.default)("dev"));
app.set("trust proxy", 1);
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "http://localhost:3010",
        "https://tiredashfleet.nahid-mahmud.xyz",
        "https://tiresdash.com",
        "https://fleet.tiresdash.com",
        "https://tiresdash-client.vercel.app",
    ],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
// parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/storage", express_1.default.static(path_1.default.join(__dirname, "../public/storage")));
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });
app.use("/api/v1", routes_1.default);
//global error handler
app.use(globalErrorHandler_1.default);
// handle api not found
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: "API not found",
        errorMessages: [
            {
                path: req.originalUrl,
                message: "API not found",
            },
        ],
    });
    next();
});
exports.default = app;
