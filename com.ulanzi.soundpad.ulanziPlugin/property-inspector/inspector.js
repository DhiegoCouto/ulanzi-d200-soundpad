let form = null;
let currentParam = { soundNumber: "" };
let soundList = [];

const ACTION_UUID = "com.ulanzi.soundpad.ulanziPlugin.playSound";
const statusEl = document.querySelector("#status");

$UD.connect(ACTION_UUID);

$UD.onConnected(() => {
  form = document.querySelector("#property-inspector");
  document.querySelector(".udpi-wrapper").classList.remove("hidden");

  const select = form.querySelector("#soundSelect");
  const refresh = form.querySelector("#refreshSounds");

  select.addEventListener("change", () => {
    const value = select.value;
    currentParam = { soundNumber: value };
    statusEl.textContent = value ? `Som ${value} selecionado.` : "Selecione um som.";
    $UD.sendParamFromPlugin(currentParam);
  });

  refresh.addEventListener("click", () => {
    statusEl.textContent = "Atualizando lista...";
    $UD.sendParamFromPlugin({ refreshSounds: true });
  });

  // Pede a lista atual ao plugin.
  $UD.sendParamFromPlugin({ refreshSounds: true });
});

$UD.onAdd((data) => {
  if (data?.param) loadParam(data.param);
});

$UD.onParamFromApp((data) => {
  if (data?.param) loadParam(data.param);
});

$UD.onParamFromPlugin((data) => {
  const param = data?.param || {};

  if (Array.isArray(param.soundList)) {
    soundList = param.soundList;
    renderSoundList();
  }
});

function loadParam(param) {
  const raw = String(param.soundNumber ?? "").trim();
  currentParam = { soundNumber: raw };

  if (!form) return;

  const select = form.querySelector("#soundSelect");
  if (raw && !soundList.some((sound) => String(sound.index) === raw)) {
    // Se o som foi removido da lista, mantém a configuração sem quebrar o select.
    const option = document.createElement("option");
    option.value = raw;
    option.textContent = `${raw} — Som não encontrado`;
    option.dataset.missing = "true";
    select.appendChild(option);
  }

  select.value = raw;
  statusEl.textContent = raw ? `Som ${raw} selecionado.` : "Selecione um som.";
}

function renderSoundList() {
  if (!form) return;

  const select = form.querySelector("#soundSelect");
  const selected = String(currentParam.soundNumber ?? "");

  select.innerHTML = "";

  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = "— Selecione um som —";
  select.appendChild(empty);

  for (const sound of soundList) {
    const option = document.createElement("option");
    option.value = String(sound.index);
    option.textContent = `${sound.index} — ${sound.title || `Som ${sound.index}`}`;
    select.appendChild(option);
  }

  if (selected && !soundList.some((sound) => String(sound.index) === selected)) {
    const missing = document.createElement("option");
    missing.value = selected;
    missing.textContent = `${selected} — Som não encontrado`;
    select.appendChild(missing);
  }

  select.value = selected;
  statusEl.textContent = selected
    ? `Som ${selected} selecionado.`
    : `Lista atualizada: ${soundList.length} sons.`;
}
