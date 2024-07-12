const axios = require('axios');
const googleIt = require('google-it');
const { openai } = require('./ai2.js');
const apikey = () => ['global', 'free', 'zex'][Math.floor(Math.random() * 3)];

const googleSearch = async (query) => {
    try {
        const result = await googleIt({ query, limit: 5 });
        return result;
    } catch (error) {
        throw new Error(`Error saat melakukan pencarian Google: ${error.message}`);
    }
};

const gpt5Request = async (prompt) => {
    try {
        const hasil = await openai(prompt, "top1k");
        return hasil;
    } catch (error) {
        throw new Error(`Error pada permintaan GPT-3: ${error.message}`);
    }
};

const determineAI = async (text) => {
    try {
        const gettopik = await gpt5Request(`buatkan satu topik yang terkait dengan topik "${text}" tapi berbeda

note: karena topik anda akan otomatis masuk ke Google Search, jadi langsung saja berikan topiknya tanpa ada teks tambahan. Jangan ada tanda kutip.`);

        const searchResult = text ? await googleSearch(text) : null;
        const searchResult2 = gettopik ? await googleSearch(gettopik) : null;

        const summarizedResults = {
            Hasil1: searchResult,
            Hasil2: searchResult2
        };

        const summarizedText = JSON.stringify(summarizedResults, null, 2);

        const topic1 = summarizedResults.Hasil1 ? summarizedResults.Hasil1[0].title : null;
        const topic2 = summarizedResults.Hasil2 ? summarizedResults.Hasil2[0].title : null;

        const ai2Response = await openai(`Tolong Rangkum teks di bawah sesuai dengan topik [${text}]\n\nteks : ${summarizedText}\n
note-1: berikan teks yang sudah di rangkum secara langsung tanpa tambahan kata apapun.
note-2: Rangkum teks dengan rinci dan jangan memberikan jawaban yang sederhana.
note-3: jangan menyertakan link di jawaban anda.`, Date.now());

        const formattedResponse = `*Mencari..*\n*Topik-1:* ${text ? text : "no topic"}\n*Topik-2:* ${gettopik ? gettopik : "no topic"}\n\n${ai2Response}\n\n${searchResult ? searchResult.slice(0, 3).map(item => `📚 ${item.title} - ${item.link}`).join('\n') : " "}`;

        return formattedResponse;
    } catch (error) {
        throw new Error(`Error pada proses penentuan AI: ${error.message}`);
    }
};

const azz = async (text) => {
    try {
        return await determineAI(text);
    } catch (error) {
        return "Sepertinya Ada yang salah :v";
    }
};

module.exports = { azz };