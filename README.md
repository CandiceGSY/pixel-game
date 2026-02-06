# Pixel Art Quiz Game (像素風闖關問答)

這是一個使用 **React** + **Vite** 建構的像素風格網頁問答遊戲。
特色包含復古的 8-bit 設計、DiceBear 生成的像素頭像，以及使用 **Google Apps Script (GAS)** 作為無伺服器後端 (Serverless Backend) 來處理題目與成績。

## 🎮 遊戲特色

- **復古像素風 (Pixel Art)**：採用 NES.css 風格與 Press Start 2P 字體。
- **動態頭像**：每一關皆有不同的「關主」像素頭像 (由 DiceBear API 提供)。
- **Google Sheets 整合**：
  - 題目直接從 Google Sheets 讀取。
  - 成績自動回傳並記錄至 Google Sheets。
- **防止作弊**：成績計算與驗證邏輯可在後端執行 (視 GAS 實作而定)。

## 🚀 快速開始 (安裝與執行)

### 1. 安裝依賴
確保您的電腦已安裝 [Node.js](https://nodejs.org/) (建議 v18+)。

```bash
# 複製專案
git clone <your-repo-url>
cd spectral-newton

# 安裝套件
npm install
```

### 2. 環境變數設定
專案需要連結 Google Apps Script 才能正常運作 (否則會進入模擬模式)。
請複製範例檔並建立 `.env`：

```bash
cp .env.example .env
```

編輯 `.env` 檔案，填入以下資訊 (後端網址取得方式請參考下方「後端設定」)：

```ini
# 您的 Google Apps Script 網頁應用程式網址
VITE_GOOGLE_APP_SCRIPT_URL=https://script.google.com/macros/s/xxxxxxxxx/exec

# 通過門檻 (答對幾題過關)
VITE_PASS_THRESHOLD=3

# 每次遊戲題目數量
VITE_QUESTION_COUNT=5
```

### 3. 啟動開發伺服器
```bash
npm run dev
```
開啟瀏覽器訪問 `http://localhost:5173` (或終端機顯示的 Port)。

---

## 🛠️ 後端設定 (Google Apps Script)

本遊戲依賴 Google Sheets 作為資料庫。

### 步驟 1：建立 Google Sheet
1. 建立一個新的 Google Sheet。
2. 新增兩個工作表 (Tabs)：
   - `題目`：欄位包含 `ID`, `Question`, `A`, `B`, `C`, `D`, `Answer`。
   - `回答`：欄位包含 `ID`, `闖關次數`, `總分`, `最高分`, `第一次通關分數`, `花了幾次通關`, `最近遊玩時間`。

### 步驟 2：部署 Apps Script
1. 在 Google Sheet 中，點擊 **擴充功能 (Extensions)** > **Apps Script**。
2. 將本專案中的 `Code.gs` 內容完整複製並貼上到編輯器中。
3. 修改程式碼上方的 `SHEET_ID` 為您的試算表 ID (或保持預設 `getActiveSpreadsheet` 若腳本綁定於該表)。
4. 點擊 **部署 (Deploy)** > **新增部署 (New deployment)**。
5. 選擇類型：**網頁應用程式 (Web app)**。
6. 設定如下：
   - **執行身分 (Execute as)**: `我 (Me)`
   - **誰可以存取 (Who has access)**: `任何人 (Anyone)` **(重要！否則前端無法呼叫)**
7. 點擊部署，並複製產生的 **網頁應用程式網址 (Web App URL)**。
8. 將此網址貼回 `.env` 檔案中的 `VITE_GOOGLE_APP_SCRIPT_URL`。

---

## 📦 部署至 GitHub Pages

本專案已包含 GitHub Actions 自動部署流程。

### 1. 設定 GitHub Secrets
在您的 GitHub Repository 中，前往 **Settings** > **Secrets and variables** > **Actions**，新增以下 Secret：

- `VITE_GOOGLE_APP_SCRIPT_URL`: 填入您的 GAS Web App URL。

(可選) 您也可以設定變數 (Variables)：
- `VITE_PASS_THRESHOLD`
- `VITE_QUESTION_COUNT`

### 2. 修改 Vite Config
開啟 `vite.config.js`，加入 `base` 設定以符合 GitHub Pages 的路徑：

```javascript
export default defineConfig({
  plugins: [react()],
  // 將 <REPO_NAME> 替換為您的讓儲存庫名稱
  base: '/<REPO_NAME>/', 
})
```

### 3. 推送程式碼
將程式碼 Push 到 `main` 分支，GitHub Actions 就會自動開始建置並部署到 `gh-pages` 分支。

---

## 📂 專案結構

- `src/components/`：React 元件 (歡迎頁、遊戲頁、結果頁)。
- `src/services/`：API 串接邏輯。
- `src/styles/`：全域樣式與像素風格設定。
- `Code.gs`：後端 Google Apps Script 程式碼。
