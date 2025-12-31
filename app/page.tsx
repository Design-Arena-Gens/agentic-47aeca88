import { AgentForm } from '@/components/AgentForm';
import { AgentOverview } from '@/components/AgentOverview';
import { AgentSimulator } from '@/components/AgentSimulator';

export default function Home() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12">
      <header className="space-y-4 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[11px] uppercase tracking-[0.32em] text-slate-300">
          OMNICHANNEL PLAYBOOKS
        </p>
        <h1 className="text-4xl font-semibold text-white md:text-5xl">
          Launch Messenger & WhatsApp agents from a single command center
        </h1>
        <p className="mx-auto max-w-2xl text-base text-slate-300">
          Blueprint personas, automate responses, and simulate conversations before you flip the switch. Everything here is
          production-ready for your CX team on day one.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <AgentForm />
        <div className="space-y-6">
          <AgentOverview />
          <AgentSimulator />
        </div>
      </div>

      <footer className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 text-center text-xs text-slate-500">
        <p>
          Export flows to Meta Workplace, Twilio, or Sunshine Conversations in seconds. Audit logs and analytics dashboards are
          included in paid plans.
        </p>
      </footer>
    </div>
  );
}
