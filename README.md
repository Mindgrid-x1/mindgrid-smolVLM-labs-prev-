# modlabs-smolVLM
llama.cpp server with SmolVLM 500M to get real-time object detection, modded by modlabs


mobile/desktop opensource **Realtime Camera UI** with a local `llama.cpp` server (SmolVLM 500M).  
- Works fully **offline** on your LAN  
- HTTPS-enabled so **mobile browsers can use the camera**  
- One command to serve the web UI and forward API calls  


## Quick Start

### 1. Install `llama.cpp`  

**Mac (with Homebrew):**
```bash
brew install cmake
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
make -j
````

**Windows (with CMake + MSVC):**

```powershell
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
cmake -B build
cmake --build build --config Release
```

👉 The compiled binaries will be inside:

* `./build/bin/` (Windows)
* `./` (Mac/Linux)

---

### 2. Run `llama-server`

Download the SmolVLM model (500M) from Hugging Face and run:

```bash
./llama-server -hf ggml-org/SmolVLM-500M-Instruct-GGUF \
  --host 0.0.0.0 --port 8080 --jinja
```

IMPORTANT Notes:

* Add `-ngl 99` to enable GPU acceleration (NVIDIA / AMD / Intel).
* You can try other models (e.g., `ggml-org/SmolVLM-1B-Instruct-GGUF`) — just swap the `-hf` flag.
* Keep this terminal **running**.

---

### 3. Clone and install ModLabs

```bash
git clone https://github.com/YOURNAME/modlabs-smolVLM
cd modlabs-vlm-cam
npm install
```

---

### 4. Generate HTTPS certs for your LAN IP

1. Find your LAN IP:

   * **Mac/Linux:**

     ```bash
     ipconfig getifaddr en0
     ```
   * **Windows PowerShell:**

     ```powershell
     ipconfig
     ```

     (Look for your Wi-Fi / Ethernet IPv4 address, e.g., `192.31.1.211`)

2. Copy `.env.example → .env` and set:

   ```env
   LAN_IP=192.31.1.211 (MODIFY)   # your LAN IP
   PORT=8443              # default HTTPS port
   API_TARGET=http://127.0.0.1:8080
   ```

3. Generate a self-signed cert for your LAN IP:

   ```bash
   npm run cert
   ```

---

### 5. Run the server

```bash
npm run start
```

You should see:

```
HTTPS up at: https://192.168.1.199:8443
Open on phone: https://192.168.1.199:8443/web/index.html
API proxied via: https://192.168.1.199:8443/v1/chat/completions
```

---

### 6. Open on your phone

* On your phone (same Wi-Fi), go to:

  ```
  https://192.168.1.199:8443/web/index.html
  ```
* Accept the **self-signed certificate warning** once
* Tap **Enable Camera** → **Start**
* Use **Front/Back** to switch cameras
* Model response updates every **3 seconds**

---

## 🛠 Troubleshooting

* **Camera blocked / black screen?**
  Make sure you opened via `https://` and not plain `http://`.
* **Server unreachable?**
  Ensure your phone is on the **same Wi-Fi** as your computer.
* **Cert errors on Windows?**
  Import the `certs/cert.pem` file into your system’s trusted root (optional, otherwise just accept the warning in the browser).
* **Slow responses?**
  Smaller models (500M) are fast but less accurate. Try bigger models for better results.

---

## ✨ Features

* Futuristic UI
* Camera (rear/front) switching
* Fixed **3s interval** processing
* Works fully offline on your LAN
* Simple setup (Mac + Windows)

---

