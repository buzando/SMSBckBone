import React, { useEffect, useRef } from 'react';
import { Box, Typography, Select, MenuItem, Menu, TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '../../assets/icon-lupa.svg';
import iconclose from '../../assets/icon-close.svg';

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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [searchText, setSearchText] = React.useState('');

  useEffect(() => {
    if (editorRef.current) {
      // Limpia el contenido
      editorRef.current.innerHTML = '';

      // Fragmento de texto limpio con chips
      const fragment = document.createDocumentFragment();

      // Regex para dividir texto y chips
      const parts = value.split(/(\{.*?\})/);

      parts.forEach(part => {
        if (/^\{.*\}$/.test(part)) {
          const variable = part.slice(1, -1); // elimina { y }

          const chip = document.createElement('span');
          chip.setAttribute('contenteditable', 'false');
          chip.style.backgroundColor = '#8F4D63';
          chip.style.color = '#fff';
          chip.style.padding = '2px 6px';
          chip.style.margin = '0 4px';
          chip.style.borderRadius = '12px';
          chip.style.fontFamily = 'Poppins';
          chip.style.fontSize = '12px';
          chip.style.display = 'inline-flex';
          chip.style.alignItems = 'center';
          chip.style.whiteSpace = 'nowrap';
          chip.style.lineHeight = '1';
          chip.style.gap = '6px';

          const label = document.createElement('span');
          label.textContent = variable;

          const close = document.createElement('span');
          close.textContent = '✖';
          close.style.cursor = 'pointer';
          close.style.marginLeft = '4px';
          close.onclick = (e) => {
            e.stopPropagation();
            chip.remove();
            const updated = value.replace(`{${variable}}`, '');
            onChange(updated);
          };

          chip.appendChild(label);
          chip.appendChild(close);
          fragment.appendChild(chip);
        } else {
          fragment.appendChild(document.createTextNode(part));
        }
      });

      editorRef.current.appendChild(fragment);

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
  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchText.toLowerCase())
  );
  return (
    <Box sx={{ mt: 4 }}>
      <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '16px', mb: 2 }}>
        Seleccionar plantilla y editar variables según se requiera.
      </Typography>

      <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', mb: 1 }}>
        Plantilla
      </Typography>
      <Box sx={{ position: 'relative', mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Seleccionar plantilla"
          value={templates.find(t => t.id.toString() === selectedId)?.name || ''}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <Typography sx={{ fontSize: 18, color: '#574B4F', pr: 1 }}>▼</Typography>
              </InputAdornment>
            )
          }}
          sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            fontFamily: 'Poppins',
            fontSize: '14px',
            cursor: 'pointer',
            height: '56px',
            '& .MuiInputBase-input': {
              padding: '16px',
            }
          }}
        />

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => {
            setAnchorEl(null);
            setSearchText('');
          }}
          PaperProps={{ style: { maxHeight: 300, width: anchorEl?.clientWidth } }}
        >
          {/* Campo de búsqueda con lupa AL INICIO */}
          <Box sx={{ px: 2, py: 1 }}>
            <TextField
              placeholder="Buscar mensaje..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              fullWidth
              size="small"
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img src={SearchIcon} alt="buscar" style={{ width: 16, height: 16 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchText('')}>
                      <img src={iconclose} alt="cerrar" style={{ width: 16, height: 16 }} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                backgroundColor: '#F8F8F8',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'Poppins',
                mb: 1
              }}
            />
          </Box>

          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((t) => (
              <MenuItem
                key={t.id}
                onClick={() => {
                  handleSelect(t.id.toString());
                  setAnchorEl(null);
                  setSearchText('');
                }}
              >
                {t.name}
              </MenuItem>
            ))
          ) : (
            <Typography
              sx={{
                fontFamily: 'Poppins',
                fontSize: '14px',
                color: '#8F4D63',
                textAlign: 'center',
                py: 2,
                px: 2
              }}
            >
              No se encontraron resultados
            </Typography>
          )}


        </Menu>
      </Box>


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
