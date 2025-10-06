import MarkdownIt from 'markdown-it';

// @ts-ignore - No type definitions available for these plugins
import taskLists from 'markdown-it-task-lists';
// @ts-ignore - No type definitions available
import githubHeadings from 'markdown-it-github-headings';
// @ts-ignore - No type definitions available
import hljs from 'markdown-it-highlightjs';
// @ts-ignore - No type definitions available
import imsize from 'markdown-it-imsize';
// @ts-ignore - No type definitions available
import githubAlerts from 'markdown-it-github-alerts';

// Configure markdown-it with GFM support
const md = new MarkdownIt({
  html: true,          // Enable HTML tags in source
  linkify: true,       // Auto-convert URLs to links
  typographer: true,   // Enable smartquotes and other typographic replacements
  breaks: true,        // Convert \n to <br> (GFM line breaks)
})
  // GitHub Flavored Markdown plugins
  .use(hljs)           // Syntax highlighting for code blocks
  .use(taskLists, {    // Task lists: - [ ] and - [x]
    enabled: true,
    label: true,
    labelAfter: true
  })
  .use(githubHeadings, { // GitHub-style heading anchors
    prefixHeadingIds: true,
    enableHeadingLinkIcons: true
  })
  .use(imsize)         // Image size support: ![alt](img.jpg =100x200) or ![alt](img.jpg =50%)
  .use(githubAlerts);  // GitHub-style alerts: [!NOTE], [!WARNING], [!IMPORTANT], [!TIP], [!CAUTION]

// Enable GFM features via markdown-it core
md.enable(['table', 'strikethrough']);

/**
 * Converts markdown to HTML with GitHub Flavored Markdown support
 * 
 * Processes ALL markdown features:
 * - Headers (H1-H6) with GitHub-style anchor IDs
 * - Emphasis (bold, italic, strikethrough)
 * - Lists (ordered, unordered, nested, task lists)
 * - Tables with alignment
 * - Code blocks with syntax highlighting
 * - Images with size support (=WIDTHxHEIGHT or =WIDTH%)
 * - Links and autolinks
 * - Blockquotes, horizontal rules
 * - GFM line breaks and typographer features
 * 
 * @param markdown - The markdown string to convert
 * @returns HTML string with complete rendering
 * 
 * @example
 * markdownToHtml("# Title\n\nParagraph with **bold**")
 * // Returns: <h1>Title</h1>\n<p>Paragraph with <strong>bold</strong></p>
 * 
 * @example
 * markdownToHtml("```javascript\ncode();\n```")
 * // Returns: <pre><code class="hljs language-javascript">...</code></pre>
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }
  
  try {
    return md.render(markdown);
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
    throw new Error('Failed to convert markdown to HTML');
  }
}

export default markdownToHtml;
