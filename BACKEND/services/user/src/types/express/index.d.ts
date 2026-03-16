// import type { JwtPayload } from "jsonwebtoken";

import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";

// declare global {
//   namespace Express {
//     interface Request {
//       user?: string | JwtPayload;
//     }
//   }
// }


// export {}; // This makes it a module


// TypeScript has two types of files:

// Script files - No imports/exports, global scope by default
// Module files - Has at least one import/export, isolated scope

// When you use declare global, you're augmenting the global scope from within a module. But if your file has no imports/exports, TypeScript treats it as a script file, not a module, which can cause issues.