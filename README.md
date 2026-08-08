# Xanthoula Mavridou — Portfolio Site

Αυτό είναι το site σου, αλλά σε μορφή που ενημερώνεται **μόνο του**: κάθε φορά
που προσθέτεις ένα νέο έργο ή μια νέα έκθεση και το ανεβάζεις (push) στο
GitHub, το **Cloudflare Pages** παίρνει μόνο του τον κώδικα, ξαναχτίζει το
site και το δημοσιεύει στο δικό σου domain — χωρίς να χρειάζεται να
ξαναφτιάξεις τίποτα με το χέρι.

Δεν χρειάζεται να ξέρεις προγραμματισμό. Τα μόνα δύο πράγματα που θα αγγίζεις
ποτέ είναι:

- ο φάκελος `images/works/` (οι φωτογραφίες των έργων σου)
- τα αρχεία `data/works.json` και `data/exhibitions.json` (τα στοιχεία κάθε έργου/έκθεσης)

Όλα τα υπόλοιπα (design, στήλες, φίλτρα, zoom effect κ.λπ.) μένουν όπως είναι.

Υπάρχει επίσης ένα μικρό GitHub Actions workflow (`validate.yml`) που απλώς
**ελέγχει** ότι το site χτίζεται σωστά σε κάθε push — δεν κάνει deploy πουθενά,
αυτό το αναλαμβάνει το Cloudflare. Αν κάνεις κάποιο τυπογραφικό λάθος σε ένα
JSON αρχείο, θα το δεις σαν κόκκινο ✕ στο GitHub πριν καν φτάσει στο Cloudflare.

---

## 1. Πρώτη φορά: GitHub + Cloudflare Pages

**Α. Ανέβασε το project στο GitHub**

1. Πήγαινε στο [github.com/new](https://github.com/new) και δημιούργησε ένα
   καινούργιο repository (π.χ. `portfolio`) — μπορεί να είναι και **private**,
   το Cloudflare έχει πρόσβαση ούτως ή άλλως.
2. Ανέβασε **όλα** τα αρχεία και τους φακέλους από αυτό το πακέτο, κρατώντας
   την ίδια δομή (τον φάκελο `.github`, `data`, `images`, `src`, κ.λπ.).
   - Αν το GitHub δεν σε αφήνει να ανεβάσεις ολόκληρο φάκελο μέσω browser,
     κατέβασε το **GitHub Desktop** (https://desktop.github.com), σύνδεσε τον
     λογαριασμό σου, "Add local repository" → διάλεξε αυτόν τον φάκελο →
     "Publish repository".

**Β. Σύνδεσε το repository με το Cloudflare Pages**

1. Μπες στο [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers &
   Pages** → **Create** → καρτέλα **Pages** → **Connect to Git**.
2. Διάλεξε το repository που μόλις έφτιαξες.
3. Στις ρυθμίσεις build βάλε ακριβώς αυτά:
   - **Build command**: `npm run build`
   - **Build output directory**: `/` (η ρίζα του repo — το `index.html` χτίζεται εκεί απευθείας)
   - (Root directory: άσ' το κενό — τα αρχεία είναι ήδη στη ρίζα του repo)
4. Πάτα **Save and Deploy**. Σε 1-2 λεπτά το site είναι ζωντανό σε μια
   διεύθυνση της μορφής `https://portfolio-xxx.pages.dev`.

**Γ. Σύνδεσε το δικό σου domain**

1. Μέσα στο Pages project → καρτέλα **Custom domains** → **Set up a domain**.
2. Γράψε το domain σου (π.χ. `xanthoulamavridou.com`) και πάτα **Continue**.
   - Αν το domain σου είναι *ήδη* μέσα στο Cloudflare (δηλαδή το βλέπεις σαν
     "zone" στο dashboard σου), η ρύθμιση γίνεται αυτόματα.
   - Αν το domain είναι σε άλλον provider (π.χ. εκεί που το αγόρασες), το
     Cloudflare θα σου δείξει ποια DNS εγγραφή (CNAME) να προσθέσεις εκεί.
3. Μέσα σε λίγα λεπτά το site σου είναι live στο δικό σου domain, με SSL
   αυτόματα ενεργοποιημένο.

Από εδώ και πέρα, **κάθε φορά** που αλλάζεις κάτι στα `data/` ή στα
`images/works/` και το κάνεις push στο GitHub, το Cloudflare Pages
ξαναχτίζει και δημοσιεύει το site μόνο του μέσα σε 1-2 λεπτά — στο ίδιο σου
domain, χωρίς άλλο βήμα.

---

## 2. Πώς προσθέτεις ένα νέο έργο

**Βήμα 1 — η φωτογραφία.** Ανέβασε το αρχείο εικόνας (jpg) μέσα στον φάκελο
`images/works/`. Δώσε του ένα απλό όνομα χωρίς κενά, π.χ. `oil-newpiece.jpg`.

**Βήμα 2 — τα στοιχεία.** Άνοιξε το αρχείο `data/works.json` (μπορείς να το
επεξεργαστείς κατευθείαν μέσα στο GitHub πατώντας το μολυβάκι ✏️ πάνω δεξιά)
και πρόσθεσε ένα καινούργιο block μέσα στις αγκύλες `[ ... ]`, π.χ.:

```json
{
  "id": "oil-newpiece",
  "title": "Τίτλος του έργου",
  "category": "oil",
  "medium": "Oil on canvas",
  "year": "2026",
  "dimensions": "40 × 50 cm",
  "images": ["oil-newpiece.jpg"],
  "alt": "Σύντομη περιγραφή για προσβασιμότητα"
}
```

Πρόσεξε: `"category"` πρέπει να είναι ένα από τα: `oil`, `ink`, `mixed`,
`sketches`. Μην ξεχάσεις το κόμμα `,` πριν από το νέο block αν δεν είναι το
τελευταίο στη λίστα.

**Βήμα 3.** Πάτα "Commit changes". Αυτό είναι όλο — το workflow αναλαμβάνει
τα υπόλοιπα.

### Έργο με περιγραφή / πολλές φωτογραφίες (όπως το "2nd Stalking")

```json
{
  "id": "process-piece",
  "title": "Τίτλος",
  "category": "mixed",
  "subgroup": "Process & Performance",
  "medium": "Περιγραφή υλικού",
  "date": "ημερομηνία αν χρειάζεται",
  "images": ["photo1.jpg", "photo2.jpg"],
  "description": "Το κείμενο που θα εμφανιστεί κάτω από τον τίτλο.",
  "feature": true
}
```

### Ομαδοποίηση σε σειρά (όπως το "Perspective Series")

Βάλε το ίδιο `"series": "Όνομα Σειράς"` σε συνεχόμενα έργα μέσα στο ίδιο
`category`, και προαιρετικά ένα `"seriesNote"` (μικρό κείμενο) στο **πρώτο**
έργο της σειράς.

---

## 3. Πώς προσθέτεις μια νέα έκθεση

Άνοιξε το `data/exhibitions.json` και πρόσθεσε ένα block:

```json
{
  "id": "unique-id-2027",
  "title": "Τίτλος έκθεσης",
  "tag": "Group Exhibition",
  "venue": "Όνομα χώρου, Πόλη",
  "dates": "1 – 10 Ιανουαρίου 2027",
  "description": "Σύντομη περιγραφή."
}
```

Οι εκθέσεις εμφανίζονται με τη σειρά που έχουν μέσα στο αρχείο.

---

## 4. Δομή του project

```
index.html             ← το τελικό site — το φτιάχνει/ανανεώνει το build.js
data/
  works.json          ← όλα τα έργα σου
  exhibitions.json    ← όλες οι εκθέσεις σου
images/works/         ← οι φωτογραφίες των έργων
src/
  template.html       ← το "κέλυφος" του site (design, hero, statement, κ.λπ.)
  build.js            ← το script που ενώνει data + template και γράφει το index.html
.github/workflows/
  validate.yml        ← έλεγχος (validation) — το Cloudflare κάνει το deploy
.nvmrc                ← καθορίζει την έκδοση Node για το Cloudflare build
```

Το `index.html` βρίσκεται πάντα στη ρίζα του project. Κάθε φορά που τρέχει
το `build.js` (είτε τοπικά είτε μέσα στο Cloudflare), αυτό ακριβώς το αρχείο
ξαναγράφεται από την αρχή με βάση τα `data/*.json` — δεν το επεξεργάζεσαι
ποτέ εσύ με το χέρι.

Ό,τι θέλεις να αλλάξεις σε κείμενο εκτός έργων/εκθέσεων (π.χ. το artist
statement, τα στοιχεία επικοινωνίας, το education) το επεξεργάζεσαι
κατευθείαν μέσα στο `src/template.html`.

---

## 5. Δοκιμή στον υπολογιστή σου (προαιρετικό)

Αν έχεις εγκατεστημένο το [Node.js](https://nodejs.org):

```bash
node src/build.js
```

Αυτό ξαναγράφει το `index.html` στη ρίζα του project — άνοιξέ το κατευθείαν
στον browser για προεπισκόπηση πριν το ανεβάσεις.
