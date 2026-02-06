// Code.gs

const SHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; 
const QUESTIONS_SHEET_NAME = '題目';
const ANSWERS_SHEET_NAME = '回答';
const PASS_THRESHOLD = 3; // Should match frontend or be passed in

function doGet(e) {
  const params = e.parameter;
  const action = params.action;
  
  if (action === 'getQuestions') {
    const count = parseInt(params.count) || 5;
    return getQuestions(count);
  }
  
  return responseJSON({status: 'error', message: 'Invalid action'});
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    if (action === 'submitScore') {
      return submitScore(data);
    }
    
    return responseJSON({status: 'error', message: 'Invalid action'});
  } catch (err) {
    return responseJSON({status: 'error', message: err.toString()});
  }
}

function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .setAccessControlAllowOrigin('*')
    .setAccessControlAllowMethods('GET, POST');
}

function getQuestions(count) {
  const ss = SpreadsheetApp.getActiveSpreadsheet(); // Or openById(SHEET_ID)
  const sheet = ss.getSheetByName(QUESTIONS_SHEET_NAME);
  if (!sheet) return responseJSON({status: 'error', message: 'Sheet not found'});
  
  const rows = sheet.getDataRange().getValues();
  // Row 0 is header.
  const data = rows.slice(1);
  
  // Random selection
  const shuffled = data.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  
  const questions = selected.map(row => {
    // Indices based on requirement:
    // 0:ID, 1:Question, 2:A, 3:B, 4:C, 5:D, 6:Answer
    return {
      id: row[0],
      question: row[1],
      A: row[2],
      B: row[3],
      C: row[4],
      D: row[5]
      // EXCLUDE Answer (row[6])
    };
  });
  
  return responseJSON({status: 'success', questions: questions});
}

function submitScore(data) {
  const { userId, answers } = data; // answers: [{questionId, answer}, ...]
  
  const ss = SpreadsheetApp.getActiveSpreadsheet(); 
  const qSheet = ss.getSheetByName(QUESTIONS_SHEET_NAME);
  const aSheet = ss.getSheetByName(ANSWERS_SHEET_NAME);
  
  // Grade it
  const qRows = qSheet.getDataRange().getValues();
  const qMap = {};
  qRows.slice(1).forEach(row => {
    qMap[row[0]] = row[6]; // ID -> Answer
  });
  
  let score = 0;
  answers.forEach(ans => {
    if (qMap[ans.questionId] && qMap[ans.questionId] == ans.answer) {
      score++;
    }
  });
  
  const total = answers.length;
  const passed = score >= PASS_THRESHOLD;
  
  // Record to Answer Sheet
  // Format: ID, 闖關次數, 總分, 最高分, 第一次通關分數, 花了幾次通關, 最近遊玩時間
  
  const aRows = aSheet.getDataRange().getValues();
  let foundRowIndex = -1;
  
  // Find existing user by ID (Row 0 is header)
  for (let i = 1; i < aRows.length; i++) {
    if (aRows[i][0] == userId) {
      foundRowIndex = i + 1; // 1-based index for getRange
      break;
    }
  }
  
  const timestamp = new Date();
  
  if (foundRowIndex > -1) {
    // Update existing
    // Columns (1-based): 1:ID, 2:Count, 3:TotalScore(Accumulated?), 4:MaxScore, 5:FirstPassScore, 6:AttemptsToPass, 7:Time
    // Logic:
    // 闖關次數 + 1
    // 總分 (Update? Description says "總分" - maybe current score? Or accumulated? Usually accumulated or current run. Let's assume current run score but requirement says "若同 ID 已通關過，後續分數不覆蓋...". This implies preserving High Score.)
    // Let's implement:
    // 2: Count++
    // 3: Total Score (Update to current? Or Sum? "總分" ambiguous. Maybe "Total Score of current run")
    // 4: Max Score (Update if higher)
    // 5: First Pass Score (Set if not set and passed)
    // 6: Attempts to pass (Set if not set and passed. If passed, store Count)
    // 7: Time (Update)
    
    const rowRange = aSheet.getRange(foundRowIndex, 1, 1, 7);
    const rowValues = rowRange.getValues()[0];
    
    let playCount = rowValues[1] + 1;
    let oldMax = rowValues[3];
    let firstPass = rowValues[4];
    let attemptsToPass = rowValues[5];
    
    let newMax = Math.max(oldMax, score);
    
    if (passed && !firstPass) {
        firstPass = score;
        attemptsToPass = playCount;
    }
    
    // update
    rowValues[1] = playCount;
    rowValues[2] = score; // Assuming "總分" means score of this run. If it means accumulated, logic changes. "成績計算...並記錄". Usually means record the score. Let's create a new row? No "若是同ID...僅在同列". So update.
    rowValues[3] = newMax;
    rowValues[4] = firstPass;
    rowValues[5] = attemptsToPass;
    rowValues[6] = timestamp;
    
    rowRange.setValues([rowValues]);
    
  } else {
    // New User
    let firstPass = passed ? score : '';
    let attemptsToPass = passed ? 1 : '';
    
    aSheet.appendRow([
      userId, 
      1, 
      score, 
      score, 
      firstPass, 
      attemptsToPass, 
      timestamp
    ]);
  }
  
  return responseJSON({
    status: 'success',
    score: score,
    total: total,
    passed: passed,
    message: 'Score recorded'
  });
}
