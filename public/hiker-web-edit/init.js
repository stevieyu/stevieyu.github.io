const vs = Array.from(document.querySelectorAll('script')).find(i=>i.src.includes('/loader.js')).src.replace('/loader.js', '');

// 加载配置选项
require.config({
  // 配置 vs 路径
  paths: {vs},
  // 编辑器中文汉化，其实就是让它加载 editor.main.nls.zh-cn.js
  // 如果不配置则会加载 editor.main.nls.js
  'vs/nls': { availableLanguages: { '*': 'zh-cn' } },
});

// 加载建议文件
import { SNIPPET, RESOURCE_INDENTIFIER, LINK_ROUTE } from './suggestions.js';

// 加载 Prettier 用于格式化
// https://unpkg.com/browse/prettier@2.8.8/esm/
import prettier from 'https://fastly.jsdelivr.net/npm/prettier@2.8.8/esm/standalone.mjs';
import parserBabel from 'https://fastly.jsdelivr.net/npm/prettier@2.8.8/esm/parser-babel.mjs';
// Prettier 更多配置：https://prettier.io/docs/en/options.html
const prettierOptions = {
  singleQuote: true, // 单引号 默认 false
  printWidth: 120, // 最大行长度 默认 80
  // semi: false, // 末尾是否加分号 默认 true
  // tabWidth: 4, // 缩进大小 默认 2
};

if (!window.monaco) {
  // 加载编辑器（确保只加载一次）
  require(['vs/editor/editor.main'], initMonacoEditor);
} else {
  // 如果已经加载，直接初始化
  initMonacoEditor();
}

// 加载编辑器
async function initMonacoEditor() {
  // 用 Prettier 格式化覆盖默认的
  monaco.languages.registerDocumentFormattingEditProvider('typescript', {
    provideDocumentFormattingEdits: (model) => {
      const range = model.getFullModelRange();
      // 由于 js: 会导致格式化错误，所以判断下，如果有就忽略第一行
      if (model.getValue().trimStart().startsWith('js:')) {
        range.startLineNumber = 2;
      }
      return [
        {
          range: range,
          text: prettier.format(model.getValueInRange(range), {
            parser: 'babel',
            plugins: [parserBabel],
            ...prettierOptions,
          }),
        },
      ];
    },
  });
  // const libUri = 'ts:hiker.d.ts';
  // 加载声明文件
  const hikerLibSource = await (await fetch('./hiker.d.ts')).text();
  const CryptoJSLibSource = await (await fetch('./CryptoJS.d.ts')).text();
  // 添加声明有两种方式
  // 1. 直接添加到默认
  // monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri);
  // 2. 创建模型时添加，只能创建一次，但能修改
  // monaco.editor.createModel(libSource, 'javascript', monaco.Uri.parse(libUri));

  monaco.languages.typescript.typescriptDefaults.addExtraLib(hikerLibSource, 'ts:hiker.d.ts');
  monaco.languages.typescript.typescriptDefaults.addExtraLib(CryptoJSLibSource, 'ts:CryptoJS.d.ts');

  const options = {
    // target: monaco.languages.typescript.ScriptTarget.ESNext,
    allowNonTsExtensions: true,
    // isolatedModules: true, // 开启隔离模式，但需要添加export或import或export { }
    // moduleResolution: 2,
    allowJs: true,
    // checkJs: true,
    lib: ['esnext'], // 关键，去点 dom ，用不到 dom 的 api
  };

  // 设置编译选项
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions(options);

  // console.log('ts: ', monaco.languages.typescript.typescriptDefaults.getCompilerOptions());

  // 设置资源标识提示
  monaco.languages.registerCompletionItemProvider('typescript', {
    provideCompletionItems: function (model, position) {
      const { lineNumber, column } = position;
      // 获取当前光标行前面的内容
      const textBeforePointer = model.getValueInRange({
        startLineNumber: lineNumber,
        endLineNumber: lineNumber,
        startColumn: 0,
        endColumn: column,
      });
      const match = /['"`]/.test(textBeforePointer);
      if (!match) {
        return { suggestions: [] };
      }
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: textBeforePointer.lastIndexOf('#') + 1,
        endColumn: word.endColumn,
      };
      return {
        suggestions: RESOURCE_INDENTIFIER.map((data) => {
          data.kind = monaco.languages.CompletionItemKind['Text'];
          data.range = range;
          data.insertText = data.label;
          data.insertTextRules = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
          return data;
        }),
      };
    },
    triggerCharacters: ['#'],
  });
  // 设置路由跳转链接的提示
  monaco.languages.registerCompletionItemProvider('typescript', {
    provideCompletionItems: function (model, position) {
      const { lineNumber, column } = position;
      const textBeforePointer = model.getValueInRange({
        startLineNumber: lineNumber,
        endLineNumber: lineNumber,
        startColumn: 0,
        endColumn: column,
      });
      const match = /['"`]/.test(textBeforePointer);
      // console.log(textBeforePointer);
      if (!match) {
        return { suggestions: [] };
      }
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };
      return {
        suggestions: LINK_ROUTE.map((data) => {
          data.kind = monaco.languages.CompletionItemKind['Text'];
          data.range = range;
          data.insertText = data.label;
          data.insertTextRules = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
          return data;
        }),
      };
    },
  });
  // 设置代码片段的提示
  monaco.languages.registerCompletionItemProvider('typescript', {
    provideCompletionItems: function (model, position) {
      const { lineNumber, column } = position;
      const textBeforePointer = model.getValueInRange({
        startLineNumber: lineNumber,
        endLineNumber: lineNumber,
        startColumn: 0,
        endColumn: column,
      });
      // console.log('光标前', textBeforePointer);
      // const textBeforePointerMulti = model.getValueInRange({
      //   startLineNumber: 1,
      //   endLineNumber: lineNumber,
      //   startColumn: 0,
      //   endColumn: column,
      // });
      // console.log('光标前多', textBeforePointerMulti);
      // const textAfterPointer = model.getValueInRange({
      //   startLineNumber: lineNumber,
      //   endLineNumber: lineNumber,
      //   startColumn: column,
      //   endColumn: model.getLineMaxColumn(model.getLineCount()),
      // });
      // console.log('光标后', textAfterPointer);
      // const textAfterPointerMulti = model.getValueInRange({
      //   startLineNumber: lineNumber,
      //   endLineNumber: model.getLineCount(),
      //   startColumn: column,
      //   endColumn: model.getLineMaxColumn(model.getLineCount()),
      // });
      // console.log('光标后多', textAfterPointerMulti);
      const match = /['"`]/.test(textBeforePointer);
      if (match) {
        return { suggestions: [] };
      }
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      return {
        suggestions: SNIPPET.map((data) => {
          data.kind = monaco.languages.CompletionItemKind['Snippet'];
          data.range = range;
          data.insertTextRules = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
          return data;
        }),
      };
    },
  });
}
