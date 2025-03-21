'use client'; 
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckSquare, AlertTriangle, Home, Bell, Users, PaintBucket, BarChart, FileText, LogOut } from 'lucide-react';

// Mock data - would be replaced with real backend data in production
const BLOCKS = ['A1', 'A2', 'B1', 'B2'];
const FLOORS = [1, 2, 3, 4, 5];
const UNITS_PER_FLOOR = 4;

const initialAnnouncements = [
  {
    id: 1,
    title: 'Project Web Portal Launch',
    content: 'We are excited to introduce our new web portal designed to streamline the scheduling of balcony painting and other painting-related tasks for your convenience.',
    date: '2025-03-15',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Repainting Project Kickoff',
    content: 'Our community repainting project begins on April 5, 2025. All balconies in blocks A1, A2, B1, and B2 will be repainted according to the schedule.',
    date: '2025-03-15',
    priority: 'high'
  },
  {
    id: 3,
    title: 'Color Selection Deadline',
    content: 'Please submit your color preferences from the approved palette by March 25, 2025. Default colors will be assigned if no selection is made.',
    date: '2025-03-16',
    priority: 'medium'
  },
  {
    id: 4,
    title: 'Block A1 Schedule Update',
    content: 'Block A1 painting will begin on April 5th and continue through April 15th. Please check your individual unit schedule and approve or request reschedule.',
    date: '2025-03-16',
    priority: 'medium'
  },
  {
    id: 5,
    title: 'Rescheduling Notice',
    content: 'We strongly recommend not rescheduling your painting appointment unless absolutely unavoidable to maintain our project timeline.',
    date: '2025-03-17',
    priority: 'medium'
  }
];

const initialActionItems = [
  {
    id: 1,
    title: 'Submit Color Preference',
    description: 'Select your preferred color from the approved palette',
    deadline: '2025-03-25',
    status: 'pending'
  },
  {
    id: 2,
    title: 'Clear Balcony Items',
    description: 'Remove all items from your balcony before your scheduled painting date',
    deadline: 'Before your scheduled date',
    status: 'pending'
  },
  {
    id: 3,
    title: 'Confirm Painting Schedule',
    description: 'Confirm if your assigned painting slot works for you',
    deadline: '48 hours after receiving schedule',
    status: 'pending'
  }
];

// Generate mock painting schedule data
const generateScheduleData = () => {
  const schedule = [];
  const startDate = new Date('2025-04-05');
  
  let id = 1;
  BLOCKS.forEach(block => {
    FLOORS.forEach(floor => {
      for (let unit = 1; unit <= UNITS_PER_FLOOR; unit++) {
        const unitId = `${block}-${floor}${unit.toString().padStart(2, '0')}`;
        const scheduledDate = new Date(startDate);
        scheduledDate.setDate(startDate.getDate() + Math.floor(id / 8));
        
        schedule.push({
          id,
          unitId,
          block,
          floor,
          unit,
          status: Math.random() > 0.7 ? 'completed' : 
                 Math.random() > 0.5 ? 'in-progress' : 
                 Math.random() > 0.3 ? 'scheduled' : 'pending',
          scheduledDate: scheduledDate.toISOString().split('T')[0],
          timeSlot: Math.random() > 0.5 ? 'Morning (9AM-12PM)' : 'Afternoon (2PM-5PM)',
          rescheduleRequested: Math.random() > 0.8,
          residentName: `Resident ${id}`,
          residentContact: `+91 98765 ${10000 + id}`,
          notes: ''
        });
        id++;
      }
    });
  });
  
  return schedule;
};

const initialScheduleData = generateScheduleData();

// Get progress statistics
const getProgressStats = (scheduleData) => {
  const total = scheduleData.length;
  const completed = scheduleData.filter(item => item.status === 'completed').length;
  const inProgress = scheduleData.filter(item => item.status === 'in-progress').length;
  const scheduled = scheduleData.filter(item => item.status === 'scheduled').length;
  const pending = scheduleData.filter(item => item.status === 'pending').length;
  const rescheduled = scheduleData.filter(item => item.rescheduleRequested).length;
  
  return {
    total,
    completed,
    inProgress,
    scheduled,
    pending,
    rescheduled,
    completionPercentage: Math.round((completed / total) * 100)
  };
};

// Block progress
const getBlockProgress = (scheduleData) => {
  return BLOCKS.map(block => {
    const blockUnits = scheduleData.filter(item => item.block === block);
    const completed = blockUnits.filter(item => item.status === 'completed').length;
    const total = blockUnits.length;
    
    return {
      block,
      completed,
      total,
      percentage: Math.round((completed / total) * 100)
    };
  });
};

// Document repository
const documentRepository = [
  {
    id: 1,
    title: 'Project Overview',
    description: 'Complete overview of the VRR NEST repainting project',
    category: 'General',
    fileName: 'VRR_NEST_Repainting_Project_Overview.pdf',
    uploadDate: '2025-03-10'
  },
  {
    id: 2,
    title: 'Approved Color Palette',
    description: 'List of approved colors for balcony repainting',
    category: 'Selection',
    fileName: 'Approved_Color_Palette.pdf',
    uploadDate: '2025-03-12'
  },
  {
    id: 3,
    title: 'Painting Specifications',
    description: 'Technical specifications and quality standards',
    category: 'Technical',
    fileName: 'Painting_Technical_Specifications.pdf',
    uploadDate: '2025-03-14'
  },
  {
    id: 4,
    title: 'Block A1 Schedule',
    description: 'Detailed painting schedule for Block A1',
    category: 'Schedule',
    fileName: 'Block_A1_Schedule.pdf',
    uploadDate: '2025-03-16'
  },
  {
    id: 5,
    title: 'Vendor Information',
    description: 'Information about the painting contractor',
    category: 'Vendor',
    fileName: 'Painting_Vendor_Information.pdf',
    uploadDate: '2025-03-15'
  }
];

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [actionItems, setActionItems] = useState(initialActionItems);
  const [scheduleData, setScheduleData] = useState(initialScheduleData);
  const [userUnit, setUserUnit] = useState('A1-101'); // Mock logged in user
  const [documents, setDocuments] = useState(documentRepository);
  const [isFirstLogin, setIsFirstLogin] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Filter schedule for current user
  const userSchedule = scheduleData.find(item => item.unitId === userUnit);
  
  // Get user's block
  const userBlock = userUnit.split('-')[0];
  
  const progressStats = getProgressStats(scheduleData);
  const blockProgress = getBlockProgress(scheduleData);
  
  // Request reschedule function
  const requestReschedule = (unitId) => {
    setScheduleData(scheduleData.map(item => 
      item.unitId === unitId 
        ? {...item, rescheduleRequested: true, notes: 'Resident requested reschedule'} 
        : item
    ));
  };
  
  // Approve schedule function
  const approveSchedule = (unitId) => {
    setScheduleData(scheduleData.map(item => 
      item.unitId === unitId 
        ? {...item, status: 'scheduled', notes: 'Schedule approved by resident'} 
        : item
    ));
  };
  
  // Mark action item as complete
  const completeActionItem = (id) => {
    setActionItems(actionItems.map(item => 
      item.id === id ? {...item, status: 'completed'} : item
    ));
  };
  
  // Effect to show password modal on first login
  //useEffect(() => {
  //  if (isFirstLogin) {
  //    setShowPasswordModal(false);
  //  }
  // }, [isFirstLogin]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center">
            <PaintBucket className="mr-2" size={24} />
            VRR NEST Repainting Project
          </h1>
          <div className="flex items-center">
            <div className="text-sm mr-4">
              <span className="font-medium">Unit: </span>
              {userUnit}
            </div>
            <button 
              className="bg-blue-700 hover:bg-blue-800 p-2 rounded flex items-center"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>
      
      {/* Display login instructions on component mount */}
      {isFirstLogin && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <span className="font-medium">Welcome to VRR NEST Repainting Project Portal!</span>
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Please change your initial password for added security.
              </p>
              <button 
                className="mt-2 px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* First Login Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <p className="text-gray-600 mb-4">Please change your password for security purposes.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input 
                  type="password" 
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter current password (vrrnestuser)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input 
                  type="password" 
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input 
                  type="password" 
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Confirm new password"
                />
              </div>
              <button 
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                onClick={() => {
                  setShowPasswordModal(false);
                  setIsFirstLogin(false);
                }}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto">
          <ul className="flex overflow-x-auto">
            <li className="flex-shrink-0">
              <button 
                className={`px-4 py-3 text-sm font-medium flex items-center ${activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <BarChart className="mr-2" size={16} />
                Dashboard
              </button>
            </li>
            <li className="flex-shrink-0">
              <button 
                className={`px-4 py-3 text-sm font-medium flex items-center ${activeTab === 'announcements' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('announcements')}
              >
                <Bell className="mr-2" size={16} />
                Announcements
              </button>
            </li>
            <li className="flex-shrink-0">
              <button 
                className={`px-4 py-3 text-sm font-medium flex items-center ${activeTab === 'actionItems' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('actionItems')}
              >
                <CheckSquare className="mr-2" size={16} />
                Action Items
              </button>
            </li>
            <li className="flex-shrink-0">
              <button 
                className={`px-4 py-3 text-sm font-medium flex items-center ${activeTab === 'schedule' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('schedule')}
              >
                <Calendar className="mr-2" size={16} />
                Schedule
              </button>
            </li>
            <li className="flex-shrink-0">
              <button 
                className={`px-4 py-3 text-sm font-medium flex items-center ${activeTab === 'documents' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('documents')}
              >
                <FileText className="mr-2" size={16} />
                Documents
              </button>
            </li>
            <li className="flex-shrink-0">
              <button 
                className={`px-4 py-3 text-sm font-medium flex items-center ${activeTab === 'progress' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('progress')}
              >
                <BarChart className="mr-2" size={16} />
                Project Progress
              </button>
            </li>
          </ul>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="flex-grow overflow-auto p-4">
        <div className="container mx-auto">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Project Overview Section */}
              <div className="bg-blue-50 rounded-lg shadow p-6 border-l-4 border-blue-600">
                <h2 className="text-lg font-semibold mb-2 text-blue-800">Upcoming Project Tasks</h2>
                <p className="text-blue-700 mb-4">Current phase: Block A1 Balcony Painting (April 5 - April 15, 2025)</p>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded mr-3">
                      <Calendar size={18} className="text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-medium">Block A1 Painting</h3>
                      <p className="text-sm text-gray-600">Block A1 residents should prepare their balconies for painting according to the schedule.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded mr-3">
                      <CheckSquare size={18} className="text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-medium">Color Selection Deadline</h3>
                      <p className="text-sm text-gray-600">All residents must submit color preferences by March 25, 2025.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-blue-700 font-medium">Project Documents</p>
                  <button 
                    onClick={() => setActiveTab('documents')}
                    className="mt-2 text-blue-600 text-sm hover:underline flex items-center"
                  >
                    <FileText size={14} className="mr-1" />
                    View all project documents
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* User Schedule Card */}
                <div className="bg-green-50 rounded-lg shadow p-6 border-l-4 border-green-600">
                  <h2 className="text-lg font-semibold mb-4 flex items-center text-green-800">
                    <Calendar className="mr-2" size={20} />
                    Your Balcony Painting Schedule
                  </h2>
                  {userSchedule ? (
                    <div>
                      <p className="font-medium">Unit: {userSchedule.unitId}</p>
                      <p className="text-gray-600 flex items-center mt-2">
                        <Calendar className="mr-2" size={16} />
                        {userSchedule.scheduledDate}
                      </p>
                      <p className="text-gray-600 flex items-center mt-2">
                        <Clock className="mr-2" size={16} />
                        {userSchedule.timeSlot}
                      </p>
                      <div className="mt-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          userSchedule.status === 'completed' ? 'bg-green-100 text-green-800' :
                          userSchedule.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          userSchedule.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {userSchedule.status.charAt(0).toUpperCase() + userSchedule.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        {!userSchedule.rescheduleRequested && userSchedule.status !== 'completed' && (
                          <>
                            <button 
                              onClick={() => approveSchedule(userSchedule.unitId)}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                            >
                              Approve Schedule
                            </button>
                            <button 
                              onClick={() => requestReschedule(userSchedule.unitId)}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            >
                              Request Reschedule
                            </button>
                          </>
                        )}
                      </div>
                      
                      {!userSchedule.rescheduleRequested && userSchedule.status !== 'completed' && (
                        <p className="mt-2 text-xs text-gray-600 italic">
                          We strongly recommend not rescheduling unless absolutely unavoidable.
                        </p>
                      )}
                      
                      {userSchedule.rescheduleRequested && (
                        <p className="mt-4 text-orange-600 text-sm flex items-center">
                          <AlertTriangle className="mr-1" size={14} />
                          Reschedule requested
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">No scheduled tasks for your unit at this time.</p>
                  )}
                </div>
                
                {/* Quick Action Items */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <CheckSquare className="mr-2" size={20} />
                    Action Items
                  </h2>
                  <ul className="space-y-3">
                    {actionItems.filter(item => item.status !== 'completed').slice(0, 3).map(item => (
                      <li key={item.id} className="flex items-start">
                        <input 
                          type="checkbox" 
                          className="mt-1 mr-3"
                          onChange={() => completeActionItem(item.id)}
                        />
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-600">Due: {item.deadline}</p>
                        </div>
                      </li>
                    ))}
                    {actionItems.filter(item => item.status !== 'completed').length === 0 && (
                      <p className="text-gray-500">No pending action items.</p>
                    )}
                  </ul>
                  <button 
                    onClick={() => setActiveTab('actionItems')}
                    className="mt-4 text-blue-600 text-sm hover:underline"
                  >
                    View all action items
                  </button>
                </div>
                
                {/* Block Progress */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <Home className="mr-2" size={20} />
                    Your Block Progress
                  </h2>
                  {blockProgress
                    .filter(block => block.block === userBlock)
                    .map(block => (
                      <div key={block.block}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Block {block.block}</span>
                          <span>{block.percentage}% Complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${block.percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {block.completed} of {block.total} units completed
                        </p>
                      </div>
                    ))}
                </div>
              </div>
              
              {/* Recent Announcements */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold flex items-center">
                    <Bell className="mr-2" size={20} />
                    Recent Announcements
                  </h2>
                  <button 
                    onClick={() => setActiveTab('announcements')}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    View all
                  </button>
                </div>
                <div className="space-y-4">
                  {announcements.slice(0, 3).map(announcement => (
                    <div key={announcement.id} className="border-l-4 border-blue-600 pl-4">
                      <h3 className="font-medium">{announcement.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                      <p className="text-xs text-gray-500 mt-2">{announcement.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Announcements */}
          {activeTab === 'announcements' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Project Announcements</h2>
                <p className="text-sm text-gray-600">Important updates about the repainting project</p>
              </div>
              <div className="divide-y">
                {announcements.map(announcement => (
                  <div key={announcement.id} className="p-6">
                    <div className="flex items-start">
                      <div className={`w-2 h-2 mt-2 rounded-full mr-3 ${
                        announcement.priority === 'high' ? 'bg-red-500' :
                        announcement.priority === 'medium' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}></div>
                      <div>
                        <h3 className="font-medium">{announcement.title}</h3>
                        <p className="text-gray-600 mt-1">{announcement.content}</p>
                        <p className="text-xs text-gray-500 mt-2">{announcement.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Action Items */}
          {activeTab === 'actionItems' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Action Items</h2>
                <p className="text-sm text-gray-600">Tasks to complete for the repainting project</p>
              </div>
              <div>
                {actionItems.map(item => (
                  <div key={item.id} className={`p-6 border-l-4 ${
                    item.status === 'completed' ? 'border-green-500 bg-green-50' : 'border-yellow-500'
                  }`}>
                    <div className="flex items-start">
                      <input 
                        type="checkbox" 
                        className="mt-1 mr-3"
                        checked={item.status === 'completed'}
                        onChange={() => completeActionItem(item.id)}
                      />
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-gray-600 mt-1">{item.description}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          <span className="font-medium">Deadline:</span> {item.deadline}
                        </p>
                        <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status === 'completed' ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Schedule */}
          {activeTab === 'schedule' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Painting Schedule</h2>
                <p className="text-sm text-gray-600">View and manage your unit's painting schedule</p>
              </div>
              
              {/* User's Unit Schedule */}
              <div className="p-6 border-b bg-blue-50">
                <h3 className="font-medium mb-4">Your Unit Schedule</h3>
                {userSchedule ? (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Unit</p>
                        <p className="font-medium">{userSchedule.unitId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-medium">{userSchedule.scheduledDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Time Slot</p>
                        <p className="font-medium">{userSchedule.timeSlot}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                        userSchedule.status === 'completed' ? 'bg-green-100 text-green-800' :
                        userSchedule.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        userSchedule.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {userSchedule.status.charAt(0).toUpperCase() + userSchedule.status.slice(1)}
                      </span>
                    </div>
                    
                    {!userSchedule.rescheduleRequested && userSchedule.status !== 'completed' && (
                      <div className="mt-4">
                        <button 
                          onClick={() => requestReschedule(userSchedule.unitId)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Request Reschedule
                        </button>
                        <p className="text-sm text-gray-600 mt-2">
                          Please request reschedule at least 48 hours in advance
                        </p>
                      </div>
                    )}
                    
                    {userSchedule.rescheduleRequested && (
                      <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded">
                        <p className="text-orange-800 flex items-center">
                          <AlertTriangle className="mr-2" size={16} />
                          You have requested a reschedule for this appointment
                        </p>
                        <p className="text-sm text-orange-700 mt-2">
                          A project coordinator will contact you soon to arrange a new time slot
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">No schedule found for your unit.</p>
                )}
              </div>
              
              {/* Block Schedule */}
              <div className="p-6">
                <h3 className="font-medium mb-4">Block {userBlock} Schedule</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Slot</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {scheduleData
                        .filter(item => item.block === userBlock)
                        .sort((a, b) => a.unitId.localeCompare(b.unitId))
                        .map(item => (
                          <tr key={item.id} className={item.unitId === userUnit ? 'bg-blue-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.unitId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.scheduledDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.timeSlot}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                item.status === 'completed' ? 'bg-green-100 text-green-800' :
                                item.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                item.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                              </span>
                              {item.rescheduleRequested && (
                                <span className="ml-2 text-orange-600 text-xs">
                                  (Reschedule Requested)
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {/* Project Progress */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              {/* Overall Progress */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Overall Project Progress</h2>
                <div className="flex flex-col md:flex-row md:items-end">
                  <div className="flex-grow mb-4 md:mb-0">
                    <div className="flex justify-between mb-1">
                      <span>Completion</span>
                      <span>{progressStats.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-blue-600 h-4 rounded-full" 
                        style={{ width: `${progressStats.completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:ml-8">
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Total Units</p>
                      <p className="text-xl font-semibold">{progressStats.total}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-green-600">Completed</p>
                      <p className="text-xl font-semibold text-green-600">{progressStats.completed}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-blue-600">In Progress</p>
                      <p className="text-xl font-semibold text-blue-600">{progressStats.inProgress}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-orange-600">Rescheduled</p>
                      <p className="text-xl font-semibold text-orange-600">{progressStats.rescheduled}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Block Progress */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Progress by Block</h2>
                <div className="space-y-4">
                  {blockProgress.map(block => (
                    <div key={block.block}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">Block {block.block}</span>
                        <span>{block.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            block.percentage > 75 ? 'bg-green-600' :
                            block.percentage > 50 ? 'bg-blue-600' :
                            block.percentage > 25 ? 'bg-yellow-600' :
                            'bg-red-600'
                          }`}
                          style={{ width: `${block.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {block.completed} of {block.total} units completed
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Timeline */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Project Timeline</h2>
                <div className="relative">
                  <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <div className="space-y-8">
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="rounded-full h-14 w-14 flex items-center justify-center bg-green-100 text-green-600">
                          <CheckSquare size={20} />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium">Project Preparation</h3>
                        <p className="text-sm text-gray-600">March 15 - April 4, 2025</p>
                        <p className="mt-1">Resident notifications, color selection, and scheduling</p>
                        <span className="inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="rounded-full h-14 w-14 flex items-center justify-center bg-blue-100 text-blue-600">
                          <PaintBucket size={20} />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium">Block A1 Painting</h3>
                        <p className="text-sm text-gray-600">April 5 - April 15, 2025</p>
                        <p className="mt-1">Balcony repainting for all units in block A1</p>
                        <span className="inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          In Progress
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="rounded-full h-14 w-14 flex items-center justify-center bg-gray-100 text-gray-600">
                          <PaintBucket size={20} />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium">Block A2 Painting</h3>
                        <p className="text-sm text-gray-600">April 16 - April 26, 2025</p>
                        <p className="mt-1">Balcony repainting for all units in block A2</p>
                        <span className="inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Upcoming
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="rounded-full h-14 w-14 flex items-center justify-center bg-gray-100 text-gray-600">
                          <PaintBucket size={20} />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium">Block B1 Painting</h3>
                        <p className="text-sm text-gray-600">April 27 - May 7, 2025</p>
                        <p className="mt-1">Balcony repainting for all units in block B1</p>
                        <span className="inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Upcoming
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="rounded-full h-14 w-14 flex items-center justify-center bg-gray-100 text-gray-600">
                          <PaintBucket size={20} />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium">Block B2 Painting</h3>
                        <p className="text-sm text-gray-600">May 8 - May 18, 2025</p>
                        <p className="mt-1">Balcony repainting for all units in block B2</p>
                        <span className="inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Upcoming
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="rounded-full h-14 w-14 flex items-center justify-center bg-gray-100 text-gray-600">
                          <CheckSquare size={20} />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium">Quality Inspection & Touch-ups</h3>
                        <p className="text-sm text-gray-600">May 19 - May 25, 2025</p>
                        <p className="mt-1">Final inspection and touch-up work across all blocks</p>
                        <span className="inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Upcoming
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white py-4 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">© 2025 VRR NEST Owners Welfare Association</p>
            <div className="mt-2 md:mt-0">
                              <p className="text-sm text-gray-600">
                For support: <span className="font-medium">support@vrrnest.com</span> | Helpline: <span className="font-medium">+91 XXXXX XXXXX</span>
              </p>
            </div>
          </div>
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-500">
              Portal URL: <a href="https://vrrnestprojects.azurewebsites.net" className="text-blue-600 hover:underline">https://vrrnestprojects.azurewebsites.net</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
