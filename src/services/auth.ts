import { db } from '../db';
import { users, subscriptions, plans } from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';

export class AuthService {
  static async register(email: string, password: string, name?: string, role: 'user' | 'admin' = 'user') {
    const hashedPassword = await Bun.password.hash(password);
    
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email)
    });
    
    if (existingUser) {
        throw new Error('User already exists');
    }

    const [user] = await db.insert(users).values({
      email,
      password: hashedPassword,
      name: name || null,
      role,
      subscriptionStatus: 0,
    }).returning();

    return user;
  }

  static async login(email: string, password: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) return null;

    const isMatch = await Bun.password.verify(password, user.password);
    if (!isMatch) return null;

    return user;
  }

  static async createSubscription(userId: number, planId: number) {
    const plan = await db.query.plans.findFirst({
        where: eq(plans.id, planId)
    });
    
    if (!plan) throw new Error('Plan not found');

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + plan.duration);

    const [sub] = await db.insert(subscriptions).values({
        userId,
        planId,
        startDate,
        endDate,
        status: 'active'
    }).returning();

    await db.update(users)
        .set({ subscriptionStatus: 1 })
        .where(eq(users.id, userId));

    return sub;
  }

  static async checkSubscriptionStatus(userId: number) {
      const sub = await db.query.subscriptions.findFirst({
          where: and(
              eq(subscriptions.userId, userId),
              eq(subscriptions.status, 'active')
          ),
          orderBy: [desc(subscriptions.endDate)]
      });

      if (!sub) {
           await db.update(users).set({ subscriptionStatus: 0 }).where(eq(users.id, userId));
           return false;
      }

      const now = new Date();
      if (sub.endDate < now) {
          await db.update(subscriptions).set({ status: 'expired' }).where(eq(subscriptions.id, sub.id));
          await db.update(users).set({ subscriptionStatus: 0 }).where(eq(users.id, userId));
          return false;
      }

      return true;
  }
}
