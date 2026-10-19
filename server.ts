import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System prompt for CoinPay Play™ customer support bot
const SYSTEM_INSTRUCTION = `Anda adalah Pembantu AI Rasmi bagi CoinPay Play™ — Super App E-Wallet & Gaming Rewards Malaysia.
Pemilik & Hak Cipta: NASADEF™ SDN. BHD. (https://nasadef.com.my)
Jenama: RazifApps@nasadef®

Maklumat Utama Sistem:
1. Akaun Rasmi Tambah Nilai (Top Up):
   - CIMB Bank: 7016657934 (Pemegang disahkan: NASADEF SDN BHD / CoinPay)
   - TNG DuitNow: 170997196374 / DuitNow QR
2. Kaedah Tambah Nilai:
   - Pilih jumlah (RM10, RM20, RM50, RM100, RM200)
   - Pindahkan wang ke akaun CIMB atau imbas DuitNow QR
   - Masukkan no rujukan & bukti resit
   - Status: Pending -> Under Review -> Approved (baki dikreditkan) / Rejected
3. Pemisahan Lejar:
   - Baki Tunai (Cash Wallet MYR): Wang sebenar, lejar selamat, boleh pindah/bayar.
   - Baki Coin Ganjaran (Reward Coins): Mata maya percuma dari permainan & misi harian, tebus baucar & diskaun, tidak boleh ditukar kepada wang tunai secara terus.
4. Koleksi Permainan:
   - 30 Permainan Slot Arked bertema percuma (hiburan & misi sahaja, tiada pertaruhan wang sebenar).
   - Candy Crush style: Candy Pop Rush (Padanan 3)
   - Tetris style: Block Drop Quest
   - Cyber Tennis 3D
   - Piano Music Tap
   - Snow Plow 3D: Cozy Isometric Snow-Plowing Game dengan kombo & upgrade!

Beri jawapan dalam Bahasa Melayu yang mesra, sopan, ringkas, berstruktur dan berwibawa. Bantu pengguna tentang e-wallet, topup CIMB/TNG, baki, permainan, dan pusat ganjaran.`;

// API endpoint for AI Chatbot
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mesej diperlukan.' });
    }

    if (!ai) {
      // Graceful smart fallback when GEMINI_API_KEY is not configured yet
      const lower = message.toLowerCase();
      let reply = "Terima kasih kerana menghubungi CoinPay Play™ AI Support. ";
      if (lower.includes('top up') || lower.includes('cimb') || lower.includes('tng') || lower.includes('tambah nilai')) {
        reply += "Untuk tambah nilai e-wallet, sila ke tab TOP UP. Buat pindahan ke CIMB Bank: 7016657934 atau TNG DuitNow: 170997196374, kemudian masukkan nombor rujukan anda untuk semakan pentadbir.";
      } else if (lower.includes('coin') || lower.includes('ganjaran') || lower.includes('hadiah')) {
        reply += "Coin ganjaran diperoleh daripada misi harian, check-in harian dan bermain mini games arked (termasuk 30 Arked Slot & 3D Snow Plow). Coin boleh ditebus untuk baucar promosi dan diskaun bil!";
      } else if (lower.includes('game') || lower.includes('main') || lower.includes('slot')) {
        reply += "Kami menyediakan 5 kategori permainan interaktif termasuk 30 Arcade Slots, Candy Pop, Tetris Puzzle, Cyber Tennis, Piano Rhythm, dan Cozy 3D Snow Plow! Semua slot adalah arked percuma untuk ganjaran hiburan.";
      } else if (lower.includes('transfer') || lower.includes('pindah')) {
        reply += "Anda boleh memindahkan baki tunai e-wallet ke nombor telefon atau ID pengguna berdaftar lain dengan pantas di tab E-Wallet > Transfer.";
      } else {
        reply += "Saya sedia membantu anda memahami fungsi e-wallet, status transaksi, cara menambah nilai ke akaun CIMB: 7016657934 / TNG: 170997196374, atau cara menebus ganjaran.";
      }
      return res.json({ reply });
    }

    const contents = [];
    if (Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        if (h.role && h.text) {
          contents.push({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }],
          });
        }
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Maaf, saya tidak dapat memproses jawapan pada masa ini.';
    return res.json({ reply });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: 'Ralat pemprosesan AI.',
      details: error?.message || 'Server error',
    });
  }
});

// App health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'CoinPay Play API', timestamp: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CoinPay Play server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
