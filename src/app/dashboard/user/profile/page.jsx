"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Card, Button, TextField, Label, InputGroup, Input } from "@heroui/react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [name, setName] = useState(user?.name || "");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!name.trim()) return setError("Name is required.");
    setIsLoading(true);
    try {
      // Profile update API — add later
      await new Promise(r => setTimeout(r, 800));
      setSuccess("Profile updated successfully!");
    } catch {
      setError("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Profile Settings</h1>
        <p className="text-zinc-500 text-sm mt-1">Manage your account details</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-2xl font-bold text-violet-600">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">{user?.name}</p>
          <p className="text-zinc-400 text-sm">{user?.email}</p>
          <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full capitalize">{user?.role}</span>
        </div>
      </div>

      <Card className="p-6 border border-zinc-200 dark:border-zinc-800">
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          {error && <div className="p-3.5 text-xs font-medium rounded-xl bg-red-100/60 text-red-700 border border-red-200"><span className="font-semibold">Error:</span> {error}</div>}
          {success && <div className="p-3.5 text-xs font-medium rounded-xl bg-emerald-100/60 text-emerald-800 border border-emerald-200"><span className="font-semibold">Success:</span> {success}</div>}

          <TextField isRequired name="name" className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Name</Label>
            <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-900 focus-within:border-violet-500 transition-colors">
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name"
                className="w-full bg-transparent py-2.5 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100" />
            </InputGroup>
          </TextField>

          <TextField name="email" className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email (cannot change)</Label>
            <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 bg-zinc-100 dark:bg-zinc-800 opacity-60">
              <Input type="email" value={user?.email || ""} disabled
                className="w-full bg-transparent py-2.5 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100" />
            </InputGroup>
          </TextField>

          <Button type="submit" color="primary" className="w-full font-semibold rounded-xl h-12" isLoading={isLoading} isDisabled={isLoading}>
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
}