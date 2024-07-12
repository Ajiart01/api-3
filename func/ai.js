const axios = require('axios');

async function alicia(text, username) {
  const payload = {
    app: {
      id: "blaael9y3cu1698750454993",
      time: Date.now(),
      data: {
        sender: { id: username },
        message: [{
          id: Date.now(),
          time: Date.now(),
          type: "text",
          value: text
        }]
      }
    }
  };

  const webhookUrl = 'https://webhook.botika.online/webhook/';
  const headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer s9561k-znra-c37c54x8qxao0vox-nwm9g4tnrm-dp3brfv8"
  };

  try {
    const { data, status } = await axios.post(webhookUrl, payload, { headers });

    if (status === 200) {
      if (data.app && data.app.data && data.app.data.message) {
        const responseMessages = data.app.data.message.map(message => message.value);
        let replyMessage = responseMessages.join('\n');

        if (/(<BR>|<br>)/i.test(replyMessage)) {
          replyMessage = replyMessage.replace(/<BR>|<br>/gi, '\n').replace(/```/g, '\n');
          return replyMessage.split('\n').map(message => `\n\n${message}\n`).join('');
        } else {
          return replyMessage;
        }
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }

  return "Aku tidak mengerti";
}

async function openai(text, user) {
    let hasil = await alicia(text, user);
    for (let i = 0; i < 3 && hasil === "Maaf, aku belum mengerti dengan pertanyaanmu. Bisa kamu menjelaskannya lagi?"; i++) {
        hasil = await alicia(text, user);
    }
    return hasil;
}

module.exports = { openai };
