// src/modules/analytics/analytics.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { User, UserRole } from '../user/entities/user.entity';
import {
  StudentActivity,
  ResourceType,
  ActivityType,
} from '../student/entities/student-activity.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(StudentActivity)
    private activityRepo: Repository<StudentActivity>,
  ) {}

  async getSummary() {
    const totalStudents = await this.userRepo.count({
      where: { role: UserRole.STUDENT },
    });
    const totalTeachers = await this.userRepo.count({
      where: { role: UserRole.TEACHER },
    });
    const totalVideos = await this.activityRepo.count({
      where: { resourceType: ResourceType.VIDEO },
    });
    // const totalSimulations = await this.activityRepo.count({ where: { resourceType: ResourceType.PDF } }); // example simulation type

    return { totalStudents, totalTeachers, totalVideos };
  }

  async getMonthlyPerformance() {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const performance: { month: string; value: number }[] = [];

    const year = new Date().getFullYear();

    for (let i = 0; i < 12; i++) {
      const start = new Date(year, i, 1);
      const end = new Date(year, i + 1, 0, 23, 59, 59);

      const totalActivities = await this.activityRepo.count({
        where: { createdAt: Between(start, end) },
      });

      performance.push({ month: months[i], value: totalActivities });
    }

    return performance;
  }

  async getSubjectEngagement() {
    // Fetch all activities with book relation
    const activities = await this.activityRepo.find({
      relations: ['book'],
    });

    // Count activities per subject
    const subjectMap: Record<string, number> = {};

    activities.forEach((act) => {
      const subject = act.book?.subject || 'Unknown';
      if (!subjectMap[subject]) subjectMap[subject] = 0;
      subjectMap[subject] += 1;
    });

    // Convert to array for UI chart
    const data = Object.entries(subjectMap).map(([name, value]) => ({
      name,
      value,
    }));

    return data;
  }

  // 4️⃣ Student Activity Stats
  async getActivityStats() {
    const opened = await this.activityRepo.count({
      where: { activityType: ActivityType.OPENED },
    });
    const completed = await this.activityRepo.count({
      where: { activityType: ActivityType.COMPLETED },
    });
    const favorite = await this.activityRepo.count({
      where: { activityType: ActivityType.FAVORITE },
    });

    return [
      { name: 'Opened', value: opened },
      { name: 'Completed', value: completed },
      { name: 'Favorite', value: favorite },
    ];
  }

  async getAverageStudyTime() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const data: { day: string; time: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const start = new Date();
      start.setDate(start.getDate() - start.getDay() + i);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setHours(23, 59, 59, 999);

      const activities = await this.activityRepo.find({
        where: { createdAt: Between(start, end) },
      });

      const avgTime = activities.length
        ? activities.reduce((sum, a) => sum + a.timeSpent, 0) /
          activities.length
        : 0;

      data.push({ day: days[i], time: avgTime });
    }

    return data;
  }

  async getLeaderboard() {
    const users = await this.userRepo.find({
      where: { role: UserRole.STUDENT },
      relations: ['activities'],
    });

    const leaderboard = users.map((user) => {
      const totalSeconds = user.activities.reduce(
        (sum, a) => sum + a.timeSpent,
        0,
      );

      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);

      return {
        name: user.username,
        time: `${hours}h ${minutes}m`,
        totalSeconds,
      };
    });

    leaderboard.sort((a, b) => b.totalSeconds - a.totalSeconds);

    return leaderboard.slice(0, 5);
  }
  // 7️⃣ Full Analytics (All data together)
  async getSingleSchoolAnalytics() {
    const summary = await this.getSummary();
    const performance = await this.getMonthlyPerformance();
    const subjectEngagement = await this.getSubjectEngagement();
    const activityStats = await this.getActivityStats();
    const studyTime = await this.getAverageStudyTime();
    const leaderboard = await this.getLeaderboard();

    return {
      summary,
      performance,
      subjectEngagement,
      activityStats,
      studyTime,
      leaderboard,
    };
  }
}
