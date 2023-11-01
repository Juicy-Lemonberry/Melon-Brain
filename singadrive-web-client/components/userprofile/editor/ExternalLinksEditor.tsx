'use client'
import React from 'react';
import '@/styles/profile-editor/EditorContent.scss';
import '@/styles/profile-editor/ExternalLinksEditor.scss';

interface ExternalLink {
  title: string;
  url: string;
}

interface ExternalLinksEditorProps {
  externalLinks: ExternalLink[];
  setExternalLinks: React.Dispatch<React.SetStateAction<ExternalLink[]>>;
}

const ExternalLinksEditor: React.FC<ExternalLinksEditorProps> = ({ externalLinks, setExternalLinks }) => {
  return (
    <div className="input-group">
      <div className="input-label">
        <label>External Links</label>
      </div>

      {externalLinks.map((link, index) => (
        <div key={index} className="link-row">
          <input
            className="title-input"
            type="text"
            placeholder="Title"
            value={link.title}
            onChange={(e) => {
              const newLinks = [...externalLinks];
              newLinks[index].title = e.target.value;
              setExternalLinks(newLinks);
            }}
          />
          <input
            className="url-input"
            type="url"
            placeholder="URL"
            value={link.url}
            onChange={(e) => {
              const newLinks = [...externalLinks];
              newLinks[index].url = e.target.value;
              setExternalLinks(newLinks);
            }}
          />
        </div>
      ))}

      <div className="button-row">
        <button onClick={() => setExternalLinks([...externalLinks, { title: '', url: '' }])}>Add Link</button>
      </div>
    </div>
  );
};

export default ExternalLinksEditor;

