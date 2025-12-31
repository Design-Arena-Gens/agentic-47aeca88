'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useAgentStore } from '@/lib/store';
import type { Agent } from '@/lib/types';

type ChatMessage = {
  id: string;
  author: 'user' | 'agent';
  content: string;
  timestamp: number;
};

const sampleUserPrompts = [
  'Can you reschedule my delivery? I need it tomorrow morning.',
  'Do you have recommendations for eco-friendly bundles?',
  'I am getting an error when pairing my device. Help!'
];

const toneModifiers: Record<Agent['persona']['tone'], string> = {
  friendly: '😊 Absolutely! ',
  concise: 'Sure thing. ',
  playful: 'You got it! ✨ ',
  professional: 'Certainly. '
};

export function AgentSimulator() {
  const { agents, selectedAgentId } = useAgentStore();
  const agent = useMemo(() => agents.find(item => item.id === selectedAgentId) ?? agents[0], [
    agents,
    selectedAgentId
  ]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!agent) return;
    setMessages([
      {
        id: crypto.randomUUID(),
        author: 'agent',
        content: agent.greeting,
        timestamp: Date.now()
      }
    ]);
    setInput('');
  }, [agent]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!agent) {
    return null;
  }

  const sendMessage = (content: string) => {
    if (!content.trim()) return;
    const trimmed = content.trim();
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      author: 'user',
      content: trimmed,
      timestamp: Date.now()
    };
    setMessages(previous => [...previous, userMessage]);

    const automationHint = agent.automations.find(auto =>
      trimmed.toLowerCase().includes(auto.name.toLowerCase().split(' ')[0])
    );

    const responsePieces = [toneModifiers[agent.persona.tone]];
    responsePieces.push(
      automationHint
        ? `I can trigger the ${automationHint.name} automation to handle that. ${automationHint.description}`
        : 'Here’s how I can help: '
    );
    responsePieces.push(
      agent.flow.blocks[0]?.message || 'Give me a moment to pull that up for you.'
    );
    if (agent.platform === 'whatsapp') {
      responsePieces.push(' Reply with *menu* anytime to view quick actions.');
    }

    const agentMessage: ChatMessage = {
      id: crypto.randomUUID(),
      author: 'agent',
      content: responsePieces.join(' '),
      timestamp: Date.now() + 100
    };

    setTimeout(() => {
      setMessages(previous => [...previous, agentMessage]);
    }, 400);
  };

  return (
    <section className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-floating backdrop-blur">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Preview</p>
          <h2 className="text-xl font-semibold text-white">Conversation simulator</h2>
        </div>
        <button
          type="button"
          className="rounded-full border border-white/20 px-3 py-1 text-xs text-slate-300 transition hover:bg-white/10"
          onClick={() => {
            const random = sampleUserPrompts[Math.floor(Math.random() * sampleUserPrompts.length)];
            sendMessage(random);
          }}
        >
          Inject prompt
        </button>
      </header>

      <div className="h-80 overflow-y-auto rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-4">
        <div className="space-y-3">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.author === 'agent' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
                  message.author === 'agent'
                    ? 'bg-messenger/15 text-slate-100'
                    : 'bg-white text-slate-900'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </div>

      <form
        className="flex gap-3"
        onSubmit={event => {
          event.preventDefault();
          sendMessage(input);
          setInput('');
        }}
      >
        <input
          className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-messenger/70"
          placeholder="Type a message to test the agent"
          value={input}
          onChange={event => setInput(event.target.value)}
        />
        <button
          type="submit"
          className="rounded-2xl bg-messenger px-5 py-3 text-sm font-semibold text-white transition hover:bg-messenger/90"
        >
          Send
        </button>
      </form>
    </section>
  );
}
