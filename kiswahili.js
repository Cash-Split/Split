/* =====================================================================
   kiswahili.js — CashSplit language layer (English default, Kiswahili)
   - Choice is stored in localStorage ("cashsplit_lang") and restored on load
   - Translates static HTML, placeholders/titles, toasts, modals, tables and
     the AI assistant, including text the app generates later
   - Your stored data is never changed: only what is DISPLAYED is translated
   ===================================================================== */
(function () {
  "use strict";
  const KEY = "cashsplit_lang";
  let lang = "en";
  try { if (localStorage.getItem(KEY) === "sw") lang = "sw"; } catch (e) {}

  const mu = (n) => (+n === 1 ? "muamala 1" : "miamala " + n);
  const fe = (s) => s.replace(/\bfee\b/, "ada").replace("already added", "tayari imeongezwa").replace("no code", "hakuna msimbo");
  const CUR = {
    "Kenyan Shilling": "Shilingi ya Kenya", "US Dollar": "Dola ya Marekani", "British Pound": "Pauni ya Uingereza",
    "Nigerian Naira": "Naira ya Nigeria", "Ugandan Shilling": "Shilingi ya Uganda", "Tanzanian Shilling": "Shilingi ya Tanzania",
    "South African Rand": "Randi ya Afrika Kusini", "Indian Rupee": "Rupia ya India",
  };
  const MONTHS = { January: "Januari", February: "Februari", March: "Machi", April: "Aprili", May: "Mei", June: "Juni", July: "Julai", August: "Agosti", September: "Septemba", October: "Oktoba", November: "Novemba", December: "Desemba" };

  /* ---------- 1. EXACT TEXT (whole text node, leading emoji/symbols ignored) ---------- */
  const D = {
    /* chrome */
    "CashSplit — Money Tracker": "CashSplit — Kifuatilia Pesa",
    "You're offline — everything still works, data is saved on this device": "Hujaunganishwa mtandaoni — kila kitu bado kinafanya kazi, data imehifadhiwa kwenye kifaa hiki",
    "Add CashSplit to your Home Screen": "Weka CashSplit kwenye Skrini yako ya Mwanzo",
    "Install": "Sakinisha", "Forgot PIN": "Nimesahau PIN", "This clears ALL app data. Continue?": "Hii itafuta data ZOTE za programu. Endelea?",
    "Hours": "Saa", "Language": "Lugha", "Productive hours": "Saa za uzalishaji", "Productive hours chart": "Chati ya saa za uzalishaji",
    "Personal": "Binafsi", "New profile": "Wasifu mpya", "Delete current": "Futa wa sasa", "New profile name": "Jina la wasifu mpya",
    /* home */
    "Balance": "Salio", "Today in": "Mapato ya leo", "Today out": "Matumizi ya leo", "Today net": "Jumla ya leo",
    "Tap in / out / net for details & trends": "Gusa mapato / matumizi / jumla kwa maelezo na mwenendo",
    "Set or reset balance": "Weka au weka upya salio", "Expense": "Matumizi", "Expenses": "Matumizi", "Income": "Mapato",
    "Smart Add — M-Pesa messages & screenshots": "Ongeza Kiotomatiki — jumbe za M-Pesa na picha za skrini",
    "Quick log": "Rekodi ya haraka", "Recent activity": "Shughuli za hivi karibuni", "List": "Orodha", "Table": "Jedwali",
    "Home": "Nyumbani", "Wall": "Ukuta", "Settings": "Mipangilio",
    /* hub + sub pages */
    "Stats": "Takwimu", "Months": "Miezi", "Goals": "Malengo", "Shortcuts": "Njia za mkato", "Recurring": "Zinazojirudia", "Smart Add": "Ongeza Kiotomatiki",
    "Ask anything about your money…": "Uliza chochote kuhusu pesa zako…", "Send": "Tuma", "Back": "Rudi",
    "This month by name": "Mwezi huu kwa jina", "Last 6 months": "Miezi 6 iliyopita", "Avg daily spend": "Wastani wa matumizi kwa siku",
    "Highest spend day": "Siku ya matumizi makubwa", "This month net": "Jumla ya mwezi huu", "Spend by weekday": "Matumizi kwa siku ya wiki",
    "No data yet this month": "Bado hakuna data mwezi huu",
    "Monthly records": "Rekodi za kila mwezi", "Search name or note…": "Tafuta jina au maelezo…", "Export this month": "Hamisha mwezi huu",
    "Savings goals": "Malengo ya akiba", "Goal": "Lengo", "New": "Mpya", "Quick shortcuts": "Njia za mkato za haraka",
    "Tap to log instantly · ✕ to delete (max 8)": "Gusa kurekodi papo hapo · ✕ kufuta (juu 8)",
    "Recurring transactions": "Miamala inayojirudia", "Community wall": "Ukuta wa jamii", "Post": "Chapisha",
    "Sun": "Jpili", "Mon": "Jtatu", "Tue": "Jne", "Wed": "Jtano", "Thu": "Alh", "Fri": "Ijm", "Sat": "Jmosi",
    "Sundays": "Jumapili", "Mondays": "Jumatatu", "Tuesdays": "Jumanne", "Wednesdays": "Jumatano", "Thursdays": "Alhamisi", "Fridays": "Ijumaa", "Saturdays": "Jumamosi",
    /* settings */
    "Appearance": "Mwonekano", "Light mode": "Hali ya mwanga", "Compact view": "Mwonekano mfupi", "Text size": "Ukubwa wa maandishi",
    "Small": "Ndogo", "Default": "Kawaida", "Large": "Kubwa", "X-Large": "Kubwa zaidi",
    "Keeps your records, starts from the amount you choose": "Inahifadhi rekodi zako, inaanza kutoka kiasi unachochagua", "Set": "Weka",
    "Currency": "Sarafu", "Active currency": "Sarafu inayotumika", "Add currency": "Ongeza sarafu",
    "Security & alerts": "Usalama na arifa", "PIN lock": "Kufunga kwa PIN", "Lock the app with a 4-digit PIN": "Funga programu kwa PIN ya tarakimu 4",
    "Low balance alert": "Arifa ya salio la chini", "Low-balance alert": "Arifa ya salio la chini", "0 = off": "0 = zima",
    "Data": "Data", "Export CSV": "Hamisha CSV", "Import CSV": "Leta CSV", "Backup": "Hifadhi nakala", "Restore": "Rejesha",
    "Danger zone": "Eneo la hatari", "Erase all data": "Futa data yote",
    /* add sheet */
    "Manual": "Kwa mkono", "M-Pesa SMS": "SMS ya M-Pesa", "Screenshots": "Picha za skrini", "What's it for?": "Ni ya nini?",
    "Save": "Hifadhi", "Save income": "Hifadhi mapato", "Save expense": "Hifadhi matumizi",
    "Paste one or many M-Pesa messages. The exact date and time in each message is used. Decode, then paste more — they all add to the list below.": "Bandika ujumbe mmoja au mingi ya M-Pesa. Tarehe na saa kamili kwenye kila ujumbe hutumika. Soma, kisha bandika zaidi — zote huongezwa kwenye orodha hapa chini.",
    "Clipboard": "Ubao wa kunakili", "Decode & add to list": "Soma na uongeze kwenye orodha",
    "Choose screenshots (pick several, add more anytime)": "Chagua picha za skrini (chagua kadhaa, ongeza zaidi wakati wowote)",
    "No screenshots chosen yet.": "Hakuna picha za skrini zilizochaguliwa bado.", "Read all screenshots": "Soma picha zote za skrini",
    "Add": "Ongeza", "Clear list": "Futa orodha", "Close": "Funga", "Loading reader…": "Inapakia kisomaji…",
    "No M-Pesa transactions found in those screenshots.": "Hakuna miamala ya M-Pesa iliyopatikana kwenye picha hizo.",
    "Could not read screenshots. Connect once so the reader can download — after that it works offline.": "Imeshindwa kusoma picha za skrini. Unganisha mara moja ili kisomaji kipakuliwe — baada ya hapo kinafanya kazi bila mtandao.",
    "Nothing in the list yet.": "Hakuna kitu kwenye orodha bado.", "no time in message — check above": "hakuna muda kwenye ujumbe — angalia hapo juu",
    "Also record M-Pesa charges": "Rekodi pia makato ya M-Pesa",
    "Paste a message first": "Bandika ujumbe kwanza", "No M-Pesa transaction found": "Hakuna muamala wa M-Pesa uliopatikana", "Already in list": "Tayari kwenye orodha",
    "Long-press the box and choose Paste": "Bonyeza kwa muda kisanduku kisha chagua Bandika", "Choose screenshots first": "Chagua picha za skrini kwanza", "Enter an amount": "Weka kiasi",
    /* day + hours popups */
    "Daily activity": "Shughuli za kila siku", "Today": "Leo", "Yesterday": "Jana", "7 days": "Siku 7", "30 days": "Siku 30", "All time": "Muda wote",
    "All": "Zote", "In only": "Mapato pekee", "Out only": "Matumizi pekee", "All days": "Siku zote", "In": "Mapato", "Out": "Matumizi", "Net": "Jumla",
    "Attained": "Imepatikana", "(before balance)": "(kabla ya salio)", "Opening": "Mwanzo", "Closing": "Mwisho",
    "Avg net / day": "Wastani wa jumla / siku", "Best day:": "Siku bora:",
    "Date": "Tarehe", "Time": "Muda", "Name": "Jina", "Type": "Aina", "Amount": "Kiasi",
    "balance": "salio", "income": "mapato", "expense": "matumizi", "No transactions to show": "Hakuna miamala ya kuonyesha",
    "Hours of the day": "Saa za siku", "Earnings": "Mapato", "Spending": "Matumizi",
    "Most productive hour:": "Saa yenye tija zaidi:", "Biggest spending hour:": "Saa ya matumizi makubwa zaidi:",
    "earned": "yaliyopatikana", "spent": "yaliyotumika", "All 24 hours · swipe →": "Saa zote 24 · telezesha →",
    "Tap a slice, bar or row to see the figures": "Gusa kipande, nguzo au safu kuona takwimu", "Other hours": "Saa nyingine",
    /* modals / confirmations */
    "Cancel": "Ghairi", "OK": "Sawa", "Yes": "Ndiyo", "Got it": "Nimeelewa",
    "Set balance (0 starts fresh)": "Weka salio (0 huanza upya)", "Enter a number": "Weka namba", "Delete record": "Futa rekodi", "Deleted": "Imefutwa",
    "Remove this balance marker? Balance stays as it is.": "Ondoa alama hii ya salio? Salio linabaki kama lilivyo.",
    "New goal": "Lengo jipya", "Target": "Lengo (kiasi)", "Deadline (optional)": "Tarehe ya mwisho (hiari)", "Emergency fund": "Hazina ya dharura",
    "New shortcut": "Njia mpya ya mkato", "Label": "Lebo", "Lunch": "Chakula cha mchana",
    "New recurring": "Muamala mpya unaojirudia", "Frequency": "Marudio", "Daily": "Kila siku", "Weekly": "Kila wiki", "Monthly": "Kila mwezi", "Rent": "Kodi",
    "Symbol": "Alama", "Code": "Msimbo", "Add custom": "Ongeza maalum",
    "Set PIN": "Weka PIN", "Enter a new 4-digit PIN": "Weka PIN mpya ya tarakimu 4", "Confirm your PIN": "Thibitisha PIN yako",
    "PINs did not match. Try again.": "PIN hazilingani. Jaribu tena.", "Locked — try again shortly": "Imefungwa — jaribu tena baadaye kidogo", "Locked for 30 seconds": "Imefungwa kwa sekunde 30",
    "New post": "Chapisho jipya", "Message": "Ujumbe", "What's on your mind?": "Unafikiria nini?", "Image (optional)": "Picha (hiari)",
    "Loading…": "Inapakia…", "No posts yet. Be the first!": "Hakuna machapisho bado. Kuwa wa kwanza!", "seen": "imeonekana", "new": "mpya", "Anonymous": "Asiyejulikana", "Reply…": "Jibu…",
    "Last month": "Mwezi uliopita", "Total in": "Jumla ya mapato", "Total out": "Jumla ya matumizi", "Top spend:": "Matumizi makubwa:", "Net saved": "Akiba halisi",
    "No records for this month.": "Hakuna rekodi za mwezi huu.", "No transactions yet. Tap + to add your first one.": "Hakuna miamala bado. Gusa + kuongeza wa kwanza.",
    "View all records ›": "Tazama rekodi zote ›", "No goals yet.": "Hakuna malengo bado.", "No shortcuts yet.": "Hakuna njia za mkato bado.",
    "No recurring transactions.": "Hakuna miamala inayojirudia.", "Remove": "Ondoa", "Goal reached!": "Lengo limefikiwa!", "Goal created 🎯": "Lengo limeundwa 🎯",
    "Shortcut saved": "Njia ya mkato imehifadhiwa", "Max 8 shortcuts": "Njia za mkato 8 tu", "Fill all fields": "Jaza sehemu zote",
    "Name and target required": "Jina na lengo vinahitajika", "Name and amount required": "Jina na kiasi vinahitajika",
    "Delete shortcut": "Futa njia ya mkato", "Delete goal": "Futa lengo", "Delete recurring": "Futa muamala unaojirudia", "Delete currency": "Futa sarafu",
    "Remove this currency?": "Ondoa sarafu hii?", "Delete profile": "Futa wasifu", "All data in this profile will be lost.": "Data zote za wasifu huu zitapotea.",
    "Cannot delete the only profile": "Huwezi kufuta wasifu pekee", "Cannot delete the active currency": "Huwezi kufuta sarafu inayotumika",
    "Already added": "Tayari imeongezwa", "Symbol and name required": "Alama na jina vinahitajika", "Currency updated": "Sarafu imebadilishwa",
    "PIN set": "PIN imewekwa", "PIN disabled": "PIN imezimwa", "Low-balance alert set": "Arifa ya salio la chini imewekwa",
    "Restore backup": "Rejesha nakala", "This overwrites all current data.": "Hii itaandika juu ya data zote za sasa.", "Invalid backup file": "Faili ya nakala si sahihi",
    "Backup downloaded": "Nakala imepakuliwa", "CSV exported": "CSV imehamishwa", "Month exported": "Mwezi umehamishwa",
    "Delete EVERYTHING? This cannot be undone.": "Futa KILA KITU? Hili haliwezi kutenduliwa.",
    "Write something first": "Andika kitu kwanza", "Resizing image…": "Inapunguza picha…", "Posting…": "Inachapisha…", "Posted!": "Imechapishwa!",
    "Failed to post": "Imeshindwa kuchapisha", "Could not reach server": "Haiwezi kufikia seva", "Reply failed": "Jibu limeshindikana",
    /* names the app creates itself (stored in English, shown in Kiswahili) */
    "Balance set": "Salio limewekwa", "Cash Withdrawal": "Utoaji wa Pesa Taslimu", "M-Pesa Charges": "Makato ya M-Pesa", "M-Pesa Income": "Mapato ya M-Pesa", "Untitled": "Bila jina",
    "Salary": "Mshahara", "Gift": "Zawadi", "Freelance": "Kazi za kujitegemea", "Business": "Biashara", "Refund": "Marejesho",
    "Food": "Chakula", "Transport": "Usafiri", "Bills": "Bili", "Shopping": "Manunuzi", "Health": "Afya",
    /* currency names (placeholder, list) handled in rules */
    /* assistant: chips, headings, buttons */
    "Report": "Ripoti", "Where it went": "Pesa ilienda wapi", "Forecast": "Utabiri", "Savings": "Akiba", "People": "Watu", "Compare": "Linganisha", "Fees": "Ada",
    "Savings plan": "Mpango wa akiba", "Open months": "Fungua miezi", "Where else": "Wapi pengine", "Full breakdown": "Mchanganuo kamili", "How to cut": "Jinsi ya kupunguza",
    "Find savings": "Tafuta akiba", "Browse months": "Vinjari miezi", "Open hours chart": "Fungua chati ya saa", "Log it": "Rekodi", "Set alert": "Weka arifa", "No": "Hapana",
    "Goal coach": "Kocha wa malengo", "Count": "Idadi", "Biggest": "Kubwa zaidi", "Recent": "Hivi karibuni", "Most recent": "Hivi karibuni zaidi",
    "By day of the week": "Kwa siku ya wiki", "Your hours": "Saa zako", "Safe daily spend": "Matumizi salama kwa siku", "What changed": "Nini kimebadilika", "Why?": "Kwa nini?",
    "Month-end forecast": "Utabiri wa mwisho wa mwezi", "People & payees": "Watu na wapokeaji", "Fees check": "Ukaguzi wa ada", "Last 4 months": "Miezi 4 iliyopita",
    "Can you afford it?": "Unaweza kumudu?", "Log this?": "Rekodi hii?",
    "I can help with…": "Naweza kusaidia na…", "Here's what I understand": "Ninachoelewa", "I'm your CashSplit assistant": "Mimi ni msaidizi wako wa CashSplit",
    "Hi, I am your CashSplit assistant": "Hujambo, mimi ni msaidizi wako wa CashSplit",
    "Hmm, nothing matches": "Hmm, hakuna kinacholingana", "I didn't quite catch that": "Sijaelewa vizuri", "Not sure I got that one": "Sina uhakika nimeelewa hilo",
    "That one's outside my money brain": "Hilo liko nje ya ubongo wangu wa pesa",
    "Hey!": "Hujambo!", "Hi there!": "Habari!", "Sure —": "Sawa —",
    "in": "mapato", "out": "matumizi", "net": "jumla", "on": "kwa", "from": "kutoka", "of": "ya", "or": "au", "At": "Kwa", "you": "wewe?", "can": "kununua", "You": "Unaweza",
    "Today: in": "Leo: mapato", "Savings plan ": "Mpango wa akiba",
    "Monthly records ": "Rekodi za kila mwezi",
  };

  /* ---------- 2. PATTERNS (whole text node, with numbers / names inside) ---------- */
  const R = [
    [/^Add (\d+) records?$/, "Ongeza rekodi $1"],
    [/^Added (\d+) record\(s\)$/, "Zimeongezwa rekodi $1"],
    [/^(\d+) added to list — paste more or press Add$/, "$1 zimeongezwa kwenye orodha — bandika zaidi au bonyeza Ongeza"],
    [/^(\d+) found ·$/, "$1 zimepatikana ·"],
    [/^screenshots? ready:$/, "picha za skrini ziko tayari:"],
    [/^Reading screenshot (\d+) of (\d+)…$/, "Inasoma picha ya skrini $1 kati ya $2…"],
    [/^Done — (\d+) transaction\(s\) added to the list below\. Review times and press Add\.$/, "Imekamilika — miamala $1 imeongezwa kwenye orodha hapa chini. Kagua muda kisha bonyeza Ongeza."],
    [/^Net · (\d+) txns?$/, "Jumla · miamala $1"],
    [/^(\d+) (?:transactions?|txns?)$/, (m, n) => mu(n)],
    [/^(.+) · (\d+) txns?$/, (m, a, n) => a + " · " + mu(n)],
    [/^time from message(.*)$/, (m, r) => "muda kutoka kwenye ujumbe" + fe(r)],
    [/^· (.*)$/, (m, r) => "· " + fe(r)],
    [/^Last: Never$/, "Mara ya mwisho: Kamwe"],
    [/^Last: (.+)$/, "Mara ya mwisho: $1"],
    [/^(.+) · (daily|weekly|monthly)$/, (m, a, f) => a + " · " + { daily: "kila siku", weekly: "kila wiki", monthly: "kila mwezi" }[f]],
    [/^Save (.+)\/day to reach by (.+)$/, "Weka $1/siku ili ufikie lengo kufikia $2"],
    [/^(.+) · Due (.+)$/, "$1 · Mwisho $2"],
    [/^Low balance: (.+)$/, "Salio la chini: $1"],
    [/^Balance set to (.+)$/, "Salio limewekwa kuwa $1"],
    [/^Balance now (.+)$/, "Salio sasa $1"],
    [/^Switched to (.+)$/, "Umebadilisha hadi $1"],
    [/^Wrong PIN \((\d)\/3\)$/, "PIN si sahihi ($1/3)"],
    [/^(\d+) recurring transaction\(s\) applied$/, "Miamala $1 inayojirudia imetumika"],
    [/^Imported (\d+), skipped (\d+)\. Balance unchanged\.$/, "Imeletwa $1, imerukwa $2. Salio halijabadilika."],
    [/^Add to "(.+)"$/, 'Ongeza kwenye "$1"'],
    [/^Delete "(.+)"\?$/, 'Futa "$1"?'],
    [/^Remove this (income|expense) of (.+)\? Balance will be adjusted back\.$/, (m, t, a) => "Ondoa " + (t === "income" ? "mapato" : "matumizi") + " ya " + a + "? Salio litarekebishwa."],
    [/^Other hours \((\d+)\)$/, "Saa nyingine ($1)"],
    [/^No (earnings|spending) recorded for this period\.$/, (m, t) => "Hakuna " + (t === "earnings" ? "mapato" : "matumizi") + " yaliyorekodiwa kwa kipindi hiki."],
    [/^Fee · (.*)$/, "Ada · $1"],
    [/^(M-Pesa · .*)$/, (m, s) => s.replace(" · From ", " · Kutoka ").replace(" · To ", " · Kwenda ")],
    [/^(\S+ .+) added$/, "$1 imeongezwa"],
    [/^Alert me at (.+)$/, "Nikumbushe kwa $1"],
    [/^Create goal (.+)$/, "Tengeneza lengo $1"],
    [/^Create "Emergency Fund" (.+)$/, 'Tengeneza "Hazina ya Dharura" $1'],
    [/^Opening the add sheet for (income|expense) ✍️$/, (m, t) => "Inafungua fomu ya " + (t === "income" ? "mapato" : "matumizi") + " ✍️"],
    [/^(\d+) days?$/, "siku $1"],
    [/^(\d+) day\(s\)$/, "siku $1"],
    [/^(up|down) (.*\d.*)$/, (m, d, a) => (d === "up" ? "juu " : "chini ") + a],
    [new RegExp("\\b(" + Object.keys(CUR).join("|") + ")\\b", "g"), (m) => CUR[m]],
    [new RegExp("\\b(" + Object.keys(MONTHS).join("|") + ")\\b(?= \\d{4})", "g"), (m) => MONTHS[m]],
  ];

  /* ---------- 3. ASSISTANT PHRASES (substring, used only inside chat replies) ---------- */
  const P = [
    [/the last (\d+) days/g, "siku $1 zilizopita"], [/the last (\d+) months/g, "miezi $1 iliyopita"],
    [/\((\d+) days left\)/g, "(siku $1 zimebaki)"], [/(\d+) days incl\. today/g, "siku $1 pamoja na leo"],
    [/\/day\b/g, "/siku"], [/\/month\b/g, "/mwezi"], [/\bnet\b/g, "jumla"], [/spend (?=[▲▼])/g, "matumizi "],
    ["Nothing logged this month yet. Use + or Smart Add and I will build your report.", "Hakuna kilichorekodiwa mwezi huu bado. Tumia + au Ongeza Kiotomatiki nami nitaandaa ripoti yako."],
    ["No income logged yet.", "Hakuna mapato yaliyorekodiwa bado."], ["Strong — you are saving well.", "Vizuri sana — unaweka akiba vizuri."],
    ["In the green but thin.", "Uko upande wa faida lakini ni kidogo."], ["You are spending more than you earn.", "Unatumia zaidi ya unachopata."],
    ["% saved)", "% imehifadhiwa)"], ["% kept)", "% imebaki)"],
    ["Average income", "Wastani wa mapato"], ["Average spend", "Wastani wa matumizi"], ["Average", "Wastani"],
    ["about", "takriban"], ["by month end.", "kufikia mwisho wa mwezi."], ["Daily spend is", "Matumizi ya kila siku ni"],
    ["above last month.", "juu kuliko mwezi uliopita."], ["below last month.", "chini kuliko mwezi uliopita."],
    ["No expenses this month yet.", "Hakuna matumizi mwezi huu bado."], ["No expenses", "Hakuna matumizi"],
    ["No transactions in that period.", "Hakuna miamala katika kipindi hicho."], ["No matching transactions yet.", "Hakuna miamala inayolingana bado."],
    ["No matching transactions", "Hakuna miamala inayolingana"], ["No spending", "Hakuna matumizi"], ["No income", "Hakuna mapato"], ["No data", "Hakuna data"],
    ["Where your money went —", "Pesa yako ilienda wapi —"], ["Biggest single spend:", "Matumizi makubwa zaidi ya mara moja:"],
    ["Biggest income", "Mapato makubwa zaidi"], ["Biggest spends", "Matumizi makubwa zaidi"],
    ["You spend most on", "Unatumia zaidi siku ya"], ["You earn most on", "Unapata zaidi siku ya"],
    ["Nothing spent", "Hakuna kilichotumika"], ["Nothing received", "Hakuna kilichopokelewa"], ["Across all time it's", "Kwa muda wote ni"],
    ["You spent", "Umetumia"], ["You received", "Umepokea"], ["Net —", "Jumla —"],
    ["transactions", "miamala"], ["transaction", "muamala"], ["totalling", "jumla"], ["per day and", "kwa siku na"], ["per transaction", "kwa muamala"],
    ["each · last on", "kila moja · mara ya mwisho"], ["each", "kila moja"],
    ["This month", "Mwezi huu"], ["this month in", "mwezi huu mapato"], ["this month", "mwezi huu"], ["last month", "mwezi uliopita"],
    ["this week", "wiki hii"], ["last week", "wiki iliyopita"], ["this year", "mwaka huu"], ["last year", "mwaka uliopita"],
    ["all time", "muda wote"], ["yesterday", "jana"], ["today", "leo"], ["the month before", "mwezi uliotangulia"], ["the period before", "kipindi kilichotangulia"], ["vs", "dhidi ya"],
    ["You have", "Una"], ["You are in the negative.", "Uko kwenye hasi."], ["At your usual", "Kwa kiwango chako cha kawaida"], ["that lasts about", "hicho kinadumu takriban"],
    ["Not enough data yet.", "Hakuna data ya kutosha bado."], ["Most productive:", "Wenye tija zaidi:"], ["Heaviest spending:", "Matumizi makubwa zaidi:"],
    ["Log a few transactions and I'll find your best hours.", "Rekodi miamala michache nami nitapata saa zako bora."],
    ["Sure — what is the price? (e.g.", "Sawa — bei ni kiasi gani? (mfano"], ["Buying for", "Kununua kwa"],
    ["Not right now — you'd be short by", "Si sasa — ungepungukiwa na"], ["Yes, comfortably. You'd still have", "Ndiyo, kwa urahisi. Ungebaki na"],
    ["but it leaves", "lakini inakuachia"], ["which may not cover", "ambacho huenda kisitoshe"], ["of normal spending for the", "ya matumizi ya kawaida kwa"],
    ["days left.", "siku zilizobaki."], ["days of normal spending", "siku za matumizi ya kawaida"],
    ["To make your balance last to month end, keep to about", "Ili salio lako lidumu hadi mwisho wa mwezi, tumia takriban"],
    ["Spent today:", "Umetumia leo:"], ["left for today.", "zimebaki kwa leo."],
    ["I need a full previous month of data to explain changes. Keep logging and ask me again next month!", "Nahitaji data ya mwezi mzima uliopita ili kueleza mabadiliko. Endelea kurekodi na uniulize tena mwezi ujao!"],
    ["Your spending is", "Matumizi yako ni"], ["vs last month so far.", "dhidi ya mwezi uliopita hadi sasa."],
    ["Biggest increases:", "Ongezeko kubwa zaidi:"], ["Biggest drop:", "Upungufu mkubwa zaidi:"], ["less).", "pungufu)."],
    ["I need some expenses this month before I can predict.", "Nahitaji matumizi fulani mwezi huu kabla sijaweza kutabiri."],
    ["you will spend about", "utatumia takriban"], ["Projected balance on the last day:", "Salio linalotarajiwa siku ya mwisho:"],
    ["Runway:", "Muda wa salio:"], ["— until about", "— hadi takriban"], ["with no new income.", "bila mapato mapya."],
    ["Keep spending under", "Tumia chini ya"], ["to stay positive.", "ili ubaki kwenye faida."],
    ["Log some expenses first and I will find where you can cut.", "Rekodi matumizi kwanza nami nitapata unapoweza kupunguza."],
    ["Trimming 15% from your top 3 categories frees up", "Kupunguza 15% kutoka kwenye makundi yako 3 ya juu kunakuachia"],
    ["save", "okoa"], ["Small leaks:", "Matumizi madogo yanayovuja:"], ["Rule of thumb: keep", "Kanuni ya jumla: weka"],
    ["(20% of income) before spending on wants.", "(20% ya mapato) kabla ya kutumia kwa mahitaji ya ziada."],
    ["No named payees yet. Paste M-Pesa SMS with Smart Add and I will track who you pay and who pays you.", "Hakuna wapokeaji wenye majina bado. Bandika SMS za M-Pesa kwenye Ongeza Kiotomatiki nami nitafuatilia unayemlipa na anayekulipa."],
    ["You pay most:", "Unalipa zaidi:"], ["Pays you most:", "Anayekulipa zaidi:"],
    ["No M-Pesa charges recorded yet. They are captured when you decode SMS in Smart Add.", "Hakuna makato ya M-Pesa yaliyorekodiwa bado. Hunaswa unaposoma SMS kwenye Ongeza Kiotomatiki."],
    ["in M-Pesa charges; all-time", "kama makato ya M-Pesa; kwa muda wote"], ["You made", "Umefanya"], ["withdrawal(s).", "utoaji."],
    ["Fewer, larger withdrawals usually cost less than many small ones.", "Utoaji mchache wa kiasi kikubwa kwa kawaida hugharimu kidogo kuliko mingi midogo."],
    ["No goals yet. A target with a deadline makes saving stick.", "Hakuna malengo bado. Lengo lenye tarehe ya mwisho hurahisisha kuweka akiba."],
    ["to finish by", "ili kumaliza kufikia"], ["Balance:", "Salio:"],
    ["Tap a chip, or ask:", "Gusa kitufe, au uliza:"],
    ["How much did I spend on food last week?", "Nimetumia kiasi gani kwa chakula wiki iliyopita?"], ["What's my balance?", "Salio langu ni lipi?"],
    ["Will I run out before month end?", "Je, nitaishiwa kabla ya mwisho wa mwezi?"], ["Can I afford 4,500?", "Naweza kununua 4,500?"],
    ["Biggest spend in October", "Matumizi makubwa zaidi Oktoba"], ["Who do I send most to?", "Nani ninayemtumia zaidi?"],
    ["Compare with last month", "Linganisha na mwezi uliopita"], ["Spent 250 on lunch", "Nimetumia 250 kwa chakula cha mchana"],
    ["— I'll log it for you", "— nitakurekodia"], ["Open stats", "Fungua takwimu"], ["dark mode", "hali ya giza"], ["alert me below 500", "nikumbushe salio likishuka chini ya 500"],
    ["I understand typos, Swahili/Sheng, and follow-ups like", "Ninaelewa makosa ya uandishi, Kiswahili/Sheng, na maswali ya kufuatilia kama"], ["and yesterday?", "na jana?"],
    ["Done! New balance:", "Imekamilika! Salio jipya:"], ["Warn you when your balance drops below", "Nikuonye salio lako likishuka chini ya"],
    ["Dark mode is on.", "Hali ya giza imewashwa."], ["Light mode is on.", "Hali ya mwanga imewashwa."], ["Opening Smart Add", "Inafungua Ongeza Kiotomatiki"],
    ["Taking you to", "Nakupeleka kwenye"], ["Nice to meet you,", "Nafurahi kukutana nawe,"], ["I'll remember that.", "Nitakumbuka hilo."],
    ["Great! What would you like to check?", "Vizuri! Ungependa kuangalia nini?"], ["No problem", "Hakuna shida"], ["I'm right here whenever you need me.", "Niko hapa wakati wowote unaponihitaji."],
    ["Got it!", "Nimeelewa!"], ["Noted!", "Imeandikwa!"], ["Right back at you!", "Nawe pia!"],
    ["Ask me anything about your money, or tap a button.", "Niulize chochote kuhusu pesa zako, au gusa kitufe."],
    ["Good morning", "Habari za asubuhi"], ["Good afternoon", "Habari za mchana"], ["Good evening", "Habari za jioni"], ["Hey, night owl", "Hujambo, bundi wa usiku"],
    ["Hi, good to see you", "Hujambo, nafurahi kukuona"], ["Hey there", "Hujambo"], ["Hello", "Hujambo"], ["Hey!", "Hujambo!"], ["Hi there!", "Habari!"],
    ["What would you like to look at?", "Ungependa kuangalia nini?"],
    ["Your records are empty — add your first transaction and I'll start learning your habits.", "Rekodi zako ni tupu — ongeza muamala wako wa kwanza nami nitaanza kujifunza tabia zako."],
    ["Your balance is", "Salio lako ni"], ["and today you've spent", "na leo umetumia"], ["and today you've received", "na leo umepokea"], ["and received", "na umepokea"],
    ["and nothing is logged yet today.", "na hakuna kilichorekodiwa leo bado."],
    ["How are", "Je, uko aje"], ["— shall we look at your money?", "Tuangalie pesa zako?"],
    ["I'm a built-in helper — not a person — that reads", "Mimi ni msaidizi uliojengewa ndani — si mtu — ninayesoma"], ["only the records on your phone", "rekodi zilizo kwenye simu yako pekee"],
    ["Nothing leaves your device. I can answer questions about spending, income, balance, people you pay, forecasts and more, and I can even log a transaction if you type it, like", "Hakuna kinachotoka kwenye kifaa chako. Naweza kujibu maswali kuhusu matumizi, mapato, salio, watu unaowalipa, utabiri na zaidi, na hata kurekodi muamala ukiuandika, kama"],
    ["It's", "Ni"],
    ["Doing great, thanks for asking!", "Niko poa kabisa, asante kwa kuuliza!"], ["All good here — ready to crunch numbers!", "Mambo poa hapa — niko tayari kuhesabu!"], ["Sharp as ever!", "Mkali kama kawaida!"],
    ["Aww, thank you!", "Aww, asante!"], ["Let's keep your money healthy together.", "Tuhakikishe pesa zako ziko salama pamoja."], ["That means a lot!", "Hiyo ina maana kubwa!"],
    ["Want to see how your month is going?", "Unataka kuona mwezi wako unaendeleaje?"],
    ["Sorry I missed the mark", "Samahani nimekosea"], ["Try asking it differently, or tap one of these — I'll do better.", "Jaribu kuuliza kwa njia nyingine, au gusa mojawapo — nitafanya vizuri zaidi."],
    ["Fair enough, I'm still learning your style. Tell me what you'd like to know and I'll give it another go.", "Sawa, bado ninajifunza mtindo wako. Niambie unachotaka kujua nami nitajaribu tena."],
    ["Why did the wallet go to therapy? Too many issues with letting go.", "Kwa nini pochi ilienda kwa mshauri? Ilikuwa na shida ya kuachilia."],
    ["My budget and I have a lot in common — we both look great on paper.", "Bajeti yangu na mimi tunafanana sana — sote tunaonekana vizuri kwenye karatasi."],
    ["I told my savings account a joke. It didn't laugh… it has no interest.", "Nilimwambia akaunti yangu ya akiba utani. Haikucheka… haina riba."],
    ["Money talks — mine mostly says goodbye.", "Pesa huongea — yangu mara nyingi huaga."], ["Now, shall we check how you're really doing?", "Sasa, tuangalie hali yako halisi?"],
    ["You're welcome!", "Karibu!"], ["Anytime!", "Wakati wowote!"], ["Happy to help!", "Nimefurahi kusaidia!"], ["Anything else on your mind?", "Kuna kitu kingine?"],
    ["See you soon!", "Tutaonana hivi karibuni!"], ["Spend wisely.", "Tumia kwa busara."], ["Your records are safe on this phone.", "Rekodi zako ziko salama kwenye simu hii."], ["Bye for now!", "Kwaheri kwa sasa!"],
    ["I focus on", "Ninalenga"], ["your money", "pesa zako"], [", so try something like", ", kwa hivyo jaribu kitu kama"], ["or", "au"],
    ["Quick snapshot meanwhile — balance", "Muhtasari wa haraka kwa sasa — salio"], ["Tap a chip above or just ask me anything.", "Gusa kitufe hapo juu au uniulize chochote."],
    ["I read your own records right on this phone — private and fully offline.", "Nasoma rekodi zako mwenyewe moja kwa moja kwenye simu hii — kwa faragha na bila mtandao kabisa."],
    ["I couldn't find any records for", "Sikuweza kupata rekodi zozote za"], ["Here is what I do have — tap one:", "Hizi ndizo ninazo — gusa moja:"],
    ["Once you log some, I'll be able to track it.", "Ukirekodi baadhi, nitaweza kuifuatilia."],
    ["Nothing spent on", "Hakuna kilichotumika kwa"],
  ];

  /* compile phrase list: longest first so long sentences win over short words */
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const PR = P.filter((p) => p[0] instanceof RegExp);
  const PS = P.filter((p) => typeof p[0] === "string").sort((a, b) => b[0].length - a[0].length)
    .map((p) => [new RegExp("(^|[^\\p{L}])" + esc(p[0]) + "(?![\\p{L}])", "gu"), "$1" + p[1].replace(/\$/g, "$$$$")]);
  const PALL = PS.concat(PR);

  /* ---------- engine ---------- */
  const has = (k) => Object.prototype.hasOwnProperty.call(D, k);
  function one(n) {
    if (has(n)) return D[n];
    for (const [re, f] of R) { const o = n.replace(re, f); if (o !== n) return o; }
    return null;
  }
  function tr(s, ai) {
    const m = s.match(/^(\s*)([\s\S]*?)(\s*)$/);
    if (!m[2]) return s;
    const n = m[2].replace(/\s+/g, " ");
    let r = one(n);
    if (r == null) { const p = n.match(/^([^\p{L}\p{N}]+)([\s\S]+)$/u); if (p) { const q = one(p[2]); if (q != null) r = p[1] + q; } }
    if (r == null && ai) { let o = n; for (const [re, f] of PALL) o = o.replace(re, f); if (o !== n) r = o; }
    return r == null ? s : m[1] + r + m[3];
  }

  /* translate HTML strings (used by the assistant before the typing effect) */
  function html(s) {
    if (lang !== "sw") return s;
    const t = document.createElement("template");
    t.innerHTML = s;
    const w = document.createTreeWalker(t.content, NodeFilter.SHOW_TEXT), a = [];
    let n; while ((n = w.nextNode())) a.push(n);
    a.forEach((x) => (x.nodeValue = tr(x.nodeValue, true)));
    return t.innerHTML;
  }

  /* Swahili question → English keywords, so the built-in assistant understands you */
  const Q = [[/\bkiasi gani\b/g, "how much"], [/\bmara ngapi\b/g, "how many times"], [/\bripoti\b|\bmuhtasari\b/g, "report"], [/\butabiri\b/g, "forecast"],
    [/\bakiba\b/g, "savings"], [/\bmalengo\b/g, "goals"], [/\bmakato\b|\bada\b/g, "fees"], [/\bwatu\b/g, "people"], [/\blinganisha\b/g, "compare"],
    [/\bnaweza kununua\b/g, "can i afford"], [/\bnitaishiwa\b|\bnitaisha\b/g, "run out"], [/\bmwisho wa mwezi\b/g, "end of month"], [/\bmsaada\b/g, "help"],
    [/\bchakula\b/g, "food"], [/\busafiri\b/g, "transport"], [/\bkodi\b/g, "rent"], [/\bkubwa zaidi\b/g, "biggest"], [/\bnani\b/g, "who"], [/\bkwa nini\b/g, "why"],
    [/\bmwaka uliopita\b/g, "last year"], [/\btakwimu\b/g, "stats"], [/\bmipangilio\b/g, "settings"], [/\bhali ya giza\b/g, "dark mode"],
    [/\bnikumbushe\b/g, "remind me"], [/\blikishuka chini ya\b/g, "drops below"],
    [/\bjanuari\b/g, "january"], [/\bfebruari\b/g, "february"], [/\bmachi\b/g, "march"], [/\baprili\b/g, "april"], [/\bjuni\b/g, "june"], [/\bjulai\b/g, "july"],
    [/\bagosti\b/g, "august"], [/\bseptemba\b/g, "september"], [/\boktoba\b/g, "october"], [/\bnovemba\b/g, "november"], [/\bdesemba\b/g, "december"]];
  const query = (t) => (lang === "sw" ? Q.reduce((s, [re, e]) => s.replace(re, e), String(t).toLowerCase()) : t);

  /* ---------- DOM walker + observer (remembers originals so EN can be restored) ---------- */
  const NODES = new WeakMap(), ATT = new WeakMap(), ATTR = ["placeholder", "title", "aria-label"], SEL = "[placeholder],[title],[aria-label]";
  function xNode(n) {
    const p = n.parentElement;
    if (!p || p.closest("script,style,#ai-log")) return;
    const v = n.nodeValue, rec = NODES.get(n);
    if (rec && v === rec.t) return;
    const t = tr(v);
    NODES.set(n, { o: v, t });
    if (t !== v) n.nodeValue = t;
  }
  function xAttr(el) {
    ATTR.forEach((a) => {
      const v = el.getAttribute(a);
      if (v == null) return;
      const all = ATT.get(el) || {}, r = all[a];
      if (r && v === r.t) return;
      const t = tr(v);
      all[a] = { o: v, t }; ATT.set(el, all);
      if (t !== v) el.setAttribute(a, t);
    });
  }
  function walk(root) {
    if (root.nodeType === 3) return xNode(root);
    if (root.nodeType !== 1 && root.nodeType !== 9) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n; while ((n = w.nextNode())) xNode(n);
    if (root.nodeType === 1 && root.matches(SEL)) xAttr(root);
    root.querySelectorAll(SEL).forEach(xAttr);
  }
  function restore(root) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n; while ((n = w.nextNode())) { const r = NODES.get(n); if (r && n.nodeValue === r.t) n.nodeValue = r.o; }
    root.querySelectorAll(SEL).forEach((el) => {
      const all = ATT.get(el); if (!all) return;
      ATTR.forEach((a) => { const r = all[a]; if (r && el.getAttribute(a) === r.t) el.setAttribute(a, r.o); });
    });
  }
  let mo = null;
  function start() {
    if (mo) return;
    mo = new MutationObserver((ms) => {
      for (const m of ms) {
        if (m.type === "characterData") xNode(m.target);
        else if (m.type === "attributes") xAttr(m.target);
        else m.addedNodes.forEach(walk);
      }
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTR });
  }
  const stop = () => { if (mo) { mo.disconnect(); mo = null; } };

  /* dates/months/weekdays follow the language (Date.toLocale* with no explicit locale) */
  ["toLocaleDateString", "toLocaleTimeString", "toLocaleString"].forEach((f) => {
    const orig = Date.prototype[f];
    Date.prototype[f] = function (l, o) {
      if (lang === "sw" && (l === undefined || l === "default" || (Array.isArray(l) && !l.length))) l = "sw-KE";
      return orig.call(this, l, o);
    };
  });

  /* re-draw everything the app generates from JS */
  function refresh() {
    try {
      if (typeof aiReady !== "undefined") {
        aiReady = false; aiQ = Promise.resolve();
        const lg = document.getElementById("ai-log"); if (lg) lg.innerHTML = "";
        AIM.intent = AIM.period = AIM.offer = AIM.pending = null; AIM.ents = [];
        if (currentPage === "hub") aiInit();
      }
      renderAll(); renderProfileMenu(); renderCurrencies();
      if (document.getElementById("add-modal").classList.contains("open")) { setType(entryType); updAmt(); smRender(); }
    } catch (e) { console.warn("i18n refresh", e); }
  }
  function chrome() {
    document.documentElement.lang = lang;
    document.title = lang === "sw" ? D["CashSplit — Money Tracker"] : "CashSplit — Money Tracker";
    const s = document.getElementById("lang-sel"); if (s) s.value = lang;
  }
  function set(l) {
    l = l === "sw" ? "sw" : "en";
    if (l === lang) return chrome();
    lang = l;
    try { localStorage.setItem(KEY, l); } catch (e) {}
    if (l === "sw") { start(); walk(document.body); } else { stop(); restore(document.body); }
    chrome();
    refresh();
  }
  function init() { chrome(); if (lang === "sw") { start(); walk(document.body); } }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();

  window.I18N = { set, get: () => lang, t: (s) => (lang === "sw" ? tr(String(s), true) : s), html, query, locale: () => (lang === "sw" ? "sw-KE" : undefined) };
})();