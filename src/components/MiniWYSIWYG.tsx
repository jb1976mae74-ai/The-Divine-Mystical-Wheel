import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, List, Table, Eraser, Check, Mic, MicOff } from 'lucide-react';
import { triggerHapticFeedback } from '../utils/haptics';

interface MiniWYSIWYGProps {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  editorId?: string;
}

// Helper to convert HTML from contentEditable into clean Markdown text using recursive DOM walker
export const parseHtmlToMarkdown = (html: string): string => {
  if (!html || html === '<br>' || html === '<div><br></div>' || html === '<div><br></div><div><br></div>') return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const body = doc.body;

  const walk = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.nodeValue || '';
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const element = node as HTMLElement;
    const tagName = element.tagName.toUpperCase();

    // Parse children recursively first
    let childrenText = '';
    for (let i = 0; i < element.childNodes.length; i++) {
      childrenText += walk(element.childNodes[i]);
    }

    switch (tagName) {
      case 'STRONG':
      case 'B':
        return childrenText.trim() ? `**${childrenText.trim()}**` : '';
      case 'EM':
      case 'I':
        return childrenText.trim() ? `*${childrenText.trim()}*` : '';
      case 'BR':
        return '\n';
      case 'DIV':
      case 'P':
        return `\n${childrenText}\n`;
      case 'LI':
        return `- ${childrenText.trim()}\n`;
      case 'UL':
        return `\n${childrenText}\n`;
      case 'TH':
      case 'TD':
        return childrenText;
      case 'TR': {
        const cells = Array.from(element.querySelectorAll('td, th'));
        if (cells.length === 0) return '';
        let rowMarkdown = '|';
        cells.forEach(cell => {
          const contents = walk(cell).trim().replace(/\|/g, '\\|');
          rowMarkdown += ` ${contents} |`;
        });
        return `${rowMarkdown}\n`;
      }
      case 'THEAD':
      case 'TBODY':
        return childrenText;
      case 'TABLE': {
        const rows = Array.from(element.querySelectorAll('tr'));
        if (rows.length === 0) return '';

        let tableMarkdown = '\n';
        
        // Find column count from header row
        const firstRowCells = Array.from(rows[0].querySelectorAll('td, th'));
        const colCount = firstRowCells.length;
        if (colCount === 0) return '';

        // Build header
        let headerRow = '|';
        firstRowCells.forEach(cell => {
          const cellContent = walk(cell).trim().replace(/\|/g, '\\|') || ' ';
          headerRow += ` ${cellContent} |`;
        });
        tableMarkdown += headerRow + '\n';

        // Build alignment/divider row
        let dividerRow = '|';
        for (let i = 0; i < colCount; i++) {
          dividerRow += ' --- |';
        }
        tableMarkdown += dividerRow + '\n';

        // Build remaining rows
        for (let r = 1; r < rows.length; r++) {
          const rowCells = Array.from(rows[r].querySelectorAll('td, th'));
          let dataRow = '|';
          for (let c = 0; c < colCount; c++) {
            const cell = rowCells[c];
            const cellContent = cell ? walk(cell).trim().replace(/\|/g, '\\|') : '';
            dataRow += ` ${cellContent} |`;
          }
          tableMarkdown += dataRow + '\n';
        }

        return tableMarkdown + '\n';
      }
      default:
        return childrenText;
    }
  };

  const result = walk(body);
  
  return result
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

// Helper to convert Markdown back to clean, semantic HTML representation (supports list, bold, italic, and tables)
export const parseMarkdownToHtml = (markdown: string): string => {
  if (!markdown) return '';

  let html = markdown;

  // Convert bold and italic matches
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  const lines = html.split('\n');
  const processedLines = [];
  let inList = false;
  let inTable = false;
  let tableRows: string[][] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if it's a table row (starts and ends with '|')
    if (line.startsWith('|') && line.endsWith('|')) {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }

      // Check for alignment/divider indicator row
      const isDivider = /^\|\s*[:-]{3,}\s*(\|\s*[:-]{3,}\s*)*\|$/.test(line);
      if (isDivider) {
        continue; // skip divider line
      }

      const cells = line
        .substring(1, line.length - 1)
        .split('|')
        .map(cell => cell.trim());

      tableRows.push(cells);
      inTable = true;
    } else {
      // Flush table builder
      if (inTable) {
        processedLines.push(renderHtmlTable(tableRows));
        tableRows = [];
        inTable = false;
      }

      // Check if it's a list item
      if (line.startsWith('- ')) {
        const content = line.substring(2);
        if (!inList) {
          processedLines.push('<ul class="list-disc pl-5 my-2">');
          inList = true;
        }
        processedLines.push(`<li class="my-0.5">${content}</li>`);
      } else {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        processedLines.push(line ? `<div>${line}</div>` : '<div><br></div>');
      }
    }
  }

  // Final flush checks
  if (inTable) {
    processedLines.push(renderHtmlTable(tableRows));
  }
  if (inList) {
    processedLines.push('</ul>');
  }

  return processedLines.join('');
};

const renderHtmlTable = (rows: string[][]): string => {
  if (rows.length === 0) return '';

  let html = '<table class="mystical-editor-table border-collapse w-full my-3.5 text-xs font-serif bg-black/40 border border-amber-500/20 rounded-lg overflow-hidden">';
  
  // Header Row
  html += '<thead><tr class="bg-amber-950/20 border-b border-amber-500/25">';
  rows[0].forEach(cell => {
    html += `<th class="px-2.5 py-1.5 text-left font-semibold text-amber-200 border-r border-amber-500/10 min-w-[80px]">${cell || '&nbsp;'}</th>`;
  });
  html += '</tr></thead>';

  // Body Rows
  html += '<tbody>';
  for (let r = 1; r < rows.length; r++) {
    html += '<tr class="border-b border-amber-500/5 hover:bg-white/5 transition-colors">';
    rows[r].forEach(cell => {
      html += `<td class="px-2.5 py-1.5 text-slate-300 border-r border-amber-500/10 min-w-[80px]">${cell || '&nbsp;'}</td>`;
    });
    html += '</tr>';
  }
  html += '</tbody></table>';

  return html;
};

export default function MiniWYSIWYG({ value, onChange, placeholder = 'Capture your mystical revelation...', editorId = 'mystical-wysiwyg' }: MiniWYSIWYGProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastValueRef = useRef<string>(value);
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [pickerCols, setPickerCols] = useState(3);
  const [pickerRows, setPickerRows] = useState(3);
  
  // Table context selection tracking
  const [activeTable, setActiveTable] = useState<HTMLTableElement | null>(null);
  const [currentCell, setCurrentCell] = useState<HTMLTableCellElement | null>(null);

  // Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const SpeechRecognitionObj = typeof window !== 'undefined' ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) : null;
  const isSpeechSupported = !!SpeechRecognitionObj;

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const startListening = () => {
    if (!isSpeechSupported || !SpeechRecognitionObj) return;

    try {
      const recognition = new SpeechRecognitionObj();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
        triggerHapticFeedback('start');
      };

      recognition.onerror = (e: any) => {
        console.warn("Speech Recognition error:", e);
        if (e.error === 'not-allowed') {
          setVoiceError("Microphone access denied. Enable mic permissions in your browser.");
        } else {
          setVoiceError(`Transcription status: ${e.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          if (editorRef.current) {
            editorRef.current.focus();
            const space = (!value || value.trim() === '') ? '' : ' ';
            document.execCommand('insertText', false, space + finalTranscript);
            handleInput();
          }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn("Failed to start SpeechRecognition:", err);
      setVoiceError("Unable to access speech audio input.");
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
    triggerHapticFeedback('finish');
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Sync value from parent editor state
  useEffect(() => {
    if (editorRef.current) {
      if (value === lastValueRef.current) {
        return;
      }
      lastValueRef.current = value;
      const parentHtml = value === '' ? '' : parseMarkdownToHtml(value);
      if (editorRef.current.innerHTML !== parentHtml) {
        editorRef.current.innerHTML = parentHtml;
      }
    }
  }, [value]);

  const checkSelection = () => {
    if (!editorRef.current) return;
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const anchorNode = selection.anchorNode;
      if (editorRef.current.contains(anchorNode)) {
        let node: Node | null = anchorNode;
        let cell: HTMLTableCellElement | null = null;
        let table: HTMLTableElement | null = null;
        
        while (node && node !== editorRef.current) {
          if (node.nodeName === 'TD' || node.nodeName === 'TH') {
            cell = node as HTMLTableCellElement;
          }
          if (node.nodeName === 'TABLE') {
            table = node as HTMLTableElement;
            break;
          }
          node = node.parentNode;
        }
        setActiveTable(prev => {
          if (prev !== table) return table;
          return prev;
        });
        setCurrentCell(prev => {
          if (prev !== cell) return cell;
          return prev;
        });
        return;
      }
    }
    
    setActiveTable(prev => {
      if (prev !== null) return null;
      return null;
    });
    setCurrentCell(prev => {
      if (prev !== null) return null;
      return null;
    });
  };

  const executeCommand = (command: string, arg: string = '') => {
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handleInput = () => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML;
      const markdown = parseHtmlToMarkdown(htmlContent);
      lastValueRef.current = markdown;
      onChange(markdown);
    }
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
      lastValueRef.current = '';
      onChange('');
      setActiveTable(null);
      setCurrentCell(null);
      editorRef.current.focus();
    }
  };

  // TABLE MANIPULATION ACTIONS
  const handleInsertTable = (cols: number, rows: number) => {
    if (!editorRef.current) return;

    let tableHtml = '<table class="mystical-editor-table border-collapse w-full my-3.5 text-xs font-serif bg-black/40 border border-amber-500/20 rounded-lg overflow-hidden">';
    
    // Header Row
    tableHtml += '<thead><tr class="bg-amber-950/20 border-b border-amber-500/25">';
    for (let c = 0; c < cols; c++) {
      tableHtml += `<th class="px-2.5 py-1.5 text-left font-semibold text-amber-200 border-r border-amber-500/10 min-w-[80px]">Header ${c + 1}</th>`;
    }
    tableHtml += '</tr></thead><tbody>';

    // Body Rows
    for (let r = 0; r < rows - 1; r++) {
      tableHtml += '<tr class="border-b border-amber-500/5 hover:bg-white/5 transition-colors">';
      for (let c = 0; c < cols; c++) {
        tableHtml += `<td class="px-2.5 py-1.5 text-slate-300 border-r border-amber-500/10 min-w-[80px]">Cell ${r + 1}-${c + 1}</td>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table><div><br></div>';

    editorRef.current.focus();
    document.execCommand('insertHTML', false, tableHtml);
    handleInput();
    
    // Auto-focus table parameters
    setTimeout(checkSelection, 50);
  };

  const handleAddRow = () => {
    if (!activeTable) return;
    
    const firstRow = activeTable.rows[0];
    if (!firstRow) return;
    const colCount = firstRow.cells.length;

    let targetIndex = -1;
    if (currentCell) {
      const parentRow = currentCell.closest('tr');
      if (parentRow) {
        targetIndex = parentRow.rowIndex + 1;
      }
    }

    const tbody = activeTable.querySelector('tbody') || activeTable;
    const adjustment = activeTable.tHead ? 1 : 0;
    const insertAt = targetIndex >= 0 ? targetIndex - adjustment : -1;
    
    // Ensure accurate bounds when inserting rows
    const trueInsertAt = insertAt > tbody.rows.length ? -1 : insertAt;
    const newRow = tbody.insertRow(trueInsertAt);
    newRow.className = "border-b border-amber-500/5 hover:bg-white/5 transition-colors";

    for (let i = 0; i < colCount; i++) {
      const newCell = newRow.insertCell(-1);
      newCell.className = "px-2.5 py-1.5 text-slate-300 border-r border-amber-500/10 min-w-[80px]";
      newCell.innerHTML = "New Cell";
    }

    handleInput();
  };

  const handleDeleteRow = () => {
    if (!activeTable) return;
    
    if (currentCell) {
      const parentRow = currentCell.closest('tr');
      if (parentRow) {
        const rowIndex = parentRow.rowIndex;
        
        if (activeTable.rows.length <= 1) {
          handlePurgeTable();
          return;
        }

        activeTable.deleteRow(rowIndex);
        setActiveTable(null);
        setCurrentCell(null);
        handleInput();
      }
    }
  };

  const handleAddColumn = () => {
    if (!activeTable) return;

    let colIndex = -1;
    if (currentCell) {
      colIndex = currentCell.cellIndex + 1;
    }

    const rows = Array.from(activeTable.rows);
    rows.forEach((row, rowIndex) => {
      const isHeader = row.closest('thead') !== null || rowIndex === 0;
      const targetColIndex = colIndex >= 0 && colIndex <= row.cells.length ? colIndex : -1;
      const newCell = row.insertCell(targetColIndex);
      
      if (isHeader) {
        newCell.className = "px-2.5 py-1.5 text-left font-semibold text-amber-200 border-r border-amber-500/10 min-w-[80px]";
        newCell.innerHTML = "Col Header";
      } else {
        newCell.className = "px-2.5 py-1.5 text-slate-300 border-r border-amber-500/10 min-w-[80px]";
        newCell.innerHTML = "Cell";
      }
    });

    handleInput();
  };

  const handleDeleteColumn = () => {
    if (!activeTable) return;

    if (currentCell) {
      const colIndex = currentCell.cellIndex;
      const rows = Array.from(activeTable.rows);
      const colCount = rows[0]?.cells.length || 0;
      
      if (colCount <= 1) {
        handlePurgeTable();
        return;
      }

      rows.forEach(row => {
        if (colIndex < row.cells.length) {
          row.deleteCell(colIndex);
        }
      });

      setActiveTable(null);
      setCurrentCell(null);
      handleInput();
    }
  };

  const handlePurgeTable = () => {
    if (activeTable) {
      activeTable.remove();
      setActiveTable(null);
      setCurrentCell(null);
      handleInput();
    }
  };

  return (
    <div id={`${editorId}-container`} className="flex flex-col border border-white/10 rounded-lg bg-black/30 overflow-hidden w-full transition-all focus-within:border-amber-500/30">
      
      {/* Editor Formatting Actions (WYSIWYG Toolbar) */}
      <div id={`${editorId}-toolbar`} className="relative flex items-center justify-between px-3 py-1.5 bg-black/50 border-b border-white/5 select-none">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            id={`${editorId}-btn-bold`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('bold')}
            title="Bold Selection (Ctrl+B)"
            className="p-1 px-1.5 rounded text-slate-400 hover:text-amber-400 hover:bg-white/5 active:scale-95 transition-all text-sm font-semibold flex items-center gap-1"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          
          <button
            type="button"
            id={`${editorId}-btn-italic`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('italic')}
            title="Italic Selection (Ctrl+I)"
            className="p-1 px-1.5 rounded text-slate-400 hover:text-amber-400 hover:bg-white/5 active:scale-95 transition-all text-sm font-semibold flex items-center gap-1"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            id={`${editorId}-btn-list`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCommand('insertUnorderedList')}
            title="Toggle Bullet List"
            className="p-1 px-1.5 rounded text-slate-400 hover:text-amber-400 hover:bg-white/5 active:scale-95 transition-all text-sm font-semibold flex items-center gap-1"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          <div className="relative">
            <button
              type="button"
              id={`${editorId}-btn-table`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowTablePicker(!showTablePicker)}
              title="Insert Table Grid"
              className={`p-1 px-1.5 rounded text-slate-400 hover:text-amber-400 hover:bg-white/5 active:scale-95 transition-all text-sm font-semibold flex items-center gap-1 ${showTablePicker ? 'bg-amber-550/15 text-amber-300' : ''}`}
            >
              <Table className="w-3.5 h-3.5" />
            </button>

            {/* Hover-Grid Dynamic Dimension Picker */}
            {showTablePicker && (
              <div className="absolute top-8 left-0 bg-[#0f0f11] border border-amber-500/30 rounded-lg p-3.5 z-50 shadow-2xl text-xs text-slate-300 w-44">
                <h5 className="font-serif font-semibold text-amber-300 mb-2 text-center text-[10px] uppercase tracking-wider">Inscribe Esoteric Grid</h5>
                <div className="grid grid-cols-5 gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <div key={r} className="flex gap-1 justify-center">
                      {[1, 2, 3, 4, 5].map((c) => {
                        const active = c <= pickerCols && r <= pickerRows;
                        return (
                          <div
                            key={c}
                            onMouseEnter={() => {
                              setPickerCols(c);
                              setPickerRows(r);
                            }}
                            onClick={() => {
                              handleInsertTable(c, r);
                              setShowTablePicker(false);
                            }}
                            className={`w-5 h-5 border cursor-pointer rounded transition-all ${
                              active
                                ? 'bg-amber-500/30 border-amber-500 shadow-sm shadow-amber-950/50'
                                : 'bg-black/45 border-white/5 hover:border-amber-500/50'
                            }`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-serif">
                  <span className="text-[9px] font-mono">{pickerRows} Rows × {pickerCols} Cols</span>
                  <button
                    type="button"
                    onClick={() => {
                      handleInsertTable(pickerCols, pickerRows);
                      setShowTablePicker(false);
                    }}
                    className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-all text-[9.5px] font-semibold"
                  >
                    Inscribe
                  </button>
                </div>
              </div>
            )}
          </div>

          {isSpeechSupported ? (
            <button
              type="button"
              id={`${editorId}-btn-mic`}
              onMouseDown={(e) => {
                e.preventDefault();
                toggleListening();
              }}
              title={isListening ? "Stop Dictation" : "Dictate Insights (Voice-to-Text)"}
              className={`p-1 px-1.5 rounded relative active:scale-95 transition-all text-sm font-semibold flex items-center gap-1 ${
                isListening 
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                  : 'text-slate-400 hover:text-amber-400 hover:bg-white/5'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5 text-rose-400" />
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                </>
              ) : (
                <Mic className="w-3.5 h-3.5" />
              )}
            </button>
          ) : (
            <button
              type="button"
              disabled
              title="Voice dictation not available in this browser"
              className="p-1 px-1.5 rounded text-slate-600 cursor-not-allowed text-sm font-semibold flex items-center gap-1"
            >
              <Mic className="w-3.5 h-3.5 opacity-30" />
            </button>
          )}
        </div>

        <button
          type="button"
          id={`${editorId}-btn-clear`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleClear}
          title="Clear content"
          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-white/5 transition-all"
        >
          <Eraser className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Structured Table Context-Aware Controls */}
      {activeTable && (
        <div className="flex flex-wrap items-center gap-1.5 px-3 py-1.5 bg-amber-500/5 border-b border-white/5 text-[10px] font-sans text-amber-300/90 gap-y-1 select-none animate-fadeIn">
          <span className="font-serif font-bold text-amber-400 mr-1 flex items-center gap-1">
            <Table className="w-3 h-3 text-amber-500" /> Grid Controls:
          </span>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleAddRow}
            className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-amber-500/15 hover:text-amber-300 border border-white/5 transition-all active:scale-95"
          >
            + Row
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleDeleteRow}
            className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-red-500/15 hover:text-red-400 border border-white/5 transition-all active:scale-95"
          >
            - Row
          </button>
          <span className="text-slate-700">|</span>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleAddColumn}
            className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-amber-500/15 hover:text-amber-300 border border-white/5 transition-all active:scale-95"
          >
            + Col
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleDeleteColumn}
            className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-red-500/15 hover:text-red-400 border border-white/5 transition-all active:scale-95"
          >
            - Col
          </button>
          <span className="text-slate-700">|</span>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handlePurgeTable}
            className="ml-auto px-1.5 py-0.5 rounded bg-rose-950/20 hover:bg-rose-900/40 text-rose-300 border border-rose-500/10 transition-all active:scale-95"
          >
            Delete Grid
          </button>
        </div>
      )}

      {/* Styled contentEditable WYSIWYG workspace */}
      <div className="relative w-full">
        {(!value || value.trim() === '') && (
          <div className="absolute top-2.5 left-3 text-xs text-slate-600 font-serif pointer-events-none select-none italic">
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          id={editorId}
          onInput={handleInput}
          onKeyUp={checkSelection}
          onMouseUp={checkSelection}
          className="w-full min-h-[90px] px-3.5 py-2.5 text-xs md:text-sm font-serif text-slate-200 outline-none focus:ring-0 overflow-y-auto max-h-[250px] leading-relaxed select-text"
          style={{ whiteSpace: 'pre-wrap' }}
        />
      </div>

      {isListening && (
        <div className="px-3.5 py-1.5 bg-rose-500/5 border-t border-rose-500/10 text-[10px] font-mono text-rose-400 flex items-center gap-1.5 select-none animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping"></span>
          <span>Voice dictation active. Speak clearly to scribe your mystical revelation...</span>
        </div>
      )}
      
      {voiceError && (
        <div className="px-3.5 py-1.5 bg-amber-500/5 border-t border-amber-500/10 text-[10px] font-mono text-amber-400/90 flex items-center justify-between select-none">
          <span>🎙️ {voiceError}</span>
          <button 
            type="button" 
            onClick={() => setVoiceError(null)} 
            className="hover:text-amber-200 transition-colors px-1 text-xs"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
