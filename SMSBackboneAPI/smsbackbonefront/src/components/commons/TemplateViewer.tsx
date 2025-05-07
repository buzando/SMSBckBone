import React, { useEffect, useRef } from 'react';
import { Box, Typography, Select, MenuItem } from '@mui/material';

interface Template {
    id: number;
    name: string;
    message: string;
    creationDate: string; // DateTime en C# es string en JS/TS
    idRoom: number;
}

interface Props {
  templates: Template[];
  value: string;
  onChange: (value: string) => void;
  onSelectTemplateId?: (id: number) => void; 
}

const TemplateViewer: React.FC<Props> = ({ templates, value, onChange, onSelectTemplateId }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = React.useState<string>('');

  useEffect(() => {
    if (editorRef.current) {
      const htmlWithChips = value.replace(/\{(.*?)\}/g, (_, variable) => {
        return `<span contenteditable="false" 
                  style="background-color:#8F4D63;color:#fff;padding:4px 8px;margin:0 2px;border-radius:8px;font-family:Poppins;font-size:14px;display:inline-flex;align-items:center;gap:4px;">
                  ${variable} <span style='cursor:pointer;' onclick='this.parentNode.remove()'>✖</span>
                </span>`;
      });
      editorRef.current.innerHTML = htmlWithChips;

      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [value]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const template = templates.find(t => t.id === Number(id));
    if (template) {
      onChange(template.message);
      if (onSelectTemplateId) onSelectTemplateId(template.id); 
    }
  };

  const updateRawText = () => {
    if (!editorRef.current) return;
    const spans = editorRef.current.querySelectorAll('span[contenteditable="false"]');
    let htmlText = editorRef.current.innerHTML;
    spans.forEach((span) => {
      const label = span.childNodes[0]?.textContent || '';
      htmlText = htmlText.replace(span.outerHTML, `{${label}}`);
    });
    const div = document.createElement('div');
    div.innerHTML = htmlText;
    const cleanText = div.innerText;
    onChange(cleanText);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '16px', mb: 2 }}>
        Seleccionar plantilla y editar variables según se requiera.
      </Typography>

      <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', mb: 1 }}>
        Plantilla
      </Typography>

      <Select
        fullWidth
        value={selectedId}
        onChange={(e) => handleSelect(e.target.value)}
        displayEmpty
        sx={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          fontFamily: 'Poppins',
          fontSize: '14px',
          mb: 3,
        }}
      >
        <MenuItem value="" disabled>
          Seleccione un mensaje
        </MenuItem>
        {templates.map((t) => (
          <MenuItem key={t.id} value={t.id}>
            {t.name}
          </MenuItem>
        ))}
      </Select>

      <Box
        contentEditable
        ref={editorRef}
        onInput={updateRawText}
        suppressContentEditableWarning
        sx={{
          backgroundColor: '#F8F8F8',
          borderRadius: '8px',
          fontFamily: 'Poppins',
          fontSize: '14px',
          minHeight: '160px',
          padding: '12px',
          border: '1px solid #ccc',
          whiteSpace: 'pre-wrap'
        }}
      />

      <Typography sx={{ fontFamily: 'Poppins', fontSize: '12px', mt: 1 }}>
        {value.length}/160 caracteres para que el mensaje se realice en un sólo envío.
      </Typography>
    </Box>
  );
};

export default TemplateViewer;
