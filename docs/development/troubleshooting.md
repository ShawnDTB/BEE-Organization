# Local Development Troubleshooting

## `vite` is not recognized

This means the project dependencies were not installed successfully. Vite is intentionally installed inside the project rather than globally.

Run from the repository root:

```cmd
node --version
npm --version
npm install
npm run dev
```

## Reset a failed Windows installation

Command Prompt:

```cmd
rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
npm cache verify
npm install
npm run dev
```

## Node version error

The supported baseline is Node.js 20.19 or newer. Node 22.16 is the repository’s pinned development and CI version.

Install the current Node.js LTS release with Windows Package Manager:

```cmd
winget install --id OpenJS.NodeJS.LTS --exact
```

Close and reopen Command Prompt after installation.

## Confirm the project folder

The command prompt should be inside the folder containing `package.json`:

```cmd
dir package.json
```

## Full validation

```cmd
npm run check
```

This runs both the TypeScript check and the production build.
