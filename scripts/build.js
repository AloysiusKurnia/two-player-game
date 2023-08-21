const esbuild = require('esbuild');
const fs = require('fs/promises');
const sass = require('sass');

async function build(devMode = false, clean = false) {
    if (clean) {
        await fs.rm('./dist', { recursive: true, force: true });
    }

    await esbuild.build({
        entryPoints: ['src/app/index.ts'],
        bundle: true,
        platform: 'node',
        target: 'node14.16.0',
        outfile: 'dist/index.js',
        external: ['express', 'express-ws'],
        minify: !devMode,
        sourcemap: devMode
    });

    await fs.mkdir('./dist/static/scripts', { recursive: true });
    await fs.mkdir('./dist/static/styles', { recursive: true });

    for (const gamename of await fs.readdir('./src/games')) {
        if (gamename.startsWith('.')) continue;

        await esbuild.build({
            entryPoints: [`src/games/${gamename}/frontend/index.tsx`],
            bundle: true,
            platform: 'browser',
            target: 'es6',
            outfile: `dist/static/scripts/${gamename}.js`,
            minify: !devMode,
            sourcemap: devMode,
        });
        const sassResult = sass.compile(`src/games/${gamename}/frontend/style.sass`, {
            outputStyle: devMode ? 'expanded' : 'compressed'
        });
        await fs.writeFile(`./dist/static/styles/${gamename}.css`, sassResult.css);
    }

    const commonSassResult = sass.compile('src/common.sass', {
        outputStyle: devMode ? 'expanded' : 'compressed'
    });
    await fs.writeFile('./dist/static/styles/common.css', commonSassResult.css);
}

const devMode = process.argv.includes('--dev');
const clean = process.argv.includes('--clean');

build(devMode, clean);