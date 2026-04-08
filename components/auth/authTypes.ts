"use client";

export type UserRole = "student" | "admin";

export function isUserRole(value: unknown): value is UserRole {
  return value === "student" || value === "admin";
}
