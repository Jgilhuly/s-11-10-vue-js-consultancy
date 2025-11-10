import express from 'express';
import { consultationRequests } from './contact.js';
import { services } from './services.js';
import { team } from './team.js';

const router = express.Router();

// Mock user data (MVP approach - no authentication system yet)
const mockUser = {
  id: 1,
  name: "Admin User",
  email: "admin@neuralink-ai.com",
  role: "Admin",
  avatar: "AU"
};

// GET /api/dashboard - Get dashboard data
router.get('/', async (req, res) => {
  try {
    // Get consultation requests from shared data
    const consultationRequestsData = consultationRequests || [];
    
    // Calculate metrics
    const totalServices = services.length;
    const activeTeamMembers = team.length;
    const totalConsultations = consultationRequestsData.length;
    const pendingConsultations = consultationRequestsData.filter(
      req => req.status === 'pending'
    ).length;
    
    // Calculate response rate (if we have responded consultations)
    const respondedConsultations = consultationRequestsData.filter(
      req => req.status === 'responded' || req.status === 'completed'
    ).length;
    const responseRate = totalConsultations > 0 
      ? Math.round((respondedConsultations / totalConsultations) * 100) 
      : 0;
    
    // Get recent activity (last 5 items)
    const recentActivity = consultationRequestsData
      .slice(-5)
      .reverse()
      .map(req => ({
        id: req.id,
        type: 'consultation',
        title: `New consultation request from ${req.name}`,
        timestamp: req.timestamp
      }));
    
    res.json({
      user: mockUser,
      metrics: {
        totalServices,
        activeTeamMembers,
        totalConsultations,
        pendingConsultations,
        responseRate
      },
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch dashboard data'
    });
  }
});

export default router;

