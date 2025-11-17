#!/usr/bin/env node
// const { execSync } = require("child_process");
import { execSync } from 'child_process';

try {
  // 尝试执行本地安装的 only-allow
  execSync('only-allow pnpm', { stdio: 'inherit' });
} catch (err) {
  console.log('本地没有 only-allow，尝试使用 npx...');
  execSync('npx -y only-allow pnpm', { stdio: 'inherit' });
}
