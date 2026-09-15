const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Team = require('./models/Team');
const Project = require('./models/Project');
const Task = require('./models/Task');
const Activity = require('./models/Activity');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/teampulse');
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Team.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();
    await Activity.deleteMany();

    console.log('Cleared existing database records.');

    // 1. Create Users
    const nishashree = await User.create({
      name: 'Nishashree',
      email: 'nishashree@teampulse.io',
      password: 'password123',
      role: 'Admin',
      title: 'Lead Full-Stack Developer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'online',
    });

    const rahul = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@teampulse.io',
      password: 'password123',
      role: 'Member',
      title: 'Backend & Cloud Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'online',
    });

    const priya = await User.create({
      name: 'Priya Patel',
      email: 'priya@teampulse.io',
      password: 'password123',
      role: 'Member',
      title: 'UI/UX & Design Systems',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      status: 'online',
    });

    const karthik = await User.create({
      name: 'Karthik Verma',
      email: 'karthik@teampulse.io',
      password: 'password123',
      role: 'Team Leader',
      title: 'DevOps & Architect',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      status: 'away',
    });

    console.log('Users created.');

    // 2. Create Team
    const team = await Team.create({
      name: 'Pulse Engineering Core',
      description: 'Cross-functional engineering and design team building college capstone and startup prototypes.',
      owner: nishashree._id,
      members: [
        { user: nishashree._id, role: 'Admin' },
        { user: karthik._id, role: 'Team Leader' },
        { user: rahul._id, role: 'Member' },
        { user: priya._id, role: 'Member' },
      ],
    });

    console.log('Team created.');

    // 3. Create Projects
    const now = new Date();
    const addDays = (d, days) => new Date(d.getTime() + days * 24 * 60 * 60 * 1000);

    const project1 = await Project.create({
      name: 'CampusAI Portal',
      description: 'An AI-powered academic advisor and study planner for campus students.',
      team: team._id,
      members: [nishashree._id, rahul._id, priya._id, karthik._id],
      deadline: addDays(now, 18),
      status: 'In Progress',
      color: '#D8A48F',
      createdBy: nishashree._id,
    });

    const project2 = await Project.create({
      name: 'FinTech Capstone',
      description: 'Micro-savings app with gamified budget challenges and UPI integration.',
      team: team._id,
      members: [nishashree._id, rahul._id, priya._id],
      deadline: addDays(now, 26),
      status: 'In Progress',
      color: '#A8C3A0',
      createdBy: karthik._id,
    });

    const project3 = await Project.create({
      name: 'EcoTrack Mobile',
      description: 'Campus sustainability tracker with food waste logging and recycling points.',
      team: team._id,
      members: [nishashree._id, karthik._id, rahul._id],
      deadline: addDays(now, 35),
      status: 'Planning',
      color: '#E7E1F5',
      createdBy: nishashree._id,
    });

    console.log('Projects created.');

    // 4. Create Tasks
    // Workload distribution target:
    // Rahul: 8 active tasks (High / Overloaded)
    // Nishashree: 4 active tasks (Balanced)
    // Karthik: 5 active tasks (Balanced)
    // Priya: 3 active tasks (Available)
    // Plus several Completed tasks to show real progress!

    const tasksData = [
      // --- Rahul's Tasks (8 active tasks -> High workload) ---
      {
        title: 'Design REST API architecture for Course Recommendations',
        description: 'Define OpenAPI specifications, rate limiting endpoints, and error serialization.',
        project: project1._id,
        team: team._id,
        assignedTo: rahul._id,
        createdBy: nishashree._id,
        priority: 'High',
        status: 'In Progress',
        dueDate: addDays(now, 2),
        comments: [
          { user: nishashree._id, text: 'Please ensure JWT claims include student university ID.', createdAt: addDays(now, -1) },
          { user: rahul._id, text: 'Working on Swagger documentation right now.', createdAt: now },
        ],
      },
      {
        title: 'Set up Redis caching for frequent catalog queries',
        description: 'Cache course listings and student elective status with a 15-minute TTL.',
        project: project1._id,
        team: team._id,
        assignedTo: rahul._id,
        createdBy: karthik._id,
        priority: 'Medium',
        status: 'To Do',
        dueDate: addDays(now, 5),
        comments: [],
      },
      {
        title: 'Implement UPI Payment Webhook receiver',
        description: 'Handle instant bank settlement notifications and update transaction state safely.',
        project: project2._id,
        team: team._id,
        assignedTo: rahul._id,
        createdBy: nishashree._id,
        priority: 'Urgent',
        status: 'In Progress',
        dueDate: addDays(now, 1),
        comments: [
          { user: priya._id, text: 'Frontend payment response modal is ready for integration.', createdAt: addDays(now, -2) },
        ],
      },
      {
        title: 'Database indexing optimization for transaction ledgers',
        description: 'Create compound indexes on (accountId, createdAt) for sub-50ms statements.',
        project: project2._id,
        team: team._id,
        assignedTo: rahul._id,
        createdBy: karthik._id,
        priority: 'High',
        status: 'Review',
        dueDate: addDays(now, 3),
        comments: [],
      },
      {
        title: 'Build scheduled cron job for automated daily interest',
        description: 'Runs midnight UTC to calculate micro-savings yield on balance tiers.',
        project: project2._id,
        team: team._id,
        assignedTo: rahul._id,
        createdBy: rahul._id,
        priority: 'Medium',
        status: 'To Do',
        dueDate: addDays(now, 7),
        comments: [],
      },
      {
        title: 'Configure AWS S3 bucket for student document uploads',
        description: 'Set up signed pre-upload URLs with 5MB file restrictions and antivirus scan hook.',
        project: project1._id,
        team: team._id,
        assignedTo: rahul._id,
        createdBy: nishashree._id,
        priority: 'Medium',
        status: 'To Do',
        dueDate: addDays(now, 8),
        comments: [],
      },
      {
        title: 'Implement OAuth2 integration with University SSO',
        description: 'SAML / OAuth2 bridge with campus directory for single sign-on authentication.',
        project: project1._id,
        team: team._id,
        assignedTo: rahul._id,
        createdBy: karthik._id,
        priority: 'High',
        status: 'In Progress',
        dueDate: addDays(now, 4),
        comments: [],
      },
      {
        title: 'EcoTrack telemetry ingestion microservice',
        description: 'Lightweight listener for campus smart-bin sensor data payloads.',
        project: project3._id,
        team: team._id,
        assignedTo: rahul._id,
        createdBy: nishashree._id,
        priority: 'Low',
        status: 'To Do',
        dueDate: addDays(now, 12),
        comments: [],
      },

      // --- Nishashree's Tasks (4 active tasks -> Balanced workload) ---
      {
        title: 'Architect Main Application Dashboard & Layout',
        description: 'Develop responsive navigation, high-contrast palette, and top statistics cards.',
        project: project1._id,
        team: team._id,
        assignedTo: nishashree._id,
        createdBy: nishashree._id,
        priority: 'Urgent',
        status: 'In Progress',
        dueDate: addDays(now, 1),
        comments: [
          { user: priya._id, text: 'Palette tokens matched nicely with the Warm Ivory identity!', createdAt: now },
        ],
      },
      {
        title: 'Implement Workload Balancer & Real-time Pulse metrics',
        description: 'Calculate member capacity metrics and render visual workload bars.',
        project: project1._id,
        team: team._id,
        assignedTo: nishashree._id,
        createdBy: nishashree._id,
        priority: 'High',
        status: 'In Progress',
        dueDate: addDays(now, 3),
        comments: [],
      },
      {
        title: 'Design Interactive Kanban Task Board with Drag & Drop',
        description: 'Four pastel-tinted columns with smooth drop zones and status persistence.',
        project: project1._id,
        team: team._id,
        assignedTo: nishashree._id,
        createdBy: nishashree._id,
        priority: 'High',
        status: 'To Do',
        dueDate: addDays(now, 4),
        comments: [],
      },
      {
        title: 'Prepare Final Capstone Presentation & System Architecture Deck',
        description: 'Comprehensive slides detailing tech stack, performance metrics, and demo scenarios.',
        project: project2._id,
        team: team._id,
        assignedTo: nishashree._id,
        createdBy: nishashree._id,
        priority: 'Medium',
        status: 'To Do',
        dueDate: addDays(now, 14),
        comments: [],
      },

      // --- Karthik's Tasks (5 active tasks -> Balanced workload) ---
      {
        title: 'Set up Docker container orchestration & CI/CD pipeline',
        description: 'GitHub Actions workflow to test, build multi-stage Docker image and deploy.',
        project: project1._id,
        team: team._id,
        assignedTo: karthik._id,
        createdBy: karthik._id,
        priority: 'Urgent',
        status: 'In Progress',
        dueDate: addDays(now, 2),
        comments: [],
      },
      {
        title: 'Configure Prometheus and Grafana monitoring metrics',
        description: 'Track node memory, API latency percentiles, and database connection pool stats.',
        project: project1._id,
        team: team._id,
        assignedTo: karthik._id,
        createdBy: karthik._id,
        priority: 'Medium',
        status: 'To Do',
        dueDate: addDays(now, 6),
        comments: [],
      },
      {
        title: 'Set up HTTPS SSL Certificates & Nginx reverse proxy',
        description: 'Automate Let’s Encrypt renewal and enforce strict transport security.',
        project: project2._id,
        team: team._id,
        assignedTo: karthik._id,
        createdBy: nishashree._id,
        priority: 'High',
        status: 'Review',
        dueDate: addDays(now, 3),
        comments: [],
      },
      {
        title: 'Database automated backup & disaster recovery drill',
        description: 'Daily compressed dump to cold storage with verify-restore script.',
        project: project2._id,
        team: team._id,
        assignedTo: karthik._id,
        createdBy: karthik._id,
        priority: 'Medium',
        status: 'To Do',
        dueDate: addDays(now, 9),
        comments: [],
      },
      {
        title: 'EcoTrack IoT gateway firmware setup',
        description: 'Flash ESP32 devices with MQTT client publishing sensor packets.',
        project: project3._id,
        team: team._id,
        assignedTo: karthik._id,
        createdBy: karthik._id,
        priority: 'Low',
        status: 'To Do',
        dueDate: addDays(now, 15),
        comments: [],
      },

      // --- Priya's Tasks (3 active tasks -> Available workload) ---
      {
        title: 'Design Mobile Responsive Component System in Figma & Tailwind',
        description: 'Craft cards, modals, form inputs, and responsive typography scales.',
        project: project1._id,
        team: team._id,
        assignedTo: priya._id,
        createdBy: nishashree._id,
        priority: 'High',
        status: 'Review',
        dueDate: addDays(now, 1),
        comments: [
          { user: nishashree._id, text: 'The cards look really elegant with the soft white elevation.', createdAt: addDays(now, -1) },
        ],
      },
      {
        title: 'Create Empty State Illustrations & Micro-interactions',
        description: 'Design friendly SVG icons and subtle states for zero-task views.',
        project: project1._id,
        team: team._id,
        assignedTo: priya._id,
        createdBy: priya._id,
        priority: 'Medium',
        status: 'In Progress',
        dueDate: addDays(now, 5),
        comments: [],
      },
      {
        title: 'Conduct User Usability Testing with 5 College Students',
        description: 'Observe navigation flow through Kanban board and task deadline filters.',
        project: project2._id,
        team: team._id,
        assignedTo: priya._id,
        createdBy: nishashree._id,
        priority: 'Low',
        status: 'To Do',
        dueDate: addDays(now, 10),
        comments: [],
      },

      // --- Completed Tasks (To show realistic completion rates) ---
      {
        title: 'Initialize MongoDB Schema & Connection Pool',
        description: 'Configure Mongoose connection, retry logic, and strict index validation.',
        project: project1._id,
        team: team._id,
        assignedTo: karthik._id,
        createdBy: nishashree._id,
        priority: 'High',
        status: 'Completed',
        dueDate: addDays(now, -3),
        comments: [
          { user: nishashree._id, text: 'Great job, database is running smoothly.', createdAt: addDays(now, -3) },
        ],
      },
      {
        title: 'Design Login & Registration Pages',
        description: 'Build JWT auth interface with password reveal toggles and clean input styling.',
        project: project1._id,
        team: team._id,
        assignedTo: priya._id,
        createdBy: nishashree._id,
        priority: 'High',
        status: 'Completed',
        dueDate: addDays(now, -4),
        comments: [
          { user: priya._id, text: 'Design login page finalized with warm ivory branding.', createdAt: addDays(now, -4) },
        ],
      },
      {
        title: 'Setup Express Router & Middleware Boilerplate',
        description: 'Mount authentication verification, cors handling, and centralized error middleware.',
        project: project1._id,
        team: team._id,
        assignedTo: rahul._id,
        createdBy: nishashree._id,
        priority: 'High',
        status: 'Completed',
        dueDate: addDays(now, -5),
        comments: [],
      },
      {
        title: 'Define Project Charter and Milestone Goals',
        description: 'Finalize core capstone objectives, student roles, and evaluation criteria.',
        project: project2._id,
        team: team._id,
        assignedTo: nishashree._id,
        createdBy: nishashree._id,
        priority: 'Medium',
        status: 'Completed',
        dueDate: addDays(now, -7),
        comments: [],
      },
    ];

    const createdTasks = await Task.insertMany(tasksData);
    console.log(`${createdTasks.length} Tasks seeded.`);

    // 5. Seed Activities (matching the exact examples in prompt!)
    const activitiesData = [
      {
        user: priya._id,
        action: 'commented_task',
        details: 'Priya commented on Design Login Page',
        task: createdTasks[21]._id,
        project: project1._id,
        team: team._id,
        createdAt: addDays(now, -0.05),
      },
      {
        user: rahul._id,
        action: 'updated_task',
        details: 'Rahul moved API Integration to In Progress',
        task: createdTasks[0]._id,
        project: project1._id,
        team: team._id,
        createdAt: addDays(now, -0.2),
      },
      {
        user: karthik._id,
        action: 'completed_task',
        details: 'Karthik completed Database Setup',
        task: createdTasks[20]._id,
        project: project1._id,
        team: team._id,
        createdAt: addDays(now, -0.5),
      },
      {
        user: nishashree._id,
        action: 'created_task',
        details: 'Nishashree created task "Architect Main Application Dashboard & Layout"',
        task: createdTasks[8]._id,
        project: project1._id,
        team: team._id,
        createdAt: addDays(now, -1),
      },
      {
        user: nishashree._id,
        action: 'created_project',
        details: 'Nishashree created project "CampusAI Portal"',
        project: project1._id,
        team: team._id,
        createdAt: addDays(now, -3),
      },
      {
        user: rahul._id,
        action: 'joined_team',
        details: 'Rahul Sharma joined team "Pulse Engineering Core"',
        team: team._id,
        createdAt: addDays(now, -5),
      },
    ];

    await Activity.insertMany(activitiesData);
    console.log('Activities seeded.');

    console.log('--- DATABASE SEEDING COMPLETED SUCCESSFULLY! ---');
    console.log('Demo Credentials:');
    console.log('Admin:       nishashree@teampulse.io / password123');
    console.log('Member:      rahul@teampulse.io      / password123');
    console.log('Member:      priya@teampulse.io      / password123');
    console.log('Team Leader: karthik@teampulse.io    / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
