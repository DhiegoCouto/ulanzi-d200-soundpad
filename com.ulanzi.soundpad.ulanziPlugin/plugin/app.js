import net from "node:net";
import UlanzideckApi from "../libs/node/ulanzideckApi.js";

const APP_UUID = "com.ulanzi.soundpad.ulanziPlugin";
const PIPE_PATH = "\\\\.\\pipe\\sp_remote_control";

const $UD = new UlanzideckApi();
const paramsByContext = new Map();
const playingByContext = new Map();
let activePlayingContext = null;
let sounds = [];

let pipe = null;
let connecting = false;
let reconnectTimer = null;
let soundlistBuffer = "";
let refreshRequested = false;

function log(...args) {
  console.log("[SOUNDPAD]", ...args);
}

function connectPipe() {
  if (pipe && !pipe.destroyed) return;
  if (connecting) return;

  connecting = true;
  log("Conectando ao Soundpad...");

  const p = net.createConnection({ path: PIPE_PATH });
  pipe = p;

  p.on("connect", () => {
    connecting = false;
    log("Soundpad CONECTADO.");
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    refreshSounds();
  });

  p.on("data", (data) => {
    const response = data.toString("utf8");
    log("Resposta:", response.trim());

    // O Soundpad devolve a lista em XML:
    // <Soundlist rel="true"><Sound index="1" title="..." ... /></Soundlist>
    if (response.includes("<Soundlist") || soundlistBuffer.includes("<Soundlist")) {
      soundlistBuffer += response;
      const end = soundlistBuffer.indexOf("</Soundlist>");
      if (end !== -1) {
        const xml = soundlistBuffer.slice(0, end + "</Soundlist>".length);
        soundlistBuffer = soundlistBuffer.slice(end + "</Soundlist>".length);
        parseSoundlist(xml);
      }
    }

    if (response.trim() === "STOPPED") {
      playingByContext.forEach((_, context) => playingByContext.set(context, false));
      activePlayingContext = null;
    }
  });

  p.on("error", (err) => {
    connecting = false;
    log("Pipe error:", err.message);
  });

  p.on("close", () => {
    connecting = false;
    if (pipe === p) pipe = null;
    log("Soundpad desconectado.");
    scheduleReconnect();
  });
}

function scheduleReconnect() {
  if (reconnectTimer) return;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connectPipe();
  }, 2000);
}

function sendCommand(command) {
  if (!pipe || pipe.destroyed) {
    log("Pipe não conectado. Tentando conectar...");
    connectPipe();
    return false;
  }

  try {
    log("ENVIANDO:", command);
    pipe.write(command, "utf8");
    return true;
  } catch (err) {
    log("Erro ao enviar:", err.message);
    return false;
  }
}

function xmlDecode(value) {
  return String(value ?? "")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function parseSoundlist(xml) {
  try {
    const list = [];
    const regex = /<Sound\b([^>]*)\/?>(?:<\/Sound>)?/gi;
    let match;

    while ((match = regex.exec(xml)) !== null) {
      const attrs = match[1] || "";
      const get = (name) => {
        const r = new RegExp(`${name}\\s*=\\s*(["'])(.*?)\\1`, "i").exec(attrs);
        return r ? xmlDecode(r[2]) : "";
      };

      const index = Number.parseInt(get("index"), 10);
      const title = get("title") || get("artist") || get("url") || `Som ${index}`;

      if (Number.isFinite(index) && index >= 1) {
        list.push({ index, title });
      }
    }

    list.sort((a, b) => a.index - b.index);
    sounds = list;
    log(`Lista de sons carregada: ${sounds.length} sons.`);
    broadcastSoundlist();
  } catch (err) {
    log("Erro ao interpretar lista de sons:", err.message);
  }
}

function broadcastSoundlist(context = null) {
  $UD.sendParamFromPlugin({
    soundList: sounds,
    soundListUpdated: true
  }, context);
}

function refreshSounds(context = null) {
  if (!pipe || pipe.destroyed) {
    refreshRequested = true;
    connectPipe();
    return;
  }

  if (refreshRequested) return;
  refreshRequested = true;
  log("Atualizando lista de sons...");
  sendCommand("GetSoundlist()");
  setTimeout(() => {
    refreshRequested = false;
  }, 500);
}

function normalizeSoundNumber(value) {
  const n = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(n) || n < 1) return null;
  return n;
}

function setPlaying(context, value) {
  if (context) playingByContext.set(context, value);
  if (!value && activePlayingContext === context) activePlayingContext = null;
}

function playSound(context, param) {
  const number = normalizeSoundNumber(param?.soundNumber);
  if (!number) {
    $UD.toast("Selecione um som do Soundpad.");
    return;
  }

  const command = `DoPlaySound(${number})`;

  log(`context=${context} | som=${number} | comando=${command}`);

  if (!sendCommand(command)) {
    $UD.toast("Soundpad não está conectado.");
    return;
  }

  playingByContext.set(context, true);
  activePlayingContext = context;
  $UD.toast(`Soundpad: ${getSoundLabel(number)}`);
}

function getSoundLabel(number) {
  const sound = sounds.find((item) => item.index === number);
  return sound ? `${number} — ${sound.title}` : `som ${number}`;
}

function stopSound() {
  log("Parando som atual.");
  if (!sendCommand("DoStopSound()")) {
    $UD.toast("Soundpad não está conectado.");
    return false;
  }

  if (activePlayingContext) {
    playingByContext.set(activePlayingContext, false);
  }
  activePlayingContext = null;
  return true;
}

function playWithSwitch(context, param) {
  const number = normalizeSoundNumber(param?.soundNumber);
  if (!number) {
    $UD.toast("Selecione um som do Soundpad.");
    return;
  }

  const isPlaying = activePlayingContext !== null;

  if (isPlaying && activePlayingContext === context) {
    // Mesmo botão enquanto toca = parar.
    stopSound();
    return;
  }

  if (isPlaying) {
    // Outro botão enquanto toca = troca direta: STOP + PLAY sem segundo clique.
    log(`Trocando som atual para ${number}.`);
    if (!stopSound()) return;

    // O protocolo do Soundpad não é transacional. Um pequeno intervalo evita
    // que o PLAY chegue antes do STOP ser processado.
    setTimeout(() => playSound(context, param), 80);
    return;
  }

  playSound(context, param);
}

$UD.connect(APP_UUID);

$UD.onConnected(() => {
  log("Ulanzi conectado.");
  connectPipe();
});

$UD.onError((error) => {
  console.error("[SOUNDPAD] Ulanzi error:", error);
});

$UD.onAdd((data) => {
  const context = data?.context;
  if (!context) return;

  if (data?.param) paramsByContext.set(context, data.param);
  if (!playingByContext.has(context)) playingByContext.set(context, false);

  if (sounds.length) {
    broadcastSoundlist(context);
  } else {
    refreshSounds(context);
  }

  log("Botão adicionado:", context, data?.param || {});
});

$UD.onParamFromApp((data) => {
  const context = data?.context;
  if (!context) return;

  const param = data?.param || {};
  paramsByContext.set(context, param);
  log("Configuração recebida:", context, param);
});

$UD.onParamFromPlugin((data) => {
  const context = data?.context;
  const param = data?.param || {};

  // O Property Inspector usa esta mensagem para pedir uma atualização da lista.
  if (param.refreshSounds) {
    refreshSounds(context);
    return;
  }

  // Também aceitamos alterações vindas do inspector.
  if (context && !param.soundList && !param.soundListUpdated) {
    paramsByContext.set(context, param);
  }
});

$UD.onRun((data) => {
  const context = data?.context;
  if (!context) return;

  const param = data?.param || paramsByContext.get(context) || {};
  paramsByContext.set(context, param);
  playWithSwitch(context, param);
});

$UD.onClear((data) => {
  const items = Array.isArray(data?.param) ? data.param : [];

  for (const item of items) {
    if (item?.context) {
      paramsByContext.delete(item.context);
      playingByContext.delete(item.context);
      if (activePlayingContext === item.context) activePlayingContext = null;
    }
  }
});

connectPipe();

// Quando um áudio termina naturalmente, Soundpad responde STOPPED.
setInterval(() => {
  if (!activePlayingContext) return;
  if (!pipe || pipe.destroyed) return;
  try {
    pipe.write("GetPlayStatus()", "utf8");
  } catch {}
}, 300);

setInterval(() => {
  if (!pipe || pipe.destroyed) connectPipe();
}, 5000);
