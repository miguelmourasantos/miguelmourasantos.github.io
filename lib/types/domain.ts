export type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  plan: "free" | "pro" | "enterprise";
  createdAt: Date;
  updatedAt: Date;
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatar?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Team = {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TeamMember = {
  id: string;
  teamId: string;
  userId: string;
  role: "owner" | "admin" | "member";
  createdAt: Date;
};

export type Subscription = {
  id: string;
  userId: string;
  plan: "free" | "pro" | "enterprise";
  status: "active" | "canceled" | "past_due";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UsageStats = {
  id: string;
  userId: string;
  organizationId: string;
  metric: string;
  value: number;
  timestamp: Date;
};
