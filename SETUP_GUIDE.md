# Google Apps Script Setup Guide

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"+ New Spreadsheet"**
3. Name it: **"Bondhu Mahamilan 2026 - Members"**
4. Note the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
   - Copy the `{SHEET_ID}` part

## Step 2: Set Up Google Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. A new tab will open with the Apps Script editor
3. Delete the default `myFunction()` code
4. Copy the entire content from `google-apps-script.js` in this repository
5. Paste it into the Apps Script editor

## Step 3: Configure Script Variables

1. In the Apps Script editor, find line 7:
   ```javascript
   const SHEET_ID = "YOUR_GOOGLE_SHEET_ID";
   ```
2. Replace `YOUR_GOOGLE_SHEET_ID` with the ID you copied in Step 1
3. Keep `SHEET_NAME = "Members"` as is

## Step 4: Initialize the Sheet

1. In the Apps Script editor, click on the dropdown that says **"Select function"**
2. Choose **`initializeSheet`**
3. Click the **▶️ Run** button
4. A popup will ask for authorization - click **"Review permissions"**
5. Select your Google Account
6. Click **"Allow"**

✅ You should see "Sheet initialized successfully!" in the Execution log

## Step 5: Deploy as Web App

1. Click **"Deploy"** button (top right)
2. Click **"New Deployment"** (if this is first time)
3. Select deployment type as **"Web app"**
4. Under "Execute as" - select your Google Account
5. Under "Who has access" - select **"Anyone"**
6. Click **"Deploy"**
7. Copy the **Deployment URL** that appears

## Step 6: Update Your HTML App

1. Go to your event management app repository
2. Open `index.html`
3. Find line 323:
   ```javascript
   const SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL";
   ```
4. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL` with the Deployment URL from Step 5
5. Save and commit the changes

## Step 7: Test the Setup

1. Open your event app in a browser: `https://yourname.github.io/Bondhu-Mahamilan-2-Dhaka-2026/`
2. Go to **Registration** tab
3. Fill in:
   - Name: Your name
   - Phone: 01700000001
   - Payment: Test Bkash
4. Click **"নিবন্ধন সম্পন্ন করুন"** (Register)
5. You should see success message ✅

6. Check your Google Sheet to verify the data was saved

## Troubleshooting

### "❌ ক্লাউড ডাটাবেস সিঙ্ক করতে ব্যর্থ!" Error

- Check if SHEET_ID is correct
- Check if Apps Script is deployed as Web App
- Check if "Anyone" has access to the Web App
- Look at Apps Script Execution log for errors

### Photo not saving

- Photos are stored as Base64 in the sheet
- They take up space in Google Sheets
- For large-scale events, consider uploading to Google Drive instead

### Sheet is not updating

- Make sure the sheet tab name is exactly **"Members"**
- Run `initializeSheet()` again to reset

## Features Once Configured

✅ **Member Registration** - Saves to Google Sheet automatically
✅ **Photo Upload** - Compressed and stored as Base64
✅ **QR Code Scanner** - Verifies members at gate
✅ **Status Tracking** - Check-in, meals, souvenirs
✅ **Cloud Backup** - All data in Google Sheet
✅ **Bulk Export** - Download all passes as ZIP

## Advanced Options

### To view all members in Apps Script Console:
1. In Apps Script, go to **Run → logAllMembers**
2. Check **View → Logs**

### To reset data:
1. Delete all rows except headers in Google Sheet
2. Or run `initializeSheet()` again

---

**Need Help?** Check the Google Apps Script execution logs for error messages!
