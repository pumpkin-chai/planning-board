export type Event = {
  id: number;
  title: string;
  desc: string;
  startsAt: Date;
  endsAt: Date | null;
  status: string;
  creator: { username: string; currentUser: boolean };
  isAttending: boolean;
  attendeeCount: number;
};

export type Group = {
  id: number;
  name: string;
};

export type UserGroupResult = {
  id: number;
  name: string;
  memberCount: number;
  role: Role;
};

export type Role = "admin" | "member";
