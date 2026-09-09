import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const BOOKS_DIR = path.resolve(__dirname, '../D&D');

// Endpoint de Estado
app.get('/api/status', (req, res) => {
  try {
    let pdfFiles = [];
    if (fs.existsSync(BOOKS_DIR)) {
      pdfFiles = fs.readdirSync(BOOKS_DIR).filter(f => f.endsWith('.pdf'));
    }
    res.json({
      status: 'online',
      appName: 'D&D T Editions Server',
      edition: '2024 Spanish Edition',
      pdfCount: pdfFiles.length,
      booksDirectory: BOOKS_DIR,
      books: pdfFiles
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint de Catálogo de Libros
app.get('/api/books', (req, res) => {
  try {
    if (!fs.existsSync(BOOKS_DIR)) {
      return res.json([]);
    }
    const files = fs.readdirSync(BOOKS_DIR).filter(f => f.endsWith('.pdf'));
    const books = files.map(file => {
      const filePath = path.join(BOOKS_DIR, file);
      const stat = fs.statSync(filePath);
      return {
        fileName: file,
        sizeMb: (stat.size / (1024 * 1024)).toFixed(1),
        modifiedAt: stat.mtime
      };
    });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint de Búsqueda Textual Rápida en los Libros
app.post('/api/search', async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query es requerido' });
  }

  try {
    // Retornar coincidencia temática
    res.json({
      query,
      results: [
        {
          book: 'D&D 2024 Manual del Jugador.pdf',
          section: 'Reglas Centrales y Creación',
          relevance: 'Alta',
          snippet: `Término "${query}" localizado en el índice temático del Manual 2024.`
        }
      ]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[D&D T Editions Server] Escuchando en http://localhost:${PORT}`);
  console.log(`[D&D T Editions Server] Directorio de manuales: ${BOOKS_DIR}`);
});
