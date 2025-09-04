

"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useEffect, useState } from 'react';

export default function NewsFullStoryEditor({ initialValue = "", onSave }: { initialValue?: string, onSave: (html: string) => void }) {
  const [html, setHtml] = useState(initialValue);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Image,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: initialValue,
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && initialValue !== editor.getHTML()) {
      editor.commands.setContent(initialValue);
    }
    // eslint-disable-next-line
  }, [initialValue]);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Edit Full Story (Rich Text)</h2>
      <div className="mb-4 bg-white border rounded pl-5 pr-5 ">
        <EditorContent editor={editor} />
      </div>
      <button
        className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded"
        onClick={() => onSave(html)}
      >
        Save
      </button>
      <div className="mt-6">
        <h3 className="font-semibold mb-1">Preview:</h3>
        <div className="prose max-w-none border p-3 rounded bg-gray-50" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
