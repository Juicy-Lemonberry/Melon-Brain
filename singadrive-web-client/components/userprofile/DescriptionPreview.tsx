'use client'
import React, { FC } from 'react';
import dynamic from "next/dynamic";
import rehypeSanitize from 'rehype-sanitize';

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

interface DescriptionPreviewProps {
  initialDescription: string;
}

const DescriptionPreview: FC<DescriptionPreviewProps> = ({ initialDescription }) => {
  return (
    <div>
      <MDEditor
        value={initialDescription}
        preview='preview'
        hideToolbar={true}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
      />
    </div>
  );
};

export default DescriptionPreview;
