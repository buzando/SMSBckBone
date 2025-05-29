import React, { useRef, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
interface Props {
  variables: string[];
  value: string;
  onChange: (value: string) => void;
}

const DynamicCampaignText: React.FC<Props> = ({ variables, value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = '';

      const variableRegex = /\{(.*?)\}/g;
      let lastIndex = 0;
      let match;

      while ((match = variableRegex.exec(value)) !== null) {
        const textBefore = value.slice(lastIndex, match.index);
        if (textBefore) {
          editorRef.current.appendChild(document.createTextNode(textBefore));
        }

        const span = document.createElement('span');
        span.contentEditable = 'false';
        span.style.display = 'inline-flex';
        span.style.alignItems = 'center';
        span.style.backgroundColor = '#8F4D63';
        span.style.color = '#fff';
        span.style.padding = '2px 8px';
        span.style.borderRadius = '16px';
        span.style.margin = '0 4px';
        span.style.fontFamily = 'Poppins';
        span.style.fontSize = '14px';

        const textNode = document.createElement('span');
        textNode.textContent = match[1];
        span.appendChild(textNode);

        const closeButton = document.createElement('span');
        closeButton.innerHTML = '&times;';
        closeButton.style.marginLeft = '8px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => {
          span.remove();
          updateRawText();
        };
        span.appendChild(closeButton);

        editorRef.current.appendChild(span);

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < value.length) {
        editorRef.current.appendChild(document.createTextNode(value.slice(lastIndex)));
      }

      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);

      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [value]);

  const handleInsertVariable = (variable: string) => {
    const span = document.createElement('span');
    span.contentEditable = 'false';
    span.style.display = 'inline-flex';
    span.style.alignItems = 'center';
    span.style.backgroundColor = '#8F4D63';
    span.style.color = '#fff';
    span.style.padding = '2px 8px';
    span.style.borderRadius = '16px';
    span.style.margin = '0 4px';
    span.style.fontFamily = 'Poppins';
    span.style.fontSize = '14px';

    const textNode = document.createElement('span');
    textNode.textContent = variable;
    span.appendChild(textNode);

    const closeButton = document.createElement('span');
    closeButton.innerHTML = '&times;';
    closeButton.style.marginLeft = '8px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => {
      span.remove();
      updateRawText();
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

    updateRawText();
  };

  const updateRawText = () => {
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

    onChange(cleanText);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const variable = e.dataTransfer.getData('text/plain');
    handleInsertVariable(variable);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, width: "770px" }}>
      {/* Título principal */}
      <Typography
        sx={{
          fontFamily: 'Poppins',
          fontSize: '18px',
          color: '#330F1B',
          fontWeight: 600,
        }}
      >
        Escribir mensaje y agregar variables según se requiera.
      </Typography>

      {/* Contenedor horizontal que divide Mensaje y Variables */}
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, width: "770px" }}>
        {/* Mensaje: título, editor y contador */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 600,
              fontSize: '16px',
              color: '#330F1B',
              mb: 1,
            }}
          >
            Mensaje
          </Typography>

          {/* Caja de creación de mensaje */}
          <Box sx={{ position: 'relative', marginLeft: '5px', width: "520px" }}>
            {value.trim() === '' && (
              <Typography
                sx={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  pointerEvents: 'none',
                  fontFamily: 'Poppins',
                  fontSize: '14px',
                  color: '#574B4F66',
                }}
              >
                Escriba aquí su mensaje.
              </Typography>
            )}

            <Box
              contentEditable
              ref={editorRef}
              onInput={updateRawText}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              suppressContentEditableWarning
              sx={{
                border: '2px solid #9B9295CC',
                borderRadius: '8px',
                padding: '12px',
                fontFamily: 'Poppins',
                fontSize: '14px',
                minHeight: '140px',
                backgroundColor: '#fff',
                overflowY: 'hidden',
                whiteSpace: 'pre-wrap',
                direction: 'ltr',
                unicodeBidi: 'plaintext',
                textAlign: 'left',
              }}
            />
          </Box>

          <Typography
            sx={{
              fontFamily: 'Poppins',
              fontSize: '12px',
              color: '#574B4F',
              mt: 1,
            }}
          >
            {value.length}/160 caracteres para que el mensaje se realice en un sólo envío.
          </Typography>
        </Box>

        {/* Variables: título y botones */}
        <Box
          sx={{
            width: "150px", mt: 1,
            borderRadius: '12px',
            height: '200px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 600,
              fontSize: '14px',
              color: '#330F1B',
              mb: 1,
            }}
          >
            Variables
          </Typography>


          <Box sx={{
            display: 'flex', flexDirection: 'column', gap: 1,
          }}>
            {variables.map((variable, i) => (
              <Button
                key={i}
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData('text/plain', variable)
                }
                onClick={() => handleInsertVariable(variable)}
                sx={{
                  justifyContent: 'space-between',
                  width: "150px", height: "40px",
                  border: '1px solid #8F4D63',
                  backgroundColor: "#FAF5F6",
                  color: '#8F4D63',
                  fontFamily: 'Poppins',
                  textTransform: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  padding: '6px 12px',
                  '&:hover': {
                    backgroundColor: '#FAF5F6',
                    borderColor: '#8F4D63',
                  },
                }}
                endIcon={
                  <DragIndicatorIcon
                    sx={{
                      fontSize: '18px',
                      color: '#576771',
                      cursor: 'grab',
                      width: '24px',
                      height: '24px',
                    }}
                  />
                }
              >
                <Typography sx={{
                  fontFamily: 'Poppins', fontSize: '16px', color: "#8F4D63"
                }}>
                  {variable}
                </Typography>
              </Button>
            ))}
          </Box>

        </Box>
      </Box>
    </Box>

  );
};

export default DynamicCampaignText;
