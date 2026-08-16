Soundpad Plugin for Ulanzi D200

A plugin that allows you to control Soundpad directly from the Ulanzi D200 / UlanziDeck.

With this plugin, you can assign Soundpad actions to buttons on your Ulanzi D200 and control Soundpad without having to switch to its window.

✨ Features
▶️ Play / pause Soundpad
⏹️ Stop playback
🎛️ Control Soundpad functions using the Ulanzi D200
🔌 Communicates with Soundpad through its Remote Control interface
🖥️ UlanziDeck integration
⚡ Fast command response
📋 Requirements

Before installing the plugin, make sure you have:

Ulanzi D200
UlanziDeck installed
Soundpad installed on Windows
Windows 10 or Windows 11
Soundpad Remote Control enabled
📥 Installation
1. Download the plugin

Download the latest version of the plugin from the Releases section of this repository.

If the plugin is provided directly in the repository, you can also download it using:

Code → Download ZIP

2. Extract the ZIP file

Extract the downloaded .zip file.

You should find the plugin folder:

com.ulanzi.soundpad.ulanziPlugin
3. Copy the plugin folder

Copy the entire plugin folder to:

%APPDATA%\Ulanzi\UlanziDeck\Plugins\

The full path will usually look like:

C:\Users\YOUR_USERNAME\AppData\Roaming\Ulanzi\UlanziDeck\Plugins\

The final folder structure should look similar to:

Plugins
└── com.ulanzi.soundpad.ulanziPlugin
    ├── manifest.json
    ├── plugin
    │   ├── app.js
    │   └── ...
    └── resources
        └── icon.png

Important: Do not place the plugin folder inside another folder with the same name.

❌ Incorrect:

Plugins
└── com.ulanzi.soundpad.ulanziPlugin
    └── com.ulanzi.soundpad.ulanziPlugin

✅ Correct:

Plugins
└── com.ulanzi.soundpad.ulanziPlugin
4. Restart UlanziDeck

Completely close UlanziDeck and open it again.

The Soundpad actions should now appear in the available plugin actions.

🔊 Soundpad Configuration

The plugin communicates with Soundpad through its Remote Control interface.

Make sure Remote Control is enabled in Soundpad.

The plugin uses the following communication channel:

\\.\pipe\sp_remote_control

Soundpad must be running for the plugin to communicate with it.

🎛️ Adding an Action to the D200

After installing the plugin:

Open UlanziDeck.
Select a button on your D200.
Find the Soundpad actions.
Drag the desired action onto the button.
Configure the action if necessary.
Save your UlanziDeck configuration.
Press the button on your D200 to test it.
🛠️ Troubleshooting
The plugin does not appear in UlanziDeck

Make sure the plugin is located at:

%APPDATA%\Ulanzi\UlanziDeck\Plugins\

Also make sure there is no duplicated plugin folder.

The path should look like:

Plugins\com.ulanzi.soundpad.ulanziPlugin\

After checking the folder, completely close and reopen UlanziDeck.

The button appears but does not control Soundpad

Check the following:

Soundpad is running.
Soundpad Remote Control is enabled.
Soundpad is working normally.
The plugin is running correctly in UlanziDeck.

You can also run the plugin manually to check for errors:

cd /d "%APPDATA%\Ulanzi\UlanziDeck\Plugins\com.ulanzi.soundpad.ulanziPlugin\plugin"
node app.js

If the plugin starts correctly, the console should display its initialization and communication messages.

The plugin stopped working after an update

Check whether your version of UlanziDeck is still compatible with the plugin.

You can also try:

Close UlanziDeck.
Remove the old plugin folder.
Install the latest version of the plugin.
Open UlanziDeck again.
📁 Project Structure
com.ulanzi.soundpad.ulanziPlugin/
├── manifest.json
├── plugin/
│   ├── app.js
│   └── ...
└── resources/
    └── icon.png
📌 Notes

This project was developed for use with the Ulanzi D200 / UlanziDeck and Soundpad.

The plugin does not modify Soundpad's files. Communication is performed through Soundpad's Remote Control interface.

This is a community project and is not officially affiliated with Ulanzi or Soundpad.

🙏 Credits

Developed by Dhiego.

Thanks to the UlanziDeck community and the developers of the plugins and examples that were used as references during development.

📄 License

See the LICENSE file in this repository for information about the license and terms of use.

⭐ If you find this plugin useful, consider giving the repository a star!
