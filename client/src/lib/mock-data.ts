// Add insurance providers and their products at the top of the file
export const insuranceProviders = {
  'North American': {
    'Indexed Universal Life': {
      name: 'Builder Plus IUL 3',
      features: [
        'Guaranteed death benefit',
        'Cash value accumulation',
        'Multiple index account options'
      ],
      minPremium: 50000,
      targetAge: '30-65',
      riskLevel: 'Moderate',
      fees: '1.5% annual',
      returns: '6-8% historical average'
    },
    'Fixed Annuity': {
      name: 'Guarantee Choice',
      features: [
        'Guaranteed interest rates',
        'Tax-deferred growth',
        'Multiple term options'
      ],
      minPremium: 25000,
      targetAge: '50+',
      riskLevel: 'Low',
      fees: '0.5% annual',
      returns: '3.5-4.5% guaranteed'
    }
  },
  'Athene': {
    'Fixed Indexed Annuity': {
      name: 'Agility 10',
      features: [
        'Index-linked growth potential',
        'Principal protection',
        'Income rider options'
      ],
      minPremium: 35000,
      targetAge: '55+',
      riskLevel: 'Low-Moderate',
      fees: '1% annual',
      returns: '4-7% potential'
    },
    'Multi-Year Guaranteed Annuity': {
      name: 'Athene MYGA',
      features: [
        'Guaranteed fixed rate',
        'Multiple guarantee periods',
        'Tax-deferred growth'
      ],
      minPremium: 20000,
      targetAge: '60+',
      riskLevel: 'Low',
      fees: '0.3% annual',
      returns: '4.2% guaranteed'
    }
  },
  'Nationwide': {
    'Variable Annuity': {
      name: 'Destination Navigator 2.0',
      features: [
        'Investment flexibility',
        'Death benefit options',
        'Living benefit riders'
      ],
      minPremium: 40000,
      targetAge: '45-70',
      riskLevel: 'Moderate-High',
      fees: '2% annual',
      returns: '5-9% potential'
    },
    'Indexed Universal Life': {
      name: 'Nationwide IUL Accumulator',
      features: [
        'Flexible premiums',
        'Multiple indexing strategies',
        'Long-term care rider option'
      ],
      minPremium: 45000,
      targetAge: '35-65',
      riskLevel: 'Moderate',
      fees: '1.8% annual',
      returns: '6-8% historical average'
    }
  }
};

// Array definitions
const randomNames = [
  "James", "Mary", "John", "Patricia", "Michael", "Jennifer", "William", "Linda",
  "David", "Elizabeth", "Richard", "Barbara", "Joseph", "Susan", "Thomas", "Jessica",
  "Charles", "Sarah", "Christopher", "Karen", "Daniel", "Nancy", "Matthew", "Lisa",
  "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley", "Steven", "Kimberly"
];

const randomLastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson"
];

const randomOccupations = [
  "Former Teacher", "Former Business Owner", "Former Engineer", "Former Doctor",
  "Former Sales Executive", "Former Accountant", "Former Nurse", "Former Manager",
  "Former Attorney", "Former Professor", "Former Consultant", "Former Architect"
];

const randomLocations = [
  "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ",
  "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA"
];

const randomHealthStatus = ["Excellent", "Good", "Fair"];
const randomRiskTolerances = ["Conservative", "Moderate", "Aggressive"];

export const retirementProducts = [
  {
    id: 'annuity-fixed',
    name: 'Fixed Annuity',
    description: 'Guaranteed income stream with fixed interest rates',
    minInvestment: 25000,
    termOptions: [5, 10, 15, 20],
    riskLevel: 'Low'
  },
  {
    id: 'annuity-variable',
    name: 'Variable Annuity',
    description: 'Market-linked returns with optional income guarantees',
    minInvestment: 50000,
    termOptions: [10, 15, 20],
    riskLevel: 'Moderate'
  },
  {
    id: 'life-whole',
    name: 'Whole Life Insurance',
    description: 'Permanent life insurance with cash value component',
    minCoverage: 100000,
    cashValueGrowth: '2-4% annually',
    riskLevel: 'Low'
  },
  {
    id: 'ltc-insurance',
    name: 'Long-Term Care Insurance',
    description: 'Coverage for extended medical care needs',
    coverageOptions: [100, 150, 200, 250],
    waitingPeriod: '90 days',
    riskLevel: 'Low'
  },
  {
    id: 'income-fund',
    name: 'Retirement Income Fund',
    description: 'Diversified portfolio focused on income generation',
    minInvestment: 10000,
    expectedYield: '4-6% annually',
    riskLevel: 'Moderate'
  }
];

// Helper functions
function shuffle(array: string[]): string[] {
  return array.sort(() => Math.random() - 0.5);
}

function generateRandomPerformance(policyType: any, value: number, years: number) {
  switch (policyType.id) {
    case 'annuity-fixed':
      return {
        returnsToDate: Math.floor(value * 0.035 * years),
        guaranteedRate: "3.5%",
        nextRateAdjustment: "2024-12-31"
      };
    case 'annuity-variable':
      return {
        returnsToDate: Math.floor(value * (0.04 + Math.random() * 0.06) * years),
        annualReturn: `${(4 + Math.random() * 6).toFixed(1)}%`,
        riskProfile: "Moderate"
      };
    default:
      return {
        returnsToDate: Math.floor(value * 0.02 * years),
        premiumsPaid: Math.floor(value * 0.05),
        coverageUtilization: 0
      };
  }
}

function generateRandomPolicies() {
  const numPolicies = 1 + Math.floor(Math.random() * 3); // 1-3 policies
  const policies = [];

  for (let i = 0; i < numPolicies; i++) {
    const policyType = retirementProducts[Math.floor(Math.random() * retirementProducts.length)];
    const startYear = 2010 + Math.floor(Math.random() * 13); // 2010-2023
    const value = 100000 + Math.floor(Math.random() * 400000);

    policies.push({
      id: `pol-${Math.random().toString(36).substr(2, 9)}`,
      type: policyType.name,
      startDate: `${startYear}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      value,
      status: "Active",
      performance: generateRandomPerformance(policyType, value, 2024 - startYear)
    });
  }

  return policies;
}

function generateRandomInterests() {
  const allInterests = [
    "Travel", "Golf", "Gardening", "Reading", "Volunteering", "Grandchildren",
    "Hiking", "Photography", "Cooking", "Music", "Art", "Bridge"
  ];

  return shuffle(allInterests).slice(0, 2 + Math.floor(Math.random() * 3));
}

function generateRandomConcerns() {
  const allConcerns = [
    "Healthcare costs", "Market volatility", "Inflation", "Long-term care",
    "Legacy planning", "Tax efficiency", "Social Security", "Medicare coverage"
  ];

  return shuffle(allConcerns).slice(0, 2 + Math.floor(Math.random() * 3));
}

// Initial customer data
export const retiredCustomers = [
  {
    id: 1,
    name: "Robert Chen",
    age: 68,
    retirementYear: 2022,
    spouse: {
      name: "Linda Chen",
      age: 65
    },
    netWorth: 1250000,
    occupation: "Former Software Executive",
    location: "San Francisco, CA",
    healthStatus: "Excellent",
    riskTolerance: "Moderate",
    pastPolicies: [
      {
        id: "pol-1",
        type: "Term Life Insurance",
        startDate: "2010-05-15",
        value: 500000,
        status: "Active",
        performance: {
          returnsToDate: 0,
          premiumsPaid: 45000,
          coverageUtilization: 0
        }
      },
      {
        id: "pol-2",
        type: "Variable Annuity",
        startDate: "2015-08-22",
        value: 300000,
        status: "Active",
        performance: {
          returnsToDate: 68000,
          annualReturn: "7.2%",
          riskProfile: "Moderate"
        }
      }
    ],
    interests: ["Travel", "Golf", "Grandchildren"],
    concerns: ["Healthcare costs", "Legacy planning", "Market volatility"]
  },
  {
    id: 2,
    name: "Margaret Thompson",
    age: 72,
    retirementYear: 2018,
    spouse: null,
    netWorth: 850000,
    occupation: "Former School Principal",
    location: "Portland, OR",
    healthStatus: "Good",
    riskTolerance: "Conservative",
    pastPolicies: [
      {
        id: "pol-3",
        type: "Fixed Annuity",
        startDate: "2018-03-10",
        value: 200000,
        status: "Active",
        performance: {
          returnsToDate: 24000,
          guaranteedRate: "3.5%",
          nextRateAdjustment: "2024-03-10"
        }
      }
    ],
    interests: ["Gardening", "Book club", "Volunteering"],
    concerns: ["Longevity risk", "Inflation", "Long-term care"]
  }
];

// Generate additional customers
[...Array(48)].forEach((_, index) => {
  const age = 65 + Math.floor(Math.random() * 20); // Ages 65-85
  const hasSpouse = Math.random() > 0.3; // 70% chance of having a spouse
  const spouseAge = age - Math.floor(Math.random() * 8) + Math.floor(Math.random() * 8);
  const netWorthBase = 500000 + Math.floor(Math.random() * 2000000);

  const customer = {
    id: index + 3,
    name: `${randomNames[Math.floor(Math.random() * randomNames.length)]} ${randomLastNames[Math.floor(Math.random() * randomLastNames.length)]}`,
    age,
    retirementYear: 2024 - Math.floor(Math.random() * 10),
    spouse: hasSpouse ? {
      name: `${randomNames[Math.floor(Math.random() * randomNames.length)]} ${randomLastNames[Math.floor(Math.random() * randomLastNames.length)]}`,
      age: spouseAge
    } : null,
    netWorth: netWorthBase,
    occupation: randomOccupations[Math.floor(Math.random() * randomOccupations.length)],
    location: randomLocations[Math.floor(Math.random() * randomLocations.length)],
    healthStatus: randomHealthStatus[Math.floor(Math.random() * randomHealthStatus.length)],
    riskTolerance: randomRiskTolerances[Math.floor(Math.random() * randomRiskTolerances.length)],
    pastPolicies: generateRandomPolicies(),
    interests: generateRandomInterests(),
    concerns: generateRandomConcerns()
  };

  retiredCustomers.push(customer);
});

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