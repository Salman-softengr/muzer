"use client"

import { signIn, signOut, useSession } from "next-auth/react";

export default function Appbar() {
    const session = useSession();

  return (
    <div className="flex justify-between">
        <div>
            Muzi
        </div>
        <div>
            {session.data?.user && <button onClick={() => signOut()} className="m-2 p-2 bg-blue-400">Logout</button>}
            {!session.data?.user && <button onClick={() => signIn()} className="m-2 p-2 bg-blue-400">Signin</button>}
        </div>
    </div>
  )
}