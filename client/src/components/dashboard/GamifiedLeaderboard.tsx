import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  Award,
  Star,
  Zap,
  Users,
  Target,
  TrendingUp,
  Crown,
  Medal
} from 'lucide-react';
import { Achievement, TeamMemberStats } from '@/lib/mock-data';

interface GamifiedLeaderboardProps {
  teamMember: TeamMemberStats;
  achievements: Achievement[];
}

const iconMap = {
  Zap,
  Users,
  Award,
  Star,
  Trophy
};

const rarityColors = {
  common: 'bg-slate-100 text-slate-700',
  rare: 'bg-blue-100 text-blue-700',
  epic: 'bg-purple-100 text-purple-700',
  legendary: 'bg-amber-100 text-amber-700'
};

export const GamifiedLeaderboard = ({ teamMember, achievements }: GamifiedLeaderboardProps) => {
  const earnedAchievements = achievements.filter(a => 
    teamMember.achievements.includes(a.id)
  );

  return (
    <div className="space-y-6">
      {/* Current Rank and Points */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="p-3 bg-blue-100 rounded-full">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Weekly Rank</p>
                <p className="text-2xl font-bold">#{teamMember.weeklyRank}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <div className="p-3 bg-purple-100 rounded-full">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Points</p>
                <p className="text-2xl font-bold">{teamMember.points}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg">
              <div className="p-3 bg-pink-100 rounded-full">
                <Medal className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Streak</p>
                <p className="text-2xl font-bold">{teamMember.streak} Days</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Active Challenges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMember.challenges.map(challenge => (
              <div key={challenge.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{challenge.id}</h4>
                    <p className="text-sm text-gray-500">
                      Ends {new Date(challenge.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {Math.round((challenge.progress / challenge.target) * 100)}%
                  </Badge>
                </div>
                <Progress
                  value={(challenge.progress / challenge.target) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {earnedAchievements.map(achievement => {
              const IconComponent = iconMap[achievement.icon as keyof typeof iconMap];
              return (
                <div
                  key={achievement.id}
                  className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-2 rounded-full ${rarityColors[achievement.rarity]}`}>
                      {IconComponent && <IconComponent className="w-4 h-4" />}
                    </div>
                    <Badge variant="secondary" className={rarityColors[achievement.rarity]}>
                      {achievement.rarity}
                    </Badge>
                  </div>
                  <h4 className="font-medium mb-1">{achievement.name}</h4>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMember.recentMilestones.map((milestone, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="p-2 bg-green-50 rounded-full">
                  <Target className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">
                    {milestone.type === 'sales' 
                      ? `$${milestone.value.toLocaleString()} in sales`
                      : `${milestone.value} ${milestone.type}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(milestone.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
