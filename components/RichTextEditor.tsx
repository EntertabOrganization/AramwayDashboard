"use client";

import { useEffect, useId, useRef } from "react";
import "quill/dist/quill.snow.css";

interface QuillLike {
  root: HTMLDivElement;
  getText: () => string;
  on: (event: "text-change", handler: () => void) => void;
}

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ align: [] }],
  ["blockquote", "link", "image"],
  ["clean"],
];

export function RichTextEditor({
  label,
  required,
  value,
  onChange,
  testId,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (html: string) => void;
  testId?: string;
}) {
  const editorId = useId();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<QuillLike | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    let cancelled = false;

    if (!editorRef.current || quillRef.current) return;

    const boot = async () => {
      const { default: Quill } = await import("quill");
      if (cancelled || !editorRef.current || quillRef.current) return;

      const quill = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write the post content...",
        modules: { toolbar: toolbarOptions },
      }) as unknown as QuillLike;

      quill.root.innerHTML = value;
      quill.on("text-change", () => {
        onChangeRef.current(quill.getText().trim() ? quill.root.innerHTML : "");
      });

      quillRef.current = quill;
    };

    void boot();

    return () => {
      cancelled = true;
    };
    // Mounted once per modal open (Modal unmounts its children on close), so
    // `value` here only ever serves as the initial content.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mb-3">
      <label htmlFor={editorId} className="mb-1 block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      <div
        className="overflow-hidden rounded-md border border-border bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary"
        data-testid={testId}
      >
        <div id={editorId} ref={editorRef} className="min-h-40 [&_.ql-editor]:min-h-36 [&_.ql-editor]:text-sm [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-border [&_.ql-container]:border-0" />
      </div>
    </div>
  );
}
