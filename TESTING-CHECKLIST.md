# 🧪 PLS Site Testing Checklist

## Quick Start

### Automated Testing
```bash
# 1. Make sure dev server is running
npm run dev

# 2. Open the test suite in your browser
open test-site.html
# or visit: file:///path/to/test-site.html

# 3. Click "Run All Tests"
```

---

## Manual Testing Checklist

### ✅ Visual & Layout Tests

#### Header & Navigation
- [ ] PLS logo displays correctly in header
- [ ] Navigation menu shows all sections (Home, Services, Partners, etc.)
- [ ] Language switcher (EN/PT) is visible and clickable
- [ ] Header is sticky/fixed on scroll
- [ ] Mobile menu works (if applicable)

#### Hero Section
- [ ] Hero background displays
- [ ] Main headline is visible and readable
- [ ] CTA buttons are present and styled correctly
- [ ] Stats/metrics display properly

#### Services Section
- [ ] All 4 service cards display:
  - Legal Services ⚖️
  - Accountancy & Tax 📊
  - Translation Services 🗣️
  - Business Consultancy 💼
- [ ] Service icons/emojis show correctly
- [ ] Hover effects work on service cards
- [ ] Service descriptions are readable

#### Partners Section
- [ ] All 4 partner logos display:
  - ✅ Montague Solicitors
  - ✅ AQ Archers
  - ✅ ACCA
  - ✅ CIOL
- [ ] Logos are properly sized and aligned
- [ ] Hover effects work on partner cards
- [ ] Certification badges display (HMRC, ICO, SRA)

#### About Section (Pedro Xavier)
- [ ] Pedro's photo displays (`/images/team/pedro.jpg`)
- [ ] Credentials badges show (BA Hons, TFL, ELB, CML, MCIL)
- [ ] Hover tooltips work on credential badges
- [ ] Bio text is readable and formatted
- [ ] Section background/styling looks good

#### Contact Section
- [ ] Contact form displays
- [ ] Email input field works
- [ ] Message textarea works
- [ ] Submit button is styled correctly
- [ ] Contact information displays (email, phone, address)

#### Footer
- [ ] PLS logo displays in footer
- [ ] Footer links work
- [ ] Copyright text displays
- [ ] Social media links (if any) work

---

### ✅ Interactive Features Tests

#### NoVo AI Assistant
- [ ] "Ask NoVo AI Assistant" button displays in bottom-right
- [ ] Button shows NoVo avatar (not robot emoji 🤖)
- [ ] Avatar image loads: `/images/services/avatar.png`
- [ ] Button has glow/pulse effect
- [ ] Clicking button opens NoVo chat window
- [ ] Chat window displays properly
- [ ] NoVo avatar shows in chat header
- [ ] Chat input field works
- [ ] Can type and send messages
- [ ] Close button works

#### AI Features
- [ ] **Translation Service**
  - Section displays
  - File upload works
  - Language selector works (EN ↔ PT)
  - Translate button is clickable
  
- [ ] **Image Analysis**
  - Section displays
  - Image upload works
  - Analysis button is clickable
  
- [ ] **AI Legal Advice**
  - Section displays
  - Category selector works
  - Query input field works
  - Submit button is clickable

#### Language Switcher
- [ ] Click EN/PT button
- [ ] Page content changes language
- [ ] All sections update (Hero, Services, etc.)
- [ ] Language preference persists

---

### ✅ Image Loading Tests

Check browser DevTools Network tab for these images:

#### Logos
- [ ] `/images/pls-logo.png` - PLS main logo
- [ ] `/images/partners/acca-logo.png` - ACCA
- [ ] `/images/partners/montague-logo.png` - Montague
- [ ] `/images/partners/aq-archers-logo.png` - AQ Archers
- [ ] `/images/partners/CIOL-logo.png` - CIOL

#### Team Photos
- [ ] `/images/team/pedro.jpg` - Pedro Xavier

#### NoVo Avatar
- [ ] `/images/services/avatar.png` - Static avatar
- [ ] `/images/services/avatar_speak.gif` - Animated avatar (when talking)

---

### ✅ Responsive Design Tests

#### Desktop (1920px+)
- [ ] Layout uses full width appropriately
- [ ] Images are high quality
- [ ] Navigation is horizontal
- [ ] All sections display side-by-side where appropriate

#### Tablet (768px - 1024px)
- [ ] Layout adjusts to tablet width
- [ ] Images scale appropriately
- [ ] Navigation still works
- [ ] Cards stack or resize properly

#### Mobile (320px - 767px)
- [ ] Layout is single column
- [ ] Text is readable (not too small)
- [ ] Buttons are touch-friendly (min 44px)
- [ ] Images don't overflow
- [ ] Mobile menu works (hamburger icon)
- [ ] NoVo button doesn't block content

---

### ✅ Performance Tests

#### Load Time
- [ ] Page loads in < 3 seconds
- [ ] Images load progressively
- [ ] No layout shift (CLS)
- [ ] Smooth scrolling

#### Browser Console
- [ ] No JavaScript errors (red messages)
- [ ] No 404 errors for missing files
- [ ] No CORS errors
- [ ] API key warnings only (expected if not configured)

---

### ✅ Functionality Tests

#### Navigation
- [ ] Clicking nav links scrolls to sections
- [ ] Smooth scroll animation works
- [ ] Active section highlights in nav (if applicable)

#### Forms
- [ ] Contact form validates email
- [ ] Required fields show errors
- [ ] Submit button works
- [ ] Success/error messages display

#### Links
- [ ] All external links open in new tab
- [ ] Partner links work (even if placeholder #)
- [ ] Social media links work

---

### ✅ Cross-Browser Tests

Test in multiple browsers:

- [ ] **Chrome** - All features work
- [ ] **Firefox** - All features work
- [ ] **Safari** - All features work
- [ ] **Edge** - All features work
- [ ] **Mobile Safari (iOS)** - All features work
- [ ] **Chrome Mobile (Android)** - All features work

---

## 🐛 Common Issues to Check

### Images Not Loading
- Check file paths are correct (case-sensitive!)
- Verify images exist in `public/images/` folder
- Check browser DevTools Network tab for 404 errors

### NoVo Avatar Shows Robot Emoji
- Verify `BRAND_LOGOS.NOVO_AVATAR` is imported in `App.tsx`
- Check `/images/services/avatar.png` exists
- Clear browser cache and reload

### API Features Not Working
- Check `.env.local` has `GEMINI_API_KEY`
- Verify API key is valid
- Check browser console for API errors

### Styling Issues
- Clear browser cache
- Check CSS is loading
- Verify Tailwind classes are working

---

## 📊 Test Results Template

```
Date: ___________
Tester: ___________
Browser: ___________
Device: ___________

Visual Tests: ___/10 passed
Interactive Tests: ___/8 passed
Image Loading: ___/8 passed
Responsive: ___/4 passed
Performance: ___/4 passed
Functionality: ___/6 passed

Total: ___/40 passed

Issues Found:
1. ___________
2. ___________
3. ___________
```

---

## 🚀 Pre-Deployment Checklist

Before deploying to Render:

- [ ] All tests pass
- [ ] All images load correctly
- [ ] No console errors
- [ ] API key is configured (in Render env vars)
- [ ] Build succeeds: `npm run build`
- [ ] Preview works: `npm run preview`
- [ ] All links work
- [ ] Contact form works
- [ ] Mobile responsive
- [ ] Cross-browser tested

