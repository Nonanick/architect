import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";

const Highlighter = hljs;

Highlighter.registerLanguage("typescript", typescript);

export default Highlighter;