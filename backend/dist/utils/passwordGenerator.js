"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePassword = void 0;
const generatePassword = (options) => {
    const { length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar, } = options;
    let charset = "";
    // Character sets
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    // Similar looking characters to exclude
    const similarChars = "il1Lo0O";
    // Build character set based on options
    if (includeUppercase)
        charset += uppercase;
    if (includeLowercase)
        charset += lowercase;
    if (includeNumbers)
        charset += numbers;
    if (includeSymbols)
        charset += symbols;
    // Remove similar characters if requested
    if (excludeSimilar) {
        charset = charset
            .split("")
            .filter((char) => !similarChars.includes(char))
            .join("");
    }
    if (charset === "") {
        throw new Error("At least one character type must be selected");
    }
    // Generate password
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};
exports.generatePassword = generatePassword;
//# sourceMappingURL=passwordGenerator.js.map