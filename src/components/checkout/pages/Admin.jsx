// pages/Admin.jsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, DollarSign, Package, 
  TrendingUp, Clock, AlertCircle, CheckCircle 
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import AdminLayout from '../components/layout/AdminLayout';
import StatCard from '../components/admin/StatCard';
import RecentOrders from '../components/admin/RecentOrders';
import TopProducts from '../components/admin/TopProducts';
import './Admin.css';

const Admin = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeUsers: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  const revenueData = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 5000 },
    { month: 'Apr', revenue: 4500 },
    { month: 'May', revenue: 6000 },
    { month: 'Jun', revenue: 5500 },
  ];

  const categoryData = [
    { name: 'Main Course', value: 35, color: '#8884d8' },
    { name: 'Breakfast', value: 20, color: '#82ca9d' },
    { name: 'Desserts', value: 15, color: '#ffc658' },
    { name: 'Beverages', value: 10, color: '#ff8042' },
    { name: 'Snacks', value: 20, color: '#0088fe' },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <div className="loader"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1>Dashboard Overview</h1>
          <div className="date-range">
            Last 30 days
          </div>
        </div>

        <div className="stats-grid">
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={<DollarSign />}
            trend={12.5}
            color="primary"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders.toLocaleString()}
            icon={<Package />}
            trend={8.2}
            color="success"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers.toLocaleString()}
            icon={<Users />}
            trend={5.7}
            color="warning"
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon={<Clock />}
            trend={-2.3}
            color="danger"
          />
        </div>

        <div className="charts-section">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Revenue Overview</h3>
              <TrendingUp />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>Sales by Category</h3>
              <BarChart3 />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="recent-data-section">
          <RecentOrders />
          <TopProducts />
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-btn primary">
              <Package size={20} />
              Add New Product
            </button>
            <button className="action-btn success">
              <Users size={20} />
              Manage Users
            </button>
            <button className="action-btn warning">
              <DollarSign size={20} />
              View Reports
            </button>
            <button className="action-btn danger">
              <AlertCircle size={20} />
              Handle Issues
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};