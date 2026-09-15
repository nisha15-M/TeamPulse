import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { BarChart3, TrendingUp, CheckCircle2, Clock, Layers } from 'lucide-react';
import api from '../api/client';
import StatCard from '../components/dashboard/StatCard';

export const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics');
        if (res.success) {
          setAnalyticsData(res.data);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !analyticsData) {
    return (
      <div className="pulse-card p-12 text-center text-[#6B7280]">
        Loading analytics & insights...
      </div>
    );
  }

  const { summary, statusData, priorityData, projectProgressData, workloadData, weeklyData } =
    analyticsData;

  const STATUS_COLORS = ['#B4A5D9', '#D8A48F', '#F0C987', '#A8C3A0'];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="pulse-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h1 className="text-2xl font-extrabold text-[#243447]">Analytics & Insights</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E7E1F5] text-[#243447]">
              Sprint Intelligence
            </span>
          </div>
          <p className="text-xs text-[#6B7280]">
            Performance metrics, task distribution, project progress, and team workload balance
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold text-[#243447] bg-[#FFFCF8] px-3 py-1.5 rounded-xl border border-[#E5DED2]">
          <TrendingUp className="w-4 h-4 text-[#2F855A]" />
          <span>Velocity: +14% vs last week</span>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Deliverables"
          value={summary.totalTasks}
          subtitle="All logged workspace tasks"
          icon={Layers}
          color="slate"
        />
        <StatCard
          title="Pending In Flight"
          value={summary.pendingTasks}
          subtitle="Actively being worked on"
          icon={Clock}
          color="terracotta"
        />
        <StatCard
          title="Completed Tasks"
          value={summary.completedTasks}
          subtitle="Delivered to completion"
          icon={CheckCircle2}
          color="sage"
        />
        <StatCard
          title="Completion Rate"
          value={`${summary.completionRate}%`}
          subtitle="Milestone fulfillment ratio"
          icon={BarChart3}
          badge={`${summary.completionRate}% Done`}
          color="lavender"
        />
      </div>

      {/* Row 1 Charts: Tasks by Status & Tasks by Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Donut Chart */}
        <div className="pulse-card p-6">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#243447]">Tasks by Status</h3>
            <p className="text-xs text-[#6B7280]">Workflow distribution across Kanban stages</p>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || STATUS_COLORS[index % STATUS_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [`${value} tasks`, props.payload.name]}
                  contentStyle={{
                    backgroundColor: '#FFFCF8',
                    borderColor: '#E5DED2',
                    borderRadius: '0.75rem',
                    color: '#243447',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Status Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-[#E5DED2]">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2 text-xs">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[#6B7280]">{item.name}:</span>
                <span className="font-bold text-[#243447]">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Bar Chart */}
        <div className="pulse-card p-6">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#243447]">Tasks by Priority</h3>
            <p className="text-xs text-[#6B7280]">Urgency allocation across open deliverables</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5DED2" vertical={false} />
                <XAxis dataKey="priority" tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip
                  formatter={(val) => [`${val} tasks`, 'Count']}
                  contentStyle={{
                    backgroundColor: '#FFFCF8',
                    borderColor: '#E5DED2',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#D8A48F" radius={[6, 6, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-[#E5DED2]">
            {priorityData.map((item) => (
              <div key={item.priority} className="flex items-center space-x-2 text-xs">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[#6B7280]">{item.priority}:</span>
                <span className="font-bold text-[#243447]">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 Charts: Team Workload Comparison & Weekly Productivity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Workload Comparison */}
        <div className="pulse-card p-6">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#243447]">Team Workload Comparison</h3>
            <p className="text-xs text-[#6B7280]">Active vs completed task volume per collaborator</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5DED2" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFCF8',
                    borderColor: '#E5DED2',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="activeTasks" name="Active Tasks" fill="#D8A48F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completedTasks" name="Completed" fill="#A8C3A0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center space-x-6 pt-3 border-t border-[#E5DED2] text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[#243447]">
              <span className="w-3 h-3 rounded bg-[#D8A48F]"></span> Active Assigned
            </span>
            <span className="flex items-center gap-1.5 text-[#243447]">
              <span className="w-3 h-3 rounded bg-[#A8C3A0]"></span> Completed Tasks
            </span>
          </div>
        </div>

        {/* Weekly Productivity Trend */}
        <div className="pulse-card p-6">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#243447]">Weekly Productivity Trend</h3>
            <p className="text-xs text-[#6B7280]">Daily velocity and completions over the week</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A8C3A0" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#A8C3A0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5DED2" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFCF8',
                    borderColor: '#E5DED2',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  name="Tasks Done"
                  stroke="#2F855A"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorCompleted)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E5DED2] text-xs text-[#6B7280]">
            <span>Peak Day: Friday (11 completions)</span>
            <span className="font-semibold text-[#2F855A]">Healthy Team Cadence</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
