const esbuild = require('esbuild');
const fs = require('fs/promises');

async function build(devMode = false, clean = false) {
    if (clean) {
        await fs.rm('./dist', { recursive: true, force: true });
    }

    await esbuild.build({
        entryPoints: ['src/backend/index.ts'],
        bundle: true,
        platform: 'node',
        target: 'node14.16.0',
        outfile: 'dist/index.js',
        external: ['express', 'express-ws'],
        minify: true,
        sourcemap: devMode
    });

    const frontendScriptsDirectory = './src/frontend/scripts';
    const frontendScriptFiles = (await fs.readdir(frontendScriptsDirectory))
        .filter(file => file.endsWith('.ts') || file.endsWith('.tsx'))
        .map(file => `${frontendScriptsDirectory}/${file}`);

    await esbuild.build({
        entryPoints: frontendScriptFiles,
        bundle: true,
        platform: 'browser',
        target: 'es6',
        outdir: 'dist/static/scripts',
        minify: true,
        sourcemap: devMode
    });
}

const devMode = process.argv.includes('--dev');
const clean = process.argv.includes('--clean');

build(devMode, clean);