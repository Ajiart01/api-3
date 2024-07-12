const express = require("express");
const path = require("path");
const fs = require("fs");
const AI = require("stable-diffusion-cjs");
const { Primbon } = require('scrape-primbon');
const primbon = new Primbon();
const { googleImage } = require('@bochilteam/scraper-images');
const scraper = require('@bochilteam/scraper');
const diffusion = require("./func/diffusion.js")
const simsimi = require("simsimi-api");
const { youtube } = require("scrape-youtube");
const axios = require("axios");
const fetch = require("@replit/node-fetch");
const googleTTS = require('google-tts-api');
const bodyParser = require("body-parser");
let startTime = new Date();
const ai2 = require('./func/ai2.js');
const { tts } = require('./func/tts.js');
const alicia = require('./func/alicia.js');
const { spawn } = require('child_process');
const { azz } = require('./func/you.js')
const bmkg_info = require('gempa-id-info');
const daffa = require('./func/ai.js')

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', (req, res, next) => {
    let data = JSON.parse(fs.readFileSync('database/reqtotal.json', 'utf8'));
    let today = new Date().toISOString().split('T')[0];
    let lastResetDay = new Date(data.last_reset_time).toISOString().split('T')[0];

    if (today !== lastResetDay) {
        data.request_perhari = 0;
        data.last_reset_time = new Date().toISOString();
    }

    data.request_perhari++;
    data.request_total++;

    fs.writeFileSync('database/reqtotal.json', JSON.stringify(data));

    next();
});

// Router
const mainRoute = require("./routes/index.js");
app.use("/", mainRoute);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));
app.set("json spaces", 2);

//=====================[BATAS]===================\\
// Router

app.get("/daffa", async (req, res) => {
try {
    if (!req.query.user) {
        return res.send("Masukkan Parameter user")
    }
    let tes = null
    if (!req.query.q) {
        tes = "aku mau nanya"
    } else {
        tes = req.query.q
    }
    let hasil = await daffa.openai(tes,req.query.user);
    res.json({respon:hasil})
} catch (error) {
    res.json("error")
}})

app.get("/api/elevenlabs", async (req, res) => {
    if (req.query.q && req.query.model) {
        try {
            const h = await tts(req.query.q, req.query.model);
            res.set('Content-Type', 'audio/mpeg');
            res.send(Buffer.from(h, 'binary'));

        } catch (error) {
            res.send("error")
        }
    } else {
        res.send(`"Rachel",
"Clyde",
"Domi",
"Dave",
"Fin",
"Bella",
"Antoni",
"Thomas",
"Charlie",
"Emily",
"Elli",
"Callum",
"Patrick",
"Harry",
"Liam",
"Dorothy",
"Josh",
"Arnold",
"Charlotte",
"Matilda",
"Matthew",
"James",
"Joseph",
"Jeremy",
"Michael",
"Ethan",
"Gigi",
"Freya",
"Grace",
"Daniel",
"Serena",
"Adam",
"Nicole",
"Jessie",
"Ryan",
"Sam",
"Glinda",
"Giovanni",
"Mimi",
"Alex"`)
    }
})
app.get("/api/alicia-voice", async (req, res) => {
    if (!req.query.q && !req.query.user) {
        return res.send("masukan parameter nya lah bujang");
    }
    const has = await alicia.openai(req.query.q, req.query.user);
    try {
        const anunya = await tts(has, "Freya");

        res.set('Content-Type', 'audio/mpeg');
        res.send(Buffer.from(anunya, 'binary'));
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get("/api/gptlogic", async (req, res) => {
    try {
        const { sifat, text, role, nama, respon } = req.query;
        const question = `aku ingin anda bertindak sebagai ${role}, anda bernama ${nama}, dan sifat anda adalah ${sifat}\n\n[How to respond?:${respon}]\n\nquestion:${text}`;
        const encodedQuestion = encodeURIComponent(question);

        const response = await axios.get(`https://chatgpt4.my.id/api/processdata?question=${encodedQuestion}`);
        res.setHeader("Content-Type", "application/json");
        res.send({ hasil: response.data });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/api/gempa', (req, res) => {
    bmkg_info.latestGempa()
        .then(data => {
            const formattedData = JSON.stringify(data, null, 2);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(formattedData);
        })
        .catch(error => {
            res.status(500).json({ error: 'Gagal mengambil informasi gempa terbaru' });
        });
});

app.get('/api/image2promt', async (req, res) => {
    const imageUrl = req.query.url;
    if (!imageUrl) {
        return res.status(400).json({ error: 'URL gambar harus disertakan' });
    }

    try {
        const response = await axios.get(`https://image-to-text.azzbot1.repl.co/image2text?url=${imageUrl}`);
        const textFromImage = response.data;
        const formattedResult = JSON.stringify({ text: textFromImage }, null, 2);
        res.setHeader('Content-Type', 'application/json');
        res.end(formattedResult);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil teks dari gambar' });
    }
});

app.get('/api/ssweb', async (req, res) => {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({ error: 'URL harus disediakan dalam parameter "url".' });
        }

        // Panggil API pihak ketiga untuk mengambil tangkapan layar
        const apiUrl = `https://screen-shot-website.azzbot1.repl.co/screenshot?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

        // Mengirim tangkapan layar sebagai respons
        res.setHeader('Content-Type', 'image/png');
        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Terjadi kesalahan dalam mengambil tangkapan layar.' });
    }
});
app.get('/api/memegen', async (req, res) => {
    try {
        // Get query parameters
        const text = req.query.text; // Default text if not provided in the query parameter
        const url = req.query.url; // Default background image URL if not provided in the query parameter

        // Validate input
        if (!text || !url) {
            throw new Error('Text and URL are required parameters');
        }

        // Construct the meme URL
        const memeUrl = `https://api.memegen.link/images/custom/_/${encodeURIComponent(text)}.png?background=${encodeURIComponent(url)}`;

        // Fetch the meme image using Axios
        const response = await axios.get(memeUrl, { responseType: 'stream' });

        // Set the appropriate content type for the response
        res.setHeader('Content-Type', 'image/png');

        // Pipe the meme image to the response
        response.data.pipe(res);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error generating meme');
    }
});

app.get('/api/lirik', async (req, res) => {
    const query = req.query.q; // Mendapatkan query dari parameter URL
    if (!query) {
        return res.status(400).json({ error: 'Query tidak boleh kosong' });
    }

    try {
        let hasilPencarian = await scraper.lyricsv2(query);

        if (!hasilPencarian) {
            // Jika lyricsv2() gagal, mencoba menggunakan lyrics()
            hasilPencarian = await scraper.lyrics(query);
        }

        if (!hasilPencarian) {
            // Jika lyrics() juga gagal, tampilkan pesan error
            return res.status(404).json({ error: 'Lirik tidak ditemukan' });
        }

        res.json({ hasil: hasilPencarian });
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan saat mencari lirik' });
    }
});

app.get('/api/liputan6', async (req, res) => {
    try {
        const data = await scraper.liputan6()
        res.json(data)
    } catch (error) {
        res.send("internal server error")
    }
});

app.get('/api/susunkata', async (req, res) => {
    try {
        const data = await scraper.susunkata();
        res.json(data)
    } catch (error) {
        res.send('internal server error')
    }
});

app.get('/api/jadwaltvnow', async (req, res) => {
    try {
        const jadwal = await scraper.jadwalTVNow();
        res.json(jadwal);
    } catch (error) {
        res.send('internal server error')
    }
});

app.get('/api/facebookdl', async (req, res) => {
    try {
        const url = req.query.url;

        if (!url) {
            return res.status(400).json({ error: 'URL tidak valid' });
        }

        const data = await scraper.facebookdlv2(url);

        if (!data) {
            return res.status(404).json({ error: 'Video tidak ditemukan' });
        }
        const jsonData = JSON.stringify(data, null, 2);
        res.setHeader("Content-Type", "application/json");
        res.send(jsonData);

    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

app.get('/akses', (req, res) => {
    // Baca isi file reqtotal.json
    fs.readFile('database/reqtotal.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Gagal membaca file');
        } else {
            // Parse isi file JSON
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        }
    });
});

app.get("/api/play", async (req, res) => {
    try {
        const text = req.query.q;
        const searchResult = await youtube.search(text);
        if (!searchResult || searchResult.videos.length === 0) {
            throw new Error("Video tidak ditemukan");
        }

        const videoId = searchResult.videos[0].link;
        const mp3 = `https://youtubedl.azzbot1.repl.co/mp3?url=${videoId}`
        const mp4 = `https://youtubedl.azzbot1.repl.co/mp4?url=${videoId}`
        const videoInfo = searchResult.videos[0];

        const data = {
            creator: "Azz-Api",
            videoInfo,
            mp3,
            mp4
        };

        const jsonData = JSON.stringify(data, null, 2);

        res.setHeader("Content-Type", "application/json");
        res.send(jsonData);
        console.log("play");
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

app.get('/api/openjourney/:q', async (req, res) => {
    try {
        const input = req.params.q;
        const data = { "inputs": input };

        const response = await axios.post(
            "https://api-inference.huggingface.co/models/prompthero/openjourney-v4",
            data,
            {
                headers: { Authorization: "Bearer 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" },
                responseType: 'arraybuffer' // To receive binary data
            }
        );

        // Set the response content type to image/png
        res.setHeader('Content-Type', 'image/png');
        // Send the binary data as the response
        res.send(response.data);
    } catch (error) {
        console.error(error);
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
});

app.get('/api/nomerhoki/:nomor', async (req, res) => {
    const nomor = req.params.nomor;
    const result = await primbon.nomer_hoki(nomor);
    const jsonData = JSON.stringify(result, null, 2);
    res.setHeader("Content-Type", "application/json");
    res.send(jsonData);
});

app.get('/api/tafsirmimpi/:mimpi', async (req, res) => {
    const mimpi = req.params.mimpi;
    const result = await primbon.tafsir_mimpi(mimpi);
    const jsonData = JSON.stringify(result, null, 2);
    res.setHeader("Content-Type", "application/json");
    res.send(jsonData);
});

app.get('/api/ramalanjodoh/:nama1/:tgl1/:bln1/:thn1/:nama2/:tgl2/:bln2/:thn2', async (req, res) => {
    const { nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2 } = req.params;
    const result = await primbon.ramalan_jodoh(nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2);
    const jsonData = JSON.stringify(result, null, 2);
    res.setHeader("Content-Type", "application/json");
    res.send(jsonData);
});

app.get('/api/ramalanjodohbali/:nama1/:tgl1/:bln1/:thn1/:nama2/:tgl2/:bln2/:thn2', async (req, res) => {
    const { nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2 } = req.params;
    const result = await primbon.ramalan_jodoh_bali(nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2);
    const jsonData = JSON.stringify(result, null, 2);
    res.setHeader("Content-Type", "application/json");
    res.send(jsonData);
});

app.get('/api/suamiistri/:nama1/:tgl1/:bln1/:thn1/:nama2/:tgl2/:bln2/:thn2', async (req, res) => {
    const { nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2 } = req.params;
    const result = await primbon.suami_istri(nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2);
    const jsonData = JSON.stringify(result, null, 2);
    res.setHeader("Content-Type", "application/json");
    res.send(jsonData);
});

app.get('/api/ramalancinta/:nama1/:tgl1/:bln1/:thn1/:nama2/:tgl2/:bln2/:thn2', async (req, res) => {
    const { nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2 } = req.params;
    const result = await primbon.ramalan_cinta(nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2);
    const jsonData = JSON.stringify(result, null, 2);
    res.setHeader("Content-Type", "application/json");
    res.send(jsonData);
});

app.get('/api/artinama/:nama', async (req, res) => {
    const nama = req.params.nama;
    const result = await primbon.arti_nama(nama);
    const jsonData = JSON.stringify(result, null, 2);
    res.setHeader("Content-Type", "application/json");
    res.send(jsonData);
});

app.get('/api/kecocokannama/:nama/:tgl/:bln/:thn', async (req, res) => {
    const { nama, tgl, bln, thn } = req.params;
    const result = await primbon.kecocokan_nama(nama, tgl, bln, thn);
    const jsonData = JSON.stringify(result, null, 2);
    res.setHeader("Content-Type", "application/json");
    res.send(jsonData);
});

app.get('/api/kecocokannamapasangan/:nama1/:nama2', async (req, res) => {
    const { nama1, nama2 } = req.params;
    const result = await primbon.kecocokan_nama_pasangan(nama1, nama2);
    const jsonData = JSON.stringify(result, null, 2);
    res.setHeader("Content-Type", "application/json");
    res.send(jsonData);
});

app.get('/api/ramalantanggaljadian/:tgl/:bln/:thn', async (req, res) => {
    const { tgl, bln, thn } = req.params;
    const result = await primbon.tanggal_jadian_pernikahan(tgl, bln, thn);
    const jsonData = JSON.stringify(result, null, 2);
    res.setHeader("Content-Type", "application/json");
    res.send(jsonData);
});

app.get('/api/sifatusahabisnis/:tgl/:bln/:thn', async (req, res) => {
    const { tgl, bln, thn } = req.params;
    const result = await primbon.sifat_usaha_bisnis(tgl, bln, thn);
    const jsonData = JSON.stringify(result, null, 2);
    res.setHeader("Content-Type", "application/json");
    res.send(jsonData);
});

app.get('/api/rejekihoki/:tgl/:bln/:thn', async (req, res) => {
    const { tgl, bln, thn } = req.params;
    const result = await primbon.rejeki_hoki_weton(tgl, bln, thn);
    const jsonData = JSON.stringify(result, null, 2);
    res.setHeader("Content-Type", "application/json");
    res.send(jsonData);
});

app.get('/api/pekerjaanweton/:tgl/:bln/:thn', async (req, res) => {
    const { tgl, bln, thn } = req.params;
    const result = await primbon.pekerjaan_weton_lahir(tgl, bln, thn);
    const jsonData = JSON.stringify(result, null, 2);
    res.setHeader("Content-Type", "application/json");
    res.send(jsonData);
});

app.get('/api/zodiak/:zodiak', async (req, res) => {
    const zodiak = req.params.zodiak;
    const result = await primbon.zodiak(zodiak);
    const jsonData = JSON.stringify(result, null, 2);
    res.setHeader("Content-Type", "application/json");
    res.send(jsonData);
});
app.get('/api/anime/:q', async (req, res) => {
    if (!req.params.q) {
        res.send('isi dengan karakter anima contoh /loli')
    } else {
        try {
            const hasil = await googleImage(req.params.q);

            // Pilih secara acak satu gambar dari hasil
            const randomImage = hasil[Math.floor(Math.random() * hasil.length)];
            const imageUrl = randomImage; // Ganti dengan URL gambar yang ingin Anda kirim
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

            // Mengatur header respons untuk jenis konten gambar
            res.setHeader('Content-Type', 'image/jpeg'); // Ganti sesuai jenis gambar Anda

            // Mengirim gambar sebagai respons
            res.send(response.data);

        } catch (error) {
            console.error(error);
            res.status(500).send('Terjadi kesalahan saat mengambil gambar.');
        }
    }
});

app.get('/api/hentai', async (req, res) => {
    try {
        const hasil = await googleImage("hentai");

        // Pilih secara acak satu gambar dari hasil
        const randomImage = hasil[Math.floor(Math.random() * hasil.length)];
        const imageUrl = randomImage; // Ganti dengan URL gambar yang ingin Anda kirim
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        // Mengatur header respons untuk jenis konten gambar
        res.setHeader('Content-Type', 'image/jpeg'); // Ganti sesuai jenis gambar Anda

        // Mengirim gambar sebagai respons
        res.send(response.data);

    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat mengambil gambar.');
    }
});

app.get('/api/cosplay', async (req, res) => {
    try {
        const hasil = await googleImage("anime cosplay");

        // Pilih secara acak satu gambar dari hasil
        const randomImage = hasil[Math.floor(Math.random() * hasil.length)];
        const imageUrl = randomImage; // Ganti dengan URL gambar yang ingin Anda kirim
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        // Mengatur header respons untuk jenis konten gambar
        res.setHeader('Content-Type', 'image/jpeg'); // Ganti sesuai jenis gambar Anda

        // Mengirim gambar sebagai respons
        res.send(response.data);

    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat mengambil gambar cosplay.');
    }
});

app.get('/api/gimage', async (req, res) => {
    const query = req.query.q;

    if (query) {
        try {
            const hasil = await googleImage(query);
            const data = { author: "azzapi", hasil }
            const jsonData = JSON.stringify(data, null, 2);
            res.setHeader('Content-Type', 'application/json');
            res.send(jsonData)
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching images' });
        }
    } else {
        res.send('masukan query')
    }
});

// Endpoint untuk memproses request dari /visitor
app.get('/visitor', (req, res) => {
    // Baca nilai saat ini dari file ./database/Visit.txt
    fs.readFile('./database/Visit.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read ./database/Visit.txt' });
        }

        // Konversi nilai menjadi integer dan tambahkan 1
        const currentVisitorCount = parseInt(data, 10) || 0;
        const newVisitorCount = currentVisitorCount + 1;

        fs.writeFile('./database/Visit.txt', newVisitorCount.toString(), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to update ./database/Visit.txt' });
            }

            // Kirimkan response berupa JSON
            return res.json({ azzapi: newVisitorCount });
        });
    });
});

app.get('/getRequests', (req, res) => {
    // Baca data dari ./database/req.json (jika ada)
    let existingRequests = [];
    if (fs.existsSync('./database/req.json')) {
        const data = fs.readFileSync('./database/req.json', 'utf8');
        existingRequests = JSON.parse(data);
    }

    res.json(existingRequests);
});
app.post('/submitRequest', (req, res) => {
    const { nama, pesan } = req.body;
    const tanggal = new Date().getDate();
    const bulan = new Date().getMonth() + 1;
    const tahun = new Date().getFullYear();

    const newRequest = { nama, pesan, tanggal, bulan, tahun };

    // Baca data dari ./database/req.json (jika ada)
    let existingRequests = [];
    if (fs.existsSync('./database/req.json')) {
        const data = fs.readFileSync('./database/req.json', 'utf8');
        existingRequests = JSON.parse(data);
    }

    // Tambahkan data baru ke array
    existingRequests.push(newRequest);

    // Simpan data ke ./database/req.json dalam bentuk string JSON
    fs.writeFileSync('./database/req.json', JSON.stringify(existingRequests));

    res.send('Request fitur berhasil dikirim!');
});

app.get('/runtime', (req, res) => {
    const currentTime = new Date();
    const runtimeInMilliseconds = currentTime - startTime;

    let seconds = Math.floor(runtimeInMilliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    seconds %= 60;
    minutes %= 60;
    hours %= 24;

    const runtime = {
        years: currentTime.getFullYear() - startTime.getFullYear(),
        months: currentTime.getMonth() - startTime.getMonth(),
        days,
        hours,
        minutes,
        seconds,
    };

    res.json(runtime);
});

app.get('/api/tts', async (req, res) => {
    try {
        const { text, language, speed } = req.query;
        const lang = language || "id";
        const slow = false;
        const host = 'https://translate.google.com';
        const splitPunct = '123456789,.?!:;';

        if (!text) {
            return res.status(400).json({ error: 'Parameter "text" is required' });
        }

        const results = googleTTS.getAllAudioUrls(text, { lang, slow, host, splitPunct });

        if (!results || results.length === 0) {
            return res.status(500).json({ error: 'Failed to generate audio URLs' });
        }

        const audioData = await Promise.all(
            results.map((result) => axios.get(result.url, { responseType: 'arraybuffer' }))
        );

        const combinedAudio = Buffer.concat(audioData.map((response) => response.data));

        const ffmpegProcess = spawn('ffmpeg', [
            '-i', 'pipe:0',
            '-filter:a', `atempo=${speed || 1.5}`,
            '-f', 'mp3',
            'pipe:1',
        ]);

        ffmpegProcess.stdin.end(combinedAudio);

        res.set('Content-Type', 'audio/mpeg');
        ffmpegProcess.stdout.pipe(res);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/instagram', (req, res) => {
    const url = req.query.url;

    scraper.instagramdl(url)
        .then((result) => {
            res.json(result); // Mengirim hasil dalam format JSON sebagai respons
        })
        .catch((err) => {
            res.status(500).json({ error: err.message }); // Mengirim pesan error dalam format JSON dengan status 500 jika terjadi kesalahan
        });
});

app.get("/api/tiktok", async (req, res) => {
    if (!req.query.url) {
        res.send("mana url nya")
    } else {
        const hasil = await scraper.tiktokdl(req.query.url)
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(hasil, null, 2))
    }
});

app.get("/api/simsimi", (req, res) => {
    const { q } = req.query;
    try {
        if (!q) {
            return res
                .status(400)
                .json({ error: 'Parameter "message" dan "language" harus disediakan.' });
        }

        simsimi
            .simtalk(q, "id")
            .then((response) => {
                const data = { author: "Azz Api", respon: response.message };
                const jsonData = JSON.stringify(data, null, 2);
                res.setHeader("Content-Type", "application/json");
                res.send(jsonData);
            })
            .catch((error) => {
                res
                    .status(500)
                    .json({
                        error: "Terjadi kesalahan saat berkomunikasi dengan SimSimi.",
                    });
            });
    } catch (error) {
        res.send("error cuk")
    }
});

app.get('/api/bard', async (req, res) => {
    const query = req.query.q;
    if (query) {
        const apiUrl = `https://api.yanzbotz.my.id/api/ai/bard?query=${encodeURIComponent(query)}`;

        try {
            const response = await axios.get(apiUrl);
            const result = response.data.result;
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ respon: result }, null, 2));
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {

    }
});

app.get("/api/azz", async (req, res) => {
    if (!req.query.q) {
        res.send("harap isi query \"q\"")
    } else {
        try {
            const hasil = await azz(req.query.q)
            res.json({ powerd_by: "AzzApi", hasil })
        } catch (error) {
            res.send("error")
        }
    }
})
app.get("/api/gpt", async (req, res) => {
    if (!req.query.q) {
        res.status(400).json({ error: 'Masukkan parameter "q".' });
    } else {
        try {
            const username = req.query.user || Date.now()
            const riki = await ai2.openai(req.query.q, username);
            const rik = riki.replace(/<BR>/g, "\n\n");
            const data = { author: "AzzApi", respon: rik };
            const jsonData = JSON.stringify(data, null, 2);
            res.setHeader("Content-Type", "application/json");
            res.status(200).send(jsonData);
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            res.status(500).json({ error: "Saat ini mengalami masalah." });
        }
    }
});

app.get("/api/alicia", async (req, res) => {
    const user = req.query.user || Date.now()
    if (!req.query.q) {
        res.status(400).json({ error: 'pastikan parameter "q" ada' });
    } else {
        try {
            const riki = await alicia.openai(req.query.q, user);
            const rik = riki.replace(/<BR>/g, "\n\n");
            const data = { author: "AzzApi", respon: rik };
            const jsonData = JSON.stringify(data, null, 2);
            res.setHeader("Content-Type", "application/json");
            res.status(200).send(jsonData);
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            res.status(500).json({ error: "Saat ini mengalami masalah." });
        }
    }
});
app.get("/api/stablediffusion", async (req, res) => {
    const query = req.query.q;
    try {
        if (!query) {
            res
                .status(400)
                .json({ error: "Missing 'q' parameter in the query string." });
            return;
        }

        AI.generate(query, async (result) => {
            if (result.error) {
                console.log(result.error);
                res.status(500).json({ error: "Failed to generate image." });
                return;
            }
            try {
                const imageData = result.results[0].split(",")[1];
                const buffer = Buffer.from(imageData, "base64");
                res.writeHead(200, {
                    "Content-Type": "image/png",
                    "Content-Length": buffer.length,
                });
                res.end(buffer);
                console.log("stable diffusion");
            } catch (e) {
                console.log(e);
                res.status(500).json({ error: "Failed to process image." });
            }
        });
    } catch (error) {
        res.send('error')
    }
});

app.get('/api/animediffusion', async (req, res, next) => {
    const query = req.query.q;
    try {
        if (!query) {
            res
                .status(400)
                .json({ error: "Missing 'q' parameter in the query string." });
            return;
        }

        diffusion.animedif(query).then(async image => {
            res.set({ 'Content-Type': 'image/png' });
            res.send(image);
        });
    } catch (error) {
        res.send('error')
    }
});

app.get('/api/animediffusion2', async (req, res, next) => {
    const query = req.query.q;
    try {
        if (!query) {
            res
                .status(400)
                .json({ error: "Missing 'q' parameter in the query string." });
            return;
        }

        diffusion.animedif2(query).then(async image => {
            res.set({ 'Content-Type': 'image/png' });
            res.send(image);
        });
    } catch (error) {
        res.send('error')
    }
});

app.get('/api/animediffusion3', async (req, res, next) => {
    const query = req.query.q;
    try {
        if (!query) {
            res
                .status(400)
                .json({ error: "Missing 'q' parameter in the query string." });
            return;
        }
        diffusion.animedif3(query).then(async image => {
            res.set({ 'Content-Type': 'image/png' });
            res.send(image);
        });
    } catch (error) {
        res.send('error')
    }
});

app.get('/api/stablediffusion3', async (req, res) => {
    const query = req.query.q;
    try {
        if (!query) {
            res
                .status(400)
                .json({ error: "Missing 'q' parameter in the query string." });
            return;
        }

        diffusion.stabledif(query).then(async image => {
            res.set({ 'Content-Type': 'image/png' });
            res.send(image);
        });
    } catch (error) {
        res.send('error')
    }
});

app.get('/api/stablediffusion2', async (req, res, next) => {
    const query = req.query.q;
    try {
        if (!query) {
            res
                .status(400)
                .json({ error: "Missing 'q' parameter in the query string." });
            return;
        }

        diffusion.stabledif2(query).then(async image => {
            res.set({ 'Content-Type': 'image/png' });
            res.send(image);
        });
    } catch (error) {
        res.send('error')
    }
});

app.get('/api/text2img', async (req, res, next) => {
    const query = req.query.q;
    try {
        if (!query) {
            res
                .status(400)
                .json({ error: "Missing 'q' parameter in the query string." });
            return;
        }

        diffusion.text2img(query).then(async image => {
            res.set({ 'Content-Type': 'image/png' });
            res.send(image);
        });
    } catch (error) {
        res.send('error')
    }
});

// Canvas
app.get("/api/welcome2", async (req, res, next) => {
    const nama = req.query.nama;
    if (!nama) return res.json('Masukan Nama Partisipasi');
    const member = req.query.member;
    if (!member) return res.json('Masukan Nomor Member');
    const pp = req.query.pp;
    if (!pp) return res.json("Masukan Url PPnya");
    const ucapan = 'Welcome';

    try {
        const response = await axios.get(`https://api.popcat.xyz/welcomecard?background=https://telegra.ph/file/86d2ffb778472cd62be32.jpg&text1=${nama}&text2=${ucapan}&text3=${member}&avatar=${pp}`, {
            responseType: 'arraybuffer'
        });
        res.set({ 'Content-Type': 'image/png' });
        res.send(response.data);
    } catch (error) {
        next(error);
    }
});

app.get("/api/welcome", async (req, res, next) => {
    const name = req.query.name;
    if (!name) return res.json("Masukan Nama nya");
    const gcname = req.query.gcname;
    if (!gcname) return res.json("Masukan Nama Group nya");
    const member = req.query.member;
    if (!member) return res.json("Masukan Jumlah Member nya");
    const pp = req.query.pp;
    if (!pp) return res.json("Masukan Gambar User nya");
    const bg = req.query.bg;
    if (!bg) return res.json("Masukan Url Background nya");
    try {
        const response = await axios.get(`https://api-canvas.miftah.biz.id/api/maker/welcome1?name=${name}&gpname=${gcname}&member=${member}&pp=${pp}&bg=${bg}`, {
            responseType: 'arraybuffer'
        });
        res.set({ 'Content-Type': 'image/png' });
        res.send(response.data);
    } catch (error) {
        next(error);
    }
});

app.get("/api/goodbye", async (req, res, next) => {
    const name = req.query.name;
    if (!name) return res.json("Masukan Nama nya");
    const gcname = req.query.gcname;
    if (!gcname) return res.json("Masukan Nama Group nya");
    const member = req.query.member;
    if (!member) return res.json("Masukan Jumlah Member nya");
    const pp = req.query.pp;
    if (!pp) return res.json("Masukan Gambar User nya");
    const bg = req.query.bg;
    if (!bg) return res.json("Masukan Url Background nya");
    try {
        const response = await axios.get(`https://api-canvas.miftah.biz.id/api/maker/goodbye1?name=${name}&gpname=${gcname}&member=${member}&pp=${pp}&bg=${bg}`, {
            responseType: 'arraybuffer'
        });
        res.set({ 'Content-Type': 'image/png' });
        res.send(response.data);
    } catch (error) {
        next(error);
    }
});

app.get("/api/goodbye2", async (req, res, next) => {
    const nama = req.query.nama;
    if (!nama) return res.json('Masukan Nama Partisipasi');
    const member = req.query.member;
    if (!member) return res.json('Masukan Nomor Member');
    const pp = req.query.pp;
    if (!pp) return res.json("Masukan Url PPnya");
    const ucapan = 'Goodbye';

    try {
        const response = await axios.get(`https://api.popcat.xyz/welcomecard?background=https://telegra.ph/file/86d2ffb778472cd62be32.jpg&text1=${nama}&text2=${ucapan}&text3=${member}&avatar=${pp}`, {
            responseType: 'arraybuffer'
        });
        res.set({ 'Content-Type': 'image/png' });
        res.send(response.data);
    } catch (error) {
        next(error);
    }
});

app.get("/api/jail", async (req, res, next) => {
    const image = req.query.image;
    if (!image) return res.json("Masukan Url gambar nya");
    try {
        const response = await axios.get(`https://api.popcat.xyz/jail?image=${image}`, {
            responseType: 'arraybuffer'
        });
        res.set({ 'Content-Type': 'image/png' });
        res.send(response.data);
    } catch (error) {
        next(error);
    }
});

app.get("/api/wanted", async (req, res, next) => {
    const image = req.query.image;
    if (!image) return res.json("Masukan Url gambar nya");
    try {
        const response = await axios.get(`https://api.popcat.xyz/wanted?image=${image}`, {
            responseType: 'arraybuffer'
        });
        res.set({ 'Content-Type': 'image/png' });
        res.send(response.data);
    } catch (error) {
        next(error);
    }
});

app.get("/api/ship", async (req, res, next) => {
    const user1 = req.query.user1;
    if (!user1) return res.json("Masukan Url gambar user1");
    const user2 = req.query.user2
    if (!user2) return req.json("Masukan Url gambar user2");
    try {
        const response = await axios.get(`https://api.popcat.xyz/ship?user1=${user1}&user2=${user2}`, {
            responseType: 'arraybuffer'
        });
        res.set({ 'Content-Type': 'image/png' });
        res.send(response.data);
    } catch (error) {
        next(error);
    }
});

app.get("/api/tweetbiden", async (req, res, next) => {
    const text = req.query.text;
    if (!text) return res.json("Masukan Text nya");
    try {
        const response = await axios.get(`https://api.popcat.xyz/biden?text=${text}`, {
            responseType: 'arraybuffer'
        });
        res.set({ 'Content-Type': 'image/png' });
        res.send(response.data);
    } catch (error) {
        next(error);
    }
});

app.get("/api/drip", async (req, res, next) => {
    const image = req.query.image;
    if (!image) return res.json("Masukan Url Image nya");
    try {
        const response = await axios.get(`https://api.popcat.xyz/drip?image=${image}`, {
            responseType: 'arraybuffer'
        });
        res.set({ 'Content-Type': 'image/png' });
        res.send(response.data);
    } catch (error) {
        next(error);
    }
});

app.get("/api/clown", async (req, res, next) => {
    const image = req.query.image;
    if (!image) return res.json("Masukan Url Image nya");
    try {
        const response = await axios.get(`https://api.popcat.xyz/clown?image=${image}`, {
            responseType: 'arraybuffer'
        });
        res.set({ 'Content-Type': 'image/png' });
        res.send(response.data);
    } catch (error) {
        next(error);
    }
});

app.get("/api/uncover", async (req, res, next) => {
    const image = req.query.image;
    if (!image) return res.json("Masukan Url Gambar nya");
    try {
        const response = await axios.get(`https://api.popcat.xyz/uncover?image=${image}`, {
            responseType: 'arraybuffer'
        });
        res.set({ 'Content-Type': 'image/png' });
        res.send(response.data);
    } catch (error) {
        next(error);
    }
});

app.get("/api/ads", async (req, res, next) => {
    const image = req.query.image;
    if (!image) return res.json("Masukan Url Gambar nya");
    try {
        const response = await axios.get(`https://api.popcat.xyz/ad?image=${image}`, {
            responseType: 'arraybuffer'
        });
        res.set({ 'Content-Type': 'image/png' });
        res.send(response.data);
    } catch (error) {
        next(error);
    }
});

app.get("/api/blur", async (req, res, next) => {
    const image = req.query.image;
    if (!image) return res.json("Masukan Url Gambar nya");
    try {
        const response = await axios.get(`https://api.popcat.xyz/blur?image=${image}`, {
            responseType: 'arraybuffer'
        });
        res.set({ 'Content-Type': 'image/png' });
        res.send(response.data);
    } catch (error) {
        next(error);
    }
});

app.get("/api/invert", async (req, res, next) => {
    const image = req.query.image;
    if (!image) return res.json("Masukan Url Image nya");
    try {
        const response = await axios.get(`https://api.popcat.xyz/invert?image=${image}`, {
            responseType: 'arraybuffer'
        });
        res.set({ 'Content-Type': 'image/png' });
        res.send(response.data);
    } catch (error) {
        next(error);
    }
});

app.get("/api/greyscale", async (req, res, next) => {
    const image = req.query.image;
    if (!image) return res.json("Masukan Url Image nya");
    try {
        const response = await axios.get(`https://api.popcat.xyz/greyscale?image=${image}`, {
            responseType: 'arraybuffer'
        });
        res.set({ 'Content-Type': 'image/png' });
        res.send(response.data);
    } catch (error) {
        next(error);
    }
});

app.get("/api/whowin", async (req, res, next) => {
    const image1 = req.query.image1;
    if (!image1) return res.json("Masukan Url Gambar 1");
    const image2 = req.query.image2;
    if (!image2) return res.json("Masukan Url Gambar 2");
    try {
        const response = await axios.get(`https://api.popcat.xyz/whowouldwin?image2=${image2}&image1=${image1}`, {
            responseType: 'arraybuffer'
        });
        res.set({ 'Content-Type': 'image/png' });
        res.send(response.data);
    } catch (error) {
        next(error);
    }
});

app.get("/api/screenshot", async (req, res, next) => {
    const url = req.query.url;
    if (!url) return res.json("Masukan Url");

    try {
        const response = await axios.get(`https://api.popcat.xyz/screenshot?url=${url}`, {
            responseType: 'arraybuffer'
        });
        res.set({ 'Content-Type': 'image/png' });
        res.send(response.data);
    } catch (error) {
        next(error);
    }
});

//
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'not.html'));
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});