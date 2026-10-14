// npm run dev: Web 画面の TypeScript をウォッチビルドしながら API サーバーを起動する（追加パッケージ不要）。
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const tscBin = require.resolve('typescript/bin/tsc');
const tsxCli = fileURLToPath(import.meta.resolve('tsx/cli'));

const children = [
  spawn(process.execPath, [tscBin, '-p', 'tsconfig.web.json', '--watch', '--preserveWatchOutput'], {
    stdio: 'inherit',
  }),
  spawn(process.execPath, [tsxCli, 'watch', '--clear-screen=false', 'src/server.ts'], { stdio: 'inherit' }),
];

let stopping = false;

function stop(exitCode) {
  if (stopping) {
    return;
  }
  stopping = true;
  process.exitCode = exitCode;
  for (const child of children) {
    if (child.exitCode === null) {
      child.kill();
    }
  }
}

for (const child of children) {
  child.on('exit', (code) => stop(code ?? 0));
}
process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));
