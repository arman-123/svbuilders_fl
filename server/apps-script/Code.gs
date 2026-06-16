/**
 * SV Developers — Leads Webhook
 * ─────────────────────────────
 * Deploy this as a Google Apps Script Web App:
 *   1. Open https://script.google.com → New project → paste this file.
 *   2. Set SHEET_ID to your Google Sheet's ID (from its URL).
 *   3. Set SECRET to the same value as APPS_SCRIPT_SECRET in server/.env.
 *   4. Click Deploy → New deployment → Web app.
 *        Execute as: Me
 *        Who has access: Anyone
 *   5. Copy the /exec URL → paste into server/.env as APPS_SCRIPT_URL.
 *
 * To add a new project: no changes needed here. The sheet column stores
 * whatever project name the backend sends.
 */

var SHEET_ID   = "YOUR_GOOGLE_SHEET_ID_HERE";
var SHEET_NAME = "Aurora Leads";
var SECRET     = "change-me-to-a-random-string"; // must match APPS_SCRIPT_SECRET in .env
var HEADER     = ["Timestamp", "Name", "Email", "Phone", "Project", "Status", "Notes", "IP"];
var DUPE_WINDOW_MINUTES = 30;

// ── Helpers ────────────────────────────────────────────────────────────────

function getSheet() {
  return SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
}

function ensureHeader(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER);
  }
}

function ok(data) {
  return ContentService
    .createTextOutput(JSON.stringify(Object.assign({ ok: true }, data)))
    .setMimeType(ContentService.MimeType.JSON);
}

function err(message, code) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: false, error: message }))
    .setMimeType(ContentService.MimeType.JSON);
}

function checkSecret(secret) {
  return secret === SECRET;
}

// ── Duplicate detection ────────────────────────────────────────────────────

function isDuplicate(sheet, email, phone, project) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return false;

  var data = sheet.getRange(2, 1, lastRow - 1, 8).getValues();
  var cutoff = new Date(Date.now() - DUPE_WINDOW_MINUTES * 60 * 1000);
  var normEmail = (email || "").toLowerCase().trim();
  var normPhone = (phone || "").replace(/[^\d]/g, "");

  return data.some(function(row) {
    var ts = new Date(row[0]);
    if (!row[0] || ts < cutoff) return false;
    var rowProject = (row[4] || "").toLowerCase();
    if (rowProject !== (project || "").toLowerCase()) return false;
    var sameEmail = (row[2] || "").toLowerCase().trim() === normEmail;
    var samePhone = (row[3] || "").replace(/[^\d]/g, "") === normPhone && normPhone !== "";
    return sameEmail || samePhone;
  });
}

// ── doPost — lead submission ───────────────────────────────────────────────

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);

    if (!checkSecret(payload.secret)) {
      return err("Unauthorized");
    }

    var action = payload.action || "submit";

    if (action === "submit") {
      var name      = (payload.name    || "").trim();
      var email     = (payload.email   || "").trim();
      var phone     = (payload.phone   || "").trim();
      var project   = (payload.project || "Aurora").trim();
      var ip        = (payload.ip      || "").trim();
      var timestamp = payload.timestamp || new Date().toISOString();

      if (!name || !email) {
        return err("name and email are required");
      }

      var sheet = getSheet();
      ensureHeader(sheet);

      if (isDuplicate(sheet, email, phone, project)) {
        return ok({ duplicate: true });
      }

      sheet.appendRow([timestamp, name, email, phone, project, "New", "", ip]);
      return ok({ duplicate: false });
    }

    return err("Unknown action");
  } catch (ex) {
    return err(ex.message || "Internal error");
  }
}

// ── doGet — lead listing (for GET /api/leads admin endpoint) ──────────────

function doGet(e) {
  try {
    var secret = (e.parameter && e.parameter.secret) || "";
    if (!checkSecret(secret)) {
      return err("Unauthorized");
    }

    var sheet   = getSheet();
    var lastRow = sheet.getLastRow();

    if (lastRow <= 1) {
      return ok({ leads: [] });
    }

    var data  = sheet.getRange(2, 1, lastRow - 1, 8).getValues();
    var leads = data
      .filter(function(row) { return row[0]; }) // skip blank rows
      .map(function(row) {
        return {
          timestamp : row[0] ? new Date(row[0]).toISOString() : "",
          name      : row[1] || "",
          email     : row[2] || "",
          phone     : row[3] || "",
          project   : row[4] || "",
          status    : row[5] || "",
          notes     : row[6] || "",
        };
      })
      .reverse();

    return ok({ leads: leads });
  } catch (ex) {
    return err(ex.message || "Internal error");
  }
}
