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

export type UserEventsResult = {
  id: number;
  title: string;
  desc: string;
  startsAt: string;
  endsAt?: string | null;
  status: string;
  creator: { id?: string; username: string };
  isAttending: boolean;
  attendeeCount: number;
};
