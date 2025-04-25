import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, IconButton, MenuItem, Select, TextField, Chip, FormControl, InputLabel } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
    onChange?: (text: string) => void;
    selectedValues?: {
        id?: string;
        telefono?: string;
        dato?: string;
    };
}

const MAX_CHARACTERS = 160;

interface ChipData {
    key: string;
    label: string;
    length: number;
}

const DynamicMessageEditor: React.FC<Props> = ({ onChange, selectedValues }) => {
    const [messageParts, setMessageParts] = useState<(string | ChipData)[]>([]);
    const [charCount, setCharCount] = useState(0);
    const editorRef = useRef<HTMLDivElement | null>(null);

    const handleInsertChip = (type: 'ID' | 'Teléfono' | 'Dato', value: string) => {
        const newChip: ChipData = {
            key: `${type}-${value}-${Date.now()}`,
            label: type,
            length: value.length,
        };

        setMessageParts((prev) => [...prev, ' ', newChip, ' ']);
        setCharCount((prev) => prev + value.length);
        triggerChange([...messageParts, ' ', newChip, ' ']);
    };

    const handleDeleteChip = (chipKey: string) => {
        const newParts = messageParts.filter(p => {
            if (typeof p === 'string') return true;
            return p.key !== chipKey;
        });
        setMessageParts(newParts);

        const newCount = newParts.reduce((acc, part) => acc + (typeof part === 'string' ? part.length : part.length), 0);
        setCharCount(newCount);
        triggerChange(newParts);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newText = e.target.value;
        const newParts = [...messageParts];

        // Elimina texto anterior si el último elemento es texto plano
        if (typeof newParts[newParts.length - 1] === 'string') {
            newParts.pop();
        }

        newParts.push(newText);
        setMessageParts(newParts);
        setCharCount(newText.length + messageParts.filter(p => typeof p !== 'string').reduce((acc, p: any) => acc + p.length, 0));
        triggerChange(newParts);
    };

    const triggerChange = (parts: (string | ChipData)[]) => {
        const finalMessage = parts.map(p => typeof p === 'string' ? p : `{${p.label}}`).join('').trim();
        onChange?.(finalMessage);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                {/* ID */}
                <FormControl fullWidth sx={{ maxWidth: 180 }}>
                    <InputLabel sx={{ fontFamily: 'Poppins' }}>Seleccionar ID</InputLabel>
                    <Select
                        label="Seleccionar ID"
                        value={selectedValues?.id || ''}
                        onChange={(e) => handleInsertChip('ID', e.target.value)}
                        sx={{ fontFamily: 'Poppins' }}
                    >
                        <MenuItem value="1">1</MenuItem>
                        <MenuItem value="2">2</MenuItem>
                        <MenuItem value="3">3</MenuItem>
                    </Select>
                </FormControl>

                {/* Teléfono */}
                <FormControl fullWidth sx={{ maxWidth: 220 }}>
                    <InputLabel sx={{ fontFamily: 'Poppins' }}>Seleccionar teléfono</InputLabel>
                    <Select
                        label="Seleccionar teléfono"
                        value={selectedValues?.telefono || ''}
                        onChange={(e) => handleInsertChip('Teléfono', e.target.value)}
                        sx={{ fontFamily: 'Poppins' }}
                    >
                        <MenuItem value="telefono1">telefono1</MenuItem>
                        <MenuItem value="telefono2">telefono2</MenuItem>
                        <MenuItem value="telefono3">telefono3</MenuItem>
                    </Select>
                </FormControl>

                {/* Dato */}
                <FormControl fullWidth sx={{ maxWidth: 200 }}>
                    <InputLabel sx={{ fontFamily: 'Poppins' }}>Seleccionar datos</InputLabel>
                    <Select
                        label="Seleccionar datos"
                        value={selectedValues?.dato || ''}
                        onChange={(e) => handleInsertChip('Dato', e.target.value)}
                        sx={{ fontFamily: 'Poppins' }}
                    >
                        <MenuItem value="Dato1">Dato1</MenuItem>
                        <MenuItem value="Dato2">Dato2</MenuItem>
                        <MenuItem value="Dato3">Dato3</MenuItem>
                    </Select>
                </FormControl>
            </Box>


            <Box
                sx={{
                    border: '1px solid #000',
                    minHeight: '120px',
                    borderRadius: '8px',
                    px: 2,
                    py: 1.5,
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap'
                }}
                contentEditable
                suppressContentEditableWarning
                ref={editorRef}
                onInput={(e) => {
                    const text = (e.target as HTMLElement).innerText;
                    setCharCount(text.length);
                    triggerChange([{ key: 'text', label: text, length: text.length }]);
                }}
            >
                {messageParts.map((part, idx) =>
                    typeof part === 'string' ? (
                        <span key={idx}>{part}</span>
                    ) : (
                        <Chip
                            key={part.key}
                            label={part.label}
                            onDelete={() => handleDeleteChip(part.key)}
                            sx={{
                                backgroundColor: '#8F4E63',
                                color: '#fff',
                                fontFamily: 'Poppins',
                                display: 'inline-flex',
                                margin: '0 4px',
                            }}
                        />
                    )
                )}
            </Box>


            <Typography variant="caption" mt={1} sx={{ fontFamily: 'Poppins', color: '#9E9E9E' }}>
                {charCount}/{MAX_CHARACTERS} caracteres para que el mensaje se realice en un sólo envío.
            </Typography>
        </Box>
    );
};

export default DynamicMessageEditor;
