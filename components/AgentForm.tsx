'use client';

import { useState } from 'react';
import { useAgentStore } from '@/lib/store';
import type { AgentDraft, Channel } from '@/lib/types';
import { PlatformBadge } from '@/components/PlatformBadge';

const toneOptions = [
  { value: 'friendly', label: 'Friendly', description: 'Casual, emoji-friendly, conversational' },
  { value: 'concise', label: 'Concise', description: 'To the point, focused on efficiency' },
  { value: 'playful', label: 'Playful', description: 'Energetic tone, brand-forward' },
  { value: 'professional', label: 'Professional', description: 'Formal, policy-driven guidance' }
] as const;

const defaultDraft: AgentDraft = {
  name: '',
  platform: 'messenger',
  persona: {
    title: '',
    tone: 'friendly',
    availability: '24/7',
    languages: ['English']
  },
  greeting: '',
  escalationPolicy: '',
  automations: [],
  knowledgeBaseSummary: '',
  flow: {
    blocks: [
      {
        id: 'block-welcome',
        label: 'Welcome',
        message: 'Hi there! How can I help you today?'
      }
    ],
    routing: []
  }
};

export function AgentForm() {
  const { createAgent } = useAgentStore();
  const [draft, setDraft] = useState<AgentDraft>(defaultDraft);
  const [languageInput, setLanguageInput] = useState('');
  const [automationDraft, setAutomationDraft] = useState({ name: '', trigger: 'keyword', description: '' });
  const [statusMessage, setStatusMessage] = useState('');

  const handlePlatformChange = (platform: Channel) => {
    setDraft(current => ({ ...current, platform }));
  };

  const handleToneChange = (tone: AgentDraft['persona']['tone']) => {
    setDraft(current => ({
      ...current,
      persona: { ...current.persona, tone }
    }));
  };

  const addLanguage = () => {
    const trimmed = languageInput.trim();
    if (!trimmed || draft.persona.languages.includes(trimmed)) return;
    setDraft(current => ({
      ...current,
      persona: { ...current.persona, languages: [...current.persona.languages, trimmed] }
    }));
    setLanguageInput('');
  };

  const removeLanguage = (language: string) => {
    setDraft(current => ({
      ...current,
      persona: {
        ...current.persona,
        languages: current.persona.languages.filter(item => item !== language)
      }
    }));
  };

  const addAutomation = () => {
    const { name, trigger, description } = automationDraft;
    if (!name.trim() || !description.trim()) return;
    setDraft(current => ({
      ...current,
      automations: [
        ...current.automations,
        {
          id: crypto.randomUUID(),
          name: name.trim(),
          trigger: trigger as AgentDraft['automations'][number]['trigger'],
          description: description.trim()
        }
      ]
    }));
    setAutomationDraft({ name: '', trigger: 'keyword', description: '' });
  };

  const removeAutomation = (id: string) => {
    setDraft(current => ({
      ...current,
      automations: current.automations.filter(item => item.id !== id)
    }));
  };

  const updateFlowBlock = (id: string, key: 'label' | 'message', value: string) => {
    setDraft(current => ({
      ...current,
      flow: {
        ...current.flow,
        blocks: current.flow.blocks.map(block => (block.id === id ? { ...block, [key]: value } : block))
      }
    }));
  };

  const addFlowBlock = () => {
    setDraft(current => ({
      ...current,
      flow: {
        ...current.flow,
        blocks: [
          ...current.flow.blocks,
          { id: crypto.randomUUID(), label: 'Follow-up', message: 'Thanks for the update! Anything else I can do?' }
        ]
      }
    }));
  };

  const removeFlowBlock = (id: string) => {
    setDraft(current => ({
      ...current,
      flow: {
        ...current.flow,
        blocks: current.flow.blocks.filter(block => block.id !== id)
      }
    }));
  };

  const submit = () => {
    if (!draft.name.trim()) {
      setStatusMessage('Name is required to launch an agent.');
      return;
    }
    if (!draft.greeting.trim()) {
      setStatusMessage('Add a greeting so the agent knows how to open conversations.');
      return;
    }
    const created = createAgent({
      ...draft,
      name: draft.name.trim(),
      greeting: draft.greeting.trim(),
      persona: {
        ...draft.persona,
        title: draft.persona.title.trim()
      },
      escalationPolicy: draft.escalationPolicy.trim(),
      knowledgeBaseSummary: draft.knowledgeBaseSummary.trim()
    });
    setDraft({ ...defaultDraft, platform: created.platform });
    setStatusMessage(`${created.name} deployed successfully on ${created.platform === 'messenger' ? 'Messenger' : 'WhatsApp'}.`);
  };

  return (
    <section className="space-y-6 rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-floating backdrop-blur">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Create a new agent</h2>
          <p className="mt-1 text-sm text-slate-400">
            Configure persona, workflows, and automations for Messenger or WhatsApp in under five minutes.
          </p>
        </div>
        <PlatformBadge platform={draft.platform} />
      </header>

      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-300">Channel</p>
            <div className="grid grid-cols-2 gap-3">
              {(['messenger', 'whatsapp'] as Channel[]).map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handlePlatformChange(option)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    draft.platform === option
                      ? 'border-white/30 bg-white/5 text-white'
                      : 'border-white/5 bg-white/0 text-slate-300 hover:border-white/10'
                  }`}
                >
                  <p className="text-sm font-semibold">
                    {option === 'messenger' ? 'Meta Messenger' : 'WhatsApp Business'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {option === 'messenger'
                      ? 'Ideal for social commerce, community, and high-volume customer care.'
                      : 'Perfect for transactional alerts, proactive outreach, and support.'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-300" htmlFor="agent-name">
              Agent name
            </label>
            <input
              id="agent-name"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-messenger/70"
              placeholder="e.g. Aurora Support"
              value={draft.name}
              onChange={event => setDraft(current => ({ ...current, name: event.target.value }))}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-300" htmlFor="persona-title">
              Persona title
            </label>
            <input
              id="persona-title"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-messenger/70"
              placeholder="Customer Success AI Specialist"
              value={draft.persona.title}
              onChange={event =>
                setDraft(current => ({
                  ...current,
                  persona: { ...current.persona, title: event.target.value }
                }))
              }
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-300">Tone of voice</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {toneOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleToneChange(option.value)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    draft.persona.tone === option.value
                      ? 'border-messenger/50 bg-messenger/10 text-white shadow-lg shadow-messenger/20'
                      : 'border-white/10 bg-white/0 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <p className="text-sm font-semibold">{option.label}</p>
                  <p className="text-xs text-slate-400">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-300" htmlFor="availability">
              Availability & SLA
            </label>
            <input
              id="availability"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-messenger/70"
              placeholder="24/7 with 2 minute first-response time"
              value={draft.persona.availability}
              onChange={event =>
                setDraft(current => ({
                  ...current,
                  persona: { ...current.persona, availability: event.target.value }
                }))
              }
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-300">Languages</p>
            <div className="flex flex-wrap gap-2">
              {draft.persona.languages.map(language => (
                <span
                  key={language}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white"
                >
                  {language}
                  <button
                    type="button"
                    className="text-slate-400 hover:text-white"
                    onClick={() => removeLanguage(language)}
                    aria-label={`Remove ${language}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-messenger/70"
                placeholder="Add another language"
                value={languageInput}
                onChange={event => setLanguageInput(event.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addLanguage();
                  }
                }}
              />
              <button
                type="button"
                className="rounded-2xl bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/20"
                onClick={addLanguage}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-300" htmlFor="greeting">
              Default greeting
            </label>
            <textarea
              id="greeting"
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-messenger/70"
              placeholder="Hello! I’m here to help you track your orders, suggest products, and route you to our human experts when needed."
              value={draft.greeting}
              onChange={event => setDraft(current => ({ ...current, greeting: event.target.value }))}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-300" htmlFor="knowledge">
              Knowledge base summary
            </label>
            <textarea
              id="knowledge"
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-messenger/70"
              placeholder="Summarize playbooks, product catalogues, or help center content this agent can reference."
              value={draft.knowledgeBaseSummary}
              onChange={event => setDraft(current => ({ ...current, knowledgeBaseSummary: event.target.value }))}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-300" htmlFor="escalation">
              Escalation policy
            </label>
            <textarea
              id="escalation"
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-messenger/70"
              placeholder="Escalate billing or urgent sentiment changes to live agents; route sales-qualified leads to CRM webhook."
              value={draft.escalationPolicy}
              onChange={event => setDraft(current => ({ ...current, escalationPolicy: event.target.value }))}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-300">Automations</p>
              <span className="text-xs text-slate-500">Triggers define when to fire hand-offs or workflows.</span>
            </div>

            <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              {draft.automations.length === 0 && (
                <p className="text-xs text-slate-500">No automations configured yet.</p>
              )}
              {draft.automations.map(automation => (
                <div key={automation.id} className="flex items-start justify-between gap-4 rounded-2xl bg-slate-900/60 p-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{automation.name}</p>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Trigger: {automation.trigger}</p>
                    <p className="mt-1 text-xs text-slate-400">{automation.description}</p>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-slate-400 transition hover:text-red-400"
                    onClick={() => removeAutomation(automation.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="space-y-3 rounded-2xl border border-dashed border-white/20 p-4">
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-messenger/70"
                  placeholder="Automation name"
                  value={automationDraft.name}
                  onChange={event => setAutomationDraft(current => ({ ...current, name: event.target.value }))}
                />
                <select
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-messenger/70"
                  value={automationDraft.trigger}
                  onChange={event => setAutomationDraft(current => ({ ...current, trigger: event.target.value }))}
                >
                  <option value="keyword">Keyword intent</option>
                  <option value="time">Scheduler</option>
                  <option value="handoff">Queue handoff</option>
                  <option value="sentiment">Sentiment shift</option>
                </select>
                <textarea
                  rows={2}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-messenger/70"
                  placeholder="Describe what happens when the trigger fires."
                  value={automationDraft.description}
                  onChange={event => setAutomationDraft(current => ({ ...current, description: event.target.value }))}
                />
                <button
                  type="button"
                  className="w-full rounded-2xl bg-messenger px-4 py-2 text-sm font-semibold text-white transition hover:bg-messenger/90"
                  onClick={addAutomation}
                >
                  Add automation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-300">Conversational flow blocks</h3>
          <button
            type="button"
            onClick={addFlowBlock}
            className="rounded-full border border-white/20 bg-transparent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-white/10"
          >
            Add block
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {draft.flow.blocks.map(block => (
            <div key={block.id} className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <input
                  className="flex-1 rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-messenger/70"
                  value={block.label}
                  onChange={event => updateFlowBlock(block.id, 'label', event.target.value)}
                  placeholder="Block label"
                />
                <button
                  type="button"
                  className="ml-3 text-xs text-slate-400 transition hover:text-red-400"
                  onClick={() => removeFlowBlock(block.id)}
                >
                  Remove
                </button>
              </div>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-messenger/70"
                value={block.message}
                onChange={event => updateFlowBlock(block.id, 'message', event.target.value)}
                placeholder="Message content"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="text-xs text-slate-400">
          {statusMessage || 'Invite your team to test the agent once published.'}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            onClick={() => {
              setDraft(defaultDraft);
              setStatusMessage('Draft cleared. Start fresh!');
            }}
          >
            Reset draft
          </button>
          <button
            type="button"
            className="rounded-2xl bg-gradient-to-r from-messenger to-sky-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-messenger/40 transition hover:from-messenger/90 hover:to-sky-400/90"
            onClick={submit}
          >
            Launch agent
          </button>
        </div>
      </div>
    </section>
  );
}
