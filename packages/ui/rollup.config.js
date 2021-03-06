import commonjs from "@rollup/plugin-commonjs";
import url from "@rollup/plugin-url";
import resolve from "@rollup/plugin-node-resolve";
import svgr from "@svgr/rollup";
import ts from "@wessberg/rollup-plugin-ts";
import autoprefixer from "autoprefixer";
import babel from "@rollup/plugin-babel";
import del from "rollup-plugin-delete";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import visualizer from "rollup-plugin-visualizer";
import ttypescript from "ttypescript";

const extensions = [".js", ".ts", ".jsx", ".tsx"];

const dir = "lib";

export default {
  input: "./src/index.tsx",
  output: {
    dir,
    format: "esm",
    preserveModules: true,
    preserveModulesRoot: "src",
    sourcemap: true
  },
  plugins: [
    del({ targets: dir }),
    resolve(),
    commonjs(),
    ts({
      typescript: ttypescript,
      tsconfig: "./tsconfig.json"
    }),
    babel({
      exclude: "node_modules/**",
      babelHelpers: "bundled"
    }),
    url(),
    svgr(),
    postcss({
      inject: false,
      extract: "styles.min.css",
      minimize: true,
      modules: true,
      use: ["sass"],
      plugins: [autoprefixer()]
    }),
    terser(),
    visualizer({
      filename: "bundle-analysis.html",
      template: "treemap",
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ],
  external: ["react", "react-dom"]
};
