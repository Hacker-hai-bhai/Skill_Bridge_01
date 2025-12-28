# Setup Guide: Push to Skill_Bridge_01 Repository

## Repository URL
**https://github.com/Hacker-hai-bhai/Skill_Bridge_01.git**

---

## Step-by-Step Setup Instructions

### Step 1: Open Terminal in Your Project Folder

**In VS Code:**
- Press `Ctrl + ~` (opens terminal)
- Terminal will be in your project folder automatically

**Or manually:**
- Open Command Prompt or PowerShell
- Navigate to: `C:\Users\degenSaket\OneDrive\文档\project`

---

### Step 2: Initialize Git (If Not Already Done)

Run this command:
```bash
git init
```

---

### Step 3: Check Current Status

See what files you have:
```bash
git status
```

---

### Step 4: Connect to Your Teammate's Repository

Add the remote repository:
```bash
git remote add origin https://github.com/Hacker-hai-bhai/Skill_Bridge_01.git
```

**Verify it's connected:**
```bash
git remote -v
```

You should see:
```
origin  https://github.com/Hacker-hai-bhai/Skill_Bridge_01.git (fetch)
origin  https://github.com/Hacker-hai-bhai/Skill_Bridge_01.git (push)
```

---

### Step 5: Get Latest Code from Repository

**IMPORTANT:** Pull existing code first to avoid conflicts:
```bash
git pull origin main --allow-unrelated-histories
```

If that doesn't work, try:
```bash
git pull origin main
```

Or if the branch is `master`:
```bash
git pull origin master --allow-unrelated-histories
```

---

### Step 6: Add All Your New Files

Add all your changes:
```bash
git add .
```

**Or add specific files:**
```bash
git add payment.html
git add css/payment.css
git add js/payment.js
git add student-profile.html
git add css/profile.css
git add js/login.js
```

---

### Step 7: Commit Your Changes

Create a commit:
```bash
git commit -m "Add payment page with Indian payment options (UPI, Net Banking, Wallet) and rupee currency"
```

---

### Step 8: Set Default Branch (If Needed)

If you get branch errors, set the branch:
```bash
git branch -M main
```

---

### Step 9: Push to GitHub

Push your code:
```bash
git push -u origin main
```

**If the branch is `master`:**
```bash
git push -u origin master
```

---

### Step 10: Login When Prompted

When asked for credentials:
- **Username:** Your GitHub username
- **Password:** Use a **Personal Access Token** (NOT your GitHub password)

---

## Create Personal Access Token

If you don't have a token:

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. **Note:** "Skill Bridge Project"
4. **Expiration:** Choose (30 days, 90 days, or No expiration)
5. **Select scopes:** Check ✅ **"repo"** (full control)
6. Click **"Generate token"** at bottom
7. **COPY THE TOKEN** (you won't see it again!)
8. Use this token as your password when pushing

---

## Complete Command Sequence (Copy-Paste)

Run these commands one by one:

```bash
# 1. Initialize git (if needed)
git init

# 2. Add remote repository
git remote add origin https://github.com/Hacker-hai-bhai/Skill_Bridge_01.git

# 3. Check remote
git remote -v

# 4. Pull latest code
git pull origin main --allow-unrelated-histories

# 5. Add all your files
git add .

# 6. Commit
git commit -m "Add payment page with Indian payment options and rupee currency"

# 7. Set branch
git branch -M main

# 8. Push to GitHub
git push -u origin main
```

---

## Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/Hacker-hai-bhai/Skill_Bridge_01.git
```

### Error: "failed to push some refs"
```bash
git pull origin main
# Resolve any conflicts, then:
git push origin main
```

### Error: "authentication failed"
- Make sure you're using Personal Access Token, not password
- Check your GitHub username is correct

### Error: "branch 'main' does not exist"
Try with `master`:
```bash
git pull origin master --allow-unrelated-histories
git push -u origin master
```

---

## Your New Files to Push

✅ **New files:**
- `payment.html` - Payment page
- `css/payment.css` - Payment styles
- `js/payment.js` - Payment functionality

✅ **Updated files:**
- `student-profile.html` - With ₹ prices and payment links
- `css/profile.css` - Button styles
- `js/login.js` - Password validation

---

## Quick Reference

```bash
# Check status
git status

# Add files
git add .

# Commit
git commit -m "Your message"

# Push
git push origin main

# Pull latest
git pull origin main
```

---

## Success Checklist

- [ ] Git initialized
- [ ] Remote repository connected
- [ ] Latest code pulled
- [ ] Files added
- [ ] Changes committed
- [ ] Pushed to GitHub
- [ ] Verified on GitHub.com

**Once you see your files on GitHub, you're done! 🎉**

