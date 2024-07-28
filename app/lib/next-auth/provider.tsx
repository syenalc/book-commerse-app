"use client";

import { FC, PropsWithChildren } from "react";
import { SessionProvider } from "next-auth/react";

export const NextAuthProvider:FC<PropsWithChildren>=({children})=>{
    return <SessionProvider>{children}</SessionProvider>
};