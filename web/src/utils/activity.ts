import collegesData from '../data/colleges.json';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'college' | 'admin';
  collegeName?: string;
  collegeUrl?: string;
  // Student details
  state?: string;
  board12?: string;
  percentage12?: string;
  preferredCourse?: string;
  appStatus?: 'Draft' | 'Applied' | 'Under Review' | 'Accepted' | 'Rejected';
  lastLogin?: string;
}

export interface LoginLog {
  id: string;
  email: string;
  fullName: string;
  role: string;
  timestamp: string;
  collegeName?: string;
}

// Initial mock students for rich demo dashboard experience
const MOCK_STUDENTS: UserProfile[] = [
  {
    id: 'student-1',
    email: 'sayak@kgphustlehouse.com',
    fullName: 'Sayak Das',
    role: 'student',
    state: 'West Bengal',
    board12: 'ISC',
    percentage12: '94%',
    preferredCourse: 'Computer Science & Data Science',
    appStatus: 'Under Review',
    lastLogin: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 mins ago
  },
  {
    id: 'student-2',
    email: 'priya.sharma@gmail.com',
    fullName: 'Priya Sharma',
    role: 'student',
    state: 'Delhi',
    board12: 'CBSE',
    percentage12: '97%',
    preferredCourse: 'Politics, Philosophy, and Economics (PPE)',
    appStatus: 'Accepted',
    lastLogin: new Date(Date.now() - 1000 * 60 * 45).toISOString() // 45 mins ago
  },
  {
    id: 'student-3',
    email: 'aditya.verma@yahoo.com',
    fullName: 'Aditya Verma',
    role: 'student',
    state: 'Karnataka',
    board12: 'State Board',
    percentage12: '88%',
    preferredCourse: 'Biotechnology & Environmental Engineering',
    appStatus: 'Applied',
    lastLogin: new Date(Date.now() - 1000 * 60 * 120).toISOString() // 2 hours ago
  },
  {
    id: 'student-4',
    email: 'rohan.mehta@outlook.com',
    fullName: 'Rohan Mehta',
    role: 'student',
    state: 'Maharashtra',
    board12: 'IB',
    percentage12: '92%',
    preferredCourse: 'Business Administration',
    appStatus: 'Draft',
    lastLogin: new Date(Date.now() - 1000 * 60 * 360).toISOString() // 6 hours ago
  },
  {
    id: 'student-5',
    email: 'sneha.nair@gmail.com',
    fullName: 'Sneha Nair',
    role: 'student',
    state: 'Kerala',
    board12: 'CBSE',
    percentage12: '95%',
    preferredCourse: 'Neuroscience',
    appStatus: 'Accepted',
    lastLogin: new Date(Date.now() - 1000 * 60 * 600).toISOString() // 10 hours ago
  }
];

// Initial mock login logs
const INITIAL_LOGS: LoginLog[] = [
  {
    id: 'log-1',
    email: 'sayak@kgphustlehouse.com',
    fullName: 'Sayak Das',
    role: 'student',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    collegeName: 'Sai University'
  },
  {
    id: 'log-2',
    email: 'priya.sharma@gmail.com',
    fullName: 'Priya Sharma',
    role: 'student',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    collegeName: 'Sai University'
  },
  {
    id: 'log-3',
    email: 'aditya.verma@yahoo.com',
    fullName: 'Aditya Verma',
    role: 'student',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    collegeName: 'Ashoka University'
  },
  {
    id: 'log-4',
    email: 'rohan.mehta@outlook.com',
    fullName: 'Rohan Mehta',
    role: 'student',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    collegeName: 'Sai University'
  }
];

// Initialize localStorage DB
const initDb = () => {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem('unisimplify_users')) {
    localStorage.setItem('unisimplify_users', JSON.stringify(MOCK_STUDENTS));
  }
  
  if (!localStorage.getItem('unisimplify_login_logs')) {
    localStorage.setItem('unisimplify_login_logs', JSON.stringify(INITIAL_LOGS));
  }
};

export const getSimulatedUsers = (): UserProfile[] => {
  if (typeof window === 'undefined') return [];
  initDb();
  try {
    return JSON.parse(localStorage.getItem('unisimplify_users') || '[]');
  } catch (e) {
    return MOCK_STUDENTS;
  }
};

export const saveSimulatedUsers = (users: UserProfile[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('unisimplify_users', JSON.stringify(users));
};

export const getLoginLogs = (): LoginLog[] => {
  if (typeof window === 'undefined') return [];
  initDb();
  try {
    return JSON.parse(localStorage.getItem('unisimplify_login_logs') || '[]');
  } catch (e) {
    return INITIAL_LOGS;
  }
};

export const logLogin = (email: string, fullName: string, role: string, collegeName?: string) => {
  if (typeof window === 'undefined') return;
  initDb();
  const logs = getLoginLogs();
  
  // Clean duplicate recent logins to keep clean overview
  const filtered = logs.filter(l => !(l.email === email && (Date.now() - new Date(l.timestamp).getTime() < 1000 * 60 * 5)));
  
  const newLog: LoginLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    email,
    fullName,
    role,
    timestamp: new Date().toISOString(),
    collegeName
  };
  
  localStorage.setItem('unisimplify_login_logs', JSON.stringify([newLog, ...filtered]));

  // Also update or add to simulated users
  const users = getSimulatedUsers();
  const existingUserIdx = users.findIndex(u => u.email === email);
  if (existingUserIdx > -1) {
    users[existingUserIdx].lastLogin = newLog.timestamp;
    if (role === 'college' && collegeName) {
      users[existingUserIdx].role = 'college';
      users[existingUserIdx].collegeName = collegeName;
    }
    saveSimulatedUsers(users);
  } else {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      fullName,
      role: role as any,
      collegeName,
      lastLogin: newLog.timestamp,
      appStatus: role === 'student' ? 'Applied' : undefined
    };
    users.push(newUser);
    saveSimulatedUsers(users);
  }
};

export const updateUserRole = (
  email: string, 
  role: 'student' | 'college' | 'admin', 
  collegeName?: string, 
  collegeUrl?: string
) => {
  const users = getSimulatedUsers();
  const userIdx = users.findIndex(u => u.email === email);
  
  if (userIdx > -1) {
    users[userIdx].role = role;
    users[userIdx].collegeName = collegeName;
    users[userIdx].collegeUrl = collegeUrl;
    saveSimulatedUsers(users);
  } else {
    // Add user
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      fullName: email.split('@')[0],
      role,
      collegeName,
      collegeUrl,
      lastLogin: new Date().toISOString()
    };
    users.push(newUser);
    saveSimulatedUsers(users);
  }
};
