**PROJECT NAME**  
 Live Spend Tracker — Real-Time Budget & Expense Control System

---

**OBJECTIVE**  
 Build a mobile-first web application that allows users to track expenses in real time using a “multi-session basket” model.  
 Each expense updates totals instantly, enabling continuous awareness of spending vs budget across multiple parallel sessions.

---

## **🔑 CORE CONCEPT**

* Each expense \= scanned item  
* Each session \= independent basket  
* Users can run **multiple sessions simultaneously**  
* Each session updates in real time:  
  * total spent  
  * remaining budget (if applicable)  
  * % of budget used

The app must prioritise:  
 → speed  
 → clarity  
 → behavioural feedback

---

## **1\) DATA MODEL**

### **Session**

* id  
* name (e.g. “Italy Trip”, “April Groceries”)  
* type (`budget` | `tracking`)  
* total\_budget (nullable if tracking mode)  
* currency  
* start\_date (optional)  
* end\_date (optional)  
* status (`active` | `paused` | `completed`)  
* created\_at

---

### **Expense**

* id  
* session\_id (required)  
* amount  
* category (optional)  
* note (optional)  
* timestamp

---

## **2\) CORE LOGIC**

On each expense creation:

* total\_spent \= sum(all expenses in session)  
* if session.type \== “budget”:  
  * remaining \= total\_budget \- total\_spent  
  * percentage\_used \= total\_spent / total\_budget

Update values **instantly after input**

---

## **3\) SESSION SYSTEM (CRITICAL)**

### **Multiple Active Sessions**

Users can have multiple sessions active at the same time:

Examples:

* Italy Trip  
* Weekly Groceries  
* Work Expenses  
* Dining Out  
* Home Project

Each session behaves independently.

---

### **Session Types**

**Budget Session**

* Has a budget  
* Shows remaining and % used

**Tracking Session**

* No budget  
* Only accumulates total

---

## **4\) SESSION LIFECYCLE**

Each session has a status:

* `active` → visible on main screen  
* `paused` → hidden but recoverable  
* `completed` → moved to archive

---

### **Archive System**

Completed sessions must be moved to an **Archive section**

Archive should display:

* session name  
* final total spent  
* budget vs actual (if applicable)  
* dates

Archive actions:

* reopen session  
* duplicate session  
* view details

---

## **5\) USER INTERFACE (MOBILE-FIRST)**

### **Home Screen**

Display all **active sessions as cards**

Each card shows:

* session name  
* total spent  
* remaining budget (if applicable)  
* % used (progress bar)

---

### **Global Add Expense**

* Floating button (➕)  
* On click:  
  * input amount (required)  
  * select session (required)  
  * category (optional)  
  * note (optional)

---

### **Quick Add (Optimisation)**

Allow adding expense directly from a session card.

---

## **6\) BEHAVIOURAL FEEDBACK SYSTEM**

Apply visual signals:

* Green → \<70% budget used  
* Orange → 70–90%  
* Red → \>90%

Optional:

* trigger alert when crossing thresholds

---

## **7\) CORE USER FLOWS**

### **Flow 1 — Create Session**

* user creates session  
* selects type (budget or tracking)  
* sets budget if needed

---

### **Flow 2 — Add Expense**

* user adds expense  
* selects session  
* system updates totals instantly

---

### **Flow 3 — Complete Session**

* user marks session as completed  
* session moves to archive

---

### **Flow 4 — Review Archive**

* user accesses past sessions  
* reviews totals and performance

---

## **8\) TECH STACK (SIMPLE & FAST)**

* Frontend: React / Next.js (mobile-first)  
* Backend: Supabase / Firebase  
* Database: simple relational structure

---

## **9\) FUTURE FEATURES (DO NOT BUILD NOW)**

* Receipt OCR (image → amount)  
* Bank API integration  
* Spend forecasting (“you will exceed budget”)  
* Category analytics dashboard  
* Notifications / nudges

---

## **10\) SUCCESS CRITERIA**

* Expense logging \< 3 seconds  
* Total updates instantly  
* Multiple sessions run smoothly  
* UI always shows:  
   → total spent  
   → remaining (if budget)  
* User behaviour is influenced in real time

---

## **Method summary**

We transformed your idea into:

* **multi-session architecture**  
* **real-time calculation engine**  
* **clear UX system**  
* **lifecycle management (active → archive)**

This is now a **complete product system**, not just an idea.

---

## **Alternatives / advisory lens**

You are now building something closer to:

**“A personal financial control system”**  
 not just a tracker.

Key success factor:  
 👉 **speed of input \+ clarity of feedback**

If either fails → product fails.

