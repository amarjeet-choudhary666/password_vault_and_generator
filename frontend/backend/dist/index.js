"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
dotenv_1.default.config();
(0, db_1.connectDB)(process.env.MONGO_URI)
    .then(() => {
    app_1.app.listen(process.env.PORT || 8000, () => {
        console.log(`server is running on port ${process.env.PORT || 8000}`);
    });
})
    .catch((error) => {
    console.log("failed to connect server", error);
});
//# sourceMappingURL=index.js.map