const esbuild = require('esbuild');
const fs = require('fs/promises');
const sass = require('sass');

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
        minify: !devMode,
        sourcemap: devMode
    });

    const frontendScriptFiles = [];
    await (async function traverse(dir) {
        for (const path of await fs.readdir(dir)) {
            const fullPath = dir + '/' + path;
            if ((await fs.stat(fullPath)).isDirectory()) {
                await traverse(fullPath);
            } else if (path.endsWith('index.tsx')) {
                frontendScriptFiles.push(fullPath);
            }
        }
    })('./src/frontend/scripts')

    await esbuild.build({
        entryPoints: frontendScriptFiles,
        bundle: true,
        platform: 'browser',
        target: 'es6',
        outdir: 'dist/static/scripts',
        minify: !devMode,
        sourcemap: devMode,
    });

    const styleDir = './src/frontend/styles';
    const styleFiles = await fs.readdir(styleDir);
    for (const file of styleFiles) {
        console.log('Compiling ' + styleDir + '/' + file);
        const result = sass.compile(styleDir + '/' + file, {
            outputStyle: devMode ? 'expanded' : 'compressed'
        });
        await fs.writeFile('./dist/static/styles/' + file.replace('.sass', '.css'), result.css);
    }
}

const devMode = process.argv.includes('--dev');
const clean = process.argv.includes('--clean');

build(devMode, clean);