import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  onChange?: (text: string) => void;
  selectedValues?: {
    id?: string;
    telefono?: string;
    dato?: string;
  };
  onSelectID?: (value: string) => void;
  onSelectTelefono?: (value: string) => void;
  onSelectDato?: (value: string) => void;
  initialMessage?: string;
}

const MAX_CHARACTERS = 160;

const DynamicMessageEditor: React.FC<Props> = ({
  onChange,
  selectedValues,
  onSelectID,
  onSelectTelefono,
  onSelectDato,
  initialMessage,
}) => {
  const [rawMessage, setRawMessage] = useState(initialMessage || '');
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && initialMessage !== undefined) {
      editorRef.current.innerHTML = '';

      // 🔥 Insertar texto normal + chips
      const variableRegex = /\{(ID|Teléfono|Dato)\}/g;
      let lastIndex = 0;
      let match;

      while ((match = variableRegex.exec(initialMessage)) !== null) {
        const textBefore = initialMessage.slice(lastIndex, match.index);
        if (textBefore) {
          const textNode = document.createTextNode(textBefore);
          editorRef.current.appendChild(textNode);
        }

        const chip = document.createElement('span');
        chip.contentEditable = 'false';
        chip.style.padding = '2px 8px 2px 6px';
        chip.style.borderRadius = '8px';
        chip.style.backgroundColor = '#7B354D';
        chip.style.color = '#FFFFFF';
        chip.style.margin = '0 4px';
        chip.style.fontSize = '13px';
        chip.style.fontFamily = 'Poppins';
        chip.style.display = 'inline-flex';
        chip.style.alignItems = 'center';
        chip.style.gap = '4px';

        const chipText = document.createElement('span');
        chipText.innerText = match[1]; // SIN corchetes
        chipText.style.pointerEvents = 'none';

        const closeIcon = document.createElement('span');
        closeIcon.innerText = '×';
        closeIcon.style.cursor = 'pointer';
        closeIcon.style.fontSize = '12px';
        closeIcon.style.marginLeft = '4px';
        closeIcon.style.userSelect = 'none';

        closeIcon.addEventListener('click', (e) => {
          e.stopPropagation();
          chip.remove();
          if (editorRef.current) {
            updateRawMessage();
          }
        });

        chip.appendChild(chipText);
        chip.appendChild(closeIcon);

        editorRef.current.appendChild(chip);

        lastIndex = match.index + match[0].length;
      }

      // 🔥 Insertar el texto que sobra al final
      if (lastIndex < initialMessage.length) {
        const remainingText = initialMessage.slice(lastIndex);
        const textNode = document.createTextNode(remainingText);
        editorRef.current.appendChild(textNode);
      }

      setRawMessage(initialMessage); // 🔥 Guarda el mensaje

      // 🔥 🔥 🔥 Mueve el cursor AL FINAL para no escribir al revés
      if (editorRef.current) {
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false); // false = final
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, [initialMessage]);



  const handleInsertTag = (tag: string) => {
    const span = document.createElement('span');
    span.contentEditable = 'false';
    span.style.display = 'inline-flex';
    span.style.alignItems = 'center';
    span.style.backgroundColor = '#8F4E63';
    span.style.color = '#fff';
    span.style.padding = '2px 8px';
    span.style.borderRadius = '16px';
    span.style.margin = '0 4px';
    span.style.fontFamily = 'Poppins';
    span.style.fontSize = '14px';

    const textNode = document.createElement('span');
    textNode.textContent = tag;
    span.appendChild(textNode);

    const closeButton = document.createElement('span');
    closeButton.innerHTML = '&times;';
    closeButton.style.marginLeft = '8px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => {
      span.remove();
      updateRawMessage();
    };
    span.appendChild(closeButton);

    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(span);
    range.collapse(false);

    const space = document.createTextNode(' ');
    range.insertNode(space);
    range.setStartAfter(space);
    range.setEndAfter(space);
    selection.removeAllRanges();
    selection.addRange(range);

    updateRawMessage();
  };

  const updateRawMessage = () => {
    if (!editorRef.current) return;
    const spans = editorRef.current.querySelectorAll('span[contenteditable="false"]');
    let htmlText = editorRef.current.innerHTML;

    spans.forEach(span => {
      const label = span.childNodes[0]?.textContent || '';
      htmlText = htmlText.replace(span.outerHTML, `{${label}}`);
    });

    const div = document.createElement('div');
    div.innerHTML = htmlText;
    const cleanText = div.innerText;

    setRawMessage(cleanText);
    onChange?.(cleanText);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl fullWidth sx={{ maxWidth: 180 }}>
          <InputLabel sx={{ fontFamily: 'Poppins', fontSize: '12px', opacity: 0.8 }}>Seleccionar ID</InputLabel>
          <Select
            label="Seleccionar ID"
            value={selectedValues?.id || ''}
            onChange={(e) => {
              onSelectID?.(e.target.value);
              handleInsertTag('ID');
            }}
            sx={{ fontFamily: 'Poppins', fontSize: '12px' }}
          >
            <MenuItem value="1" sx={{
              fontFamily: 'Poppins', fontSize: '12px', opacity: 0.5,
              '&:hover': { backgroundColor: '#F2EBED', },
            }}>1</MenuItem>
            <MenuItem value="2" sx={{
              fontFamily: 'Poppins', fontSize: '12px', opacity: 0.5,
              '&:hover': { backgroundColor: '#F2EBED', },
            }}>2</MenuItem>
            <MenuItem value="3" sx={{
              fontFamily: 'Poppins', fontSize: '12px', opacity: 0.5,
              '&:hover': { backgroundColor: '#F2EBED', },
            }}>3</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ maxWidth: 220 }}>
          <InputLabel sx={{ fontFamily: 'Poppins', fontSize: '12px' }}>Seleccionar teléfono</InputLabel>
          <Select
            label="Seleccionar teléfono"
            value={selectedValues?.telefono || ''}
            onChange={(e) => {
              onSelectTelefono?.(e.target.value);
              handleInsertTag('Teléfono');
            }}
            sx={{ fontFamily: 'Poppins', fontSize: '12px' }}
          >
            <MenuItem value="telefono1" sx={{
              fontFamily: 'Poppins', fontSize: '12px', opacity: 0.5,
              '&:hover': { backgroundColor: '#F2EBED', },
            }}>telefono1</MenuItem>
            <MenuItem value="telefono2" sx={{
              fontFamily: 'Poppins', fontSize: '12px', opacity: 0.5,
              '&:hover': { backgroundColor: '#F2EBED', },
            }}>telefono2</MenuItem>
            <MenuItem value="telefono3" sx={{
              fontFamily: 'Poppins', fontSize: '12px', opacity: 0.5,
              '&:hover': { backgroundColor: '#F2EBED', },
            }}>telefono3</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ maxWidth: 200 }}>
          <InputLabel sx={{ fontFamily: 'Poppins', fontSize: '12px' }}>Seleccionar datos</InputLabel>
          <Select
            label="Seleccionar datos"
            value={selectedValues?.dato || ''}
            onChange={(e) => {
              onSelectDato?.(e.target.value);
              handleInsertTag('Dato');
            }}
            sx={{ fontFamily: 'Poppins', fontSize: '12px' }}
          >
            <MenuItem value="Dato1" sx={{
              fontFamily: 'Poppins', fontSize: '12px', opacity: 0.5,
              '&:hover': { backgroundColor: '#F2EBED', },
            }}>Dato1</MenuItem>
            <MenuItem value="Dato1" sx={{
              fontFamily: 'Poppins', fontSize: '12px', opacity: 0.5,
              '&:hover': { backgroundColor: '#F2EBED', },
            }}>Dato2</MenuItem>
            <MenuItem value="Dato1" sx={{
              fontFamily: 'Poppins', fontSize: '12px', opacity: 0.5,
              '&:hover': { backgroundColor: '#F2EBED', },
            }}>Dato3</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={updateRawMessage}
        sx={{
          border: '1px solid #ccc',
          borderRadius: 2,
          minHeight: '120px',
          px: 2,
          py: 1.5,
          fontFamily: 'Poppins',
          fontSize: '14px',
          backgroundColor: '#fff',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      />

      <Typography variant="caption" mt={1} sx={{ fontFamily: 'Poppins', color: '#9E9E9E' }}>
        {rawMessage.length}/{MAX_CHARACTERS} caracteres para que el mensaje se realice en un sólo envío.
      </Typography>
    </Box>
  );
};

export default DynamicMessageEditor;
