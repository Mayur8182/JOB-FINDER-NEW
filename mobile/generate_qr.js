const { toQR } = require('./node_modules/toqr');
const fs = require('fs');

const url = 'exp://10.131.232.11:8081';
const data = toQR(url);
const size = 25;
const border = 2;
const totalSize = size + border * 2;
const scale = 12;
const svgWidth = totalSize * scale;

let rects = '';
for (let r = 0; r < size; r++) {
  for (let c = 0; c < size; c++) {
    if (data[r * size + c] === 1) {
      rects += `  <rect x="${(c + border) * scale}" y="${(r + border) * scale}" width="${scale}" height="${scale}" fill="#0F172A" />\n`;
    }
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgWidth}" width="${svgWidth}" height="${svgWidth}">
  <rect width="100%" height="100%" fill="#FFFFFF" rx="16" />
${rects}</svg>`;

fs.writeFileSync('./expo_qr.svg', svg);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Expo Go - JobFinder Mobile App</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%);
      color: #F8FAFC;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: rgba(30, 41, 59, 0.9);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 24px;
      padding: 36px 32px;
      max-width: 460px;
      width: 100%;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #34D399;
      font-size: 13px;
      font-weight: 600;
      padding: 6px 16px;
      border-radius: 9999px;
      margin-bottom: 18px;
    }
    .dot {
      width: 8px;
      height: 8px;
      background: #34D399;
      border-radius: 50%;
      box-shadow: 0 0 10px #34D399;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.85); }
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 6px;
      color: #FFFFFF;
      letter-spacing: -0.5px;
    }
    p.subtitle {
      font-size: 14px;
      color: #94A3B8;
      margin-bottom: 24px;
    }
    .qr-container {
      background: #FFFFFF;
      padding: 16px;
      border-radius: 20px;
      display: inline-block;
      margin-bottom: 22px;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
    }
    .qr-container svg {
      display: block;
      width: 250px;
      height: 250px;
    }
    .url-box {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      padding: 12px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 22px;
    }
    .url-text {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 13px;
      color: #38BDF8;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      user-select: all;
    }
    .btn-copy {
      background: #4F46E5;
      color: #FFFFFF;
      border: none;
      border-radius: 8px;
      padding: 8px 14px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .btn-copy:hover {
      background: #4338CA;
    }
    .steps {
      text-align: left;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 18px 20px;
      font-size: 13px;
      color: #CBD5E1;
      line-height: 1.65;
    }
    .steps ol {
      padding-left: 20px;
    }
    .steps li {
      margin-bottom: 8px;
    }
    .steps li:last-child {
      margin-bottom: 0;
    }
    .steps strong {
      color: #F8FAFC;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">
      <div class="dot"></div>
      Expo Metro Bundler Live
    </div>
    <h1>JobFinder Mobile App</h1>
    <p class="subtitle">Scan using Expo Go on your mobile phone</p>
    
    <div class="qr-container">
      ${svg}
    </div>

    <div class="url-box">
      <span class="url-text" id="expoUrl">${url}</span>
      <button class="btn-copy" onclick="copyUrl()" id="copyBtn">Copy URL</button>
    </div>

    <div class="steps">
      <ol>
        <li>Make sure your phone is connected to <strong>same Wi-Fi / Hotspot (vivo)</strong>.</li>
        <li><strong>Android:</strong> Open <strong>Expo Go</strong> app &rarr; Tap <em>Scan QR code</em> (or <em>Enter URL manually</em>).</li>
        <li><strong>iPhone:</strong> Open iOS <strong>Camera</strong> &rarr; Scan QR code &rarr; Tap the Expo notification.</li>
      </ol>
    </div>
  </div>

  <script>
    function copyUrl() {
      const url = document.getElementById('expoUrl').innerText;
      navigator.clipboard.writeText(url).then(() => {
        const btn = document.getElementById('copyBtn');
        btn.innerText = 'Copied!';
        setTimeout(() => btn.innerText = 'Copy URL', 2000);
      });
    }
  </script>
</body>
</html>`;

fs.writeFileSync('./expo_qr.html', html);
console.log('Generated expo_qr.svg and expo_qr.html successfully!');
