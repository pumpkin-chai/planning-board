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
