# Self-Hosting the App

If the main website is down, don’t worry — you can still run the app locally!

## How to Set It Up

### Step 1:  Clone or Download the Project

#### Option A: Using Git (for developers)
If you know how to use Git, you can clone the project like this:
```bash
git clone https://github.com/lezzthanthree/SEKAI-Stories.git
```

#### Option B: Manual Download (for everyone)
Go to the repository:  
 https://github.com/lezzthanthree/SEKAI-Stories  

Click the green **Code** button and choose **Download ZIP**.  
Once downloaded, unzip it to a folder.

![](/public/img/step-1.png)

---

### Step 2: Install Node.js

The app runs on Node.js, so you’ll need to install it first.

#### Option A: Direct Install  
Go to [nodejs.org](https://nodejs.org/en) and download the latest stable version for your system.

![](/public/img/step-2.png)

#### Option B: Using nvm (for advanced users)
If you're using **nvm** (Node Version Manager), run:
```bash
nvm install 23.11.0
```

---

### Step 3: Install Required Packages

Once you have the files and Node.js ready:

1. Open a terminal or command prompt.
2. Navigate to the project folder.
   ```bash
   cd path/to/SEKAI-Stories
   ```
3. Install the necessary packages:
   ```bash
   npm install
   ```
4. Run the project!
   ```bash
   npm run dev
   ```

![](/public/img/step-3.png)
