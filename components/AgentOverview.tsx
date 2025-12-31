'use client';

import { useMemo } from 'react';
import { useAgentStore } from '@/lib/store';
import { PlatformBadge } from '@/components/PlatformBadge';

export function AgentOverview() {
  const { agents, selectedAgentId, selectAgent, deleteAgent } = useAgentStore();
  const selected = useMemo(() => agents.find(agent => agent.id === selectedAgentId) ?? agents[0], [
    agents,
    selectedAgentId
  ]);

  if (!selected) {
    return (
      <section className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/70 p-8 text-center text-slate-300">
        <p>No agents yet. Launch one using the form to the left.</p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-floating backdrop-blur">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs text-slate-500">Active agent</p>
          <h2 className="text-3xl font-semibold text-white">{selected.name}</h2>
        </div>
        <div className="flex items-center gap-3">
          <PlatformBadge platform={selected.platform} />
          <button
            type="button"
            className="rounded-2xl border border-red-500/20 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/10"
            onClick={() => deleteAgent(selected.id)}
          >
            Decommission
          </button>
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Persona</p>
            <p className="text-base font-semibold text-white">{selected.persona.title || 'Untitled persona'}</p>
            <p className="text-sm text-slate-300">Tone: {selected.persona.tone}</p>
            <p className="text-sm text-slate-300">Availability: {selected.persona.availability}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {selected.persona.languages.map(language => (
                <span
                  key={language}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Escalation</p>
            <p className="text-sm text-slate-200">
              {selected.escalationPolicy || 'No escalation policy configured yet. Add guidance so humans know when to jump in.'}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-slate-400">Agents</p>
            <div className="space-y-2">
              {agents.map(agent => (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => selectAgent(agent.id)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    agent.id === selected.id
                      ? 'border-white/30 bg-messenger/10 text-white'
                      : 'border-white/5 bg-white/0 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <p className="font-semibold">{agent.name}</p>
                  <p className="text-xs text-slate-400">{agent.persona.title || 'No persona title'}</p>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <section className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-wide text-slate-400">Greeting</p>
            <p className="text-lg text-slate-100">{selected.greeting}</p>
          </section>

          <section className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-slate-400">Knowledge base</p>
              <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-wide text-slate-300">
                {Math.max(selected.knowledgeBaseSummary.length, 30)} tokens
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-200">
              {selected.knowledgeBaseSummary ||
                'Use the form to summarize playbooks, documentation, and knowledge sources that train this agent.'}
            </p>
          </section>

          <section className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Automations</p>
                <p className="text-sm text-slate-300">Trigger workflows without code.</p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">{selected.automations.length} active</span>
            </header>
            <div className="grid gap-4 sm:grid-cols-2">
              {selected.automations.map(automation => (
                <article key={automation.id} className="space-y-2 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <p className="text-sm font-semibold text-white">{automation.name}</p>
                  <p className="text-xs uppercase tracking-wide text-messenger">{automation.trigger}</p>
                  <p className="text-xs text-slate-300">{automation.description}</p>
                </article>
              ))}
              {selected.automations.length === 0 && (
                <p className="text-xs text-slate-400">No automations defined. Map key customer intents to actions.</p>
              )}
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Conversation flow</p>
                <p className="text-sm text-slate-300">Draft messages and platform overrides.</p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">
                {selected.flow.blocks.length} nodes
              </span>
            </header>
            <div className="space-y-3">
              {selected.flow.blocks.map(block => (
                <div key={block.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <p className="text-sm font-semibold text-white">{block.label}</p>
                  <p className="text-xs text-slate-300">{block.message}</p>
                  {block.channelOverrides && (
                    <div className="mt-3 space-y-2">
                      {Object.entries(block.channelOverrides).map(([channel, message]) => (
                        <p key={channel} className="text-xs text-slate-400">
                          Override for {channel}: {message}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/60 p-4 text-xs text-slate-400">
              <p>
                Map hand-offs and branch logic inside your favorite CX platform. Export JSON is coming soon.
              </p>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
