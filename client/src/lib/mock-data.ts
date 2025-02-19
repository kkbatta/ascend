export const hierarchyMetrics = {
  personal: {
    teamSize: 45,
    monthlyRevenue: 95000,
    newRecruits: 12,
    teamProduction: 450000
  },
  baseShop: {
    teamSize: 285,
    monthlyRevenue: 568000,
    newRecruits: 45,
    teamProduction: 2876000
  },
  rmdBase: {
    teamSize: 1250,
    monthlyRevenue: 2485000,
    newRecruits: 142,
    teamProduction: 12450000
  },
  superBase: {
    teamSize: 5200,
    monthlyRevenue: 8850000,
    newRecruits: 465,
    teamProduction: 48800000
  }
};

export const hierarchyData = {
  personal: [
    {
      id: 1,
      name: 'Thomas Anderson',
      location: 'Phoenix, AZ',
      rank: 'EFC',
      rv: 7.8,
      production: 125000,
      recruits: 8,
      teamSize: 45,
      avatarUrl: "/api/placeholder/48/48?text=TA"
    },
    {
      id: 2,
      name: 'Sarah Connor',
      location: 'Seattle, WA',
      rank: 'TA',
      rv: 6.5,
      production: 98000,
      recruits: 5,
      teamSize: 28,
      avatarUrl: "/api/placeholder/48/48?text=SC"
    }
  ],
  baseShop: [
    {
      id: 1,
      name: 'James Wilson',
      location: 'Chicago, IL',
      rank: 'RMD',
      rv: 9.2,
      production: 950000,
      recruits: 32,
      teamSize: 285,
      avatarUrl: "/api/placeholder/48/48?text=JW"
    }
  ],
  rmdBase: [
    {
      id: 1,
      name: 'Elizabeth Chen',
      location: 'San Francisco, CA',
      rank: 'SMD',
      rv: 12.5,
      production: 2850000,
      recruits: 85,
      teamSize: 1250,
      avatarUrl: "/api/placeholder/48/48?text=EC"
    }
  ],
  superBase: [
    {
      id: 1,
      name: 'Robert Martinez',
      location: 'Miami, FL',
      rank: 'NMD',
      rv: 15.8,
      production: 8500000,
      recruits: 145,
      teamSize: 5200,
      avatarUrl: "/api/placeholder/48/48?text=RM"
    }
  ]
};

export const businessValueData = [
  { month: 'Jan', actual: 85000, target: 100000, projected: 95000 },
  { month: 'Feb', actual: 92000, target: 105000, projected: 98000 },
  { month: 'Mar', actual: 108000, target: 110000, projected: 112000 },
  { month: 'Apr', actual: 115000, target: 115000, projected: 118000 },
  { month: 'May', actual: 125000, target: 120000, projected: 128000 },
  { month: 'Jun', actual: 135000, target: 125000, projected: 138000 }
];

export const currentUser = {
  name: "Rajitha",
  role: "Team Lead",
  avatarUrl: "/api/placeholder/40/40?text=RT"
};

export const navItems = [
  { icon: 'BarChart3', label: 'Dashboard', active: true },
  { icon: 'FileText', label: 'Business' },
  { icon: 'Users', label: 'Associates' },
  { icon: 'Target', label: 'HGI Direct' },
  { icon: 'TrendingUp', label: 'Reports' },
  { icon: 'MessageSquare', label: 'Marketing' },
  { icon: 'BookOpen', label: 'Resources' },
  { icon: 'HelpCircle', label: 'Help Center' }
];

export const prospects = [
  {
    id: 1,
    name: 'Michael Chen',
    age: 42,
    occupation: 'Small Business Owner',
    familyStatus: 'Married with 2 kids (ages 8 and 10)',
    income: 120000,
    goals: ['Business protection', 'Children\'s education', 'Retirement planning'],
    riskTolerance: 'Moderate',
    currentInvestments: ['401k', 'Real estate']
  },
  {
    id: 2,
    name: 'Sarah Rodriguez',
    age: 58,
    occupation: 'Senior Manager',
    familyStatus: 'Single',
    income: 150000,
    goals: ['Retirement security', 'Estate planning', 'Tax optimization'],
    riskTolerance: 'Conservative',
    currentInvestments: ['Company pension', 'Stock portfolio']
  },
  {
    id: 3,
    name: 'David Kim',
    age: 35,
    occupation: 'Software Engineer',
    familyStatus: 'Married, expecting first child',
    income: 135000,
    goals: ['Family protection', 'Long-term savings', 'Future college fund'],
    riskTolerance: 'Aggressive',
    currentInvestments: ['Tech company RSUs', 'Cryptocurrency']
  }
];

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'sales' | 'recruiting' | 'training' | 'engagement';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface TeamMemberStats extends User {
  points: number;
  achievements: string[];
  streak: number;
  weeklyRank: number;
  monthlyRank: number;
  recentMilestones: {
    type: string;
    value: number;
    date: string;
  }[];
  challenges: {
    id: string;
    progress: number;
    target: number;
    endDate: string;
  }[];
}

export const achievements: Achievement[] = [
  {
    id: 'fast-starter',
    name: 'Fast Starter',
    description: 'Achieved 5 sales in your first month',
    icon: 'Zap',
    type: 'sales',
    rarity: 'common'
  },
  {
    id: 'team-builder',
    name: 'Team Builder',
    description: 'Recruited 3 new team members in a month',
    icon: 'Users',
    type: 'recruiting',
    rarity: 'rare'
  },
  {
    id: 'elite-performer',
    name: 'Elite Performer',
    description: 'Maintained top 5 ranking for 3 consecutive months',
    icon: 'Award',
    type: 'sales',
    rarity: 'epic'
  },
  {
    id: 'master-mentor',
    name: 'Master Mentor',
    description: 'Helped 5 team members achieve their monthly goals',
    icon: 'Star',
    type: 'training',
    rarity: 'legendary'
  }
];

export const weeklyChallenge = {
  id: 'weekly-sprint-23',
  title: 'February Sprint Challenge',
  description: 'Achieve 150% of your monthly sales target',
  reward: {
    points: 1000,
    badge: 'Sprint Champion'
  },
  leaderboard: [
    {
      id: 1,
      name: 'Thomas Anderson',
      progress: 85,
      points: 850,
      rank: 1
    },
    {
      id: 2,
      name: 'Sarah Connor',
      progress: 75,
      points: 750,
      rank: 2
    }
  ]
};

export const teamMemberStats: Record<number, TeamMemberStats> = {
  1: {
    id: 1,
    name: 'Thomas Anderson',
    points: 2500,
    achievements: ['fast-starter', 'team-builder'],
    streak: 5,
    weeklyRank: 1,
    monthlyRank: 2,
    recentMilestones: [
      {
        type: 'sales',
        value: 100000,
        date: '2025-02-15'
      },
      {
        type: 'recruiting',
        value: 3,
        date: '2025-02-10'
      }
    ],
    challenges: [
      {
        id: 'weekly-sprint-23',
        progress: 85,
        target: 100,
        endDate: '2025-02-25'
      }
    ]
  },
  2: {
    id: 2,
    name: 'Sarah Connor',
    points: 2200,
    achievements: ['fast-starter', 'elite-performer'],
    streak: 3,
    weeklyRank: 2,
    monthlyRank: 1,
    recentMilestones: [
      {
        type: 'sales',
        value: 150000,
        date: '2025-02-14'
      }
    ],
    challenges: [
      {
        id: 'weekly-sprint-23',
        progress: 75,
        target: 100,
        endDate: '2025-02-25'
      }
    ]
  }
};

// Org Chart Data
export const mockOrgData = {
  id: '1',
  name: 'John Maxwell',
  designation: 'CEO',
  compensationPercentage: 78,
  bonusPercentage: 15,
  yearlyIncome: 1250000,
  level: 1,
  children: [
    {
      id: '2',
      name: 'Sarah Johnson',
      designation: 'CEOMD',
      compensationPercentage: 72,
      bonusPercentage: 12,
      yearlyIncome: 850000,
      level: 2,
      children: [
        {
          id: '4',
          name: 'Michael Chen',
          designation: 'RMD',
          compensationPercentage: 65,
          bonusPercentage: 8,
          yearlyIncome: 420000,
          level: 3,
          children: [
            {
              id: '7',
              name: 'Emma Davis',
              designation: 'MD',
              compensationPercentage: 60,
              bonusPercentage: 5,
              yearlyIncome: 180000,
              level: 4,
              children: [
                {
                  id: '11',
                  name: 'Alex Turner',
                  designation: 'SFC',
                  compensationPercentage: 55,
                  bonusPercentage: 3,
                  yearlyIncome: 95000,
                  level: 5,
                  children: [
                    {
                      id: '15',
                      name: 'Ryan Cooper',
                      designation: 'Associate',
                      compensationPercentage: 45,
                      yearlyIncome: 65000,
                      level: 6
                    }
                  ]
                }
              ]
            },
            {
              id: '8',
              name: 'James Wilson',
              designation: 'SFC',
              compensationPercentage: 55,
              bonusPercentage: 3,
              yearlyIncome: 150000,
              level: 4,
              children: [
                {
                  id: '12',
                  name: 'Sophie Miller',
                  designation: 'Associate',
                  compensationPercentage: 45,
                  yearlyIncome: 72000,
                  level: 5
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: '3',
      name: 'Robert Martinez',
      designation: 'CEOMD',
      compensationPercentage: 72,
      bonusPercentage: 12,
      yearlyIncome: 780000,
      level: 2,
      children: [
        {
          id: '5',
          name: 'Lisa Thompson',
          designation: 'RMD',
          compensationPercentage: 65,
          bonusPercentage: 8,
          yearlyIncome: 380000,
          level: 3,
          children: [
            {
              id: '9',
              name: 'David Brown',
              designation: 'SEFC',
              compensationPercentage: 50,
              bonusPercentage: 3,
              yearlyIncome: 120000,
              level: 4,
              children: [
                {
                  id: '13',
                  name: 'Emily White',
                  designation: 'Associate',
                  compensationPercentage: 45,
                  yearlyIncome: 68000,
                  level: 5
                }
              ]
            }
          ]
        },
        {
          id: '6',
          name: 'Kevin Anderson',
          designation: 'RMD',
          compensationPercentage: 65,
          bonusPercentage: 8,
          yearlyIncome: 350000,
          level: 3,
          children: [
            {
              id: '10',
              name: 'Patricia Lee',
              designation: 'MD',
              compensationPercentage: 60,
              bonusPercentage: 5,
              yearlyIncome: 165000,
              level: 4,
              children: [
                {
                  id: '14',
                  name: 'Daniel Kim',
                  designation: 'SFC',
                  compensationPercentage: 55,
                  bonusPercentage: 3,
                  yearlyIncome: 92000,
                  level: 5,
                  children: [
                    {
                      id: '16',
                      name: 'Jessica Park',
                      designation: 'Associate',
                      compensationPercentage: 45,
                      yearlyIncome: 63000,
                      level: 6
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// This is a placeholder.  Replace with your actual User interface
interface User {
  id: number;
  name: string;
}