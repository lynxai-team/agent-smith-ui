import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js';
import MarkdownRender, { CodeBlockNode, HtmlBlockNode, VueRendererMarkdown } from 'markstream-vue'
import ChartNode from './components/ChartNode.vue';

const app = createApp(App);

app.use(router).use(VueRendererMarkdown, {
    components: {
        code_block: CodeBlockNode, html_block: HtmlBlockNode, chart: ChartNode,
    },
}).component('MarkdownRender', MarkdownRender).mount('#app');
