# arniverse

The all-in-one library powering Arniva projects

arniverse is a monorepo that houses essential tools, modules, and utilities used across Arniva projects. It provides a well-structured and reusable foundation, ensuring consistency and efficiency in development.

What's Inside?

- 🚀 **@arniverse/ui** – Reusable Svelte components for UI consistency
- 🔗 **@arniverse/api** – API handling modules for seamless data fetching
- 🛠 **@arniverse/utils** – Utility functions for formatting, time manipulation, and more
- 🎯 **@arniverse/tools** – Miscellaneous helpers to streamline development
- 📖 **@arniverse/docs** - Full documentation for everything related to arniverse

Designed for modularity, arniverse allows individual packages to be installed and updated independently, ensuring flexibility without unnecessary dependencies.

# login before publish

npm login --scope=@arniverse --registry=https://npm.pkg.github.com

# Publish spesific package

## BEFORE PUBLISH

DO NOT FORGET to set a new version inside package's `package.json`.

### Publishing UI

#### IMPORTANT - Change Version Number inside package.json file

First compile scss to css by running this script:

```bash
pnpm prepare:ui
```

Then change ``ìndex.js`inside`lib```folder from **scss** to **css**:

```javascript
import "./styles/app.css";
```

- COMMIT CHANGES TO GIT

then publish it by:

```bash
pnpm build:ui
```

!IMPORTANT Change css to scss again
AND DELETE css if you like.

### Publishing Utils

#### IMPORTANT - Change Version Number inside package.json file

First compile scss to css by running this script:

```bash
pnpm prepare:utils
```

Then change ``ìndex.js`inside`lib```folder from **scss** to **css**:

```javascript
import "./styles/app.css";
```

- COMMIT CHANGES TO GIT

then publish it by:

```bash
pnpm build:utils
```

!IMPORTANT Change css to scss again
AND DELETE css if you like.

### IMPORTANT

DO NOT FORGET TO CHANGE `css`to `scss`BACK AGAIN.

pnpm --filter @ruzgardogu/ui publish --access restricted
pnpm --filter @ruzgardogu/utils publish --access restricted

# Package Registery

/Users/emresahin/.npmrc
legacy-peer-deps=true
//npm.pkg.github.com/:\_authToken=YOUR_AUTH_TOKEN
@ruzgardogu:registry=https://npm.pkg.github.com/

# HEADS UP!

package.json files inside each package should have the same name registery.
For example, if the registery name (github username for personal user) is ruzgardogu, then name of the package should be "@ruzgardogu/\*\*\*"
Also the "Package Registery" defined before, should have the same domain.
