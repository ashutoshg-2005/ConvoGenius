"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client"; //import the auth client
import { Input } from "@/components/ui/input";
import { useState } from "react";


export default function Home() {

   const { data: session } = authClient.useSession() 
  const [email,setEmail] = useState("");
  const [name,setName] = useState("");
  const [password,setPassword] = useState("");
  const onSubmit =() => {
    authClient.signUp.email({
      email,
      name,
      password
    }, {
      onError: () => {
        window.alert("Error signing up:");
      },
      onSuccess: () => {
        window.alert("User created successfully!");
      }
    });
  }

  const onLogin =() => {
    authClient.signIn.email({
      email,
      password
    }, {
      onError: () => {
        window.alert("Error login up:");
      },
      onSuccess: () => {
        window.alert("User logged successfully!");
      }
    });
  }
  if (session) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl">Welcome, {session.user.name || session.user.email}!</h1>
        <Button onClick={() => authClient.signOut()}>Sign Out</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col  justify-center gap-y-10">
      <div className="flex flex-col items-center justify-center gap-4">
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={onSubmit} className="w-full" >
          Create User
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={onLogin} >
          Login 
        </Button>
      </div>
    </div>
  );
}
