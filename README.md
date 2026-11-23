# MCA Study Planner

A React mini project for organising subjects, assignments, exams, labs and
revision. The dashboard starts with three example tasks. You can add subjects,
add or edit tasks and their due dates, filter by subject or status, mark tasks
complete, and delete tasks. Pending tasks are shown first, sorted by due date.

## 1. Open the source code

Extract **MCA_Study_Planner_React.zip**. In VS Code, choose **File → Open
Folder** and select **mca-study-planner**. Check for package.json in Explorer.
Open **Terminal → New Terminal** in VS Code.

## 2. Run the project on your laptop

Use Node.js 22.12+ on the Node 22 line or Node.js 24. Run each command from the
folder that contains package.json.

```bash
node -v
npm install
npm run dev
```

Open the Local URL shown in the terminal, usually http://localhost:5173.
Leave the terminal running while you use the app. Press Ctrl+C to stop it.
If npm cannot find package.json, reopen the inner mca-study-planner folder.

## 3. Understand the code

| File | Purpose |
| --- | --- |
| index.html | Sets the page title and provides the root element. |
| src/main.jsx | Mounts the React app and imports the styles. |
| src/App.jsx | Contains the subject form, task form, task list, filters and dashboard. |
| src/planner.js | Provides sample data, date functions and browser storage functions. |
| src/styles.css | Styles the dashboard for laptop and phone screens. |
| package.json | Lists dependencies and npm scripts. |

When a task is added or changed, React's useState updates the list. The
dashboard calculates counts and progress from that list, and useEffect saves
the subjects and tasks to localStorage. When the app opens, it reads the
saved data or loads example tasks for a new browser. Browser storage is
separate for each site URL and browser profile.

## 4. Check the production build

```bash
npm run build
```

Vite generates a dist folder. You can optionally run npm run preview and
open its Local URL to check the production output.

## 5. Publish to GitHub using VS Code

1. Open **Source Control** in the sidebar and click **Initialize Repository**
   if the folder is new to Git.
2. Click the plus next to **Changes** to stage the source files.
3. Enter a commit message such as **Build MCA Study Planner** and click **Commit**.
4. Click **Publish Branch** or **Publish to GitHub**, sign in when prompted,
   and publish the repository as **mca-study-planner**.
5. Open the GitHub repository and check that package.json and src are visible.

## 6. Deploy to Vercel

1. Open https://vercel.com/new and connect your GitHub account.
2. Find **mca-study-planner** and click **Import**.
3. Use the **Vite** framework preset. The root directory is the folder
   containing package.json. Leave the default if package.json appears at the
   top level of the repository.
4. Use **npm run build** as the build command and **dist** as the output
   directory. The project requires no environment variables or database.
5. Click **Deploy**, then open and copy the resulting .vercel.app URL.

See the [Vercel Git deployment guide](https://vercel.com/docs/git) and
[Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite).

## 7. Demonstrate the project

1. Add **Database Management** under Subjects.
2. Add **Prepare SQL joins notes** under that subject. Choose **Revision**
   and enter a future due date.
3. Select Database Management in the subject filter.
4. Tick the task checkbox. Show how the Completed count and progress change.
5. Filter by **Completed** and refresh the page to verify the task was saved.
6. Capture the dashboard with the Vercel URL visible for your assignment.
