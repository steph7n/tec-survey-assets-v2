/**
 * ApiRouter.gs
 *
 * Handles connection from client-side code to server-side functions
 * via doGet with 'action' parameter.
 *
 * Currently supports:
 * - checkFacultyLoginStatus
 * - facultyLoginStart
 *
 * Future expansions may include:
 * - getSurveyList
 * - getSurveyQuestions
 *
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || "";

  switch (action) {
    case "checkFacultyLoginStatus":
      return jsonResponse(checkFacultyLoginStatus_());

    case "facultyLoginStart":
      return facultyLoginStart_(e); // we’ll define this next

    // we can add more actions later:
    // case "getSurveyList": ...
    // case "getSurveyQuestions": ...
  }

  // default: unknown action
  return ContentService
    .createTextOutput(JSON.stringify({ error: "Unknown action" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonResponse(obj) {
  var output = ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * Wrapper used by the API router.
 * Keeps a stable name for routing while allowing the main implementation
 * to live in checkFacultyLoginStatus().
 */
function checkFacultyLoginStatus_() {
  return checkFacultyLoginStatus();
}

/**
 * Handles the "Login with Google" bounce for faculty/student login.
 * When the user hits this endpoint, Apps Script / Google will first
 * ensure they are signed in (based on the web app's access settings).
 * After login, this function simply redirects back to the provided
 * redirect URL so the static frontend can re-run checkFacultyLoginStatus().
 *
 * Expected query parameter:
 *   redirect: full URL of the static loginFaculty.html page
 */
function facultyLoginStart_(e) {
  var redirect =
    (e && e.parameter && e.parameter.redirect) || "";

  // Basic safety: if redirect is missing, show a simple message.
  if (!redirect) {
    return HtmlService
      .createHtmlOutput(
        "<!DOCTYPE html><html><body>" +
        "<p>Login completed. You may close this tab and return to the survey page.</p>" +
        "</body></html>"
      );
  }

  var html = HtmlService.createHtmlOutput(
    '<!DOCTYPE html><html><head><meta charset="UTF-8">' +
    "<script>" +
    "window.location.href = " + JSON.stringify(redirect) + ";" +
    "</script>" +
    "</head><body>Redirecting back to the survey…</body></html>"
  );

  return html;
}

