import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "cafe_riddim_admin";
const SESSION_DAYS = 7;

const getPassword = () => process.env.ADMIN_PASSWORD ?? "";

export const isAdminConfigured = () => getPassword().length > 0;

// Sessions are signed with the password, so changing ADMIN_PASSWORD logs everyone out
const sign = (value: string) =>
    crypto.createHmac("sha256", getPassword()).update(value).digest("hex");

const safeEqual = (a: string, b: string) => {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
};

export const checkPassword = (attempt: string) =>
    isAdminConfigured() && safeEqual(sign(attempt), sign(getPassword()));

export const createSession = async () => {
    const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
    const payload = String(expires);
    (await cookies()).set(COOKIE_NAME, `${payload}.${sign(payload)}`, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/admin",
        expires: new Date(expires),
    });
};

export const destroySession = async () => {
    (await cookies()).delete({ name: COOKIE_NAME, path: "/admin" });
};

export const isLoggedIn = async () => {
    if (!isAdminConfigured()) return false;
    const value = (await cookies()).get(COOKIE_NAME)?.value;
    if (!value) return false;
    const [payload, signature] = value.split(".");
    if (!payload || !signature || !safeEqual(signature, sign(payload))) return false;
    return Number(payload) > Date.now();
};
