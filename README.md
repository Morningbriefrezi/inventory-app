# სტრუქტურა – ინვენტარი 🏗

სამშენებლო კომპანიის ინვენტარის მართვის სისტემა.

## ✨ ფუნქციები

- 📦 ინვენტარის მართვა (8 კატეგ., 3 ობიექტი)
- 🛒 შესყიდვების ჟურნალი
- 💸 ხარჯების კონტროლი
- 📊 ანალიტიკა და ანგარიშები
- 🌙 ღამის / დღის რეჟიმი
- 💾 ავტომ. შენახვა (localStorage)

---

## 🚀 GitHub Pages-ზე გასაშვებად – ნაბიჯ-ნაბიჯ

### 1. GitHub რეპოზიტორი შექმენი

1. გახსენი [github.com/new](https://github.com/new)
2. სახელი მიეცი, მაგ: `inventory-app`
3. დააჭირე **Create repository**

---

### 2. `vite.config.js` განაახლე

გახსენი `vite.config.js` და შეცვალე `base` შენი რეპოს სახელის მიხედვით:

```js
base: "/inventory-app/",   // ← შენი repo სახელი
```

---

### 3. კოდი გადაიტანე GitHub-ზე

ტერმინალში, პროექტის საქაღალდეში:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/შენი-username/inventory-app.git
git push -u origin main
```

---

### 4. GitHub Pages ჩართე

1. გახსენი რეპო → **Settings** → **Pages** (მარცხნივ)
2. **Source** → `GitHub Actions` (dropdown-იდან)
3. შენახე

---

### 5. ავტომ. Deploy

`main`-ზე push-ის შემდეგ GitHub Actions ავტომ. ააწყობს და გამოქვეყნებს.

✅ სამ-ოთხ წუთში მისამართი გამოჩნდება:
```
https://შენი-username.github.io/inventory-app/
```

---

## 💻 ლოკალური გაშვება

```bash
npm install
npm run dev
```

გახსნი: http://localhost:5173/inventory-app/

---

## 🔧 ტექ. დეტალები

- React 18 + Vite 5
- ყველა მონ. ინახება localStorage-ში
- CSS-ი inline styles-ით (build dependency არ სჭ.)
- ავტომ. deploy GitHub Actions-ით
