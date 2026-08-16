# Soundpad Plugin for Ulanzi D200

Plugin para controlar o **Soundpad** diretamente pelo **Ulanzi D200 / UlanziDeck**.

Com este plugin, você pode adicionar botões no Ulanzi D200 para controlar funções do Soundpad sem precisar alternar para a janela do programa.

## ✨ Recursos

* ▶️ Reproduzir / pausar o Soundpad
* ⏹️ Parar reprodução
* ⏭️ Controlar funções do Soundpad através dos botões do Ulanzi D200
* 🔌 Comunicação com o Soundpad através do Remote Control
* 🖥️ Integração com o UlanziDeck
* ⚡ Resposta rápida aos comandos

## 📋 Requisitos

Antes de instalar, certifique-se de que você possui:

* **Ulanzi D200**
* **UlanziDeck** instalado
* **Soundpad** instalado no Windows
* Windows 10 ou Windows 11
* Remote Control do Soundpad habilitado

## 📥 Instalação

### 1. Baixe o plugin

Baixe a versão mais recente do plugin na seção **Releases** deste repositório.

Caso o repositório contenha o plugin diretamente, você também pode baixar o projeto através de:

**Code → Download ZIP**

### 2. Extraia o arquivo

Extraia o conteúdo do `.zip`.

Você deverá encontrar a pasta do plugin:

```text
com.ulanzi.soundpad.ulanziPlugin
```

### 3. Copie a pasta para o UlanziDeck

Copie a pasta inteira do plugin para:

```text
%APPDATA%\Ulanzi\UlanziDeck\Plugins\
```

O caminho normalmente corresponde a:

```text
C:\Users\SEU_USUARIO\AppData\Roaming\Ulanzi\UlanziDeck\Plugins\
```

No final, a estrutura deve ficar parecida com:

```text
Plugins
└── com.ulanzi.soundpad.ulanziPlugin
    ├── manifest.json
    ├── plugin
    │   ├── app.js
    │   └── ...
    └── resources
        └── icon.png
```

> **Importante:** não coloque uma pasta do plugin dentro de outra pasta do plugin.

Errado:

```text
Plugins
└── com.ulanzi.soundpad.ulanziPlugin
    └── com.ulanzi.soundpad.ulanziPlugin
```

Correto:

```text
Plugins
└── com.ulanzi.soundpad.ulanziPlugin
```

### 4. Reinicie o UlanziDeck

Feche completamente o **UlanziDeck** e abra novamente.

O plugin deverá aparecer na lista de plugins/ações disponíveis.

## 🔊 Configurando o Soundpad

O plugin utiliza a comunicação de controle remoto do Soundpad.

Abra o Soundpad e certifique-se de que o **Remote Control** esteja habilitado.

O plugin utiliza o canal de comunicação:

```text
\\.\pipe\sp_remote_control
```

O Soundpad precisa estar em execução para que os comandos possam ser enviados.

## 🎛️ Adicionando uma ação ao D200

Depois de instalar o plugin:

1. Abra o **UlanziDeck**.
2. Selecione uma tecla do seu D200.
3. Procure pelas ações do **Soundpad**.
4. Arraste a ação desejada para a tecla.
5. Configure a tecla conforme necessário.
6. Salve a configuração.
7. Pressione a tecla no D200 para testar.

## 🛠️ Solução de problemas

### O plugin não aparece no UlanziDeck

Verifique se a pasta está exatamente em:

```text
%APPDATA%\Ulanzi\UlanziDeck\Plugins\
```

E confirme que não existe uma pasta duplicada.

A estrutura deve começar diretamente com:

```text
Plugins\com.ulanzi.soundpad.ulanziPlugin\
```

Depois disso, feche e abra novamente o UlanziDeck.

### O botão aparece, mas não controla o Soundpad

Verifique:

* Se o Soundpad está aberto.
* Se o Remote Control do Soundpad está habilitado.
* Se o Soundpad está funcionando normalmente.
* Se o plugin está sendo executado pelo UlanziDeck.

Também é possível executar o plugin manualmente para verificar mensagens de erro:

```cmd
cd /d "%APPDATA%\Ulanzi\UlanziDeck\Plugins\com.ulanzi.soundpad.ulanziPlugin\plugin"
node app.js
```

Se o plugin iniciar corretamente, o console deverá mostrar as mensagens de inicialização e comunicação com o UlanziDeck.

### O plugin parou de funcionar depois de uma atualização

Verifique se a versão do UlanziDeck continua compatível com o plugin.

Também tente:

1. Fechar o UlanziDeck.
2. Remover a pasta antiga do plugin.
3. Instalar novamente a versão mais recente.
4. Abrir o UlanziDeck novamente.

## 📁 Estrutura do projeto

```text
com.ulanzi.soundpad.ulanziPlugin/
├── manifest.json
├── plugin/
│   ├── app.js
│   └── ...
└── resources/
    └── icon.png
```

## 📌 Observações

Este projeto foi desenvolvido para uso com o **Ulanzi D200 / UlanziDeck** e o **Soundpad**.

O plugin não modifica os arquivos do Soundpad. A comunicação é realizada através do sistema de controle remoto disponibilizado pelo próprio Soundpad.

Este projeto é destinado à comunidade e não possui vínculo oficial com Ulanzi ou Soundpad.

## 🙏 Créditos

Desenvolvido por **Dhiego**.

Agradecimentos aos projetos e desenvolvedores da comunidade UlanziDeck que disponibilizaram plugins e exemplos utilizados como referência para o desenvolvimento.

## 📄 Licença

Consulte o arquivo `LICENSE` deste repositório para obter informações sobre a licença e os termos de uso.

---

⭐ Se este plugin foi útil para você, considere deixar uma estrela no repositório!
