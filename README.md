# TeamPulse — Smart Task Team Collaboration Tool
> **Plan. Collaborate. Complete.**

TeamPulse is a full-stack, portfolio-ready collaborative workspace crafted for college project teams, capstones, and agile squads. It combines smart task management, role-based security, live workload balancing, project velocity tracking, audit logs, and deadline calendars into a unified, calm SaaS environment.

---

## 🎨 Design System & Palette

- **Main Background**: `#F3F0EA` (Warm Ivory)
- **Hero & Highlights**: `#E7E1F5` (Dusty Lavender)
- **Cards**: `#FFFCF8` (Soft White)
- **Sidebar & Primary Text**: `#243447` (Deep Slate)
- **Primary Accent**: `#D8A48F` (Muted Terracotta)
- **Success & Completed**: `#A8C3A0` (Sage Green)
- **Secondary Text**: `#6B7280`
- **Borders**: `#E5DED2`
- **Kanban Pastel Columns**:
  - *To Do*: `#EFEBF8` (Lavender Tint)
  - *In Progress*: `#FDF0E9` (Peach / Terracotta Tint)
  - *Review*: `#FAF5E8` (Cream Tint)
  - *Completed*: `#EDF5EB` (Sage Tint)

---

## 🚀 Key Features

1. **Landing Page**:
   - Modern hero section with *"Plan. Collaborate. Complete."* branding.
   - Interactive live dashboard preview mockup.
   - 4-step *"How TeamPulse Works"* walkthrough.
   - One-click *"Explore Demo"* instant access.

2. **Authentication & Roles**:
   - JWT authentication with secure password hashing (`bcryptjs`).
   - Role-based authorization (`Admin`, `Team Leader`, `Member`).
   - Password reveal toggle and instant demo persona switcher in profile menu.

3. **Executive Dashboard**:
   - Dynamic greeting (*"Good morning, Nishashree! 👋 Small steps every day lead to big results."*).
   - 4 key statistics cards (Total, Pending, Completed, Members).
   - **Team Pulse**: Health score, active velocity meter, online member status.
   - **Workload Balancer**: Real-time capacity utilization, overloaded member warnings.
   - **Upcoming Deadlines**: Days-remaining counter (`Due in 2 days`, `Overdue by 1 day`).
   - **Recent Activity**: Live audit feed of all updates.

4. **Interactive Kanban Board**:
   - 4 pastel-tinted columns (*To Do*, *In Progress*, *Review*, *Completed*).
   - HTML5 Drag-and-drop card movement with database status synchronization.
   - Project and priority filters.

5. **My Tasks**:
   - Personal queue filter (*Assigned to Me* vs *All Tasks*).
   - Multi-criteria filtering by priority, status, and project.
   - Sorting by earliest deadline or urgency.

6. **Task Details Modal with Live Comments**:
   - Full description, metadata editor, and one-click status mover.
   - Real-time comment submission thread with author avatar and timestamp.

7. **Team Workspace & Workload Balancer**:
   - Full capacity matrix with `Available` (< 4 tasks), `Balanced` (4–6 tasks), and `Overloaded` (> 6 tasks) badges.
   - Member directory with roles and task counts.
   - Teammate invite modal.

8. **Projects Management**:
   - Project cards with dynamic progress calculation based on task completion.
   - Add/edit/delete project with associated task cleanup.

9. **Calendar & Deadlines**:
   - Monthly grid highlighting task deliverables and project milestone dates.
   - Click-to-inspect task details.

10. **Analytics & Productivity Insights**:
    - Powered by **Recharts**:
      - Task Distribution by Status (Donut Chart)
      - Tasks by Priority (Bar Chart)
      - Team Workload Comparison (Grouped Bar Chart)
      - Weekly Productivity Trend (Area Chart)

---

## 🔑 Demo Personas & Credentials

| Persona | Role | Email | Password | Workload |
|---|---|---|---|---|
| **Nishashree** | Admin / Lead | `nishashree@teampulse.io` | `password123` | Balanced (4 tasks) |
| **Rahul Sharma** | Member | `rahul@teampulse.io` | `password123` | High / Overloaded (8 tasks) |
| **Priya Patel** | Member | `priya@teampulse.io` | `password123` | Available (3 tasks) |
| **Karthik Verma** | Team Leader | `karthik@teampulse.io` | `password123` | Balanced (5 tasks) |

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Recharts, React Router DOM
- **Backend**: Node.js, Express.js, Mongoose ODM
- **Database**: MongoDB (Service on `localhost:27017`)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs

---

## 🏃 Running the Application

### 1. Database & Backend
```powershell
cd server
npm install
npm run seed     # Seeds realistic demo data
npm start        # Runs on http://localhost:5000
```

### 2. Frontend
```powershell
cd client
npm install
npm run dev      # Runs on http://localhost:3000
```

Open `http://localhost:3000` in your web browser to use TeamPulse.
