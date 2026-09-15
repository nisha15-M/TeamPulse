import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Scale,
  BarChart3,
  Calendar,
  Layers,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, demoLogin } = useAuth();

  const handleExploreDemo = async () => {
    await demoLogin('nishashree@teampulse.io');
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F3F0EA] text-[#243447]">
      {/* Navigation */}
      <nav className="border-b border-[#E5DED2] bg-[#FFFCF8]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#D8A48F] flex items-center justify-center text-[#243447] shadow-sm">
              <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-[#243447]">TeamPulse</span>
              <span className="hidden sm:inline text-xs text-[#6B7280] ml-2 pl-2 border-l border-[#E5DED2]">
                Plan. Collaborate. Complete.
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/app/dashboard')}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#243447] text-white text-xs sm:text-sm font-semibold hover:bg-[#1e2c3c] transition-all shadow-sm"
              >
                <span>Go to Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#243447] hover:bg-[#E7E1F5]/50 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={handleExploreDemo}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#D8A48F] text-[#243447] text-xs sm:text-sm font-semibold hover:bg-[#c99580] transition-all shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Explore Demo</span>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#E7E1F5] text-[#243447] text-xs font-semibold mb-6 border border-[#D6BCFA]">
          <span className="w-2 h-2 rounded-full bg-[#A8C3A0] animate-pulse"></span>
          <span>Next-Generation Team Workspace for Capstones & Startups</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#243447] max-w-4xl mx-auto leading-tight">
          Plan. Collaborate. <span className="text-[#D8A48F]">Complete.</span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
          One workspace to organize tasks, balance workloads, and keep your team moving forward with confidence.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#243447] text-white font-bold text-sm hover:bg-[#1e2c3c] shadow-card transition-all flex items-center justify-center space-x-2"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleExploreDemo}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#FFFCF8] border border-[#E5DED2] text-[#243447] font-bold text-sm hover:border-[#D8A48F] hover:bg-[#FFFCF8]/90 shadow-subtle transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-[#D8A48F]" />
            <span>Explore Live Demo</span>
          </button>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl bg-[#FFFCF8] p-4 sm:p-6 shadow-floating border border-[#E5DED2] text-left">
          {/* Top mockup bar */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5DED2]">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-[#F5C6CB]"></span>
              <span className="w-3 h-3 rounded-full bg-[#F6E05E]"></span>
              <span className="w-3 h-3 rounded-full bg-[#C6F6D5]"></span>
              <span className="ml-3 text-xs font-semibold text-[#6B7280]">
                teampulse.io/app/workspace
              </span>
            </div>
            <span className="text-xs font-bold text-[#243447] bg-[#EDF5EB] text-[#22543D] px-2.5 py-0.5 rounded-full">
              Live Preview
            </span>
          </div>

          {/* Inner mockup dashboard preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Stat 1 */}
            <div className="p-4 rounded-xl bg-[#F3F0EA]/70 border border-[#E5DED2]">
              <span className="text-[11px] font-semibold text-[#6B7280] uppercase">Active Tasks</span>
              <div className="text-2xl font-bold text-[#243447] mt-1">24 Tasks</div>
              <div className="text-xs text-[#2F855A] font-semibold mt-1">82% on schedule</div>
            </div>

            {/* Stat 2 */}
            <div className="p-4 rounded-xl bg-[#E7E1F5]/40 border border-[#D6BCFA]/60">
              <span className="text-[11px] font-semibold text-[#6B7280] uppercase">Workload Status</span>
              <div className="text-2xl font-bold text-[#243447] mt-1">Balanced</div>
              <div className="text-xs text-[#6B7280] font-semibold mt-1">4 active teammates</div>
            </div>

            {/* Stat 3 */}
            <div className="p-4 rounded-xl bg-[#FDF0E9]/60 border border-[#FBD38D]/60">
              <span className="text-[11px] font-semibold text-[#6B7280] uppercase">Next Milestone</span>
              <div className="text-2xl font-bold text-[#243447] mt-1">CampusAI Beta</div>
              <div className="text-xs text-[#C05621] font-semibold mt-1">Due in 3 days</div>
            </div>
          </div>

          {/* Mockup Kanban snippet */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
            {[
              { col: 'To Do', color: 'bg-[#EFEBF8]', count: 3 },
              { col: 'In Progress', color: 'bg-[#FDF0E9]', count: 6 },
              { col: 'Review', color: 'bg-[#FAF5E8]', count: 2 },
              { col: 'Completed', color: 'bg-[#EDF5EB]', count: 4 },
            ].map((c) => (
              <div key={c.col} className={`p-3 rounded-xl border border-[#E5DED2] ${c.color}`}>
                <div className="flex justify-between items-center text-xs font-bold text-[#243447] mb-2">
                  <span>{c.col}</span>
                  <span className="text-[10px] bg-white/80 px-1.5 py-0.5 rounded-full">{c.count}</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-[#E5DED2]/80 text-[11px] font-medium text-[#243447] shadow-sm">
                  Feature Implementation
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How TeamPulse Works Section */}
      <section className="py-16 bg-[#FFFCF8] border-y border-[#E5DED2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243447]">
              How TeamPulse Works
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#6B7280]">
              A frictionless 4-step workflow tailored for engineering capstones, student clubs, and agile squads.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Create a Workspace',
                desc: 'Organize your team members with defined roles (Admin, Leader, Member) and invite classmates seamlessly.',
                icon: Users,
              },
              {
                step: '02',
                title: 'Assign Tasks & Deadlines',
                desc: 'Break projects down into bite-sized actionable deliverables with explicit due dates and priorities.',
                icon: CheckCircle2,
              },
              {
                step: '03',
                title: 'Track Workload & Progress',
                desc: 'Keep an eye on individual member capacities to prevent bottlenecks, burnouts, and unassigned tasks.',
                icon: Scale,
              },
              {
                step: '04',
                title: 'Complete Projects on Time',
                desc: 'Collaborate with comments, drag cards across Kanban columns, and ship with high velocity.',
                icon: Sparkles,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="p-6 rounded-2xl bg-[#F3F0EA]/50 border border-[#E5DED2] relative hover:border-[#D8A48F] transition-colors"
                >
                  <span className="text-2xl font-black text-[#D8A48F] font-mono block mb-3">
                    {item.step}
                  </span>
                  <div className="p-2.5 rounded-xl bg-white w-fit border border-[#E5DED2] mb-3 text-[#243447]">
                    <Icon className="w-5 h-5 text-[#243447]" />
                  </div>
                  <h3 className="text-base font-bold text-[#243447] mb-2">{item.title}</h3>
                  <p className="text-xs text-[#6B7280] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D8A48F]">
            Core Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243447] mt-1">
            Built to Empower Every Team Member
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-2xl bg-[#FFFCF8] border border-[#E5DED2] shadow-subtle hover:shadow-card transition-all">
            <div className="p-3 rounded-xl bg-[#E7E1F5] w-fit mb-4 text-[#243447]">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#243447] mb-2">Smart Task Management</h3>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Interactive Kanban board with pastel column tints, quick status switching, live comments, due date reminders, and priority flags to keep everyone in sync.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-2xl bg-[#FFFCF8] border border-[#E5DED2] shadow-subtle hover:shadow-card transition-all">
            <div className="p-3 rounded-xl bg-[#FDF0E9] w-fit mb-4 text-[#D8A48F]">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#243447] mb-2">Real-Time Workload Balance</h3>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Transparent capacity tracking. Automatically identifies overloaded vs available members with clean visual meters so leaders can rebalance work fairly.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-2xl bg-[#FFFCF8] border border-[#E5DED2] shadow-subtle hover:shadow-card transition-all">
            <div className="p-3 rounded-xl bg-[#EDF5EB] w-fit mb-4 text-[#2F855A]">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#243447] mb-2">Team Collaboration & Activity</h3>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Complete audit trail of actions: task assignments, status shifts, comments, and project milestones. See active members online status in real-time.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-8 rounded-2xl bg-[#FFFCF8] border border-[#E5DED2] shadow-subtle hover:shadow-card transition-all">
            <div className="p-3 rounded-xl bg-[#FAF5E8] w-fit mb-4 text-[#975A16]">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#243447] mb-2">Project Insights & Analytics</h3>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Beautiful charts visualizing task distribution by status, priority breakdown, completion percentages, and team velocity without clutter.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#243447] text-white py-12 border-t border-[#2d425a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#D8A48F] flex items-center justify-center text-[#243447] font-bold">
              <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold">TeamPulse</span>
              <p className="text-xs text-gray-400">Smart Task Team Collaboration Tool</p>
            </div>
          </div>

          <div className="text-xs text-gray-400 text-center sm:text-right">
            <p>© 2026 TeamPulse Workspace. Plan. Collaborate. Complete.</p>
            <p className="mt-1 text-gray-500">Crafted with React, Node.js, Express & MongoDB</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
