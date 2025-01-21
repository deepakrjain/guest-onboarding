# app.js

```js
// app.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();

// Middleware and Static File Serving
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
// Ensure bodyParser middleware is applied
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || '1067',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Global Middleware for User and Flash Messages
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.error = null;
    res.locals.success = null;
    next();
});

// Routes
app.get('/', (req, res) => {
    res.render('index', { 
        pageTitle: 'Digital Guest Onboarding System',
        message: null 
    });
});
app.use('/guest', require('./routes/guestRoutes'));
app.use('/admin', require('./routes/adminRoutes'));

// Error Handling
app.use((err, req, res, next) => {
    console.error('Error:', err.message || err);
    res.status(err.status || 500).render('index', {
        pageTitle: 'Error',
        message: err.message || 'An unexpected error occurred.'
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).render('index', {
        pageTitle: '404 Not Found',
        message: 'Page not found'
    });
});

// Database Connection and Server Start
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error('Database connection error:', err);
        process.exit(1);
    });

module.exports = app;
```

# code.docx

This is a binary file of the type: Word Document

# code.txt

```txt
file structure:-
DigitalGuestOnboarding/
├── controllers/        # Business logic (e.g., hotel, guest)
│   ├── adminController.js
│   ├── guestController.js
├── middleware/        
│   ├── authMiddleware.js
├── models/             # MongoDB schemas
│   ├── hotel.js
│   ├── guest.js
│   ├── admin.js
├── routes/             # Express routes
│   ├── adminRoutes.js
│   ├── guestRoutes.js
├── public/             # Static files
│   ├── scripts/
│   │   ├── validation.js
│   ├── styles.css
├── views/              # EJS templates
│   ├── admin/
│   │   ├── dashboard.ejs
│   │   ├── guestDetails.ejs
│   │   ├── editGuest.ejs
│   │   ├── login.ejs
│   │   ├── hotels.ejs
│   ├── guest/
│   │   ├── form.ejs
│   │   ├── thankyou.ejs
├── .env                # Environment variables
├── app.js              # Main server file
└── package.json        # Node.js dependencies


/.env:
--------------------------------------------------------------------------------
1 | MONGO_URI=mongodb://localhost:27017/DigitalGuestOnboarding
2 | JWT_SECRET=1067


--------------------------------------------------------------------------------
/node_modules/@mapbox/node-pre-gyp/bin/node-pre-gyp:
--------------------------------------------------------------------------------
1 | #!/usr/bin/env node
2 | 'use strict';
3 | 
4 | require('../lib/main');
5 | 


--------------------------------------------------------------------------------
/node_modules/@mapbox/node-pre-gyp/bin/node-pre-gyp.cmd:
--------------------------------------------------------------------------------
1 | @echo off
2 | node  "%~dp0\node-pre-gyp" %*
3 | 


--------------------------------------------------------------------------------
/node_modules/@mongodb-js/saslprep/dist/.esm-wrapper.mjs:
--------------------------------------------------------------------------------
1 | import mod from "./node.js";
2 | 
3 | export default mod;
4 | export const saslprep = mod.saslprep;
5 | 


--------------------------------------------------------------------------------
/node_modules/@mongodb-js/saslprep/dist/browser.d.ts:
--------------------------------------------------------------------------------
1 | declare const saslprep: (args_0: string, args_1?: {
2 |     allowUnassigned?: boolean | undefined;
3 | } | undefined) => string;
4 | export = saslprep;
5 | //# sourceMappingURL=browser.d.ts.map


--------------------------------------------------------------------------------
/node_modules/@mongodb-js/saslprep/dist/browser.d.ts.map:
--------------------------------------------------------------------------------
1 | {"version":3,"file":"browser.d.ts","sourceRoot":"","sources":["../src/browser.ts"],"names":[],"mappings":"AAMA,QAAA,MAAM,QAAQ;;wBAAmC,CAAC;AAIlD,SAAS,QAAQ,CAAC"}


--------------------------------------------------------------------------------
/node_modules/@mongodb-js/saslprep/dist/code-points-data-browser.d.ts:
--------------------------------------------------------------------------------
1 | /// <reference types="node" />
2 | declare const data: Buffer;
3 | export default data;
4 | //# sourceMappingURL=code-points-data-browser.d.ts.map


--------------------------------------------------------------------------------
/node_modules/@mongodb-js/saslprep/dist/code-points-data.d.ts:
--------------------------------------------------------------------------------
1 | /// <reference types="node" />
2 | declare const _default: Buffer;
3 | export default _default;
4 | //# sourceMappingURL=code-points-data.d.ts.map


--------------------------------------------------------------------------------
/node_modules/@mongodb-js/saslprep/dist/code-points-data.d.ts.map:
--------------------------------------------------------------------------------
1 | {"version":3,"file":"code-points-data.d.ts","sourceRoot":"","sources":["../src/code-points-data.ts"],"names":[],"mappings":";;AAEA,wBAKE"}


--------------------------------------------------------------------------------
/node_modules/@mongodb-js/saslprep/dist/generate-code-points.d.ts:
--------------------------------------------------------------------------------
1 | export {};
2 | //# sourceMappingURL=generate-code-points.d.ts.map


--------------------------------------------------------------------------------
/node_modules/@mongodb-js/saslprep/dist/generate-code-points.d.ts.map:
--------------------------------------------------------------------------------
1 | {"version":3,"file":"generate-code-points.d.ts","sourceRoot":"","sources":["../src/generate-code-points.ts"],"names":[],"mappings":""}


--------------------------------------------------------------------------------
/node_modules/@mongodb-js/saslprep/dist/util.d.ts:
--------------------------------------------------------------------------------
1 | export declare function range(from: number, to: number): number[];
2 | //# sourceMappingURL=util.d.ts.map


--------------------------------------------------------------------------------
/node_modules/@mongodb-js/saslprep/dist/util.d.ts.map:
--------------------------------------------------------------------------------
1 | {"version":3,"file":"util.d.ts","sourceRoot":"","sources":["../src/util.ts"],"names":[],"mappings":"AAGA,wBAAgB,KAAK,CAAC,IAAI,EAAE,MAAM,EAAE,EAAE,EAAE,MAAM,GAAG,MAAM,EAAE,CAQxD"}


--------------------------------------------------------------------------------
/node_modules/@types/whatwg-url/webidl2js-wrapper.d.ts:
--------------------------------------------------------------------------------
1 | import * as URL from "./lib/URL";
2 | import * as URLSearchParams from "./lib/URLSearchParams";
3 | 
4 | export { URL, URLSearchParams };
5 | 


--------------------------------------------------------------------------------
/node_modules/append-field/.npmignore:
--------------------------------------------------------------------------------
1 | node_modules/
2 | 


--------------------------------------------------------------------------------
/node_modules/aproba/CHANGELOG.md:
--------------------------------------------------------------------------------
1 | 2.0.0
2 |   * Drop support for 0.10 and 0.12. They haven't been in travis but still,
3 |     since we _know_ we'll break with them now it's only polite to do a
4 |     major bump.
5 | 


--------------------------------------------------------------------------------
/node_modules/are-we-there-yet/lib/index.js:
--------------------------------------------------------------------------------
1 | 'use strict'
2 | exports.TrackerGroup = require('./tracker-group.js')
3 | exports.Tracker = require('./tracker.js')
4 | exports.TrackerStream = require('./tracker-stream.js')
5 | 


--------------------------------------------------------------------------------
/node_modules/are-we-there-yet/node_modules/readable-stream/lib/internal/streams/from-browser.js:
--------------------------------------------------------------------------------
1 | module.exports = function () {
2 |   throw new Error('Readable.from is not available in the browser')
3 | };
4 | 


--------------------------------------------------------------------------------
/node_modules/are-we-there-yet/node_modules/readable-stream/lib/internal/streams/stream-browser.js:
--------------------------------------------------------------------------------
1 | module.exports = require('events').EventEmitter;
2 | 


--------------------------------------------------------------------------------
/node_modules/are-we-there-yet/node_modules/readable-stream/lib/internal/streams/stream.js:
--------------------------------------------------------------------------------
1 | module.exports = require('stream');
2 | 


--------------------------------------------------------------------------------
/node_modules/balanced-match/.github/FUNDING.yml:
--------------------------------------------------------------------------------
1 | tidelift: "npm/balanced-match"
2 | patreon: juliangruber
3 | 


--------------------------------------------------------------------------------
/node_modules/bcrypt/examples/forever_gen_salt.js:
--------------------------------------------------------------------------------
1 | var bcrypt = require('../bcrypt');
2 | 
3 | (function printSalt() {
4 |   bcrypt.genSalt(10, function(err, salt) {
5 |     console.log('salt: ' + salt);
6 |     printSalt();
7 |   });
8 | })()
9 | 


--------------------------------------------------------------------------------
/node_modules/bcrypt/lib/binding/napi-v3/bcrypt_lib.node:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/deepakrjain/guest-onboarding/298f09830fb03f5fb471d014f0588e5b834ec63a/node_modules/bcrypt/lib/binding/napi-v3/bcrypt_lib.node


--------------------------------------------------------------------------------
/node_modules/bcryptjs/.npmignore:
--------------------------------------------------------------------------------
1 | node_modules/
2 | npm-debug.log
3 | debug.log
4 | doco/
5 | tests/bench.js
6 | *.png
7 | 


--------------------------------------------------------------------------------
/node_modules/bcryptjs/.vscode/settings.json:
--------------------------------------------------------------------------------
1 | {
2 |     "vsicons.presets.angular": false
3 | }


--------------------------------------------------------------------------------
/node_modules/bcryptjs/dist/bcrypt.min.js.gz:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/deepakrjain/guest-onboarding/298f09830fb03f5fb471d014f0588e5b834ec63a/node_modules/bcryptjs/dist/bcrypt.min.js.gz


--------------------------------------------------------------------------------
/node_modules/binary-extensions/binary-extensions.json.d.ts:
--------------------------------------------------------------------------------
1 | declare const binaryExtensionsJson: readonly string[];
2 | 
3 | export = binaryExtensionsJson;
4 | 


--------------------------------------------------------------------------------
/node_modules/binary-extensions/index.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./binary-extensions.json');
2 | 


--------------------------------------------------------------------------------
/node_modules/buffer-equal-constant-time/.npmignore:
--------------------------------------------------------------------------------
1 | .*.sw[mnop]
2 | node_modules/
3 | 


--------------------------------------------------------------------------------
/node_modules/buffer-equal-constant-time/.travis.yml:
--------------------------------------------------------------------------------
1 | language: node_js
2 | node_js:
3 | - "0.11"
4 | - "0.10"
5 | 


--------------------------------------------------------------------------------
/node_modules/busboy/.eslintrc.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | module.exports = {
4 |   extends: '@mscdex/eslint-config',
5 | };
6 | 


--------------------------------------------------------------------------------
/node_modules/call-bind-apply-helpers/.nycrc:
--------------------------------------------------------------------------------
 1 | {
 2 | 	"all": true,
 3 | 	"check-coverage": false,
 4 | 	"reporter": ["text-summary", "text", "html", "json"],
 5 | 	"exclude": [
 6 | 		"coverage",
 7 | 		"test"
 8 | 	]
 9 | }
10 | 


--------------------------------------------------------------------------------
/node_modules/call-bind-apply-helpers/actualApply.d.ts:
--------------------------------------------------------------------------------
1 | export = Reflect.apply;


--------------------------------------------------------------------------------
/node_modules/call-bind-apply-helpers/functionApply.d.ts:
--------------------------------------------------------------------------------
1 | export = Function.prototype.apply;


--------------------------------------------------------------------------------
/node_modules/call-bind-apply-helpers/functionApply.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | /** @type {import('./functionApply')} */
4 | module.exports = Function.prototype.apply;
5 | 


--------------------------------------------------------------------------------
/node_modules/call-bind-apply-helpers/functionCall.d.ts:
--------------------------------------------------------------------------------
1 | export = Function.prototype.call;


--------------------------------------------------------------------------------
/node_modules/call-bind-apply-helpers/functionCall.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | /** @type {import('./functionCall')} */
4 | module.exports = Function.prototype.call;
5 | 


--------------------------------------------------------------------------------
/node_modules/call-bind-apply-helpers/reflectApply.d.ts:
--------------------------------------------------------------------------------
1 | declare const reflectApply: false | typeof Reflect.apply;
2 | 
3 | export = reflectApply;
4 | 


--------------------------------------------------------------------------------
/node_modules/call-bind-apply-helpers/reflectApply.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | /** @type {import('./reflectApply')} */
4 | module.exports = typeof Reflect !== 'undefined' && Reflect && Reflect.apply;
5 | 


--------------------------------------------------------------------------------
/node_modules/call-bind-apply-helpers/tsconfig.json:
--------------------------------------------------------------------------------
1 | {
2 | 	"extends": "@ljharb/tsconfig",
3 | 	"compilerOptions": {
4 | 		"target": "es2021",
5 | 	},
6 | 	"exclude": [
7 | 		"coverage",
8 | 	],
9 | }


--------------------------------------------------------------------------------
/node_modules/call-bound/.eslintrc:
--------------------------------------------------------------------------------
 1 | {
 2 | 	"root": true,
 3 | 
 4 | 	"extends": "@ljharb",
 5 | 
 6 | 	"rules": {
 7 | 		"new-cap": [2, {
 8 | 			"capIsNewExceptions": [
 9 | 				"GetIntrinsic",
10 | 			],
11 | 		}],
12 | 	},
13 | }
14 | 


--------------------------------------------------------------------------------
/node_modules/call-bound/.nycrc:
--------------------------------------------------------------------------------
 1 | {
 2 | 	"all": true,
 3 | 	"check-coverage": false,
 4 | 	"reporter": ["text-summary", "text", "html", "json"],
 5 | 	"exclude": [
 6 | 		"coverage",
 7 | 		"test"
 8 | 	]
 9 | }
10 | 


--------------------------------------------------------------------------------
/node_modules/call-bound/tsconfig.json:
--------------------------------------------------------------------------------
 1 | {
 2 | 	"extends": "@ljharb/tsconfig",
 3 | 	"compilerOptions": {
 4 | 		"target": "es2021",
 5 | 	},
 6 | 	"exclude": [
 7 | 		"coverage",
 8 | 	],
 9 | }
10 | 


--------------------------------------------------------------------------------
/node_modules/chownr/README.md:
--------------------------------------------------------------------------------
1 | Like `chown -R`.
2 | 
3 | Takes the same arguments as `fs.chown()`
4 | 


--------------------------------------------------------------------------------
/node_modules/color-support/bin.js:
--------------------------------------------------------------------------------
1 | #!/usr/bin/env node
2 | var colorSupport = require('./')({alwaysReturn: true })
3 | console.log(JSON.stringify(colorSupport, null, 2))
4 | 


--------------------------------------------------------------------------------
/node_modules/concat-map/.travis.yml:
--------------------------------------------------------------------------------
1 | language: node_js
2 | node_js:
3 |   - 0.4
4 |   - 0.6
5 | 


--------------------------------------------------------------------------------
/node_modules/concat-map/example/map.js:
--------------------------------------------------------------------------------
1 | var concatMap = require('../');
2 | var xs = [ 1, 2, 3, 4, 5, 6 ];
3 | var ys = concatMap(xs, function (x) {
4 |     return x % 2 ? [ x - 0.1, x, x + 0.1 ] : [];
5 | });
6 | console.dir(ys);
7 | 


--------------------------------------------------------------------------------
/node_modules/cookie-signature/.npmignore:
--------------------------------------------------------------------------------
1 | support
2 | test
3 | examples
4 | *.sock
5 | 


--------------------------------------------------------------------------------
/node_modules/core-util-is/README.md:
--------------------------------------------------------------------------------
1 | # core-util-is
2 | 
3 | The `util.is*` functions introduced in Node v0.12.
4 | 


--------------------------------------------------------------------------------
/node_modules/debug/.coveralls.yml:
--------------------------------------------------------------------------------
1 | repo_token: SIAeZjKYlHK74rbcFvNHMUzjRiMpflxve
2 | 


--------------------------------------------------------------------------------
/node_modules/debug/.npmignore:
--------------------------------------------------------------------------------
 1 | support
 2 | test
 3 | examples
 4 | example
 5 | *.sock
 6 | dist
 7 | yarn.lock
 8 | coverage
 9 | bower.json
10 | 


--------------------------------------------------------------------------------
/node_modules/debug/.travis.yml:
--------------------------------------------------------------------------------
 1 | 
 2 | language: node_js
 3 | node_js:
 4 |   - "6"
 5 |   - "5"
 6 |   - "4"
 7 | 
 8 | install:
 9 |   - make node_modules
10 | 
11 | script:
12 |   - make lint
13 |   - make test
14 |   - make coveralls
15 | 


--------------------------------------------------------------------------------
/node_modules/debug/node.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./src/node');
2 | 


--------------------------------------------------------------------------------
/node_modules/delegates/.npmignore:
--------------------------------------------------------------------------------
1 | node_modules/
2 | 


--------------------------------------------------------------------------------
/node_modules/delegates/Makefile:
--------------------------------------------------------------------------------
1 | 
2 | test:
3 | 	@./node_modules/.bin/mocha \
4 | 		--require should \
5 | 		--reporter spec \
6 | 		--bail
7 | 
8 | .PHONY: test


--------------------------------------------------------------------------------
/node_modules/dijkstrajs/.travis.yml:
--------------------------------------------------------------------------------
1 | language: node_js
2 | node_js:
3 |   - "stable"
4 | sudo: false
5 | 


--------------------------------------------------------------------------------
/node_modules/dotenv/config.d.ts:
--------------------------------------------------------------------------------
1 | export {};
2 | 


--------------------------------------------------------------------------------
/node_modules/dotenv/config.js:
--------------------------------------------------------------------------------
 1 | (function () {
 2 |   require('./lib/main').config(
 3 |     Object.assign(
 4 |       {},
 5 |       require('./lib/env-options'),
 6 |       require('./lib/cli-options')(process.argv)
 7 |     )
 8 |   )
 9 | })()
10 | 


--------------------------------------------------------------------------------
/node_modules/dunder-proto/.eslintrc:
--------------------------------------------------------------------------------
1 | {
2 | 	"root": true,
3 | 
4 | 	"extends": "@ljharb",
5 | }
6 | 


--------------------------------------------------------------------------------
/node_modules/dunder-proto/get.d.ts:
--------------------------------------------------------------------------------
1 | declare function getDunderProto(target: {}): object | null;
2 | 
3 | declare const x: false | typeof getDunderProto;
4 | 
5 | export = x;


--------------------------------------------------------------------------------
/node_modules/dunder-proto/set.d.ts:
--------------------------------------------------------------------------------
1 | declare function setDunderProto<P extends null | object>(target: {}, proto: P): P;
2 | 
3 | declare const x: false | typeof setDunderProto;
4 | 
5 | export = x;


--------------------------------------------------------------------------------
/node_modules/dunder-proto/test/index.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | require('./get');
4 | require('./set');
5 | 


--------------------------------------------------------------------------------
/node_modules/dunder-proto/tsconfig.json:
--------------------------------------------------------------------------------
 1 | {
 2 | 	"extends": "@ljharb/tsconfig",
 3 | 	"compilerOptions": {
 4 | 		"target": "ES2021",
 5 | 	},
 6 | 	"exclude": [
 7 | 		"coverage",
 8 | 	],
 9 | }
10 | 


--------------------------------------------------------------------------------
/node_modules/ecdsa-sig-formatter/CODEOWNERS:
--------------------------------------------------------------------------------
1 | * @omsmith
2 | 


--------------------------------------------------------------------------------
/node_modules/es-define-property/.eslintrc:
--------------------------------------------------------------------------------
 1 | {
 2 | 	"root": true,
 3 | 
 4 | 	"extends": "@ljharb",
 5 | 
 6 | 	"rules": {
 7 | 		"new-cap": ["error", {
 8 | 			"capIsNewExceptions": [
 9 | 				"GetIntrinsic",
10 | 			],
11 | 		}],
12 | 	},
13 | }
14 | 


--------------------------------------------------------------------------------
/node_modules/es-define-property/.nycrc:
--------------------------------------------------------------------------------
 1 | {
 2 | 	"all": true,
 3 | 	"check-coverage": false,
 4 | 	"reporter": ["text-summary", "text", "html", "json"],
 5 | 	"exclude": [
 6 | 		"coverage",
 7 | 		"test"
 8 | 	]
 9 | }
10 | 


--------------------------------------------------------------------------------
/node_modules/es-define-property/index.d.ts:
--------------------------------------------------------------------------------
1 | declare const defineProperty: false | typeof Object.defineProperty;
2 | 
3 | export = defineProperty;


--------------------------------------------------------------------------------
/node_modules/es-define-property/tsconfig.json:
--------------------------------------------------------------------------------
 1 | {
 2 | 	"extends": "@ljharb/tsconfig",
 3 | 	"compilerOptions": {
 4 | 		"target": "es2022",
 5 | 	},
 6 | 	"exclude": [
 7 | 		"coverage",
 8 | 		"test/list-exports"
 9 | 	],
10 | }
11 | 


--------------------------------------------------------------------------------
/node_modules/es-errors/.eslintrc:
--------------------------------------------------------------------------------
1 | {
2 | 	"root": true,
3 | 
4 | 	"extends": "@ljharb",
5 | }
6 | 


--------------------------------------------------------------------------------
/node_modules/es-errors/eval.d.ts:
--------------------------------------------------------------------------------
1 | declare const EvalError: EvalErrorConstructor;
2 | 
3 | export = EvalError;
4 | 


--------------------------------------------------------------------------------
/node_modules/es-errors/eval.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | /** @type {import('./eval')} */
4 | module.exports = EvalError;
5 | 


--------------------------------------------------------------------------------
/node_modules/es-errors/index.d.ts:
--------------------------------------------------------------------------------
1 | declare const Error: ErrorConstructor;
2 | 
3 | export = Error;
4 | 


--------------------------------------------------------------------------------
/node_modules/es-errors/index.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | /** @type {import('.')} */
4 | module.exports = Error;
5 | 


--------------------------------------------------------------------------------
/node_modules/es-errors/range.d.ts:
--------------------------------------------------------------------------------
1 | declare const RangeError: RangeErrorConstructor;
2 | 
3 | export = RangeError;
4 | 


--------------------------------------------------------------------------------
/node_modules/es-errors/range.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | /** @type {import('./range')} */
4 | module.exports = RangeError;
5 | 


--------------------------------------------------------------------------------
/node_modules/es-errors/ref.d.ts:
--------------------------------------------------------------------------------
1 | declare const ReferenceError: ReferenceErrorConstructor;
2 | 
3 | export = ReferenceError;
4 | 


--------------------------------------------------------------------------------
/node_modules/es-errors/ref.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | /** @type {import('./ref')} */
4 | module.exports = ReferenceError;
5 | 


--------------------------------------------------------------------------------
/node_modules/es-errors/syntax.d.ts:
--------------------------------------------------------------------------------
1 | declare const SyntaxError: SyntaxErrorConstructor;
2 | 
3 | export = SyntaxError;
4 | 


--------------------------------------------------------------------------------
/node_modules/es-errors/syntax.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | /** @type {import('./syntax')} */
4 | module.exports = SyntaxError;
5 | 


--------------------------------------------------------------------------------
/node_modules/es-errors/type.d.ts:
--------------------------------------------------------------------------------
1 | declare const TypeError: TypeErrorConstructor
2 | 
3 | export = TypeError;
4 | 


--------------------------------------------------------------------------------
/node_modules/es-errors/type.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | /** @type {import('./type')} */
4 | module.exports = TypeError;
5 | 


--------------------------------------------------------------------------------
/node_modules/es-errors/uri.d.ts:
--------------------------------------------------------------------------------
1 | declare const URIError: URIErrorConstructor;
2 | 
3 | export = URIError;
4 | 


--------------------------------------------------------------------------------
/node_modules/es-errors/uri.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | /** @type {import('./uri')} */
4 | module.exports = URIError;
5 | 


--------------------------------------------------------------------------------
/node_modules/es-object-atoms/RequireObjectCoercible.d.ts:
--------------------------------------------------------------------------------
1 | declare function RequireObjectCoercible<T extends {}>(value: T, optMessage?: string): T;
2 | 
3 | export = RequireObjectCoercible;
4 | 


--------------------------------------------------------------------------------
/node_modules/es-object-atoms/index.d.ts:
--------------------------------------------------------------------------------
1 | declare const Object: ObjectConstructor;
2 | 
3 | export = Object;
4 | 


--------------------------------------------------------------------------------
/node_modules/es-object-atoms/index.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | /** @type {import('.')} */
4 | module.exports = Object;
5 | 


--------------------------------------------------------------------------------
/node_modules/es-object-atoms/isObject.d.ts:
--------------------------------------------------------------------------------
1 | declare function isObject(x: unknown): x is object;
2 | 
3 | export = isObject;
4 | 


--------------------------------------------------------------------------------
/node_modules/es-object-atoms/isObject.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | /** @type {import('./isObject')} */
4 | module.exports = function isObject(x) {
5 | 	return !!x && (typeof x === 'function' || typeof x === 'object');
6 | };
7 | 


--------------------------------------------------------------------------------
/node_modules/es-object-atoms/tsconfig.json:
--------------------------------------------------------------------------------
1 | {
2 | 	"extends": "@ljharb/tsconfig",
3 | 	"compilerOptions": {
4 | 		"target": "es5",
5 | 	},
6 | }
7 | 


--------------------------------------------------------------------------------
/node_modules/express-validator/lib/chain/context-handler.js:
--------------------------------------------------------------------------------
1 | "use strict";
2 | Object.defineProperty(exports, "__esModule", { value: true });
3 | 


--------------------------------------------------------------------------------
/node_modules/express-validator/lib/chain/context-runner.js:
--------------------------------------------------------------------------------
1 | "use strict";
2 | Object.defineProperty(exports, "__esModule", { value: true });
3 | 


--------------------------------------------------------------------------------
/node_modules/express-validator/lib/chain/sanitizers.js:
--------------------------------------------------------------------------------
1 | "use strict";
2 | Object.defineProperty(exports, "__esModule", { value: true });
3 | 


--------------------------------------------------------------------------------
/node_modules/express-validator/lib/chain/validation-chain.js:
--------------------------------------------------------------------------------
1 | "use strict";
2 | Object.defineProperty(exports, "__esModule", { value: true });
3 | 


--------------------------------------------------------------------------------
/node_modules/express-validator/lib/chain/validators.js:
--------------------------------------------------------------------------------
1 | "use strict";
2 | Object.defineProperty(exports, "__esModule", { value: true });
3 | 


--------------------------------------------------------------------------------
/node_modules/express-validator/lib/context-items/bail.d.ts:
--------------------------------------------------------------------------------
1 | import { Context } from '../context';
2 | import { ContextItem } from './context-item';
3 | export declare class Bail implements ContextItem {
4 |     run(context: Context): Promise<void>;
5 | }
6 | 


--------------------------------------------------------------------------------
/node_modules/express-validator/lib/context-items/context-item.d.ts:
--------------------------------------------------------------------------------
1 | import { Meta } from '../base';
2 | import { Context } from '../context';
3 | export interface ContextItem {
4 |     run(context: Context, value: any, meta: Meta): Promise<void>;
5 | }
6 | 


--------------------------------------------------------------------------------
/node_modules/express-validator/lib/context-items/context-item.js:
--------------------------------------------------------------------------------
1 | "use strict";
2 | Object.defineProperty(exports, "__esModule", { value: true });
3 | 


--------------------------------------------------------------------------------
/node_modules/express-validator/lib/context-items/index.d.ts:
--------------------------------------------------------------------------------
1 | export * from './chain-condition';
2 | export * from './context-item';
3 | export * from './custom-condition';
4 | export * from './custom-validation';
5 | export * from './standard-validation';
6 | 


--------------------------------------------------------------------------------
/node_modules/express-validator/lib/options.js:
--------------------------------------------------------------------------------
1 | "use strict";
2 | Object.defineProperty(exports, "__esModule", { value: true });
3 | 


--------------------------------------------------------------------------------
/node_modules/filelist/node_modules/brace-expansion/.github/FUNDING.yml:
--------------------------------------------------------------------------------
1 | tidelift: "npm/brace-expansion"
2 | patreon: juliangruber
3 | 


--------------------------------------------------------------------------------
/node_modules/filelist/node_modules/minimatch/lib/path.js:
--------------------------------------------------------------------------------
1 | const isWindows = typeof process === 'object' &&
2 |   process &&
3 |   process.platform === 'win32'
4 | module.exports = isWindows ? { sep: '\\' } : { sep: '/' }
5 | 


--------------------------------------------------------------------------------
/node_modules/function-bind/.github/SECURITY.md:
--------------------------------------------------------------------------------
1 | # Security
2 | 
3 | Please email [@ljharb](https://github.com/ljharb) or see https://tidelift.com/security if you have a potential security vulnerability to report.
4 | 


--------------------------------------------------------------------------------
/node_modules/function-bind/index.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | var implementation = require('./implementation');
4 | 
5 | module.exports = Function.prototype.bind || implementation;
6 | 


--------------------------------------------------------------------------------
/node_modules/gauge/has-color.js:
--------------------------------------------------------------------------------
1 | 'use strict'
2 | var colorSupport = require('color-support')
3 | 
4 | module.exports = colorSupport().hasBasic
5 | 


--------------------------------------------------------------------------------
/node_modules/gauge/process.js:
--------------------------------------------------------------------------------
1 | 'use strict'
2 | // this exists so we can replace it during testing
3 | module.exports = process
4 | 


--------------------------------------------------------------------------------
/node_modules/gauge/set-immediate.js:
--------------------------------------------------------------------------------
1 | 'use strict'
2 | var process = require('./process')
3 | try {
4 |   module.exports = setImmediate
5 | } catch (ex) {
6 |   module.exports = process.nextTick
7 | }
8 | 


--------------------------------------------------------------------------------
/node_modules/gauge/set-interval.js:
--------------------------------------------------------------------------------
1 | 'use strict'
2 | // this exists so we can replace it during testing
3 | module.exports = setInterval
4 | 


--------------------------------------------------------------------------------
/node_modules/gauge/spin.js:
--------------------------------------------------------------------------------
1 | 'use strict'
2 | 
3 | module.exports = function spin (spinstr, spun) {
4 |   return spinstr[spun % spinstr.length]
5 | }
6 | 


--------------------------------------------------------------------------------
/node_modules/get-caller-file/index.d.ts:
--------------------------------------------------------------------------------
1 | declare const _default: (position?: number) => any;
2 | export = _default;
3 | 


--------------------------------------------------------------------------------
/node_modules/get-intrinsic/.nycrc:
--------------------------------------------------------------------------------
 1 | {
 2 | 	"all": true,
 3 | 	"check-coverage": false,
 4 | 	"reporter": ["text-summary", "text", "html", "json"],
 5 | 	"exclude": [
 6 | 		"coverage",
 7 | 		"test"
 8 | 	]
 9 | }
10 | 


--------------------------------------------------------------------------------
/node_modules/get-proto/.eslintrc:
--------------------------------------------------------------------------------
 1 | {
 2 | 	"root": true,
 3 | 
 4 | 	"extends": "@ljharb",
 5 | 
 6 | 	"rules": {
 7 | 		"id-length": "off",
 8 | 		"sort-keys": "off",
 9 | 	},
10 | }
11 | 


--------------------------------------------------------------------------------
/node_modules/get-proto/.nycrc:
--------------------------------------------------------------------------------
 1 | {
 2 | 	"all": true,
 3 | 	"check-coverage": false,
 4 | 	"reporter": ["text-summary", "text", "html", "json"],
 5 | 	"exclude": [
 6 | 		"coverage",
 7 | 		"test"
 8 | 	]
 9 | }
10 | 


--------------------------------------------------------------------------------
/node_modules/get-proto/Object.getPrototypeOf.d.ts:
--------------------------------------------------------------------------------
1 | declare function getProto<O extends object>(object: O): object | null;
2 | 
3 | declare const x: typeof getProto | null;
4 | 
5 | export = x;


--------------------------------------------------------------------------------
/node_modules/get-proto/Object.getPrototypeOf.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | var $Object = require('es-object-atoms');
4 | 
5 | /** @type {import('./Object.getPrototypeOf')} */
6 | module.exports = $Object.getPrototypeOf || null;
7 | 


--------------------------------------------------------------------------------
/node_modules/get-proto/Reflect.getPrototypeOf.d.ts:
--------------------------------------------------------------------------------
1 | declare const x: typeof Reflect.getPrototypeOf | null;
2 | 
3 | export = x;


--------------------------------------------------------------------------------
/node_modules/get-proto/Reflect.getPrototypeOf.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | /** @type {import('./Reflect.getPrototypeOf')} */
4 | module.exports = (typeof Reflect !== 'undefined' && Reflect.getPrototypeOf) || null;
5 | 


--------------------------------------------------------------------------------
/node_modules/get-proto/index.d.ts:
--------------------------------------------------------------------------------
1 | declare function getProto<O extends object>(object: O): object | null;
2 | 
3 | declare const x: typeof getProto | null;
4 | 
5 | export = x;
6 | 


--------------------------------------------------------------------------------
/node_modules/get-proto/tsconfig.json:
--------------------------------------------------------------------------------
 1 | {
 2 | 	"extends": "@ljharb/tsconfig",
 3 | 	"compilerOptions": {
 4 | 		//"target": "es2021",
 5 | 	},
 6 | 	"exclude": [
 7 | 		"coverage",
 8 | 	],
 9 | }
10 | 


--------------------------------------------------------------------------------
/node_modules/gopd/gOPD.d.ts:
--------------------------------------------------------------------------------
1 | export = Object.getOwnPropertyDescriptor;
2 | 


--------------------------------------------------------------------------------
/node_modules/gopd/gOPD.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | /** @type {import('./gOPD')} */
4 | module.exports = Object.getOwnPropertyDescriptor;
5 | 


--------------------------------------------------------------------------------
/node_modules/gopd/index.d.ts:
--------------------------------------------------------------------------------
1 | declare function gOPD<O extends object, K extends keyof O>(obj: O, prop: K): PropertyDescriptor | undefined;
2 | 
3 | declare const fn: typeof gOPD | undefined | null;
4 | 
5 | export = fn;


--------------------------------------------------------------------------------
/node_modules/gopd/tsconfig.json:
--------------------------------------------------------------------------------
 1 | {
 2 | 	"extends": "@ljharb/tsconfig",
 3 | 	"compilerOptions": {
 4 | 		"target": "es2021",
 5 | 	},
 6 | 	"exclude": [
 7 | 		"coverage",
 8 | 	],
 9 | }
10 | 


--------------------------------------------------------------------------------
/node_modules/has-symbols/.eslintrc:
--------------------------------------------------------------------------------
 1 | {
 2 | 	"root": true,
 3 | 
 4 | 	"extends": "@ljharb",
 5 | 
 6 | 	"rules": {
 7 | 		"max-statements-per-line": [2, { "max": 2 }],
 8 | 		"no-magic-numbers": 0,
 9 | 		"multiline-comment-style": 0,
10 | 	}
11 | }
12 | 


--------------------------------------------------------------------------------
/node_modules/has-symbols/.nycrc:
--------------------------------------------------------------------------------
 1 | {
 2 | 	"all": true,
 3 | 	"check-coverage": false,
 4 | 	"reporter": ["text-summary", "text", "html", "json"],
 5 | 	"exclude": [
 6 | 		"coverage",
 7 | 		"test"
 8 | 	]
 9 | }
10 | 


--------------------------------------------------------------------------------
/node_modules/has-symbols/index.d.ts:
--------------------------------------------------------------------------------
1 | declare function hasNativeSymbols(): boolean;
2 | 
3 | export = hasNativeSymbols;


--------------------------------------------------------------------------------
/node_modules/has-symbols/shams.d.ts:
--------------------------------------------------------------------------------
1 | declare function hasSymbolShams(): boolean;
2 | 
3 | export = hasSymbolShams;


--------------------------------------------------------------------------------
/node_modules/has-symbols/tsconfig.json:
--------------------------------------------------------------------------------
 1 | {
 2 | 	"extends": "@ljharb/tsconfig",
 3 | 	"compilerOptions": {
 4 | 		"target": "ES2021",
 5 | 		"maxNodeModuleJsDepth": 0,
 6 | 	},
 7 | 	"exclude": [
 8 | 		"coverage"
 9 | 	]
10 | }
11 | 


--------------------------------------------------------------------------------
/node_modules/hasown/.eslintrc:
--------------------------------------------------------------------------------
1 | {
2 | 	"root": true,
3 | 
4 | 	"extends": "@ljharb",
5 | }
6 | 


--------------------------------------------------------------------------------
/node_modules/hasown/index.d.ts:
--------------------------------------------------------------------------------
1 | declare function hasOwn<O, K extends PropertyKey, V = unknown>(o: O, p: K): o is O & Record<K, V>;
2 | 
3 | export = hasOwn;
4 | 


--------------------------------------------------------------------------------
/node_modules/hasown/tsconfig.json:
--------------------------------------------------------------------------------
1 | {
2 |   "extends": "@ljharb/tsconfig",
3 |   "exclude": [
4 |     "coverage",
5 |   ],
6 | }
7 | 


--------------------------------------------------------------------------------
/node_modules/isarray/.npmignore:
--------------------------------------------------------------------------------
1 | node_modules
2 | 


--------------------------------------------------------------------------------
/node_modules/isarray/.travis.yml:
--------------------------------------------------------------------------------
1 | language: node_js
2 | node_js:
3 |   - "0.8"
4 |   - "0.10"
5 | 


--------------------------------------------------------------------------------
/node_modules/isarray/Makefile:
--------------------------------------------------------------------------------
1 | 
2 | test:
3 | 	@node_modules/.bin/tape test.js
4 | 
5 | .PHONY: test
6 | 
7 | 


--------------------------------------------------------------------------------
/node_modules/isarray/index.js:
--------------------------------------------------------------------------------
1 | var toString = {}.toString;
2 | 
3 | module.exports = Array.isArray || function (arr) {
4 |   return toString.call(arr) == '[object Array]';
5 | };
6 | 


--------------------------------------------------------------------------------
/node_modules/jsonwebtoken/lib/asymmetricKeyDetailsSupported.js:
--------------------------------------------------------------------------------
1 | const semver = require('semver');
2 | 
3 | module.exports = semver.satisfies(process.version, '>=15.7.0');
4 | 


--------------------------------------------------------------------------------
/node_modules/jsonwebtoken/lib/psSupported.js:
--------------------------------------------------------------------------------
1 | var semver = require('semver');
2 | 
3 | module.exports = semver.satisfies(process.version, '^6.12.0 || >=8.0.0');
4 | 


--------------------------------------------------------------------------------
/node_modules/jsonwebtoken/lib/rsaPssKeyDetailsSupported.js:
--------------------------------------------------------------------------------
1 | const semver = require('semver');
2 | 
3 | module.exports = semver.satisfies(process.version, '>=16.9.0');
4 | 


--------------------------------------------------------------------------------
/node_modules/kareem/SECURITY.md:
--------------------------------------------------------------------------------
1 | ## Security contact information
2 | 
3 | To report a security vulnerability, please use the
4 | [Tidelift security contact](https://tidelift.com/security).
5 | Tidelift will coordinate the fix and disclosure.
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/_Map.js:
--------------------------------------------------------------------------------
1 | var getNative = require('./_getNative'),
2 |     root = require('./_root');
3 | 
4 | /* Built-in method references that are verified to be native. */
5 | var Map = getNative(root, 'Map');
6 | 
7 | module.exports = Map;
8 | 


--------------------------------------------------------------------------------
/node_modules/lodash/_Set.js:
--------------------------------------------------------------------------------
1 | var getNative = require('./_getNative'),
2 |     root = require('./_root');
3 | 
4 | /* Built-in method references that are verified to be native. */
5 | var Set = getNative(root, 'Set');
6 | 
7 | module.exports = Set;
8 | 


--------------------------------------------------------------------------------
/node_modules/lodash/_Symbol.js:
--------------------------------------------------------------------------------
1 | var root = require('./_root');
2 | 
3 | /** Built-in value references. */
4 | var Symbol = root.Symbol;
5 | 
6 | module.exports = Symbol;
7 | 


--------------------------------------------------------------------------------
/node_modules/lodash/_Uint8Array.js:
--------------------------------------------------------------------------------
1 | var root = require('./_root');
2 | 
3 | /** Built-in value references. */
4 | var Uint8Array = root.Uint8Array;
5 | 
6 | module.exports = Uint8Array;
7 | 


--------------------------------------------------------------------------------
/node_modules/lodash/_coreJsData.js:
--------------------------------------------------------------------------------
1 | var root = require('./_root');
2 | 
3 | /** Used to detect overreaching core-js shims. */
4 | var coreJsData = root['__core-js_shared__'];
5 | 
6 | module.exports = coreJsData;
7 | 


--------------------------------------------------------------------------------
/node_modules/lodash/_freeGlobal.js:
--------------------------------------------------------------------------------
1 | /** Detect free variable `global` from Node.js. */
2 | var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
3 | 
4 | module.exports = freeGlobal;
5 | 


--------------------------------------------------------------------------------
/node_modules/lodash/_getPrototype.js:
--------------------------------------------------------------------------------
1 | var overArg = require('./_overArg');
2 | 
3 | /** Built-in value references. */
4 | var getPrototype = overArg(Object.getPrototypeOf, Object);
5 | 
6 | module.exports = getPrototype;
7 | 


--------------------------------------------------------------------------------
/node_modules/lodash/_metaMap.js:
--------------------------------------------------------------------------------
1 | var WeakMap = require('./_WeakMap');
2 | 
3 | /** Used to store function metadata. */
4 | var metaMap = WeakMap && new WeakMap;
5 | 
6 | module.exports = metaMap;
7 | 


--------------------------------------------------------------------------------
/node_modules/lodash/_nativeCreate.js:
--------------------------------------------------------------------------------
1 | var getNative = require('./_getNative');
2 | 
3 | /* Built-in method references that are verified to be native. */
4 | var nativeCreate = getNative(Object, 'create');
5 | 
6 | module.exports = nativeCreate;
7 | 


--------------------------------------------------------------------------------
/node_modules/lodash/_reEscape.js:
--------------------------------------------------------------------------------
1 | /** Used to match template delimiters. */
2 | var reEscape = /<%-([\s\S]+?)%>/g;
3 | 
4 | module.exports = reEscape;
5 | 


--------------------------------------------------------------------------------
/node_modules/lodash/_reEvaluate.js:
--------------------------------------------------------------------------------
1 | /** Used to match template delimiters. */
2 | var reEvaluate = /<%([\s\S]+?)%>/g;
3 | 
4 | module.exports = reEvaluate;
5 | 


--------------------------------------------------------------------------------
/node_modules/lodash/_reInterpolate.js:
--------------------------------------------------------------------------------
1 | /** Used to match template delimiters. */
2 | var reInterpolate = /<%=([\s\S]+?)%>/g;
3 | 
4 | module.exports = reInterpolate;
5 | 


--------------------------------------------------------------------------------
/node_modules/lodash/_realNames.js:
--------------------------------------------------------------------------------
1 | /** Used to lookup unminified function names. */
2 | var realNames = {};
3 | 
4 | module.exports = realNames;
5 | 


--------------------------------------------------------------------------------
/node_modules/lodash/date.js:
--------------------------------------------------------------------------------
1 | module.exports = {
2 |   'now': require('./now')
3 | };
4 | 


--------------------------------------------------------------------------------
/node_modules/lodash/each.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./forEach');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/eachRight.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./forEachRight');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/entries.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./toPairs');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/entriesIn.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./toPairsIn');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/extend.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./assignIn');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/extendWith.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./assignInWith');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/first.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./head');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp.js:
--------------------------------------------------------------------------------
1 | var _ = require('./lodash.min').runInContext();
2 | module.exports = require('./fp/_baseConvert')(_, _);
3 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/F.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./stubFalse');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/T.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./stubTrue');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/__.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./placeholder');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/_falseOptions.js:
--------------------------------------------------------------------------------
1 | module.exports = {
2 |   'cap': false,
3 |   'curry': false,
4 |   'fixed': false,
5 |   'immutable': false,
6 |   'rearg': false
7 | };
8 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/add.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('add', require('../add'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/after.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('after', require('../after'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/all.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./every');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/allPass.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./overEvery');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/always.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./constant');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/any.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./some');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/anyPass.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./overSome');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/apply.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./spread');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/array.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert');
2 | module.exports = convert(require('../array'));
3 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/ary.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('ary', require('../ary'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/assign.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('assign', require('../assign'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/assignAll.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('assignAll', require('../assign'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/assignAllWith.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('assignAllWith', require('../assignWith'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/assignIn.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('assignIn', require('../assignIn'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/assignInAll.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('assignInAll', require('../assignIn'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/assignInAllWith.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('assignInAllWith', require('../assignInWith'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/assignInWith.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('assignInWith', require('../assignInWith'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/assignWith.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('assignWith', require('../assignWith'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/assoc.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./set');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/assocPath.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./set');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/at.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('at', require('../at'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/attempt.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('attempt', require('../attempt'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/before.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('before', require('../before'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/bind.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('bind', require('../bind'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/bindAll.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('bindAll', require('../bindAll'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/bindKey.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('bindKey', require('../bindKey'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/camelCase.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('camelCase', require('../camelCase'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/capitalize.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('capitalize', require('../capitalize'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/castArray.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('castArray', require('../castArray'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/ceil.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('ceil', require('../ceil'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/chain.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('chain', require('../chain'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/chunk.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('chunk', require('../chunk'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/clamp.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('clamp', require('../clamp'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/clone.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('clone', require('../clone'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/cloneDeep.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('cloneDeep', require('../cloneDeep'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/cloneDeepWith.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('cloneDeepWith', require('../cloneDeepWith'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/cloneWith.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('cloneWith', require('../cloneWith'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/collection.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert');
2 | module.exports = convert(require('../collection'));
3 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/commit.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('commit', require('../commit'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/compact.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('compact', require('../compact'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/complement.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./negate');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/compose.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./flowRight');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/concat.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('concat', require('../concat'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/cond.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('cond', require('../cond'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/conforms.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./conformsTo');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/conformsTo.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('conformsTo', require('../conformsTo'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/constant.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('constant', require('../constant'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/contains.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./includes');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/countBy.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('countBy', require('../countBy'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/create.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('create', require('../create'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/curry.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('curry', require('../curry'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/curryN.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('curryN', require('../curry'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/curryRight.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('curryRight', require('../curryRight'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/curryRightN.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('curryRightN', require('../curryRight'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/date.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert');
2 | module.exports = convert(require('../date'));
3 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/debounce.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('debounce', require('../debounce'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/deburr.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('deburr', require('../deburr'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/defaultTo.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('defaultTo', require('../defaultTo'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/defaults.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('defaults', require('../defaults'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/defaultsAll.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('defaultsAll', require('../defaults'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/defaultsDeep.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('defaultsDeep', require('../defaultsDeep'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/defaultsDeepAll.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('defaultsDeepAll', require('../defaultsDeep'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/defer.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('defer', require('../defer'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/delay.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('delay', require('../delay'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/difference.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('difference', require('../difference'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/differenceBy.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('differenceBy', require('../differenceBy'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/differenceWith.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('differenceWith', require('../differenceWith'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/dissoc.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./unset');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/dissocPath.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./unset');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/divide.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('divide', require('../divide'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/drop.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('drop', require('../drop'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/dropLast.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./dropRight');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/dropLastWhile.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./dropRightWhile');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/dropRight.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('dropRight', require('../dropRight'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/dropRightWhile.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('dropRightWhile', require('../dropRightWhile'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/dropWhile.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('dropWhile', require('../dropWhile'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/each.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./forEach');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/eachRight.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./forEachRight');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/endsWith.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('endsWith', require('../endsWith'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/entries.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./toPairs');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/entriesIn.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./toPairsIn');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/eq.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('eq', require('../eq'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/equals.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./isEqual');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/escape.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('escape', require('../escape'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/escapeRegExp.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('escapeRegExp', require('../escapeRegExp'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/every.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('every', require('../every'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/extend.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./assignIn');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/extendAll.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./assignInAll');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/extendAllWith.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./assignInAllWith');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/extendWith.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./assignInWith');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/fill.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('fill', require('../fill'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/filter.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('filter', require('../filter'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/find.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('find', require('../find'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/findFrom.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('findFrom', require('../find'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/findIndex.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('findIndex', require('../findIndex'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/findIndexFrom.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('findIndexFrom', require('../findIndex'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/findKey.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('findKey', require('../findKey'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/findLast.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('findLast', require('../findLast'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/findLastFrom.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('findLastFrom', require('../findLast'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/findLastIndex.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('findLastIndex', require('../findLastIndex'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/findLastIndexFrom.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('findLastIndexFrom', require('../findLastIndex'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/findLastKey.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('findLastKey', require('../findLastKey'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/first.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./head');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/flatMap.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('flatMap', require('../flatMap'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/flatMapDeep.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('flatMapDeep', require('../flatMapDeep'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/flatMapDepth.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('flatMapDepth', require('../flatMapDepth'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/flatten.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('flatten', require('../flatten'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/flattenDeep.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('flattenDeep', require('../flattenDeep'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/flattenDepth.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('flattenDepth', require('../flattenDepth'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/flip.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('flip', require('../flip'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/floor.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('floor', require('../floor'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/flow.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('flow', require('../flow'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/flowRight.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('flowRight', require('../flowRight'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/forEach.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('forEach', require('../forEach'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/forEachRight.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('forEachRight', require('../forEachRight'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/forIn.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('forIn', require('../forIn'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/forInRight.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('forInRight', require('../forInRight'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/forOwn.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('forOwn', require('../forOwn'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/forOwnRight.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('forOwnRight', require('../forOwnRight'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/fromPairs.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('fromPairs', require('../fromPairs'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/function.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert');
2 | module.exports = convert(require('../function'));
3 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/functions.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('functions', require('../functions'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/functionsIn.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('functionsIn', require('../functionsIn'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/get.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('get', require('../get'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/getOr.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('getOr', require('../get'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/groupBy.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('groupBy', require('../groupBy'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/gt.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('gt', require('../gt'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/gte.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('gte', require('../gte'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/has.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('has', require('../has'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/hasIn.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('hasIn', require('../hasIn'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/head.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('head', require('../head'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/identical.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./eq');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/identity.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('identity', require('../identity'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/inRange.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('inRange', require('../inRange'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/includes.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('includes', require('../includes'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/includesFrom.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('includesFrom', require('../includes'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/indexBy.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./keyBy');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/indexOf.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('indexOf', require('../indexOf'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/indexOfFrom.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('indexOfFrom', require('../indexOf'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/init.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./initial');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/initial.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('initial', require('../initial'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/intersection.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('intersection', require('../intersection'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/intersectionBy.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('intersectionBy', require('../intersectionBy'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/intersectionWith.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('intersectionWith', require('../intersectionWith'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/invert.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('invert', require('../invert'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/invertBy.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('invertBy', require('../invertBy'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/invertObj.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./invert');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/invoke.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('invoke', require('../invoke'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/invokeArgs.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('invokeArgs', require('../invoke'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/invokeArgsMap.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('invokeArgsMap', require('../invokeMap'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/invokeMap.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('invokeMap', require('../invokeMap'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isArguments.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isArguments', require('../isArguments'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isArray.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isArray', require('../isArray'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isArrayBuffer.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isArrayBuffer', require('../isArrayBuffer'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isArrayLike.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isArrayLike', require('../isArrayLike'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isBoolean.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isBoolean', require('../isBoolean'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isBuffer.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isBuffer', require('../isBuffer'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isDate.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isDate', require('../isDate'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isElement.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isElement', require('../isElement'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isEmpty.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isEmpty', require('../isEmpty'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isEqual.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isEqual', require('../isEqual'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isEqualWith.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isEqualWith', require('../isEqualWith'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isError.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isError', require('../isError'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isFinite.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isFinite', require('../isFinite'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isFunction.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isFunction', require('../isFunction'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isInteger.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isInteger', require('../isInteger'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isLength.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isLength', require('../isLength'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isMap.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isMap', require('../isMap'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isMatch.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isMatch', require('../isMatch'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isMatchWith.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isMatchWith', require('../isMatchWith'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isNaN.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isNaN', require('../isNaN'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isNative.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isNative', require('../isNative'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isNil.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isNil', require('../isNil'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isNull.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isNull', require('../isNull'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isNumber.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isNumber', require('../isNumber'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isObject.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isObject', require('../isObject'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isObjectLike.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isObjectLike', require('../isObjectLike'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isRegExp.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isRegExp', require('../isRegExp'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isSet.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isSet', require('../isSet'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isString.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isString', require('../isString'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isSymbol.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isSymbol', require('../isSymbol'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isUndefined.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isUndefined', require('../isUndefined'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isWeakMap.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isWeakMap', require('../isWeakMap'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/isWeakSet.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('isWeakSet', require('../isWeakSet'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/iteratee.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('iteratee', require('../iteratee'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/join.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('join', require('../join'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/juxt.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./over');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/kebabCase.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('kebabCase', require('../kebabCase'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/keyBy.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('keyBy', require('../keyBy'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/keys.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('keys', require('../keys'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/keysIn.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('keysIn', require('../keysIn'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/lang.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert');
2 | module.exports = convert(require('../lang'));
3 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/last.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('last', require('../last'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/lastIndexOf.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('lastIndexOf', require('../lastIndexOf'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/lastIndexOfFrom.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('lastIndexOfFrom', require('../lastIndexOf'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/lowerCase.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('lowerCase', require('../lowerCase'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/lowerFirst.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('lowerFirst', require('../lowerFirst'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/lt.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('lt', require('../lt'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/lte.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('lte', require('../lte'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/map.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('map', require('../map'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/mapKeys.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('mapKeys', require('../mapKeys'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/mapValues.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('mapValues', require('../mapValues'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/matches.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./isMatch');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/matchesProperty.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('matchesProperty', require('../matchesProperty'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/math.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert');
2 | module.exports = convert(require('../math'));
3 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/max.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('max', require('../max'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/maxBy.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('maxBy', require('../maxBy'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/mean.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('mean', require('../mean'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/meanBy.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('meanBy', require('../meanBy'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/memoize.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('memoize', require('../memoize'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/merge.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('merge', require('../merge'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/mergeAll.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('mergeAll', require('../merge'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/mergeAllWith.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('mergeAllWith', require('../mergeWith'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/mergeWith.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('mergeWith', require('../mergeWith'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/method.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('method', require('../method'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/methodOf.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('methodOf', require('../methodOf'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/min.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('min', require('../min'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/minBy.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('minBy', require('../minBy'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/mixin.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('mixin', require('../mixin'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/multiply.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('multiply', require('../multiply'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/nAry.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./ary');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/negate.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('negate', require('../negate'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/next.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('next', require('../next'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/noop.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('noop', require('../noop'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/now.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('now', require('../now'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/nth.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('nth', require('../nth'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/nthArg.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('nthArg', require('../nthArg'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/number.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert');
2 | module.exports = convert(require('../number'));
3 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/object.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert');
2 | module.exports = convert(require('../object'));
3 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/omit.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('omit', require('../omit'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/omitAll.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./omit');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/omitBy.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('omitBy', require('../omitBy'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/once.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('once', require('../once'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/orderBy.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('orderBy', require('../orderBy'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/over.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('over', require('../over'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/overArgs.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('overArgs', require('../overArgs'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/overEvery.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('overEvery', require('../overEvery'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/overSome.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('overSome', require('../overSome'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/pad.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('pad', require('../pad'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/padChars.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('padChars', require('../pad'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/padCharsEnd.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('padCharsEnd', require('../padEnd'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/padCharsStart.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('padCharsStart', require('../padStart'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/padEnd.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('padEnd', require('../padEnd'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/padStart.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('padStart', require('../padStart'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/parseInt.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('parseInt', require('../parseInt'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/partial.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('partial', require('../partial'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/partialRight.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('partialRight', require('../partialRight'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/partition.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('partition', require('../partition'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/path.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./get');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/pathEq.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./matchesProperty');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/pathOr.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./getOr');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/paths.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./at');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/pick.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('pick', require('../pick'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/pickAll.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./pick');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/pickBy.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('pickBy', require('../pickBy'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/pipe.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./flow');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/placeholder.js:
--------------------------------------------------------------------------------
1 | /**
2 |  * The default argument placeholder value for methods.
3 |  *
4 |  * @type {Object}
5 |  */
6 | module.exports = {};
7 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/plant.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('plant', require('../plant'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/pluck.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./map');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/prop.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./get');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/propEq.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./matchesProperty');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/propOr.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./getOr');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/property.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./get');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/propertyOf.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('propertyOf', require('../get'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/props.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./at');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/pull.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('pull', require('../pull'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/pullAll.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('pullAll', require('../pullAll'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/pullAllBy.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('pullAllBy', require('../pullAllBy'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/pullAllWith.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('pullAllWith', require('../pullAllWith'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/pullAt.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('pullAt', require('../pullAt'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/random.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('random', require('../random'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/range.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('range', require('../range'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/rangeRight.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('rangeRight', require('../rangeRight'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/rangeStep.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('rangeStep', require('../range'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/rangeStepRight.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('rangeStepRight', require('../rangeRight'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/rearg.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('rearg', require('../rearg'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/reduce.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('reduce', require('../reduce'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/reduceRight.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('reduceRight', require('../reduceRight'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/reject.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('reject', require('../reject'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/remove.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('remove', require('../remove'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/repeat.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('repeat', require('../repeat'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/replace.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('replace', require('../replace'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/rest.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('rest', require('../rest'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/restFrom.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('restFrom', require('../rest'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/result.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('result', require('../result'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/reverse.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('reverse', require('../reverse'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/round.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('round', require('../round'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/sample.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('sample', require('../sample'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/sampleSize.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('sampleSize', require('../sampleSize'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/seq.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert');
2 | module.exports = convert(require('../seq'));
3 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/set.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('set', require('../set'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/setWith.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('setWith', require('../setWith'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/shuffle.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('shuffle', require('../shuffle'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/size.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('size', require('../size'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/slice.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('slice', require('../slice'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/snakeCase.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('snakeCase', require('../snakeCase'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/some.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('some', require('../some'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/sortBy.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('sortBy', require('../sortBy'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/sortedIndex.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('sortedIndex', require('../sortedIndex'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/sortedIndexBy.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('sortedIndexBy', require('../sortedIndexBy'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/sortedIndexOf.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('sortedIndexOf', require('../sortedIndexOf'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/sortedLastIndex.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('sortedLastIndex', require('../sortedLastIndex'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/sortedLastIndexBy.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('sortedLastIndexBy', require('../sortedLastIndexBy'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/sortedLastIndexOf.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('sortedLastIndexOf', require('../sortedLastIndexOf'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/sortedUniq.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('sortedUniq', require('../sortedUniq'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/sortedUniqBy.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('sortedUniqBy', require('../sortedUniqBy'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/split.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('split', require('../split'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/spread.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('spread', require('../spread'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/spreadFrom.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('spreadFrom', require('../spread'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/startCase.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('startCase', require('../startCase'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/startsWith.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('startsWith', require('../startsWith'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/string.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert');
2 | module.exports = convert(require('../string'));
3 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/stubArray.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('stubArray', require('../stubArray'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/stubFalse.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('stubFalse', require('../stubFalse'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/stubObject.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('stubObject', require('../stubObject'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/stubString.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('stubString', require('../stubString'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/stubTrue.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('stubTrue', require('../stubTrue'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/subtract.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('subtract', require('../subtract'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/sum.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('sum', require('../sum'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/sumBy.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('sumBy', require('../sumBy'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/symmetricDifference.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./xor');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/symmetricDifferenceBy.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./xorBy');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/symmetricDifferenceWith.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./xorWith');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/tail.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('tail', require('../tail'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/take.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('take', require('../take'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/takeLast.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./takeRight');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/takeLastWhile.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./takeRightWhile');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/takeRight.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('takeRight', require('../takeRight'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/takeRightWhile.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('takeRightWhile', require('../takeRightWhile'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/takeWhile.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('takeWhile', require('../takeWhile'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/tap.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('tap', require('../tap'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/template.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('template', require('../template'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/throttle.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('throttle', require('../throttle'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/thru.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('thru', require('../thru'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/times.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('times', require('../times'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/toArray.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('toArray', require('../toArray'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/toFinite.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('toFinite', require('../toFinite'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/toInteger.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('toInteger', require('../toInteger'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/toIterator.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('toIterator', require('../toIterator'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/toJSON.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('toJSON', require('../toJSON'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/toLength.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('toLength', require('../toLength'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/toLower.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('toLower', require('../toLower'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/toNumber.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('toNumber', require('../toNumber'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/toPairs.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('toPairs', require('../toPairs'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/toPairsIn.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('toPairsIn', require('../toPairsIn'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/toPath.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('toPath', require('../toPath'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/toString.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('toString', require('../toString'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/toUpper.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('toUpper', require('../toUpper'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/transform.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('transform', require('../transform'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/trim.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('trim', require('../trim'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/trimChars.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('trimChars', require('../trim'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/trimCharsEnd.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('trimCharsEnd', require('../trimEnd'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/trimCharsStart.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('trimCharsStart', require('../trimStart'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/trimEnd.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('trimEnd', require('../trimEnd'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/trimStart.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('trimStart', require('../trimStart'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/truncate.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('truncate', require('../truncate'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/unapply.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./rest');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/unary.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('unary', require('../unary'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/unescape.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('unescape', require('../unescape'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/union.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('union', require('../union'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/unionBy.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('unionBy', require('../unionBy'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/unionWith.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('unionWith', require('../unionWith'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/uniq.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('uniq', require('../uniq'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/uniqBy.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('uniqBy', require('../uniqBy'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/uniqWith.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('uniqWith', require('../uniqWith'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/uniqueId.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('uniqueId', require('../uniqueId'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/unnest.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./flatten');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/unset.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('unset', require('../unset'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/unzip.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('unzip', require('../unzip'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/unzipWith.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('unzipWith', require('../unzipWith'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/update.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('update', require('../update'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/updateWith.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('updateWith', require('../updateWith'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/upperCase.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('upperCase', require('../upperCase'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/upperFirst.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('upperFirst', require('../upperFirst'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/useWith.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./overArgs');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/util.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert');
2 | module.exports = convert(require('../util'));
3 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/value.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('value', require('../value'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/valueOf.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('valueOf', require('../valueOf'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/values.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('values', require('../values'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/valuesIn.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('valuesIn', require('../valuesIn'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/where.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./conformsTo');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/whereEq.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./isMatch');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/without.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('without', require('../without'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/words.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('words', require('../words'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/wrap.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('wrap', require('../wrap'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/wrapperAt.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('wrapperAt', require('../wrapperAt'), require('./_falseOptions'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/xor.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('xor', require('../xor'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/xorBy.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('xorBy', require('../xorBy'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/xorWith.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('xorWith', require('../xorWith'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/zip.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('zip', require('../zip'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/zipAll.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('zipAll', require('../zip'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/zipObj.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./zipObject');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/zipObject.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('zipObject', require('../zipObject'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/zipObjectDeep.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('zipObjectDeep', require('../zipObjectDeep'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/fp/zipWith.js:
--------------------------------------------------------------------------------
1 | var convert = require('./convert'),
2 |     func = convert('zipWith', require('../zipWith'));
3 | 
4 | func.placeholder = require('./placeholder');
5 | module.exports = func;
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/index.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./lodash');


--------------------------------------------------------------------------------
/node_modules/lodash/number.js:
--------------------------------------------------------------------------------
1 | module.exports = {
2 |   'clamp': require('./clamp'),
3 |   'inRange': require('./inRange'),
4 |   'random': require('./random')
5 | };
6 | 


--------------------------------------------------------------------------------
/node_modules/lodash/toJSON.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./wrapperValue');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/value.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./wrapperValue');
2 | 


--------------------------------------------------------------------------------
/node_modules/lodash/valueOf.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./wrapperValue');
2 | 


--------------------------------------------------------------------------------
/node_modules/math-intrinsics/abs.d.ts:
--------------------------------------------------------------------------------
1 | export = Math.abs;


--------------------------------------------------------------------------------
/node_modules/math-intrinsics/abs.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | /** @type {import('./abs')} */
4 | module.exports = Math.abs;
5 | 


--------------------------------------------------------------------------------
/node_modules/math-intrinsics/constants/maxArrayLength.d.ts:
--------------------------------------------------------------------------------
1 | declare const MAX_ARRAY_LENGTH: 4294967295;
2 | 
3 | export = MAX_ARRAY_LENGTH;


--------------------------------------------------------------------------------
/node_modules/math-intrinsics/constants/maxArrayLength.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | /** @type {import('./maxArrayLength')} */
4 | module.exports = 4294967295; // Math.pow(2, 32) - 1;
5 | 


--------------------------------------------------------------------------------
/node_modules/math-intrinsics/constants/maxSafeInteger.d.ts:
--------------------------------------------------------------------------------
1 | declare const MAX_SAFE_INTEGER: 9007199254740991;
2 | 
3 | export = MAX_SAFE_INTEGER;


--------------------------------------------------------------------------------
/node_modules/math-intrinsics/constants/maxValue.d.ts:
--------------------------------------------------------------------------------
1 | declare const MAX_VALUE: 1.7976931348623157e+308;
2 | 
3 | export = MAX_VALUE;
4 | 


--------------------------------------------------------------------------------
/node_modules/math-intrinsics/floor.d.ts:
--------------------------------------------------------------------------------
1 | export = Math.floor;


--------------------------------------------------------------------------------
/node_modules/math-intrinsics/floor.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | /** @type {import('./floor')} */
4 | module.exports = Math.floor;
5 | 


--------------------------------------------------------------------------------
/node_modules/math-intrinsics/isFinite.d.ts:
--------------------------------------------------------------------------------
1 | declare function isFinite(x: unknown): x is number | bigint;
2 | 
3 | export = isFinite;


--------------------------------------------------------------------------------
/node_modules/math-intrinsics/isInteger.d.ts:
--------------------------------------------------------------------------------
1 | declare function isInteger(argument: unknown): argument is number;
2 | 
3 | export = isInteger;


--------------------------------------------------------------------------------
/node_modules/math-intrinsics/isNaN.d.ts:
--------------------------------------------------------------------------------
1 | export = Number.isNaN;


--------------------------------------------------------------------------------
/node_modules/math-intrinsics/isNaN.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | /** @type {import('./isNaN')} */
4 | module.exports = Number.isNaN || function isNaN(a) {
5 | 	return a !== a;
6 | };
7 | 


--------------------------------------------------------------------------------
/node_modules/math-intrinsics/isNegativeZero.d.ts:
--------------------------------------------------------------------------------
1 | declare function isNegativeZero(x: unknown): boolean;
2 | 
3 | export = isNegativeZero;


--------------------------------------------------------------------------------
/node_modules/math-intrinsics/isNegativeZero.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | /** @type {import('./isNegativeZero')} */
4 | module.exports = function isNegativeZero(x) {
5 | 	return x === 0 && 1 / x === 1 / -0;
6 | };
7 | 


--------------------------------------------------------------------------------
/node_modules/math-intrinsics/max.d.ts:
--------------------------------------------------------------------------------
1 | export = Math.max;


--------------------------------------------------------------------------------
/node_modules/math-intrinsics/max.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | /** @type {import('./max')} */
4 | module.exports = Math.max;
5 | 


--------------------------------------------------------------------------------
/node_modules/math-intrinsics/min.d.ts:
--------------------------------------------------------------------------------
1 | export = Math.min;


--------------------------------------------------------------------------------
/node_modules/math-intrinsics/min.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | /** @type {import('./min')} */
4 | module.exports = Math.min;
5 | 


--------------------------------------------------------------------------------
/node_modules/math-intrinsics/mod.d.ts:
--------------------------------------------------------------------------------
1 | declare function mod(number: number, modulo: number): number;
2 | 
3 | export = mod;


--------------------------------------------------------------------------------
/node_modules/math-intrinsics/pow.d.ts:
--------------------------------------------------------------------------------
1 | export = Math.pow;


--------------------------------------------------------------------------------
/node_modules/math-intrinsics/pow.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | /** @type {import('./pow')} */
4 | module.exports = Math.pow;
5 | 


--------------------------------------------------------------------------------
/node_modules/math-intrinsics/round.d.ts:
--------------------------------------------------------------------------------
1 | export = Math.round;


--------------------------------------------------------------------------------
/node_modules/math-intrinsics/round.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | /** @type {import('./round')} */
4 | module.exports = Math.round;
5 | 


--------------------------------------------------------------------------------
/node_modules/math-intrinsics/sign.d.ts:
--------------------------------------------------------------------------------
1 | declare function sign(x: number): number;
2 | 
3 | export = sign;


--------------------------------------------------------------------------------
/node_modules/math-intrinsics/tsconfig.json:
--------------------------------------------------------------------------------
1 | {
2 | 	"extends": "@ljharb/tsconfig",
3 | }
4 | 


--------------------------------------------------------------------------------
/node_modules/memory-pager/.travis.yml:
--------------------------------------------------------------------------------
1 | language: node_js
2 | node_js:
3 |   - '4'
4 |   - '6'
5 | 


--------------------------------------------------------------------------------
/node_modules/mime/.npmignore:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/deepakrjain/guest-onboarding/298f09830fb03f5fb471d014f0588e5b834ec63a/node_modules/mime/.npmignore


--------------------------------------------------------------------------------
/node_modules/mime/cli.js:
--------------------------------------------------------------------------------
1 | #!/usr/bin/env node
2 | 
3 | var mime = require('./mime.js');
4 | var file = process.argv[2];
5 | var type = mime.lookup(file);
6 | 
7 | process.stdout.write(type + '\n');
8 | 
9 | 


--------------------------------------------------------------------------------
/node_modules/minimist/example/parse.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | var argv = require('../')(process.argv.slice(2));
4 | console.log(argv);
5 | 


--------------------------------------------------------------------------------
/node_modules/mongodb/lib/operations/client_bulk_write/common.js:
--------------------------------------------------------------------------------
1 | "use strict";
2 | Object.defineProperty(exports, "__esModule", { value: true });
3 | //# sourceMappingURL=common.js.map


--------------------------------------------------------------------------------
/node_modules/mongodb/lib/operations/client_bulk_write/common.js.map:
--------------------------------------------------------------------------------
1 | {"version":3,"file":"common.js","sourceRoot":"","sources":["../../../src/operations/client_bulk_write/common.ts"],"names":[],"mappings":""}


--------------------------------------------------------------------------------
/node_modules/mongoose/SECURITY.md:
--------------------------------------------------------------------------------
1 | Please follow the instructions on [Tidelift's security page](https://tidelift.com/docs/security) to report a security issue.
2 | 


--------------------------------------------------------------------------------
/node_modules/mongoose/browser.js:
--------------------------------------------------------------------------------
1 | /**
2 |  * Export lib/mongoose
3 |  *
4 |  */
5 | 
6 | 'use strict';
7 | 
8 | module.exports = require('./lib/browser');
9 | 


--------------------------------------------------------------------------------
/node_modules/mongoose/lib/drivers/SPEC.md:
--------------------------------------------------------------------------------
1 | 
2 | # Driver Spec
3 | 
4 | TODO
5 | 


--------------------------------------------------------------------------------
/node_modules/mongoose/lib/drivers/browser/decimal128.js:
--------------------------------------------------------------------------------
1 | /*!
2 |  * ignore
3 |  */
4 | 
5 | 'use strict';
6 | 
7 | module.exports = require('bson').Decimal128;
8 | 


--------------------------------------------------------------------------------
/node_modules/mongoose/lib/drivers/node-mongodb-native/index.js:
--------------------------------------------------------------------------------
1 | /*!
2 |  * Module exports.
3 |  */
4 | 
5 | 'use strict';
6 | 
7 | exports.Collection = require('./collection');
8 | exports.Connection = require('./connection');
9 | 


--------------------------------------------------------------------------------
/node_modules/mongoose/lib/helpers/firstKey.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | module.exports = function firstKey(obj) {
4 |   if (obj == null) {
5 |     return null;
6 |   }
7 |   return Object.keys(obj)[0];
8 | };
9 | 


--------------------------------------------------------------------------------
/node_modules/mongoose/lib/helpers/isPromise.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | function isPromise(val) {
3 |   return !!val && (typeof val === 'object' || typeof val === 'function') && typeof val.then === 'function';
4 | }
5 | 
6 | module.exports = isPromise;
7 | 


--------------------------------------------------------------------------------
/node_modules/mongoose/lib/helpers/populate/leanPopulateMap.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | /*!
4 |  * ignore
5 |  */
6 | 
7 | module.exports = new WeakMap();
8 | 


--------------------------------------------------------------------------------
/node_modules/mongoose/lib/helpers/query/validOps.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | module.exports = require('../../constants').queryMiddlewareFunctions;
4 | 


--------------------------------------------------------------------------------
/node_modules/mongoose/lib/helpers/specialProperties.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | module.exports = new Set(['__proto__', 'constructor', 'prototype']);
4 | 


--------------------------------------------------------------------------------
/node_modules/mongoose/lib/helpers/timers.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | exports.setTimeout = setTimeout;
4 | 


--------------------------------------------------------------------------------
/node_modules/mongoose/lib/options/propertyOptions.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | module.exports = Object.freeze({
4 |   enumerable: true,
5 |   configurable: true,
6 |   writable: true,
7 |   value: void 0
8 | });
9 | 


--------------------------------------------------------------------------------
/node_modules/mongoose/lib/schema/symbols.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | exports.schemaMixedSymbol = Symbol.for('mongoose:schema_mixed');
4 | 
5 | exports.builtInMiddleware = Symbol.for('mongoose:built-in-middleware');
6 | 


--------------------------------------------------------------------------------
/node_modules/mongoose/lib/types/array/isMongooseArray.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | exports.isMongooseArray = function(mongooseArray) {
4 |   return Array.isArray(mongooseArray) && mongooseArray.isMongooseArray;
5 | };
6 | 


--------------------------------------------------------------------------------
/node_modules/mpath/.travis.yml:
--------------------------------------------------------------------------------
 1 | language: node_js
 2 | node_js:
 3 |   - "4"
 4 |   - "5"
 5 |   - "6"
 6 |   - "7"
 7 |   - "8"
 8 |   - "9"
 9 |   - "10"
10 | 


--------------------------------------------------------------------------------
/node_modules/mpath/index.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | module.exports = exports = require('./lib');
4 | 


--------------------------------------------------------------------------------
/node_modules/mpath/test/.eslintrc.yml:
--------------------------------------------------------------------------------
1 | env:
2 |   mocha: true
3 | rules:
4 |   no-unused-vars: off


--------------------------------------------------------------------------------
/node_modules/mquery/SECURITY.md:
--------------------------------------------------------------------------------
1 | Please follow the instructions on [Tidelift's security page](https://tidelift.com/docs/security) to report a security issue.
2 | 


--------------------------------------------------------------------------------
/node_modules/node-addon-api/node_api.gyp:
--------------------------------------------------------------------------------
 1 | {
 2 |   'targets': [
 3 |     {
 4 |       'target_name': 'nothing',
 5 |       'type': 'static_library',
 6 |       'sources': [ 'nothing.c' ]
 7 |     }
 8 |   ]
 9 | }
10 | 


--------------------------------------------------------------------------------
/node_modules/node-addon-api/nothing.c:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/deepakrjain/guest-onboarding/298f09830fb03f5fb471d014f0588e5b834ec63a/node_modules/node-addon-api/nothing.c


--------------------------------------------------------------------------------
/node_modules/node-fetch/node_modules/tr46/.npmignore:
--------------------------------------------------------------------------------
1 | scripts/
2 | test/
3 | 
4 | !lib/mapping_table.json
5 | 


--------------------------------------------------------------------------------
/node_modules/node-fetch/node_modules/tr46/lib/.gitkeep:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/deepakrjain/guest-onboarding/298f09830fb03f5fb471d014f0588e5b834ec63a/node_modules/node-fetch/node_modules/tr46/lib/.gitkeep


--------------------------------------------------------------------------------
/node_modules/nodemon/.prettierrc.json:
--------------------------------------------------------------------------------
1 | {
2 |   "singleQuote": true
3 | }
4 | 


--------------------------------------------------------------------------------
/node_modules/nodemon/bin/windows-kill.exe:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/deepakrjain/guest-onboarding/298f09830fb03f5fb471d014f0588e5b834ec63a/node_modules/nodemon/bin/windows-kill.exe


--------------------------------------------------------------------------------
/node_modules/nodemon/doc/cli/usage.txt:
--------------------------------------------------------------------------------
1 |   Usage: nodemon [nodemon options] [script.js] [args]
2 | 
3 |   See "nodemon --help" for more.
4 | 


--------------------------------------------------------------------------------
/node_modules/nodemon/jsconfig.json:
--------------------------------------------------------------------------------
1 | {
2 |   "compilerOptions": {
3 |     "typeRoots": ["./index.d.ts", "./node_modules/@types"],
4 |     "checkJs": true
5 |   },
6 |   "exclude": ["node_modules"]
7 | }
8 | 


--------------------------------------------------------------------------------
/node_modules/nodemon/lib/index.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./nodemon');


--------------------------------------------------------------------------------
/node_modules/nodemon/lib/monitor/index.js:
--------------------------------------------------------------------------------
1 | module.exports = {
2 |   run: require('./run'),
3 |   watch: require('./watch').watch,
4 | };
5 | 


--------------------------------------------------------------------------------
/node_modules/nodemon/node_modules/supports-color/browser.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | module.exports = {
3 | 	stdout: false,
4 | 	stderr: false
5 | };
6 | 


--------------------------------------------------------------------------------
/node_modules/object-inspect/example/circular.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | var inspect = require('../');
4 | var obj = { a: 1, b: [3, 4] };
5 | obj.c = obj;
6 | console.log(inspect(obj));
7 | 


--------------------------------------------------------------------------------
/node_modules/object-inspect/example/fn.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | var inspect = require('../');
4 | var obj = [1, 2, function f(n) { return n + 5; }, 4];
5 | console.log(inspect(obj));
6 | 


--------------------------------------------------------------------------------
/node_modules/object-inspect/util.inspect.js:
--------------------------------------------------------------------------------
1 | module.exports = require('util').inspect;
2 | 


--------------------------------------------------------------------------------
/node_modules/picomatch/index.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | module.exports = require('./lib/picomatch');
4 | 


--------------------------------------------------------------------------------
/node_modules/pngjs/.eslintignore:
--------------------------------------------------------------------------------
1 | /browser.js
2 | /test/imagediff.js
3 | 


--------------------------------------------------------------------------------
/node_modules/pngjs/.prettierignore:
--------------------------------------------------------------------------------
1 | /browser.js
2 | /test/imagediff.js
3 | .nyc_output
4 | 


--------------------------------------------------------------------------------
/node_modules/pngjs/coverage/lcov-report/favicon.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/deepakrjain/guest-onboarding/298f09830fb03f5fb471d014f0588e5b834ec63a/node_modules/pngjs/coverage/lcov-report/favicon.png


--------------------------------------------------------------------------------
/node_modules/pngjs/coverage/lcov-report/sort-arrow-sprite.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/deepakrjain/guest-onboarding/298f09830fb03f5fb471d014f0588e5b834ec63a/node_modules/pngjs/coverage/lcov-report/sort-arrow-sprite.png


--------------------------------------------------------------------------------
/node_modules/pstree.remy/.travis.yml:
--------------------------------------------------------------------------------
1 | language: node_js
2 | cache:
3 |   directories:
4 |     - ~/.npm
5 | notifications:
6 |   email: false
7 | node_js:
8 |   - '8'
9 | 


--------------------------------------------------------------------------------
/node_modules/qrcode/helper/to-sjis-browser.js:
--------------------------------------------------------------------------------
1 | /* global QRCode */
2 | QRCode.toSJIS = require('./to-sjis')
3 | 


--------------------------------------------------------------------------------
/node_modules/random-bytes/HISTORY.md:
--------------------------------------------------------------------------------
1 | 1.0.0 / 2016-01-17
2 | ==================
3 | 
4 |   * Initial release
5 | 


--------------------------------------------------------------------------------
/node_modules/readable-stream/duplex-browser.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./lib/_stream_duplex.js');
2 | 


--------------------------------------------------------------------------------
/node_modules/readable-stream/duplex.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./readable').Duplex
2 | 


--------------------------------------------------------------------------------
/node_modules/readable-stream/lib/internal/streams/stream-browser.js:
--------------------------------------------------------------------------------
1 | module.exports = require('events').EventEmitter;
2 | 


--------------------------------------------------------------------------------
/node_modules/readable-stream/lib/internal/streams/stream.js:
--------------------------------------------------------------------------------
1 | module.exports = require('stream');
2 | 


--------------------------------------------------------------------------------
/node_modules/readable-stream/passthrough.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./readable').PassThrough
2 | 


--------------------------------------------------------------------------------
/node_modules/readable-stream/transform.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./readable').Transform
2 | 


--------------------------------------------------------------------------------
/node_modules/readable-stream/writable-browser.js:
--------------------------------------------------------------------------------
1 | module.exports = require('./lib/_stream_writable.js');
2 | 


--------------------------------------------------------------------------------
/node_modules/require-directory/.npmignore:
--------------------------------------------------------------------------------
1 | test/**
2 | 


--------------------------------------------------------------------------------
/node_modules/require-directory/.travis.yml:
--------------------------------------------------------------------------------
1 | language: node_js
2 | node_js:
3 |   - 0.10
4 | 


--------------------------------------------------------------------------------
/node_modules/semver/classes/index.js:
--------------------------------------------------------------------------------
1 | module.exports = {
2 |   SemVer: require('./semver.js'),
3 |   Range: require('./range.js'),
4 |   Comparator: require('./comparator.js'),
5 | }
6 | 


--------------------------------------------------------------------------------
/node_modules/semver/functions/clean.js:
--------------------------------------------------------------------------------
1 | const parse = require('./parse')
2 | const clean = (version, options) => {
3 |   const s = parse(version.trim().replace(/^[=v]+/, ''), options)
4 |   return s ? s.version : null
5 | }
6 | module.exports = clean
7 | 


--------------------------------------------------------------------------------
/node_modules/semver/functions/compare-loose.js:
--------------------------------------------------------------------------------
1 | const compare = require('./compare')
2 | const compareLoose = (a, b) => compare(a, b, true)
3 | module.exports = compareLoose
4 | 


--------------------------------------------------------------------------------
/node_modules/semver/functions/compare.js:
--------------------------------------------------------------------------------
1 | const SemVer = require('../classes/semver')
2 | const compare = (a, b, loose) =>
3 |   new SemVer(a, loose).compare(new SemVer(b, loose))
4 | 
5 | module.exports = compare
6 | 


--------------------------------------------------------------------------------
/node_modules/semver/functions/eq.js:
--------------------------------------------------------------------------------
1 | const compare = require('./compare')
2 | const eq = (a, b, loose) => compare(a, b, loose) === 0
3 | module.exports = eq
4 | 


--------------------------------------------------------------------------------
/node_modules/semver/functions/gt.js:
--------------------------------------------------------------------------------
1 | const compare = require('./compare')
2 | const gt = (a, b, loose) => compare(a, b, loose) > 0
3 | module.exports = gt
4 | 


--------------------------------------------------------------------------------
/node_modules/semver/functions/gte.js:
--------------------------------------------------------------------------------
1 | const compare = require('./compare')
2 | const gte = (a, b, loose) => compare(a, b, loose) >= 0
3 | module.exports = gte
4 | 


--------------------------------------------------------------------------------
/node_modules/semver/functions/lt.js:
--------------------------------------------------------------------------------
1 | const compare = require('./compare')
2 | const lt = (a, b, loose) => compare(a, b, loose) < 0
3 | module.exports = lt
4 | 


--------------------------------------------------------------------------------
/node_modules/semver/functions/lte.js:
--------------------------------------------------------------------------------
1 | const compare = require('./compare')
2 | const lte = (a, b, loose) => compare(a, b, loose) <= 0
3 | module.exports = lte
4 | 


--------------------------------------------------------------------------------
/node_modules/semver/functions/major.js:
--------------------------------------------------------------------------------
1 | const SemVer = require('../classes/semver')
2 | const major = (a, loose) => new SemVer(a, loose).major
3 | module.exports = major
4 | 


--------------------------------------------------------------------------------
/node_modules/semver/functions/minor.js:
--------------------------------------------------------------------------------
1 | const SemVer = require('../classes/semver')
2 | const minor = (a, loose) => new SemVer(a, loose).minor
3 | module.exports = minor
4 | 


--------------------------------------------------------------------------------
/node_modules/semver/functions/neq.js:
--------------------------------------------------------------------------------
1 | const compare = require('./compare')
2 | const neq = (a, b, loose) => compare(a, b, loose) !== 0
3 | module.exports = neq
4 | 


--------------------------------------------------------------------------------
/node_modules/semver/functions/patch.js:
--------------------------------------------------------------------------------
1 | const SemVer = require('../classes/semver')
2 | const patch = (a, loose) => new SemVer(a, loose).patch
3 | module.exports = patch
4 | 


--------------------------------------------------------------------------------
/node_modules/semver/functions/rcompare.js:
--------------------------------------------------------------------------------
1 | const compare = require('./compare')
2 | const rcompare = (a, b, loose) => compare(b, a, loose)
3 | module.exports = rcompare
4 | 


--------------------------------------------------------------------------------
/node_modules/semver/functions/rsort.js:
--------------------------------------------------------------------------------
1 | const compareBuild = require('./compare-build')
2 | const rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose))
3 | module.exports = rsort
4 | 


--------------------------------------------------------------------------------
/node_modules/semver/functions/sort.js:
--------------------------------------------------------------------------------
1 | const compareBuild = require('./compare-build')
2 | const sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose))
3 | module.exports = sort
4 | 


--------------------------------------------------------------------------------
/node_modules/semver/functions/valid.js:
--------------------------------------------------------------------------------
1 | const parse = require('./parse')
2 | const valid = (version, options) => {
3 |   const v = parse(version, options)
4 |   return v ? v.version : null
5 | }
6 | module.exports = valid
7 | 


--------------------------------------------------------------------------------
/node_modules/semver/preload.js:
--------------------------------------------------------------------------------
1 | // XXX remove in v8 or beyond
2 | module.exports = require('./index.js')
3 | 


--------------------------------------------------------------------------------
/node_modules/setprototypeof/index.d.ts:
--------------------------------------------------------------------------------
1 | declare function setPrototypeOf(o: any, proto: object | null): any;
2 | export = setPrototypeOf;
3 | 


--------------------------------------------------------------------------------
/node_modules/side-channel-list/.editorconfig:
--------------------------------------------------------------------------------
 1 | root = true
 2 | 
 3 | [*]
 4 | charset = utf-8
 5 | end_of_line = lf
 6 | insert_final_newline = true
 7 | indent_style = tab
 8 | indent_size = 2
 9 | trim_trailing_whitespace = true
10 | 


--------------------------------------------------------------------------------
/node_modules/side-channel-list/tsconfig.json:
--------------------------------------------------------------------------------
 1 | {
 2 | 	"extends": "@ljharb/tsconfig",
 3 | 	"compilerOptions": {
 4 | 		"target": "es2021",
 5 | 	},
 6 | 	"exclude": [
 7 | 		"coverage",
 8 | 	],
 9 | }
10 | 


--------------------------------------------------------------------------------
/node_modules/side-channel-map/.editorconfig:
--------------------------------------------------------------------------------
 1 | root = true
 2 | 
 3 | [*]
 4 | charset = utf-8
 5 | end_of_line = lf
 6 | insert_final_newline = true
 7 | indent_style = tab
 8 | indent_size = 2
 9 | trim_trailing_whitespace = true
10 | 


--------------------------------------------------------------------------------
/node_modules/side-channel-map/tsconfig.json:
--------------------------------------------------------------------------------
 1 | {
 2 | 	"extends": "@ljharb/tsconfig",
 3 | 	"compilerOptions": {
 4 | 		"target": "es2021",
 5 | 	},
 6 | 	"exclude": [
 7 | 		"coverage",
 8 | 	],
 9 | }
10 | 


--------------------------------------------------------------------------------
/node_modules/side-channel-weakmap/.editorconfig:
--------------------------------------------------------------------------------
 1 | root = true
 2 | 
 3 | [*]
 4 | charset = utf-8
 5 | end_of_line = lf
 6 | insert_final_newline = true
 7 | indent_style = tab
 8 | indent_size = 2
 9 | trim_trailing_whitespace = true
10 | 


--------------------------------------------------------------------------------
/node_modules/side-channel-weakmap/tsconfig.json:
--------------------------------------------------------------------------------
 1 | {
 2 | 	"extends": "@ljharb/tsconfig",
 3 | 	"compilerOptions": {
 4 | 		"target": "es2021",
 5 | 	},
 6 | 	"exclude": [
 7 | 		"coverage",
 8 | 	],
 9 | }
10 | 


--------------------------------------------------------------------------------
/node_modules/side-channel/.editorconfig:
--------------------------------------------------------------------------------
 1 | root = true
 2 | 
 3 | [*]
 4 | charset = utf-8
 5 | end_of_line = lf
 6 | insert_final_newline = true
 7 | indent_style = tab
 8 | indent_size = 2
 9 | trim_trailing_whitespace = true
10 | 


--------------------------------------------------------------------------------
/node_modules/side-channel/tsconfig.json:
--------------------------------------------------------------------------------
 1 | {
 2 | 	"extends": "@ljharb/tsconfig",
 3 | 	"compilerOptions": {
 4 | 		"target": "es2021",
 5 | 	},
 6 | 	"exclude": [
 7 | 		"coverage",
 8 | 	],
 9 | }
10 | 


--------------------------------------------------------------------------------
/node_modules/sift/index.d.ts:
--------------------------------------------------------------------------------
1 | import sift from "./lib";
2 | 
3 | export default sift;
4 | export * from "./lib";
5 | 


--------------------------------------------------------------------------------
/node_modules/sift/index.js:
--------------------------------------------------------------------------------
1 | const lib = require("./lib");
2 | 
3 | module.exports = lib.default;
4 | Object.assign(module.exports, lib);
5 | 


--------------------------------------------------------------------------------
/node_modules/sparse-bitfield/.npmignore:
--------------------------------------------------------------------------------
1 | node_modules
2 | 


--------------------------------------------------------------------------------
/node_modules/sparse-bitfield/.travis.yml:
--------------------------------------------------------------------------------
1 | language: node_js
2 | node_js:
3 |   - '0.10'
4 |   - '0.12'
5 |   - '4.0'
6 |   - '5.0'
7 | 


--------------------------------------------------------------------------------
/node_modules/streamsearch/.eslintrc.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | 
3 | module.exports = {
4 |   extends: '@mscdex/eslint-config',
5 | };
6 | 


--------------------------------------------------------------------------------
/node_modules/strip-ansi/index.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | const ansiRegex = require('ansi-regex');
3 | 
4 | module.exports = string => typeof string === 'string' ? string.replace(ansiRegex(), '') : string;
5 | 


--------------------------------------------------------------------------------
/node_modules/supports-color/browser.js:
--------------------------------------------------------------------------------
1 | 'use strict';
2 | module.exports = {
3 | 	stdout: false,
4 | 	stderr: false
5 | };
6 | 


--------------------------------------------------------------------------------
/node_modules/toidentifier/HISTORY.md:
--------------------------------------------------------------------------------
 1 | 1.0.1 / 2021-11-14
 2 | ==================
 3 | 
 4 |   * pref: enable strict mode
 5 | 
 6 | 1.0.0 / 2018-07-09
 7 | ==================
 8 | 
 9 |   * Initial release
10 | 


--------------------------------------------------------------------------------
/node_modules/typedarray/.travis.yml:
--------------------------------------------------------------------------------
1 | language: node_js
2 | node_js:
3 |   - "0.8"
4 |   - "0.10"
5 | 


--------------------------------------------------------------------------------
/node_modules/typedarray/example/tarray.js:
--------------------------------------------------------------------------------
1 | var Uint8Array = require('../').Uint8Array;
2 | var ua = new Uint8Array(5);
3 | ua[1] = 256 + 55;
4 | console.log(ua[1]);
5 | 


--------------------------------------------------------------------------------
/node_modules/unpipe/HISTORY.md:
--------------------------------------------------------------------------------
1 | 1.0.0 / 2015-06-14
2 | ==================
3 | 
4 |   * Initial release
5 | 


--------------------------------------------------------------------------------
/node_modules/util-deprecate/node.js:
--------------------------------------------------------------------------------
1 | 
2 | /**
3 |  * For Node.js, simply re-export the core `util.deprecate` function.
4 |  */
5 | 
6 | module.exports = require('util').deprecate;
7 | 


--------------------------------------------------------------------------------
/node_modules/utils-merge/.npmignore:
--------------------------------------------------------------------------------
 1 | CONTRIBUTING.md
 2 | Makefile
 3 | docs/
 4 | examples/
 5 | reports/
 6 | test/
 7 | 
 8 | .jshintrc
 9 | .travis.yml
10 | 


--------------------------------------------------------------------------------
/node_modules/validator/es/lib/blacklist.js:
--------------------------------------------------------------------------------
1 | import assertString from './util/assertString';
2 | export default function blacklist(str, chars) {
3 |   assertString(str);
4 |   return str.replace(new RegExp("[".concat(chars, "]+"), 'g'), '');
5 | }


--------------------------------------------------------------------------------
/node_modules/validator/es/lib/equals.js:
--------------------------------------------------------------------------------
1 | import assertString from './util/assertString';
2 | export default function equals(str, comparison) {
3 |   assertString(str);
4 |   return str === comparison;
5 | }


--------------------------------------------------------------------------------
/node_modules/validator/es/lib/isEthereumAddress.js:
--------------------------------------------------------------------------------
1 | import assertString from './util/assertString';
2 | var eth = /^(0x)[0-9a-f]{40}$/i;
3 | export default function isEthereumAddress(str) {
4 |   assertString(str);
5 |   return eth.test(str);
6 | }


--------------------------------------------------------------------------------
/node_modules/validator/es/lib/isLowercase.js:
--------------------------------------------------------------------------------
1 | import assertString from './util/assertString';
2 | export default function isLowercase(str) {
3 |   assertString(str);
4 |   return str === str.toLowerCase();
5 | }


--------------------------------------------------------------------------------
/node_modules/validator/es/lib/isMD5.js:
--------------------------------------------------------------------------------
1 | import assertString from './util/assertString';
2 | var md5 = /^[a-f0-9]{32}$/;
3 | export default function isMD5(str) {
4 |   assertString(str);
5 |   return md5.test(str);
6 | }


--------------------------------------------------------------------------------
/node_modules/validator/es/lib/isOctal.js:
--------------------------------------------------------------------------------
1 | import assertString from './util/assertString';
2 | var octal = /^(0o)?[0-7]+$/i;
3 | export default function isOctal(str) {
4 |   assertString(str);
5 |   return octal.test(str);
6 | }


--------------------------------------------------------------------------------
/node_modules/validator/es/lib/isPort.js:
--------------------------------------------------------------------------------
1 | import isInt from './isInt';
2 | export default function isPort(str) {
3 |   return isInt(str, {
4 |     allow_leading_zeroes: false,
5 |     min: 0,
6 |     max: 65535
7 |   });
8 | }


--------------------------------------------------------------------------------
/node_modules/validator/es/lib/isUppercase.js:
--------------------------------------------------------------------------------
1 | import assertString from './util/assertString';
2 | export default function isUppercase(str) {
3 |   assertString(str);
4 |   return str === str.toUpperCase();
5 | }


--------------------------------------------------------------------------------
/node_modules/validator/es/lib/toDate.js:
--------------------------------------------------------------------------------
1 | import assertString from './util/assertString';
2 | export default function toDate(date) {
3 |   assertString(date);
4 |   date = Date.parse(date);
5 |   return !isNaN(date) ? new Date(date) : null;
6 | }


--------------------------------------------------------------------------------
/node_modules/validator/es/lib/toFloat.js:
--------------------------------------------------------------------------------
1 | import isFloat from './isFloat';
2 | export default function toFloat(str) {
3 |   if (!isFloat(str)) return NaN;
4 |   return parseFloat(str);
5 | }


--------------------------------------------------------------------------------
/node_modules/validator/es/lib/toInt.js:
--------------------------------------------------------------------------------
1 | import assertString from './util/assertString';
2 | export default function toInt(str, radix) {
3 |   assertString(str);
4 |   return parseInt(str, radix || 10);
5 | }


--------------------------------------------------------------------------------
/node_modules/validator/es/lib/trim.js:
--------------------------------------------------------------------------------
1 | import rtrim from './rtrim';
2 | import ltrim from './ltrim';
3 | export default function trim(str, chars) {
4 |   return rtrim(ltrim(str, chars), chars);
5 | }


--------------------------------------------------------------------------------
/node_modules/validator/es/lib/util/includes.js:
--------------------------------------------------------------------------------
1 | var includes = function includes(arr, val) {
2 |   return arr.some(function (arrVal) {
3 |     return val === arrVal;
4 |   });
5 | };
6 | export default includes;


--------------------------------------------------------------------------------
/node_modules/validator/es/lib/whitelist.js:
--------------------------------------------------------------------------------
1 | import assertString from './util/assertString';
2 | export default function whitelist(str, chars) {
3 |   assertString(str);
4 |   return str.replace(new RegExp("[^".concat(chars, "]+"), 'g'), '');
5 | }


--------------------------------------------------------------------------------
/node_modules/whatwg-url/webidl2js-wrapper.js:
--------------------------------------------------------------------------------
1 | "use strict";
2 | 
3 | const URL = require("./lib/URL");
4 | const URLSearchParams = require("./lib/URLSearchParams");
5 | 
6 | exports.URL = URL;
7 | exports.URLSearchParams = URLSearchParams;
8 | 


--------------------------------------------------------------------------------
/node_modules/yargs/build/lib/apply-extends.d.ts:
--------------------------------------------------------------------------------
1 | import { Dictionary } from './common-types';
2 | export declare function applyExtends(config: Dictionary, cwd: string, mergeExtends?: boolean): Dictionary;
3 | 


--------------------------------------------------------------------------------
/node_modules/yargs/build/lib/argsert.d.ts:
--------------------------------------------------------------------------------
1 | export declare function argsert(callerArguments: any[], length?: number): void;
2 | export declare function argsert(expected: string, callerArguments: any[], length?: number): void;
3 | 


--------------------------------------------------------------------------------
/node_modules/yargs/build/lib/is-promise.d.ts:
--------------------------------------------------------------------------------
1 | export declare function isPromise<T>(maybePromise: T | Promise<T>): maybePromise is Promise<T>;
2 | 


--------------------------------------------------------------------------------
/node_modules/yargs/build/lib/levenshtein.d.ts:
--------------------------------------------------------------------------------
1 | export declare function levenshtein(a: string, b: string): number;
2 | 


--------------------------------------------------------------------------------
/node_modules/yargs/build/lib/obj-filter.d.ts:
--------------------------------------------------------------------------------
1 | export declare function objFilter<T extends object>(original?: T, filter?: (k: keyof T, v: T[keyof T]) => boolean): T;
2 | 


--------------------------------------------------------------------------------
/node_modules/yargs/build/lib/process-argv.d.ts:
--------------------------------------------------------------------------------
1 | export declare function getProcessArgvWithoutBin(): string[];
2 | export declare function getProcessArgvBin(): string;
3 | 


--------------------------------------------------------------------------------
/node_modules/yargs/build/lib/yerror.d.ts:
--------------------------------------------------------------------------------
1 | export declare class YError extends Error {
2 |     name: string;
3 |     constructor(msg?: string | null);
4 | }
5 | 


--------------------------------------------------------------------------------
/public/styles.css:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/deepakrjain/guest-onboarding/298f09830fb03f5fb471d014f0588e5b834ec63a/public/styles.css


--------------------------------------------------------------------------------
/testBcrypt.js:
--------------------------------------------------------------------------------
1 | const bcrypt = require('bcrypt');
2 | 
3 | bcrypt.hash('password123', 10)
4 |   .then(hash => {
5 |     console.log('Hashed Password:', hash);
6 |   })
7 |   .catch(err => {
8 |     console.error('Error:', err);
9 |   });


--------------------------------------------------------------------------------

```

# config\db.js

```js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully!');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit with failure
    }
};

module.exports = connectDB;
```

# controllers\adminController.js

```js
const Hotel = require('../models/hotel');
const Guest = require('../models/guest');
const QRCode = require('qrcode');

// Main Admin Dashboard
exports.dashboard = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        const hotelsWithStats = await Promise.all(
            hotels.map(async (hotel) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const [todayGuests, totalGuests] = await Promise.all([
                    Guest.countDocuments({
                        hotel: hotel._id,
                        'stayDates.from': { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
                    }),
                    Guest.countDocuments({ hotel: hotel._id })
                ]);
                return { ...hotel.toObject(), todayGuests, totalGuests };
            })
        );

        res.render('admin/dashboard', {
            pageTitle: 'Admin Dashboard',
            hotels: hotelsWithStats,
            guests: await Guest.find()
        });
    } catch (error) {
        console.error('Error loading dashboard:', error);
        res.status(500).render('index', {
            pageTitle: 'Error',
            message: 'An error occurred while loading the dashboard'
        });
    }
};

// Guest Admin Dashboard
exports.guestDashboard = async (req, res) => {
    try {
        const hotelId = req.user.hotelId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [guests, todayCheckIns, todayCheckOuts, hotel] = await Promise.all([
            Guest.find({ hotel: hotelId }).sort('-createdAt').limit(10),
            Guest.countDocuments({
                hotel: hotelId,
                'stayDates.from': {
                    $gte: today,
                    $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                }
            }),
            Guest.countDocuments({
                hotel: hotelId,
                'stayDates.to': {
                    $gte: today,
                    $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                }
            }),
            Hotel.findById(hotelId)
        ]);

        res.render('admin/guest-dashboard', {
            guests,
            hotel,
            stats: {
                todayCheckIns,
                todayCheckOuts,
                totalGuests: await Guest.countDocuments({ hotel: hotelId })
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.addHotel = async (req, res) => {
    const { name, address } = req.body;
    const logo = req.file.path; // Assuming file upload is handled
    const newHotel = await Hotel.create({ name, address, logo });
    
    // Generate QR code for hotel-specific landing page
    const qrCode = await QRCode.toDataURL(`http://localhost:3000/hotels/${newHotel.id}`);
    newHotel.qrCode = qrCode;
    await newHotel.save();
    
    res.redirect('/admin/hotels');
};

exports.getHotels = async (req, res) => {
    const hotels = await Hotel.findAll(); // Fetch from database
    res.render('admin/hotels', { hotels });
};

exports.deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        // Delete associated files
        if (hotel.logo) {
            fs.unlink(`public/uploads/${hotel.logo}`, err => {
                if (err) console.error('Error deleting logo:', err);
            });
        }

        // Delete associated guests
        await Guest.deleteMany({ hotel: hotel._id });

        await hotel.remove();
        
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting hotel' });
    }
};

exports.searchGuests = async (req, res) => {
    try {
        const { query } = req.query;
        const hotelId = req.user.role === 'mainAdmin' ? req.query.hotelId : req.user.hotelId;

        const searchCriteria = {
            hotel: hotelId,
            $or: [
                { fullName: new RegExp(query, 'i') },
                { email: new RegExp(query, 'i') },
                { mobileNumber: new RegExp(query, 'i') }
            ]
        };

        const guests = await Guest.find(searchCriteria).limit(10);
        
        res.json(guests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching guests' });
    }
};

// Add this new function - don't replace entire file
exports.generateQRCode = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.hotelId);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        const guestFormUrl = `${process.env.BASE_URL}/guest/${hotel._id}`;
        const qrCode = await QRCode.toDataURL(guestFormUrl);
        
        hotel.qrCode = qrCode;
        await hotel.save();

        res.json({ qrCode });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating QR code');
    }
};

// Guest Management
exports.getGuests = async (req, res) => {
    try {
        const hotelId = req.user.role === 'mainAdmin' ? req.params.hotelId : req.user.hotelId;
        const guests = await Guest.find({ hotel: hotelId }).sort('-createdAt');
        const hotel = await Hotel.findById(hotelId);
        
        res.render('admin/guestDetails', { guests, hotel });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.viewGuest = async (req, res) => {
    try {
        const guest = await Guest.findById(req.params.id).populate('hotel');
        
        if (!guest) {
            return res.status(404).send('Guest not found');
        }

        // Check if user has access to this guest's information
        if (req.user.role === 'guestAdmin' && guest.hotel._id.toString() !== req.user.hotelId) {
            return res.status(403).send('Access denied');
        }

        res.render('admin/viewGuest', { guest });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.editGuest = async (req, res) => {
    try {
        const { fullName, mobile, purpose, fromDate, toDate, email } = req.body;
        const guest = await Guest.findById(req.params.id);

        if (!guest) {
            return res.status(404).send('Guest not found');
        }

        // Check if user has access to edit this guest
        if (req.user.role === 'guestAdmin' && guest.hotel.toString() !== req.user.hotelId) {
            return res.status(403).send('Access denied');
        }

        guest.fullName = fullName;
        guest.mobile = mobile;
        guest.purpose = purpose;
        guest.stayDates = { from: fromDate, to: toDate };
        guest.email = email;

        await guest.save();
        res.redirect(`/admin/guests${req.user.role === 'mainAdmin' ? '/' + guest.hotel : ''}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
```

# controllers\authController.js

```js
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');

// Login function that uses res.render
exports.login = async (req, res) => {
    try {
        if (!req.body || !req.body.username || !req.body.password) {
            return res.render('admin/login', {
                error: 'Username and password are required.'
            });
        }

        const { username, password } = req.body;

        const admin = await Admin.findOne({ username }).populate('hotel');
        if (!admin) {
            return res.render('admin/login', {
                error: 'Invalid credentials',
                username
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.render('admin/login', {
                error: 'Invalid credentials',
                username
            });
        }

        const token = jwt.sign(
            { id: admin._id, role: admin.role, hotelId: admin.hotel?._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        // Redirect based on role
        res.redirect(admin.role === 'mainAdmin' ? '/admin/dashboard' : '/admin/guest-dashboard');
    } catch (error) {
        console.error('Login error:', error);
        res.render('admin/login', {
            error: 'An error occurred during login. Please try again.'
        });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/admin/login');
};

exports.registerGuestAdmin = async (req, res) => {
    try {
        const { username, email, password, hotelId } = req.body;
        
        // Check if email already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create new guest admin
        const admin = new Admin({
            username,
            email,
            password, // Will be hashed by the model's pre-save middleware
            role: 'guestAdmin',
            hotel: hotelId
        });

        await admin.save();
        res.status(201).json({ message: 'Guest admin registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering guest admin' });
    }
};
```

# controllers\guestController.js

```js
const Guest = require('../models/guest');
const Hotel = require('../models/hotel');
const { validationResult } = require('express-validator');

exports.showForm = async (req, res) => {
    try {
        const { hotelId } = req.params;

        if (!hotelId) {
            return res.status(400).render('guest/form', {
                hotel: null, 
                pageTitle: 'Guest Registration',
                errors: [{ msg: 'Hotel not specified' }],
                formData: {}
            });
        }

        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            return res.status(404).render('guest/form', {
                hotel: null, 
                pageTitle: 'Guest Registration',
                errors: [{ msg: 'Hotel not found' }],
                formData: {}
            });
        }

        res.render('guest/form', {
            hotel,
            pageTitle: `Guest Registration - ${hotel.name}`,
            errors: [],
            formData: {}
        });
    } catch (error) {
        console.error('Error showing guest form:', error);
        res.status(500).render('guest/form', {
            hotel: null, 
            pageTitle: 'Guest Registration',
            errors: [{ msg: 'An unexpected error occurred. Please try again later.' }],
            formData: {}
        });
    }
};

exports.getGuests = (req, res) => {
    // Logic to fetch guests from the database
    res.render('guests', { guests: [] });
};

exports.submitForm = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.hotelId);
        if (!hotel) {
            return res.status(404).render('index', {
                pageTitle: 'Hotel Not Found',
                message: 'The requested hotel could not be found.'
            });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('guest/form', {
                hotel,
                pageTitle: `Welcome to ${hotel.name}`,
                formData: req.body,
                errors: errors.array()
            });
        }

        const guest = new Guest({
            hotel: hotel._id,
            fullName: req.body.fullName,
            mobileNumber: req.body.mobileNumber,
            email: req.body.email,
            address: req.body.address,
            purpose: req.body.purpose,
            stayDates: {
                from: req.body.stayDates.from,
                to: req.body.stayDates.to
            },
            idProofNumber: req.body.idProofNumber
        });

        await guest.save();

        res.render('guest/thankyou', {
            pageTitle: 'Registration Successful',
            guest,
            hotel
        });
    } catch (err) {
        console.error('Error submitting guest form:', err);
        res.render('index', {
            pageTitle: 'Error',
            message: 'An error occurred while processing your registration. Please try again.'
        });
    }
};

exports.addGuest = async (req, res) => {
    const { name, mobile, address, visitPurpose, stayDates, email, idProof } = req.body;
    await Guest.create({ name, mobile, address, visitPurpose, stayDates, email, idProof });
    res.render('thankYou');
};
```

# fileStructure.txt

```txt
├── .env
├── app.js
├── config
    └── db.js
├── controllers
    ├── adminController.js
    ├── authController.js
    └── guestController.js
├── fileStructure.txt
├── middleware
    ├── authMiddleware.js
    ├── uploadMiddleware.js
    └── validationMiddleware.js
├── models
    ├── admin.js
    ├── guest.js
    └── hotel.js
├── package-lock.json
├── package.json
├── public
    ├── scripts
    │   └── validation.js
    └── styles.css
├── routes
    ├── adminRoutes.js
    └── guestRoutes.js
├── testBcrypt.js
├── utils
    └── qrCode.js
└── views
    ├── admin
        ├── dashboard.ejs
        ├── editGuest.ejs
        ├── guestDetails.ejs
        ├── hotels.ejs
        ├── login.ejs
        └── viewGuest.ejs
    ├── guest
        ├── form.ejs
        └── thankyou.ejs
    └── index.ejs
    └── layout.ejs
```

# middleware\authMiddleware.js

```js
const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).render('admin/login', {
                error: 'Access Denied. Please log in.',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error);
        res.status(403).render('admin/login', {
            error: 'Invalid or expired token. Please log in again.',
        });
    }
};

// Middleware to check for MainAdmin role
const isMainAdmin = (req, res, next) => {
    if (req.user.role !== 'MainAdmin') {
        return res.status(403).json({ message: 'Access Denied. Admin privileges required.' });
    }
    next();
};

// Middleware to check for GuestAdmin role
const isGuestAdmin = (req, res, next) => {
    if (req.user.role !== 'GuestAdmin') {
        return res.status(403).json({ message: 'Access Denied. Guest Admin privileges required.' });
    }
    next();
};

module.exports = { verifyToken, isMainAdmin, isGuestAdmin };
```

# middleware\uploadMiddleware.js

```js
// middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type! Only images are allowed.'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;
```

# middleware\validationMiddleware.js

```js
// middleware/validationMiddleware.js
const { body, validationResult } = require('express-validator');

exports.guestValidationRules = [
    body('fullName')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    
    body('mobileNumber')
        .matches(/^[0-9]{10}$/).withMessage('Please enter a valid 10-digit mobile number'),
    
    body('address')
        .trim()
        .notEmpty().withMessage('Address is required')
        .isLength({ min: 5 }).withMessage('Address must be at least 5 characters long'),
    
    body('purpose')
        .isIn(['Business', 'Personal', 'Tourist']).withMessage('Invalid purpose selected'),
    
    body('stayDates.from')
        .isISO8601().withMessage('Invalid check-in date')
        .custom((value, { req }) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const fromDate = new Date(value);
            if (fromDate < today) {
                throw new Error('Check-in date cannot be in the past');
            }
            return true;
        }),
    
    body('stayDates.to')
        .isISO8601().withMessage('Invalid check-out date')
        .custom((value, { req }) => {
            const fromDate = new Date(req.body.stayDates.from);
            const toDate = new Date(value);
            if (toDate <= fromDate) {
                throw new Error('Check-out date must be after check-in date');
            }
            return true;
        }),
    
    body('email')
        .trim()
        .isEmail().withMessage('Please enter a valid email address')
        .normalizeEmail(),
    
    body('idProofNumber')
        .trim()
        .notEmpty().withMessage('ID proof number is required')
        .isLength({ min: 5, max: 20 }).withMessage('ID proof number must be between 5 and 20 characters')
];

exports.hotelValidationRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Hotel name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Hotel name must be between 2 and 100 characters'),
    
    body('address')
        .trim()
        .notEmpty().withMessage('Address is required')
        .isLength({ min: 5 }).withMessage('Address must be at least 5 characters long')
];

exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);

        // Determine the template and page title dynamically
        const template = req.originalUrl.includes('guest') ? 'guest/form' : 'admin/hotels';
        const pageTitle = req.originalUrl.includes('guest') ? 'Guest Registration' : 'Manage Hotels';

        return res.render(template, {
            errors: errorMessages,
            formData: req.body,
            pageTitle,
        });
    }
    next();
};
```

# models\admin.js

```js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['mainAdmin', 'guestAdmin'], 
        required: true 
    },
    hotel: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Hotel',
        required: function() { return this.role === 'guestAdmin'; }
    },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare password
adminSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
```

# models\guest.js

```js
// models/guest.js
const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
    hotel: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Hotel', 
        required: true 
    },
    fullName: { 
        type: String, 
        required: true,
        trim: true
    },
    mobileNumber: { 
        type: String, 
        required: true,
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
    },
    address: { 
        type: String, 
        required: true 
    },
    purpose: { 
        type: String, 
        required: true,
        enum: ['Business', 'Personal', 'Tourist']
    },
    stayDates: {
        from: { 
            type: Date, 
            required: true 
        },
        to: { 
            type: Date, 
            required: true 
        }
    },
    email: { 
        type: String, 
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    idProofNumber: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true
});

// Validation for stay dates
guestSchema.pre('save', function(next) {
    if (this.stayDates.from > this.stayDates.to) {
        next(new Error('Check-out date must be after check-in date'));
    }
    next();
});

module.exports = mongoose.model('Guest', guestSchema);
```

# models\hotel.js

```js
const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, required: true },
  address: { type: String, required: true },
  qrCode: { type: String }, // Path to QR code image
});

module.exports = mongoose.model('Hotel', HotelSchema);
```

# package.json

```json
{
  "name": "guest-onboarding",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "bcrypt": "^5.1.1",
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.20.3",
    "cookie-parser": "^1.4.7",
    "dotenv": "^16.4.7",
    "ejs": "^3.1.10",
    "express": "^4.21.2",
    "express-ejs-layouts": "^2.5.1",
    "express-session": "^1.18.1",
    "express-validator": "^7.2.1",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.9.5",
    "multer": "^1.4.5-lts.1",
    "qrcode": "^1.5.4"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}

```

# public\scripts\validation.js

```js
// public/scripts/validation.js
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Real-time validation
        form.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });

        // Form submission
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            if (validateForm(this)) {
                this.submit();
            }
        });
    });
});

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing error messages
    const existingError = field.nextElementSibling;
    if (existingError && existingError.classList.contains('invalid-feedback')) {
        existingError.remove();
    }

    // Validation rules
    switch(field.name) {
        case 'fullName':
            if (!value) {
                isValid = false;
                errorMessage = 'Full name is required';
            } else if (value.length < 2 || value.length > 50) {
                isValid = false;
                errorMessage = 'Name must be between 2 and 50 characters';
            }
            break;

        case 'mobile':
            if (!value.match(/^[0-9]{10}$/)) {
                isValid = false;
                errorMessage = 'Please enter a valid 10-digit mobile number';
            }
            break;

        case 'email':
            if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;

        case 'purpose':
            if (!['Business', 'Personal', 'Tourist'].includes(value)) {
                isValid = false;
                errorMessage = 'Please select a valid purpose';
            }
            break;

        // Add more cases as needed
    }

    // Update UI
    if (!isValid) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = errorMessage;
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
    } else {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    }

    return isValid;
}

function validateForm(form) {
    let isValid = true;
    form.querySelectorAll('input, select').forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    return isValid;
}
```

# public\styles.css

```css
/* public/styles.css */
:root {
    --primary-color: #4a90e2;
    --secondary-color: #f5f5f5;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --warning-color: #ffc107;
    --info-color: #17a2b8;
    --dark-color: #343a40;
    --light-color: #f8f9fa;
}

/* General Styles */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    background-color: #f4f6f9;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
}

/* Card Styles */
.card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 20px;
    transition: transform 0.2s ease;
}

.card:hover {
    transform: translateY(-2px);
}

.card-header {
    background-color: #fff;
    border-bottom: 1px solid #eee;
    padding: 15px 20px;
}

.card-body {
    padding: 20px;
}

/* Form Styles */
.form-control {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px 12px;
    transition: border-color 0.2s ease;
}

.form-control:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 0.2rem rgba(74, 144, 226, 0.25);
}

.form-label {
    font-weight: 500;
    margin-bottom: 8px;
}

/* Button Styles */
.btn {
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 500;
    transition: all 0.2s ease;
}

.btn-primary {
    background-color: var(--primary-color);
    border: none;
}

.btn-primary:hover {
    background-color: #357abd;
    transform: translateY(-1px);
}

/* Table Styles */
.table {
    width: 100%;
    margin-bottom: 1rem;
    background-color: transparent;
}

.table th {
    padding: 12px;
    border-bottom: 2px solid #dee2e6;
    font-weight: 600;
}

.table td {
    padding: 12px;
    border-bottom: 1px solid #dee2e6;
}

.table-hover tbody tr:hover {
    background-color: rgba(0,0,0,.075);
}

/* Alert Styles */
.alert {
    padding: 12px 20px;
    margin-bottom: 1rem;
    border: 1px solid transparent;
    border-radius: 4px;
}

.alert-success {
    color: #155724;
    background-color: #d4edda;
    border-color: #c3e6cb;
}

.alert-danger {
    color: #721c24;
    background-color: #f8d7da;
    border-color: #f5c6cb;
}

/* Navigation Styles */
.navbar {
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 1rem 0;
}

.navbar-brand {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary-color);
}

/* Dashboard Stats */
.stats-card {
    background: linear-gradient(135deg, var(--primary-color) 0%, #357abd 100%);
    color: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.stats-card h3 {
    font-size: 2rem;
    margin: 0;
}

.stats-card p {
    margin: 5px 0 0;
    opacity: 0.8;
}

/* QR Code Styles */
.qr-code-container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    display: inline-block;
}

/* Print Styles */
@media print {
    .no-print {
        display: none;
    }
    
    body {
        padding: 20px;
    }
    
    .container {
        width: 100%;
        max-width: none;
    }
}
```

# routes\adminRoutes.js

```js
const express = require('express');
const router = express.Router();
const generateQRCode = require('../utils/qrCode');
const Hotel = require('../models/hotel');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const { verifyToken, isMainAdmin, isGuestAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { hotelValidationRules, validate } = require('../middleware/validationMiddleware');

// Auth routes
router.post('/admin/login', authController.login);
router.get('/login', (req, res) => res.render('admin/login'));

// Login route with error handling
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Attempt login using authController.login
        const user = await authController.login(username, password);

        if (user) {
            // If login successful, redirect to the dashboard
            res.redirect('/admin/dashboard');
        } else {
            // If authentication fails, pass error message to the login page
            res.render('admin/login', { error: 'Invalid username or password' });
        }
    } catch (error) {
        // Log and pass the error to the login page
        console.error('Login error:', error);
        res.render('admin/login', { error: 'An error occurred during login' });
    }
});

// Logout route
router.get('/logout', authController.logout);

// Protected routes
router.use(verifyToken);

// Main admin routes
router.use('/hotels', isMainAdmin);
router.get('/hotels', adminController.getHotels);
router.post(
    '/hotels',
    upload.single('logo'), // Handles file upload for the "logo" field
    hotelValidationRules,
    validate,
    async (req, res) => {
        try {
            const { name, address } = req.body;
            const logo = req.file.filename; // The uploaded file's name
            const qrCodeUrl = `${process.env.BASE_URL}/guest/form?hotelId=${name}`;
            const qrCode = await generateQRCode(qrCodeUrl);

            const hotel = new Hotel({ name, address, logo, qrCode });
            await hotel.save();

            res.redirect('/admin/dashboard');
        } catch (error) {
            console.error('Error adding hotel:', error);
            res.status(500).send('Internal Server Error');
        }
    }
);

router.get('/dashboard', isMainAdmin, adminController.dashboard);


// routes/adminRoutes.js

// Add these routes
router.delete('/hotels/:id', isMainAdmin, adminController.deleteHotel);
router.get('/search/guests', verifyToken, adminController.searchGuests);


// Guest admin routes
router.use('/guests', isGuestAdmin);
router.get('/guests', adminController.getGuests);
router.get('/guest/:id', adminController.viewGuest);
router.post('/guest/edit/:id', adminController.editGuest);
router.get('/guest-dashboard', isGuestAdmin, adminController.guestDashboard);

// Register guest admin (main admin only)
router.post('/register-guest-admin', isMainAdmin, authController.registerGuestAdmin);

module.exports = router;
```

# routes\guestRoutes.js

```js
const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');
const Hotel = require('../models/hotel');

router.get('/form', async (req, res) => {
    const hotels = await Hotel.find(); // Fetch all hotels
    if (hotels.length === 1) {
        // Redirect to the only hotel's form if only one hotel exists
        return res.redirect(`/guest/form/${hotels[0]._id}`);
    }

    res.render('guest/form', { 
        hotel: null, 
        pageTitle: 'Guest Registration',
        errors: [],
        formData: {}
    });
});
// Static route to render the guest registration form
router.get('/form/:hotelId', guestController.showForm);

// Route to submit the registration form
router.post('/form', guestController.submitForm);

// Route to get the list of guests (Admin)
router.get('/guests', guestController.getGuests);
router.post('/guests', guestController.addGuest);
// Dynamic route to show the form for a specific hotel
router.get('/:hotelId', guestController.showForm);
router.post('/:hotelId', guestController.submitForm);

module.exports = router;
```

# testBcrypt.js

```js
const bcrypt = require('bcrypt');

bcrypt.hash('password123', 10)
  .then(hash => {
    console.log('Hashed Password:', hash);
  })
  .catch(err => {
    console.error('Error:', err);
  });
```

# utils\qrCode.js

```js
const QRCode = require('qrcode');

const generateQRCode = async (url) => {
    try {
        return await QRCode.toDataURL(url);
    } catch (error) {
        console.error('QR Code Generation Error:', error);
        throw error;
    }
};

module.exports = generateQRCode;
```

# views\admin\dashboard.ejs

```ejs
<header>
    <h1>Admin Dashboard</h1>
</header>
<main>
    <!-- views/admin/dashboard.ejs -->
<div class="container">
    <div class="row">
        <div class="col-md-4">
            <div class="card bg-primary text-white mb-4">
                <div class="card-body">
                    <h5 class="card-title">Total Hotels</h5>
                    <h2><%= hotels.length %></h2>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card bg-success text-white mb-4">
                <div class="card-body">
                    <h5 class="card-title">Total Guests</h5>
                    <h2><%= guests.length %></h2>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card bg-info text-white mb-4">
                <div class="card-body">
                    <h5 class="card-title">Today's Check-ins</h5>
                    <h2><%= todayCheckIns %></h2>
                </div>
            </div>
        </div>
    </div>
    
    <div class="row mt-4">
        <div class="col-12">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Recent Activities</h5>
                    <a href="/admin/hotels" class="btn btn-primary">Manage Hotels</a>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Hotel</th>
                                    <th>Today's Guests</th>
                                    <th>Total Guests</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <% hotels.forEach(hotel => { %>
                                <tr>
                                    <td><%= hotel.name %></td>
                                    <td><%= hotel.todayGuests || 0 %></td>
                                    <td><%= hotel.totalGuests || 0 %></td>
                                    <td>
                                        <a href="/admin/hotels/<%= hotel._id %>" class="btn btn-sm btn-info">View</a>
                                        <a href="/admin/hotels/<%= hotel._id %>/guests" class="btn btn-sm btn-primary">Guests</a>
                                    </td>
                                </tr>
                                <% }); %>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</main>
```

# views\admin\editGuest.ejs

```ejs

    <h1>Edit Guest Details</h1>
    <form action="/admin/guest/edit/<%= guest._id %>" method="POST">
        <div class="mb-3">
            <label for="fullName" class="form-label">Full Name</label>
            <input type="text" class="form-control" id="fullName" name="fullName" value="<%= guest.fullName %>"
                required>
        </div>
        <div class="mb-3">
            <label for="mobile" class="form-label">Mobile Number</label>
            <input type="text" class="form-control" id="mobile" name="mobile" value="<%= guest.mobile %>" required>
        </div>
        <div class="mb-3">
            <label for="purpose" class="form-label">Purpose of Visit</label>
            <select class="form-control" id="purpose" name="purpose" required>
                <option value="Business" <%=guest.purpose==='Business' ? 'selected' : '' %>>Business</option>
                <option value="Personal" <%=guest.purpose==='Personal' ? 'selected' : '' %>>Personal</option>
                <option value="Tourist" <%=guest.purpose==='Tourist' ? 'selected' : '' %>>Tourist</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="fromDate" class="form-label">Stay Dates (From)</label>
            <input type="date" class="form-control" id="fromDate" name="fromDate" value="<%= guest.fromDate %>"
                required>
        </div>
        <div class="mb-3">
            <label for="toDate" class="form-label">Stay Dates (To)</label>
            <input type="date" class="form-control" id="toDate" name="toDate" value="<%= guest.toDate %>" required>
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Email ID</label>
            <input type="email" class="form-control" id="email" name="email" value="<%= guest.email %>" required>
        </div>
        <button type="submit" class="btn btn-primary">Update Guest</button>
    </form>
```

# views\admin\guestDetails.ejs

```ejs

<h1>Guest Details</h1>
<table class="table">
    <thead>
        <tr>
            <th>Name</th>
            <th>Mobile</th>
            <th>Purpose</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <% guests.forEach(guest => { %>
            <tr>
                <td><%= guest.fullName %></td>
                <td><%= guest.mobileNumber %></td>
                <td><%= guest.purpose %></td>
                <td>
                    <a href="/admin/edit-guest/<%= guest._id %>" class="btn btn-primary btn-sm">Edit</a>
                </td>
            </tr>
        <% }) %>
    </tbody>
</table>
```

# views\admin\hotels.ejs

```ejs

<h1>Manage Hotels</h1>
<form method="POST" action="/admin/add-hotel" enctype="multipart/form-data">
    <div class="mb-3">
        <input type="text" name="name" class="form-control" placeholder="Hotel Name" required />
    </div>
    <div class="mb-3">
        <input type="text" name="address" class="form-control" placeholder="Address" required />
    </div>
    <div class="mb-3">
        <input type="file" name="logo" class="form-control" />
    </div>
    <button type="submit" class="btn btn-primary">Add Hotel</button>
</form>
<table class="table mt-4">
    <thead>
        <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Logo</th>
            <th>QR Code</th>
        </tr>
    </thead>
    <tbody>
        <% hotels.forEach(hotel => { %>
            <tr>
                <td><%= hotel.name %></td>
                <td><%= hotel.address %></td>
                <td><img src="/uploads/<%= hotel.logo %>" alt="Logo" width="50" /></td>
                <td><img src="<%= hotel.qrCode %>" alt="QR Code" width="50" /></td>
            </tr>
        <% }) %>
    </tbody>
</table>
```

# views\admin\login.ejs

```ejs

<h1>Admin Login</h1>
<form method="POST" action="/admin/login">
    <div class="mb-3">
        <input type="text" name="username" class="form-control" placeholder="Username" required />
    </div>
    <div class="mb-3">
        <input type="password" name="password" class="form-control" placeholder="Password" required />
    </div>
    <button type="submit" class="btn btn-primary">Login</button>
    <% if (error) { %>
        <p style="color: red;"><%= error %></p>
    <% } %>
</form>
```

# views\admin\viewGuest.ejs

```ejs

<h2>Guest Details</h2>
<p><strong>Full Name:</strong> <%= guest.fullName %></p>
<p><strong>Mobile:</strong> <%= guest.mobile %></p>
<p><strong>Purpose of Visit:</strong> <%= guest.purpose %></p>
<p><strong>Stay Dates:</strong> <%= guest.fromDate %> - <%= guest.toDate %></p>
<p><strong>Email:</strong> <%= guest.email %></p>
<button onclick="window.print()" class="btn btn-secondary">Print</button>
```

# views\guest\form.ejs

```ejs
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guest Registration</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/public/styles.css">
</head>
<body>
    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header text-center">
                        <% if (hotel) { %>
                            <img src="/uploads/<%= hotel.logo %>" alt="<%= hotel.name %> Logo" class="img-fluid mb-2" style="max-height: 100px;">
                            <h2><%= hotel.name %></h2>
                            <p class="text-muted"><%= hotel.address %></p>
                        <% } else { %>
                            <h2>Guest Registration</h2>
                        <% } %>
                    </div>
                    <div class="card-body">
                        <% if (typeof errors !== 'undefined' && errors.length > 0) { %>
                            <div class="alert alert-danger">
                                <ul class="mb-0">
                                    <% errors.forEach(function(error) { %>
                                        <li><%= error.msg %></li>
                                    <% }); %>
                                </ul>
                            </div>
                        <% } %>

                        <form method="POST" action="<%= hotel ? `/guest/${hotel._id}` : '#' %>">
                            <div class="mb-3">
                                <label for="fullName" class="form-label">Full Name</label>
                                <input type="text" class="form-control" id="fullName" name="fullName" 
                                       value="<%= typeof formData !== 'undefined' ? formData.fullName : '' %>" required>
                            </div>

                            <div class="mb-3">
                                <label for="mobileNumber" class="form-label">Mobile Number</label>
                                <input type="tel" class="form-control" id="mobileNumber" name="mobileNumber" 
                                       pattern="[0-9]{10}" value="<%= typeof formData !== 'undefined' ? formData.mobileNumber : '' %>" required>
                            </div>

                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" name="email" 
                                       value="<%= typeof formData !== 'undefined' ? formData.email : '' %>" required>
                            </div>

                            <div class="mb-3">
                                <label for="address" class="form-label">Address</label>
                                <textarea class="form-control" id="address" name="address" rows="3" required><%= typeof formData !== 'undefined' ? formData.address : '' %></textarea>
                            </div>

                            <div class="mb-3">
                                <label for="purpose" class="form-label">Purpose of Visit</label>
                                <select class="form-control" id="purpose" name="purpose" required>
                                    <option value="">Select Purpose</option>
                                    <option value="Business" <%= typeof formData !== 'undefined' && formData.purpose === 'Business' ? 'selected' : '' %>>Business</option>
                                    <option value="Personal" <%= typeof formData !== 'undefined' && formData.purpose === 'Personal' ? 'selected' : '' %>>Personal</option>
                                    <option value="Tourist" <%= typeof formData !== 'undefined' && formData.purpose === 'Tourist' ? 'selected' : '' %>>Tourist</option>
                                </select>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="fromDate" class="form-label">Check-in Date</label>
                                    <input type="date" class="form-control" id="fromDate" name="stayDates[from]" 
                                           min="<%= new Date().toISOString().split('T')[0] %>" 
                                           value="<%= typeof formData !== 'undefined' ? formData.stayDates?.from : '' %>" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="toDate" class="form-label">Check-out Date</label>
                                    <input type="date" class="form-control" id="toDate" name="stayDates[to]" 
                                           value="<%= typeof formData !== 'undefined' ? formData.stayDates?.to : '' %>" required>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="idProofNumber" class="form-label">ID Proof Number</label>
                                <input type="text" class="form-control" id="idProofNumber" name="idProofNumber" 
                                       value="<%= typeof formData !== 'undefined' ? formData.idProofNumber : '' %>" required>
                            </div>

                            <button type="submit" class="btn btn-primary w-100">Submit Registration</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/public/scripts/validation.js"></script>
</body>
</html>
```

# views\guest\thankyou.ejs

```ejs

<h1>Thank You, <%= fullName %>!</h1>
<p>Your details have been successfully submitted.</p>
```

# views\index.ejs

```ejs

<div class="text-center">
    <h1>Welcome to the Digital Guest Onboarding System</h1>
    <% if (message) { %>
        <div class="alert alert-danger"><%= message %></div>
    <% } %>
    <div>
        <a href="/guest/form" class="btn btn-primary">Guest Registration</a>
        <a href="/admin/login" class="btn btn-secondary">Admin Login</a>
    </div>
</div>
```

# views\layout.ejs

```ejs
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Digital Guest Onboarding</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/public/styles.css">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container"> 
            <a class="navbar-brand" href="/">Guest Onboarding</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="/guest/form">Guest Registration</a></li>
                    <li class="nav-item"><a class="nav-link" href="/admin/login">Admin Login</a></li>
                </ul>
            </div>
        </div>
    </nav>
    <div class="container mt-4">
        <%- body %>
    </div>
    <footer class="text-center mt-4">
        <p>&copy; 2025 Digital Guest Onboarding System</p>
    </footer>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

