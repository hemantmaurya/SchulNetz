# SchulNetz – Simple School ERP System

SchulNetz is a lightweight school management / ERP-like application we are building step by step.  
It will help manage students, teachers, inventory, fees, attendance, purchases, sales, etc.

**Important note for complete beginners:**  
You **do NOT** need to install Node.js, npm, React, PostgreSQL or any other development tools on your computer.  
**Everything runs inside Docker containers.**

You only need **one program**: **Docker Desktop**.

## Who can follow this guide?

- People who have **never** used Terminal / Command Prompt
- People who have **never** used Git or GitHub
- People who have **never** run a web project before
- Windows 10/11 or macOS users

If anything goes wrong — take a screenshot of the error message and ask for help.

## What you will get after following these steps

- Backend API → http://localhost:4000
- React frontend (dashboard) → http://localhost:5173
- pgAdmin (web database manager like phpMyAdmin) → http://localhost:5050
- PostgreSQL database running safely in Docker

## Step 0 – Install Docker Desktop (the only program you need)

### On Windows (10 or 11)

1. Open your browser (Chrome / Edge / Firefox)
2. Go to: https://www.docker.com/products/docker-desktop/
3. Click **Download for Windows**
4. Run the downloaded file (`Docker Desktop Installer.exe`)
5. Click **OK** → **Next** → accept license → **Install**
6. If it asks to install WSL 2 → allow it (restart computer if asked)
7. After restart, search **Docker Desktop** in Start menu and open it
8. Accept the license again if asked
9. Wait until the whale icon in the bottom-right taskbar turns green and says "Docker Desktop is running"

### On macOS (MacBook – any recent model)

1. Go to: https://www.docker.com/products/docker-desktop/
2. Click **Download for Mac** (it chooses Apple Silicon or Intel automatically)
3. Open the downloaded `.dmg` file
4. Drag the **Docker** icon to the **Applications** folder
5. Go to **Applications** → double-click **Docker.app**
6. If macOS says "unidentified developer" → click **Open**
7. Enter your Mac password if asked
8. Wait until the whale icon appears in the top menu bar and shows Docker is running

## Step 1 – Download the project from GitHub (easiest way – no git needed)
***Beginner Way***
1. Open your browser
2. Go to:  
   https://github.com/YOUR_GITHUB_USERNAME/SchulNetz  
   (replace YOUR_GITHUB_USERNAME with the actual GitHub username that is hemantmaurya)

3. Click the green **Code** button
4. Click **Download ZIP**
5. Go to your **Downloads** folder
6. Right-click `SchulNetz-main.zip` → **Extract All** (Windows)  
   or double-click it (Mac) to unzip
7. Rename the extracted folder from `SchulNetz-main` to just `SchulNetz`

***Professional way (Recomended)***

1. Open your browser
2. Go to:  
   https://github.com/YOUR_GITHUB_USERNAME/SchulNetz  
   (replace YOUR_GITHUB_USERNAME with the actual GitHub username that is hemantmaurya)

3. Click the green **Code** button
4. Copy link that is (https://github.com/hemantmaurya/SchulNetz.git) in our case
5. Open Terminal(mac) or Command prompt(Widnows)
6. Navigate to the folder you want the project to be.
7. Just run the following command
   git clone and the link that you just copied.
   
```
git clone https://github.com/hemantmaurya/SchulNetz.git
```

## Step 2 – Open Terminal / Command Prompt

**Windows:**
- Press Windows key
- Type `cmd` → press Enter → black window opens  
  (or search for **PowerShell** — both work)

**Mac:**
- Press Command (⌘) + Space
- Type `Terminal` → press Enter

This is where we will copy-paste commands.

## Step 3 – Go inside the SchulNetz folder

In the Terminal/Command Prompt window:

**Windows example (if folder is on Desktop):**

```bash
cd Desktop\SchulNetz
```

### Quick test – are you in the correct folder?

```
dir          # Windows
ls           # Mac

```

You should see these folders/files:

- backend
- frontend
- docker-compose.yml
- README.md

- If you see them → perfect!


### Step 4 – Start the whole project (main command)
```
docker compose up -d --build
```


- Few Hours Later
- When terminal work is done within 1-2 mins, depends on speed

### Step 5 – Check if everything started correctly

```
docker compose ps
```

You should see output similar to:

```
NAME                    STATUS              PORTS
schulnetz-db            Up (healthy)        0.0.0.0:5433->5432/tcp
schulnetz-backend       Up
schulnetz-frontend      Up
schulnetz-pgadmin       Up
```
### Step 6 – Open the application in your browser

| What                     | Address                        | What you should see                                      |
|--------------------------|--------------------------------|----------------------------------------------------------|
| Frontend (React dashboard) | http://localhost:5173        | School dashboard or login page                           |
| Backend health check     | http://localhost:4000/health   | JSON like `{"status":"ok","app":"SchulNetz Backend",...}` |
| Database admin panel     | http://localhost:5050          | pgAdmin login page                                       |


### pgAdmin login:

- Email:    weadmin@local.com
- Password: pass123word

### After login:

- Click Add New Server (or right-click Servers → Create → Server…)
- In General tab → Name: anything (e.g. "SchulNetz DB")
- In Connection tab:
- Host name/address: db
- Port: 5432
- Maintenance database: schulnetz
-     Username: weAdmin
-     Password: pass123word

- Click Save

### Step 7 – Stop the project when finished
```
docker compose down
```

### Want to delete all database data and start fresh?

```
docker compose down -v
```

### Quick command reference

```
# Go to project folder (example)
cd Desktop\SchulNetz           # Windows
cd ~/Desktop/SchulNetz         # Mac

# Start / rebuild
docker compose up -d --build

# Check status
docker compose ps

# See logs if something is wrong
docker compose logs backend
docker compose logs db

# Stop
docker compose down

# Stop + delete data
docker compose down -v
```

### Default passwords (development only – change in production!)

-  PostgreSQL:
-    Username: weAdmin
-    Password: pass123word
-    Database: schulnetz

-  pgAdmin:
-    Email: weadmin@local.com
-    Password: pass123word

### Never use these credentials on a real/public server!

### #######################################################


## Git Basics – Most Important Commands (Explained Super Simple)

Git is like a "save history" for your code.  
You use it to track changes and upload to GitHub.

Copy-paste these commands when needed. Examples are short and real.

### Everyday Commands (use these 90% of the time)

1. **Check what you changed**  
   ```
   git status
   ```

2. **Add all your changes**
  ```
  git add .
  ```
  → Tells Git: "save these changes"
(You can also add one file: git add filename.js)

3. **Save changes with a message (commit)**

  ```
    git commit -m "your short message like Just added a button here or anything that inform what you did by now since last commit"

  ```
  Examples
  ```
  git commit -m "fixed login button"
git commit -m "added student list page"
git commit -m "updated README"
```

4. **Send your saved work to GitHub (push)Bash**
```
git push origin main
```

5. **Get latest code from GitHub (pull)**
```
git pull origin main
```
6. *** Working with Branches (good habit – don't work directly on main) ***

7. ***Create and switch to a new branch***
```
Create and switch to a new branch
```
Example
```
git checkout -b add-student-registration
git checkout -b fix-dashboard-bugs
```

8. ***Go back to main branch***
```
git checkout main
```
9. ***See all branches***
```
git branch
```
→ The one with * is where you are now

10. ***Quick Daily Flow (copy this order)***
```
# 1. Start your day – get latest code
git pull origin main

# 2. Make your changes in code...

# 3. Check what changed
git status

# 4. Add changes
git add .

# 5. Save with message
git commit -m "added new invoice page"

# 6. Send to GitHub
git push origin main
```

### Other Useful Commands

1. ***See short history of saves***
```
git log --oneline
```
2. ***Undo last commit (but keep your code changes)***
```
git reset --soft HEAD~1
```
3. ***Throw away all unsaved changes (careful!)***
```
git restore .
```
4. ***See what exactly changed in one file***
```
git diff backend/src/index.js
```

### Commit small changes often (every 5–15 minutes) with clear messages.
### It’s like save points in a game — you can always go back if something breaks.

***Start with git status → then add → commit → push — that's the core loop.***


### Making Login Portal Backend

***We have installed following***
1. express, cors, dotenv
2. bcryptjs, jsonwebtoken, joi
3. nodemon (dev)

```
cd backend
npm install express cors dotenv bcryptjs jsonwebtoken joi
npm install --save-dev nodemon
cd ..
```


***Created following Structure***
```
backend/src/
├── config/db.js ***(Connects to PostgreSQL)***
├── controllers/auth.controller.js ***(Password hashing + JWT token generation)***
├── middlewares/validate.js ***(Input validation using Joi)***
├── routes/auth.routes.js ***(Login and Register logic)***
├── utils/auth.js (***Routes (/login and /register))***
└── index.js ***(Main server with security and health check)***

```

***Go to http://localhost:5050 and create database, following table first***

```
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
-- Create a test admin user (password = admin123)
```
INSERT INTO users (username, email, password_hash, full_name, role)
VALUES (
  'admin',
  'admin@schulnetz.local',
  '$2b$12$4p9q8r7s6t5u4v3w2x1y0z9A8B7C6D5E4F3G2H1I0J9K8L7M6N5O4P', -- this is bcrypt hash of "admin123"
  'System Administrator',
  'admin'
);
```
````
http://localhost:4000/api/auth/register

{
  "username": "teacher1",
  "email": "teacher1@schulnetz.local",
  "password": "teacher123",
  "full_name": "Ravi Sharma",
  "role": "teacher"
}

http://localhost:4000/api/auth/login

{
  "email": "admin@schulnetz.local",
  "password": "admin123"
}
```

### Rebuild and Test 

```
docker compose down
rm -rf backend/node_modules
cd backend
npm install
cd ..
docker compose up -d --build backend
```

### If Any Error Happens paste following in terminal

```
docker compose logs backend --tail=40
```

Good luck Hemant!
