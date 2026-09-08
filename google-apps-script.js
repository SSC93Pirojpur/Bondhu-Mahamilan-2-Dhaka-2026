// =====================================================
// Google Apps Script for Bondhu Mahamilan Event Management
// =====================================================
// This script handles:
// 1. Member registration
// 2. Photo storage (Base64 in sheet)
// 3. Status updates (check-in, meal, snack, souvenir)
// 4. Data retrieval for the web app
// =====================================================

// Configuration
const SHEET_ID = "YOUR_GOOGLE_SHEET_ID"; // Replace with your Google Sheet ID
const SHEET_NAME = "Members"; // Name of the sheet tab

// Initialize Sheet (run this once in Apps Script editor)
function initializeSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  
  // Set headers
  const headers = ["Name", "Phone", "PaymentInfo", "PhotoUrl", "CheckedIn", "MealServed", "SnackServed", "SouvenirGiven", "Timestamp"];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#8B5A8D");
  headerRange.setFontColor("#FFFFFF");
  headerRange.setFontWeight("bold");
  
  Logger.log("Sheet initialized successfully!");
}

// Main handler function (deployed as web app)
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === "register") {
      return registerMember(data.member);
    } else if (data.action === "updateStatus") {
      return updateStatus(data.phone, data.property);
    } else {
      return sendResponse(false, "Unknown action");
    }
  } catch (error) {
    Logger.log("Error: " + error);
    return sendResponse(false, "Error: " + error.toString());
  }
}

// Handle GET requests (retrieve all members)
function doGet(e) {
  try {
    const members = getAllMembers();
    return ContentService.createTextOutput(JSON.stringify(members))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log("Error: " + error);
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Register a new member
function registerMember(memberData) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    // Check if phone already exists
    const existingMember = findMemberByPhone(memberData.phone);
    if (existingMember) {
      return sendResponse(false, "Phone number already registered");
    }
    
    // Add new row
    const newRow = [
      memberData.name,
      memberData.phone,
      memberData.paymentInfo,
      memberData.photoUrl, // Base64 encoded photo
      false, // checkedIn
      false, // mealServed
      false, // snackServed
      false, // souvenirGiven
      new Date() // timestamp
    ];
    
    sheet.appendRow(newRow);
    
    Logger.log("Member registered: " + memberData.name);
    return sendResponse(true, "Member registered successfully");
    
  } catch (error) {
    Logger.log("Registration error: " + error);
    return sendResponse(false, "Registration failed: " + error.toString());
  }
}

// Update member status (check-in, meal, snack, souvenir)
function updateStatus(phone, property) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    // Find member by phone
    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] == phone) { // Column B is Phone
        rowIndex = i;
        break;
      }
    }
    
    if (rowIndex === -1) {
      return sendResponse(false, "Member not found");
    }
    
    // Map property names to column indices
    const propertyMap = {
      "checkedIn": 4,      // Column E
      "mealServed": 5,     // Column F
      "snackServed": 6,    // Column G
      "souvenirGiven": 7   // Column H
    };
    
    const colIndex = propertyMap[property];
    if (!colIndex) {
      return sendResponse(false, "Invalid property");
    }
    
    // Update the cell (rowIndex + 1 because sheets are 1-indexed)
    sheet.getRange(rowIndex + 1, colIndex).setValue(true);
    
    Logger.log("Status updated for " + phone + ": " + property);
    return sendResponse(true, "Status updated successfully");
    
  } catch (error) {
    Logger.log("Status update error: " + error);
    return sendResponse(false, "Update failed: " + error.toString());
  }
}

// Get all members
function getAllMembers() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    const members = [];
    
    // Skip header row (i = 1)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Only include rows with phone numbers
      if (row[1]) {
        members.push({
          name: row[0],
          phone: row[1],
          paymentInfo: row[2],
          photoUrl: row[3],
          checkedIn: row[4] === true || row[4] === "TRUE",
          mealServed: row[5] === true || row[5] === "TRUE",
          snackServed: row[6] === true || row[6] === "TRUE",
          souvenirGiven: row[7] === true || row[7] === "TRUE"
        });
      }
    }
    
    return members;
    
  } catch (error) {
    Logger.log("Get members error: " + error);
    return [];
  }
}

// Find member by phone
function findMemberByPhone(phone) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] == phone) {
        return true;
      }
    }
    return false;
    
  } catch (error) {
    Logger.log("Find member error: " + error);
    return false;
  }
}

// Helper function to send JSON response
function sendResponse(success, message) {
  return ContentService.createTextOutput(JSON.stringify({
    success: success,
    message: message
  })).setMimeType(ContentService.MimeType.JSON);
}

// Test function (run in Apps Script editor to test)
function testRegistration() {
  const testMember = {
    name: "টেস্ট সদস্য",
    phone: "01900000000",
    paymentInfo: "BKash 01900000000",
    photoUrl: ""
  };
  
  const result = registerMember(testMember);
  Logger.log(result);
}

// Log all members (run to debug)
function logAllMembers() {
  const members = getAllMembers();
  Logger.log(JSON.stringify(members, null, 2));
}
