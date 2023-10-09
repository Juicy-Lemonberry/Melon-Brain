'use client'
import React, { useState, FC } from 'react';
import dynamic from "next/dynamic";
import rehypeSanitize from 'rehype-sanitize';

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

interface DescriptionEditorProps {
  initialDescription: string;
  onDescriptionChange: (value: string) => void;
}

const DescriptionEditor: FC<DescriptionEditorProps> = ({ initialDescription, onDescriptionChange }) => {
  const [value, setValue] = useState(initialDescription); 

  function onEditorChange(e: string | undefined) {
    let newValue = '';
    if (typeof e !== 'undefined') {
      newValue = e;
    }

    setValue(newValue);
    onDescriptionChange(newValue);
  }

  return (
    <div>
      <MDEditor
        value={value}
        onChange={onEditorChange}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
      />
    </div>
  );
};

export default DescriptionEditor;
