"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Check,
  Crown,
  CreditCard,
  Loader2,
  Mail,
  Pencil,
  Shield,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import shellStyles from "@/components/dashboard/dashboard-shell.module.css";

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

function MemberAvatar({ member }: { member: TeamMember }) {
  return (
    <div className="w-11 h-11 rounded-full bg-[var(--color-cyan)]/12 border border-white/10 flex items-center justify-center overflow-hidden">
      {member.image ? (
        // Remote provider avatars can come from arbitrary hosts, so keep a plain img here.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={member.image} alt="" className="w-full h-full object-cover" />
      ) : (
        <span className="text-sm font-bold text-[var(--color-cyan)]">
          {(member.name || member.email)[0].toUpperCase()}
        </span>
      )}
    </div>
  );
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
      void fetchTeams();
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
      console.error("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (event: React.FormEvent) => {
    event.preventDefault();
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
        alert(err.error || "Failed to create team");
      }
    } catch {
      alert("Failed to create team");
    } finally {
      setCreating(false);
    }
  };

  const handleInvite = async (event: React.FormEvent, teamId: string) => {
    event.preventDefault();
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
        alert(err.error || "Invitation failed");
      }
    } catch {
      alert("Invitation failed");
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
        alert(err.error || "Save failed");
      }
    } catch {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const ownedTeam = teamsData?.ownedTeams?.[0] ?? null;
  const memberTeam = teamsData?.memberOf ?? null;
  const hasAnyTeam = Boolean(ownedTeam || memberTeam);
  const totalMembers = useMemo(
    () => ownedTeam?.members.length ?? memberTeam?.members.length ?? 0,
    [ownedTeam, memberTeam]
  );

  if (status === "loading" || loading) {
    return (
      <div className={shellStyles.loadingPage}>
        <Loader2 className={shellStyles.loadingSpinner} />
      </div>
    );
  }

  return (
    <DashboardShell
      eyebrow="TEAM WORKSPACE"
      title={
        <>
          Team structure, <span className="gradient-text">without clutter</span>.
        </>
      }
      description="Create the workspace team, invite members, assign ownership, and keep multi-user card management organized inside the same premium operating layer."
      navItems={[
        { href: "/dashboard", label: "Cards", icon: CreditCard },
        {
          href: "/dashboard/leads",
          label: "Leads",
          icon: Users,
          hiddenUntil: "md",
        },
        {
          href: "/dashboard/templates",
          label: "Templates",
          icon: Sparkles,
          hiddenUntil: "md",
        },
        { href: "/dashboard/team", label: "Team", icon: UserPlus, active: true },
        ...(session?.user?.isAdmin
          ? [
              {
                href: "/dashboard/admin",
                label: "Admin",
                icon: ShieldCheck,
                hiddenUntil: "lg" as const,
              },
            ]
          : []),
      ]}
      sessionLabel={session?.user?.name || session?.user?.email}
      onSignOut={() => signOut({ callbackUrl: "/" })}
      heroActions={
        !hasAnyTeam ? (
          <button
            onClick={() =>
              document.getElementById("team-create-form")?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              })
            }
            className={shellStyles.actionButton}
          >
            <Shield className={shellStyles.buttonIcon} />
            Create team
          </button>
        ) : undefined
      }
      heroAside={
        <>
          <div className={`${shellStyles.spotlight} glass-panel`}>
            <p className={`mono ${shellStyles.spotlightLabel}`}>COLLABORATION SIGNAL</p>
            <h2 className={shellStyles.spotlightTitle}>
              {hasAnyTeam
                ? `${totalMembers} member${totalMembers === 1 ? "" : "s"} connected to the current workspace.`
                : "No team yet. Create one when you are ready to collaborate."}
            </h2>
            <p className={shellStyles.spotlightText}>
              Team mode is where card operations move from solo management to shared control. Owners can rename teams and send invites directly from this surface.
            </p>
            <div className={shellStyles.spotlightBadges}>
              <span className={shellStyles.spotlightBadge}>
                <Users className={shellStyles.spotlightBadgeIcon} />
                Shared card ops
              </span>
              <span className={shellStyles.spotlightBadge}>
                <Mail className={shellStyles.spotlightBadgeIcon} />
                Invite flow
              </span>
            </div>
          </div>

          <div className={shellStyles.metricGrid}>
            <div className={shellStyles.metricTile}>
              <span className={shellStyles.metricTileLabel}>Owned teams</span>
              <span className={shellStyles.metricTileValue}>
                {teamsData?.ownedTeams.length ?? 0}
              </span>
            </div>
            <div className={shellStyles.metricTile}>
              <span className={shellStyles.metricTileLabel}>Members</span>
              <span className={shellStyles.metricTileValue}>{totalMembers}</span>
            </div>
          </div>
        </>
      }
      stats={[
        {
          label: "Owned teams",
          value: teamsData?.ownedTeams.length ?? 0,
          hint: "Teams where this account controls ownership.",
        },
        {
          label: "Membership",
          value: memberTeam ? 1 : 0,
          hint: "Whether this account is also part of another team.",
          tone: "violet",
        },
        {
          label: "Members",
          value: totalMembers,
          hint: "Visible members in the active team context.",
          tone: "emerald",
        },
        {
          label: "Invites ready",
          value: hasAnyTeam ? "ON" : "WAIT",
          hint: "Invite flow becomes available after team creation.",
          tone: "amber",
        },
      ]}
    >
      {!hasAnyTeam && (
        <section id="team-create-form" className={`${shellStyles.surfaceCard} glass-panel`}>
          <div className={shellStyles.surfaceHeader}>
            <div>
              <p className={`mono ${shellStyles.spotlightLabel}`}>CREATE TEAM</p>
              <h2 className={shellStyles.surfaceTitle}>Start your shared workspace</h2>
              <p className={shellStyles.surfaceDescription}>
                A team lets you organize employee cards from one central account and prepare multi-user operations.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateTeam} className={shellStyles.toolbar}>
            <label className={shellStyles.toolbarField}>
              <Users className={shellStyles.toolbarFieldIcon} />
              <input
                type="text"
                value={createName}
                onChange={(event) => setCreateName(event.target.value)}
                placeholder="Team name"
                className={shellStyles.toolbarInput}
              />
            </label>
            <button
              type="submit"
              disabled={creating || !createName.trim()}
              className={shellStyles.actionButton}
            >
              {creating ? (
                <Loader2 className={shellStyles.buttonIcon} />
              ) : (
                <Shield className={shellStyles.buttonIcon} />
              )}
              Create team
            </button>
          </form>
        </section>
      )}

      {ownedTeam && (
        <section className={`${shellStyles.surfaceCard} glass-panel`}>
          <div className={shellStyles.surfaceHeader}>
            <div>
              <p className={`mono ${shellStyles.spotlightLabel}`}>OWNER TEAM</p>
              <h2 className={shellStyles.surfaceTitle}>
                {editingTeamId === ownedTeam.id ? "Edit team name" : ownedTeam.name}
              </h2>
              <p className={shellStyles.surfaceDescription}>
                You own this team. Manage members, rename the team, and invite new people into the workspace.
              </p>
            </div>

            <div className={shellStyles.pillRow}>
              <span className={shellStyles.pill}>
                <Crown className={shellStyles.pillIcon} />
                You are the owner
              </span>
            </div>
          </div>

          {editingTeamId === ownedTeam.id ? (
            <div className={shellStyles.toolbar}>
              <label className={shellStyles.toolbarField}>
                <Pencil className={shellStyles.toolbarFieldIcon} />
                <input
                  type="text"
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  className={shellStyles.toolbarInput}
                />
              </label>
              <button
                onClick={() => void saveTeamName()}
                disabled={saving}
                className={shellStyles.actionButton}
              >
                {saving ? (
                  <Loader2 className={shellStyles.buttonIcon} />
                ) : (
                  <Check className={shellStyles.buttonIcon} />
                )}
                Save
              </button>
              <button onClick={cancelEdit} className={shellStyles.actionButtonGhost}>
                <X className={shellStyles.buttonIcon} />
                Cancel
              </button>
            </div>
          ) : (
            <div className={shellStyles.buttonRow}>
              <button
                onClick={() => startEditTeam(ownedTeam)}
                className={shellStyles.actionButtonGhost}
              >
                <Pencil className={shellStyles.buttonIcon} />
                Rename team
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6 mt-6">
            <div className={`${shellStyles.surfaceCard} glass-panel`}>
              <div className={shellStyles.surfaceHeader}>
                <div>
                  <p className={`mono ${shellStyles.spotlightLabel}`}>MEMBERS</p>
                  <h3 className={shellStyles.surfaceTitle}>Current team roster</h3>
                </div>
              </div>

              <div className="space-y-3">
                {ownedTeam.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 rounded-[22px] border border-white/8 bg-white/4 px-4 py-3"
                  >
                    <MemberAvatar member={member} />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">
                        {member.name || member.email}
                      </p>
                      <p className="text-sm text-[var(--color-text-muted)] truncate">
                        {member.email}
                      </p>
                    </div>
                    {member.id === ownedTeam.ownerId && (
                      <span className={shellStyles.badge}>
                        <Crown className={shellStyles.badgeIcon} />
                        Owner
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={`${shellStyles.surfaceCard} glass-panel`}>
              <div className={shellStyles.surfaceHeader}>
                <div>
                  <p className={`mono ${shellStyles.spotlightLabel}`}>INVITE FLOW</p>
                  <h3 className={shellStyles.surfaceTitle}>Invite a new member</h3>
                  <p className={shellStyles.surfaceDescription}>
                    Send an invite by email to expand the workspace.
                  </p>
                </div>
              </div>

              <form
                onSubmit={(event) => void handleInvite(event, ownedTeam.id)}
                className="space-y-4"
              >
                <label className={shellStyles.toolbarField}>
                  <Mail className={shellStyles.toolbarFieldIcon} />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(event) => setInviteEmail(event.target.value)}
                    placeholder="email@example.com"
                    className={shellStyles.toolbarInput}
                  />
                </label>

                <button
                  type="submit"
                  disabled={inviting || !inviteEmail.trim()}
                  className={shellStyles.actionButton}
                >
                  {inviting ? (
                    <Loader2 className={shellStyles.buttonIcon} />
                  ) : (
                    <UserPlus className={shellStyles.buttonIcon} />
                  )}
                  Invite member
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {memberTeam && memberTeam.id !== ownedTeam?.id && (
        <section className={`${shellStyles.surfaceCard} glass-panel`}>
          <div className={shellStyles.surfaceHeader}>
            <div>
              <p className={`mono ${shellStyles.spotlightLabel}`}>MEMBER TEAM</p>
              <h2 className={shellStyles.surfaceTitle}>{memberTeam.name}</h2>
              <p className={shellStyles.surfaceDescription}>
                You are part of this team as a member. The team owner controls invitations and naming.
              </p>
            </div>
          </div>

          {memberTeam.owner && (
            <div className={`${shellStyles.surfaceCard} glass-panel mb-5`}>
              <p className={`mono ${shellStyles.spotlightLabel}`}>TEAM OWNER</p>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-[var(--color-cyan)]/12 border border-white/10 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-[var(--color-cyan)]" />
                </div>
                <div>
                  <p className="font-medium">
                    {memberTeam.owner.name || memberTeam.owner.email}
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {memberTeam.owner.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {memberTeam.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 rounded-[22px] border border-white/8 bg-white/4 px-4 py-3"
              >
                <MemberAvatar member={member} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{member.name || member.email}</p>
                  <p className="text-sm text-[var(--color-text-muted)] truncate">
                    {member.email}
                  </p>
                </div>
                {member.id === memberTeam.ownerId && (
                  <span className={shellStyles.badge}>
                    <Crown className={shellStyles.badgeIcon} />
                    Owner
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </DashboardShell>
  );
}
