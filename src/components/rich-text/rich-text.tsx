import { cn } from '@/utils/cn';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

const markdownComponents: Components = {
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table className="mb-2 w-full border-collapse text-xs">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-border bg-muted px-2 py-1 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="border border-border px-2 py-1">{children}</td>,
};

export interface RichTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Freeform markdown/GFM text — bold, italic, headings, lists, blockquotes, and tables are all supported. */
  children: string;
}

/**
 * Renders freeform rules text (feat benefits, spell descriptions, class features, etc.) as
 * formatted markdown instead of raw text with literal `**`/`*`/`|` characters. Font size and
 * color are left to the caller via className — only element spacing/structure is styled here.
 */
const RichText = React.forwardRef<HTMLDivElement, RichTextProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        '[&_p]:mb-2 [&_p:last-child]:mb-0',
        '[&_strong]:font-semibold',
        '[&_em]:italic',
        '[&_a]:underline [&_a]:underline-offset-2',
        '[&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-5',
        '[&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5',
        '[&_li]:mb-0.5',
        '[&_blockquote]:mb-2 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:italic',
        '[&_h1]:mb-1 [&_h1]:mt-3 [&_h1]:text-base [&_h1]:font-semibold',
        '[&_h2]:mb-1 [&_h2]:mt-3 [&_h2]:text-base [&_h2]:font-semibold',
        '[&_h3]:mb-1 [&_h3]:mt-3 [&_h3]:font-semibold',
        '[&_h4]:mb-1 [&_h4]:mt-3 [&_h4]:font-semibold',
        '[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em]',
        className,
      )}
      {...props}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {children}
      </ReactMarkdown>
    </div>
  ),
);
RichText.displayName = 'RichText';

export { RichText };
