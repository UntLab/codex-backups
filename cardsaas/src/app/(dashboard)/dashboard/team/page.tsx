"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  LogOut,
  Users,
  UserPlus,
  Mail,
  Shield,
  Crown,
  Loader2,
  Pencil,
  Check,
  X,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

interface Team {
  id: string;
  name: string;
  ownerId: string;
  owner?: { id: string; name: string | null; email: string };
  members: TeamMember[];
  createdAt: string;
}

interface TeamsResponse {
  ownedTeams: Team[];
  memberOf: Team | null;
}

export default function TeamPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [teamsData, setTeamsData] = useState<TeamsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [createName, setCreateName] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchTeams();
    }
  }, [status]);

  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/teams");
      const data = await res.json();
      setTeamsData({
        ownedTeams: data.ownedTeams || [],
        memberOf: data.memberOf || null,
      });
    } catch {
      console.error("Ошибка загрузки команд");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: createName.trim() }),
      });
      if (res.ok) {
        await fetchTeams();
        setCreateName("");
      } else {
        const err = await res.json();
        alert(err.error || "Ошибка создания команды");
      }
    } catch {
      alert("Ошибка создания команды");
    } finally {
      setCreating(false);
    }
  };

  const handleInvite = async (e: React.FormEvent, teamId: string) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    try {
      const res = await fetch("/api/teams/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, email: inviteEmail.trim() }),
      });
      if (res.ok) {
        await fetchTeams();
        setInviteEmail("");
      } else {
        const err = await res.json();
        alert(err.error || "Ошибка приглашения");
      }
    } catch {
      alert("Ошибка приглашения");
    } finally {
      setInviting(false);
    }
  };

  const startEditTeam = (team: Team) => {
    setEditingTeamId(team.id);
    setEditName(team.name);
  };

  const cancelEdit = () => {
    setEditingTeamId(null);
    setEditName("");
  };

  const saveTeamName = async () => {
    if (!editingTeamId || !editName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/teams/${editingTeamId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      });
      if (res.ok) {
        await fetchTeams();
        cancelEdit();
      } else {
        const err = await res.json();
        alert(err.error || "Ошибка сохранения");
      }
    } catch {
      alert("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-base)] flex items-center justify-center cyber-grid">
        <Loader2 className="w-8 h-8 text-[var(--color-neon)] animate-spin" />
      </div>
    );
  }

  const ownedTeam = teamsData?.ownedTeams?.[0] ?? null;
  const memberTeam = teamsData?.memberOf ?? null;
  const hasAnyTeam = ownedTeam || memberTeam;

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] cyber-grid">
      <nav className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[var(--color-neon)] rounded-md flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-black" />
            </div>
            <span className="text-xl font-bold font-[family-name:var(--font-geist-mono)]">
              Card<span className="text-[var(--color-neon)]">SaaS</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-neon)] transition-colors font-[family-name:var(--font-geist-mono)]"
            >
              Визитки
            </Link>
            <span className="text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-geist-mono)] hidden sm:block">
              {session?.user?.name || session?.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-neon-danger)] transition-colors font-[family-name:var(--font-geist-mono)]"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1 font-[family-name:var(--font-geist-mono)]">
            Команда
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-geist-mono)]">
            Управление участниками и визитками команды
          </p>
        </div>

        {!hasAnyTeam && (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-[var(--color-neon)]/10 border border-[var(--color-neon)]/30 flex items-center justify-center">
                <Users className="w-6 h-6 text-[var(--color-neon)]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold font-[family-name:var(--font-geist-mono)]">
                  Создать команду
                </h2>
                <p className="text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-geist-mono)]">
                  Команда позволяет управлять визитками сотрудников из одного аккаунта
                </p>
              </div>
            </div>
            <form onSubmit={handleCreateTeam} className="flex gap-3">
              <input
                type="text"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="Название команды"
                className="flex-1 bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm font-[family-name:var(--font-geist-mono)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-neon)] transition-colors"
              />
              <button
                type="submit"
                disabled={creating || !createName.trim()}
                className="flex items-center gap-2 bg-[var(--color-neon)] text-black px-5 py-2.5 rounded-lg font-bold text-sm hover:shadow-[0_0_20px_rgba(0,255,204,0.4)] transition-all font-[family-name:var(--font-geist-mono)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Shield className="w-4 h-4" />
                )}
                Создать команду
              </button>
            </form>
          </div>
        )}

        {ownedTeam && (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden mb-6">
            <div className="p-6 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-neon)]/10 border border-[var(--color-neon)]/30 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-[var(--color-neon)]" />
                </div>
                {editingTeamId === ownedTeam.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm font-[family-name:var(--font-geist-mono)] focus:outline-none focus:border-[var(--color-neon)]"
                    />
                    <button
                      onClick={saveTeamName}
                      disabled={saving}
                      className="p-2 rounded-lg bg-[var(--color-neon)] text-black hover:opacity-90"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-2 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-neon-danger)] text-[var(--color-neon-danger)]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold font-[family-name:var(--font-geist-mono)]">
                      {ownedTeam.name}
                    </h2>
                    <span className="text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-geist-mono)]">
                      Вы владелец
                    </span>
                    <button
                      onClick={() => startEditTeam(ownedTeam)}
                      className="p-2 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-neon)] text-[var(--color-text-muted)] hover:text-[var(--color-neon)] transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-4 font-[family-name:var(--font-geist-mono)]">
                Участники
              </h3>
              <div className="space-y-3 mb-6">
                {ownedTeam.members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-bg-base)] border border-[var(--color-border)]"
                  >
                    <div className="w-8 h-8 rounded-full bg-[var(--color-neon)]/20 flex items-center justify-center overflow-hidden">
                      {m.image ? (
                        <img
                          src={m.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-[var(--color-neon)]">
                          {(m.name || m.email)[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate font-[family-name:var(--font-geist-mono)]">
                        {m.name || m.email}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] truncate font-[family-name:var(--font-geist-mono)]">
                        {m.email}
                      </p>
                    </div>
                    {m.id === ownedTeam.ownerId && (
                      <span className="flex items-center gap-1 text-xs text-[var(--color-neon)] font-[family-name:var(--font-geist-mono)]">
                        <Crown className="w-3.5 h-3.5" />
                        Владелец
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3 font-[family-name:var(--font-geist-mono)]">
                Пригласить участника
              </h3>
              <form
                onSubmit={(e) => handleInvite(e, ownedTeam.id)}
                className="flex gap-3"
              >
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-lg pl-10 pr-4 py-2.5 text-sm font-[family-name:var(--font-geist-mono)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-neon)] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={inviting || !inviteEmail.trim()}
                  className="flex items-center gap-2 bg-[var(--color-neon)] text-black px-5 py-2.5 rounded-lg font-bold text-sm hover:shadow-[0_0_20px_rgba(0,255,204,0.4)] transition-all font-[family-name:var(--font-geist-mono)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {inviting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  Пригласить участника
                </button>
              </form>
            </div>
          </div>
        )}

        {memberTeam && memberTeam.id !== ownedTeam?.id && (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-neon)]/10 border border-[var(--color-neon)]/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-[var(--color-neon)]" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-[family-name:var(--font-geist-mono)]">
                  {memberTeam.name}
                </h2>
                <p className="text-sm text-[var(--color-text-muted)] font-[family-name:var(--font-geist-mono)]">
                  Вы участник этой команды
                </p>
              </div>
            </div>
            {memberTeam.owner && (
              <div className="p-4 rounded-lg bg-[var(--color-bg-base)] border border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-text-muted)] mb-2 font-[family-name:var(--font-geist-mono)]">
                  Владелец команды
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-neon)]/20 flex items-center justify-center">
                    <Crown className="w-4 h-4 text-[var(--color-neon)]" />
                  </div>
                  <div>
                    <p className="font-medium font-[family-name:var(--font-geist-mono)]">
                      {memberTeam.owner.name || memberTeam.owner.email}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-geist-mono)]">
                      {memberTeam.owner.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3 font-[family-name:var(--font-geist-mono)]">
                Участники команды
              </h3>
              <div className="space-y-2">
                {memberTeam.members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-bg-base)] border border-[var(--color-border)]"
                  >
                    <div className="w-8 h-8 rounded-full bg-[var(--color-neon)]/20 flex items-center justify-center overflow-hidden">
                      {m.image ? (
                        <img
                          src={m.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-[var(--color-neon)]">
                          {(m.name || m.email)[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium font-[family-name:var(--font-geist-mono)]">
                        {m.name || m.email}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-geist-mono)]">
                        {m.email}
                      </p>
                    </div>
                    {m.id === memberTeam.ownerId && (
                      <span className="flex items-center gap-1 text-xs text-[var(--color-neon)] ml-auto font-[family-name:var(--font-geist-mono)]">
                        <Crown className="w-3.5 h-3.5" />
                        Владелец
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
