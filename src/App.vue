<template lang="pug">
  div
    .editor(ref='editor')
    .json(ref='jsoneditor')
</template>

<script lang="ts">
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import { api as GraphQLAPI } from 'monaco-graphql';

// NOTE: using loader syntax becuase Yaml worker imports editor.worker directly and that
// import shouldn't go through loader syntax.
// @ts-ignore
import EditorWorker from 'worker-loader!monaco-editor/esm/vs/editor/editor.worker';
// @ts-ignore
import JSONWorker from 'worker-loader!monaco-editor/esm/vs/language/json/json.worker';
// @ts-ignore
import GraphQLWorker from 'worker-loader!monaco-graphql/esm/graphql.worker';

// @ts-ignore
window.MonacoEnvironment = {
  getWorker(_workerId: string, label: string) {
    console.log(label)
    if (label === 'graphqlDev') {
      return new GraphQLWorker();
    }
    if (label === 'json') {
      return new JSONWorker();
    }
    return new EditorWorker();
  },
};

const operation = `
# right click to view context menu
# F1 for command palette
# enjoy prettier formatting, autocompletion, 
# validation, hinting and more for GraphQL SDL and operations!
query Example($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    stargazerCount
  }
}
`;


const operationModel = monaco.editor.createModel(
  operation,
  'graphqlDev',
  monaco.Uri.file('/1/operation.graphql'),
);

const variables = `{ "owner": "graphql", "name": "graphiql" }`;

const variablesModel = monaco.editor.createModel(
  variables,
  'json',
  monaco.Uri.file('/1/variables.json'),
);

import { Component, Vue } from 'vue-property-decorator'
@Component
export default class App extends Vue {
  mounted() {
    console.log(new GraphQLWorker());
    const variablesEditor = monaco.editor.create(
      this.$refs.jsoneditor as HTMLElement,
      {
        model: variablesModel,
        language: 'json',
        automaticLayout: true,
      },
    );
    monaco.editor.create(
      this.$refs.editor as HTMLElement,
      {
        model: operationModel,
        automaticLayout: true,
        formatOnPaste: true,
        formatOnType: true,
        folding: true,
      },
    );
    GraphQLAPI.setSchemaUri('https://graphql.bitquery.io/');
  }
}
</script>
<style lang="scss" scoped>
.editor {
  height: 70vh;
}
.json {
  height: 30vh;
}
</style>