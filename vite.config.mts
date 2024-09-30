import MillionLint from '@million/lint';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import commonjs from 'vite-plugin-commonjs';
import svgr from 'vite-plugin-svgr';
import vitetsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  envDir: './environments',
	plugins: [
		MillionLint.vite(),
		react(),
		vitetsConfigPaths(),
		commonjs(),
		svgr({
			include: ['src/**/*.svg', '**/*.svg?react'],
		}),
	],
	build: {
		outDir: 'build',
	},
	server: {
		open: true,
		port: 3001,
	},
});
