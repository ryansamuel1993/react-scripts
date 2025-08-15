🌟============================================================🌟
                 @rsamuel1993/ts-scripts
🌟============================================================🌟

✨ Tiny scaffolding CLIs for React / Next.js projects ✨

📦  create-component  →  empty, typed React component
📄  create-page       →  Next.js Pages Router route with getLayout
🪝  create-hook       →  typed React hook (useSomething)

💡 Works in single repos and monorepos.
🛡  Safe by default (won’t overwrite unless you pass --force).

------------------------------------------------------------

🛠  REQUIREMENTS
------------------------------------------------------------

⚙  Node ≥ 20.8.1
🚫 No need for TypeScript in the target project — ships compiled JS.

------------------------------------------------------------

📥  INSTALLATION
------------------------------------------------------------

💨 One-off (no install):

```text
npx @rsamuel1993/ts-scripts create-page customer

npm i -D @rsamuel1993/ts-scripts
# pnpm add -D @rsamuel1993/ts-scripts
# yarn add -D @rsamuel1993/ts-scripts

{
  "scripts": {
    "create:component": "create-component",
    "create:page": "create-page",
    "create:hook": "create-hook"
  }
}

npm run create:page -- customer
npm run create:component -- button/alert
npm run create:hook -- auth/verification


2️⃣ Next.js Pages (Pages Router)
create-component button/alert
create-page customer

📁 Nested routes:

create-page dashboard/settings


Generates:

.../pages/dashboard/settings/index.tsx


3️⃣ Hooks

create-hook auth/verification


Generates:

<repo>/(hooks|src/hooks)/auth/useVerification.tsx

import { useCallback, useMemo, useRef, useState } from 'react';

export type UseVerificationOptions = {};
export type UseVerificationReturn = {};

export const useVerification = (): UseVerificationReturn => {
  return {};
};

export default useVerification;


🔤 Name handling:

create-hook useUser → useUser.tsx
create-hook user → useUser.tsx (auto "use" prefix)
create-hook auth/verification → auth/useVerification.tsx


