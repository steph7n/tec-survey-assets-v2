<!-- Copilot / AI agent instructions for the KPI Survey repo -->
# KPI Survey — AI Agent Instructions

Purpose: Help AI coding agents be productive quickly in this Google Apps Script spreadsheet project.

Key files
- `src/Code.gs`: Lightweight Apps Script entrypoints. Implements `onOpen()` which creates a custom menu and wires UI commands (see `testFunction`).
- `src/Code.js`: Main business logic for the Survey initiation flow. Contains `initiateSurvey()` — interactive UI prompts, validation loops, Drive template copy, and writes into a `Config` sheet.
- `src/appsscript.json`: Apps Script metadata (timezone, runtimeVersion). Time zone is `Asia/Jakarta`.
- `package.json`: Minimal; has `@types/google-apps-script` as a devDependency. There are no build or deploy scripts in this repo.

Big picture / architecture
- This is a Google Apps Script project that runs in the context of a Google Spreadsheet (SpreadsheetApp). It uses DriveApp to copy a template spreadsheet (identified by `TEMPLATE_ID`) into the same folder as the active "core" spreadsheet.
- Data flow: user triggers `initiateSurvey()` via UI → agent prompts collect `surveyYear`, start/end dates, `maxOpenEndedLength` → code copies template, opens new spreadsheet, finds sheet named `Config`, locates keys in column A and writes values to column B.
- Important assumptions to preserve: the template spreadsheet must contain a sheet named `Config` and the expected keys as strings in column A. The code expects the active spreadsheet to have exactly one parent folder (`coreFile.getParents().next()`).

Patterns & project-specific conventions
- UI style: prefer `SpreadsheetApp.getUi().prompt()` forms with validation loops and `ui.alert()` for user-facing errors. The code regularly throws an `Error` after showing an alert to abort flows.
- Template usage: `TEMPLATE_ID` is a hardcoded Drive file id in `src/Code.js`. Do not change it unless you confirm with the repo owner.
- Config mutation: keys are matched by exact string in column A; writes go to column B. See `keys = ["surveyYear", "surveyStartDate", "surveyEndDate", "maxOpenEndedLength"]` in `src/Code.js` for the canonical key set.
- Error handling: UI alert + `throw new Error(...)` — this surfaces to Stackdriver (see `exceptionLogging` in `appsscript.json`). Keep this pattern when adding new user flows.

Developer workflows (discoverable from repo)
- There is no included `clasp` or CI configuration. Common deployment options:
  - Edit in the Apps Script online editor (recommended if you don't want to add tooling).
  - Or add `clasp` locally (not present here). Example commands an engineer may run if they choose to use clasp:
    ```bash
    npm install -g @google/clasp
    clasp login
    clasp create --type sheets --title "KPI Survey" # or `clasp clone <scriptId>`
    clasp push
    ```
  Only use `clasp` after confirming the desired Apps Script project id and access method with the repo owner.

What to watch for when making changes
- Preserve the `Config` sheet contract: keys spelled exactly in col A; values must be written to col B. Tests or code that mutate the sheet structure must update `src/Code.js` accordingly.
- Avoid assuming multiple parent folders for the core spreadsheet; the current code calls `.next()` on the parents iterator.
- Keep UI wording and validation intact unless changing user experience is intended — the prompts enforce year and date formats strictly.

Suggestions for future updates (if asked)
- Add a `README.md` describing manual deploy steps and the Apps Script project id.
- Add a `clasp`-based workflow: a `scripts` section in `package.json` for `clasp push` and `clasp pull` and an instruction in this file.
- Add automated checks (small lints) for the presence of `Config` keys when running integration tests.

If something is unclear, ask the repo owner for the Apps Script project id, intended deployment method (Apps Script editor vs `clasp`), and whether the hardcoded `TEMPLATE_ID` is stable.

Examples to reference in edits
- Copy/template behavior: see `src/Code.js`, lines around `templateFile.makeCopy(newFileName, coreFolder)` and the subsequent `getSheetByName('Config')` lookup.
- Menu wiring: see `src/Code.gs` `onOpen()` + `testFunction()` for how menu items call functions.

End of file — please give feedback on any missing details.
