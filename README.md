🌟============================================================🌟
                 @rsamuel1993/react-scripts
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

# npx @rsamuel1993/react-scripts create-page customer #

or

# npm i -D @rsamuel1993/react-scripts #

 

{
  "scripts": {
    "create:component": "create-component",
    "create:page": "create-page",
    "create:hook": "create-hook",
    "create:folders": "create-folders"  
  }
}

npm run create:page -- customer
npm run create:component -- button/alert
npm run create:hook -- auth/verification
npm run create:folders

1️⃣ Components
create-component button/alert 

2️⃣ Next.js Pages (Pages Router)
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

4️⃣ 🗂️ Folder Scaffold (🆕)
create-folders

# Creates the standard structure under <repo>/src if it exists; otherwise prompts to use <repo> root

# Folders created

# - pages

# - features

# - components

# - hooks

# - context

# - services

Examples:
create-folders                       # prompts if no src/ found
create-folders --yes                 # skip prompt; proceed in repo root if src/ missing
create-folders --dry-run             # preview without creating
create-folders --root ./apps/web     # start search from a specific directory
