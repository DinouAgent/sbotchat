
const deepseekApiKey = "sk-4b2fdd463f314d0f8ba58cad5416dce4";
const elevenlabsApiKey = "sk_d3d02715a15d68e1048a04274cd3030cd57f631f8020f08c";
const voiceId = "EXAVITQu4vr4xnSDxMaL"; // Gia Huy or Linh

const chatLog = document.getElementById("chat-log");

function appendMessage(content, isUser = false) {
  const div = document.createElement("div");
  div.className = "chat-bubble " + (isUser ? "user" : "bot");
  div.innerText = content;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("user-input");
  const userText = input.value.trim();
  if (!userText) return;

  appendMessage(userText, true);
  input.value = "";

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + deepseekApiKey
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "Bạn là trợ lý AI hỗ trợ tiếng Việt." },
        { role: "user", content: userText }
      ]
    })
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;
  appendMessage(reply, false);
  speak(reply);
}

async function speak(text) {
  const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": elevenlabsApiKey
    },
    body: JSON.stringify({
      text: text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.5, similarity_boost: 0.75 }
    })
  });

  const audioBlob = await ttsResponse.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
}
