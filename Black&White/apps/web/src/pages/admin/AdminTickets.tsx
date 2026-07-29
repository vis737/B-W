// apps/web/src/pages/admin/AdminTickets.tsx
import React, { useState } from 'react';
import { MOCK_TICKETS } from '../../data/mockData';
import { useToast } from '../../contexts/ToastContext';

export const AdminTickets: React.FC = () => {
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<typeof MOCK_TICKETS[0] | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const { showToast } = useToast();

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage) return;

    const updated = {
      ...selectedTicket,
      status: 'resolved' as const,
      messages: [
        ...selectedTicket.messages,
        {
          id: `m-${Date.now()}`,
          sender: 'admin' as const,
          sender_name: 'Master Tailor Concierge',
          message: replyMessage,
          created_at: new Date().toISOString()
        }
      ]
    };

    setTickets(tickets.map((t) => (t.id === selectedTicket.id ? updated : t)));
    setSelectedTicket(updated);
    setReplyMessage('');
    showToast('Reply dispatched to client.', 'success', 'Ticket Answered');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">Client Desk</span>
          <h1 className="text-3xl font-serif font-black uppercase text-white">Support Tickets</h1>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs font-mono text-zinc-300">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900 text-amber-400 uppercase">
              <th className="p-4">Ticket #</th>
              <th className="p-4">Client Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Reply Thread</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {tickets.map((t) => (
              <tr key={t.id} className="hover:bg-zinc-900/50">
                <td className="p-4 font-bold text-white">{t.ticket_number}</td>
                <td className="p-4">{t.customer_name}</td>
                <td className="p-4 uppercase">{t.category}</td>
                <td className="p-4 text-amber-400 font-bold uppercase">{t.priority}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 text-[10px] uppercase font-bold rounded ${t.status === 'resolved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
                    {t.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => setSelectedTicket(t)}
                    className="px-3 py-1 bg-amber-400 text-black font-bold rounded text-[10px] uppercase hover:bg-white transition-colors"
                  >
                    Open Thread
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-xl max-w-xl w-full space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <h3 className="font-serif font-bold text-lg uppercase text-white">{selectedTicket.ticket_number} - {selectedTicket.subject}</h3>
              <button onClick={() => setSelectedTicket(null)} className="text-zinc-500 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {selectedTicket.messages.map((m) => (
                <div key={m.id} className={`p-3 rounded border text-xs ${m.sender === 'admin' ? 'bg-amber-950/20 border-amber-500/40 text-amber-100 ml-6' : 'bg-black border-zinc-800 text-zinc-300 mr-6'}`}>
                  <div className="flex justify-between font-mono text-[10px] text-zinc-400 mb-1">
                    <span>{m.sender_name}</span>
                    <span>{m.created_at.split('T')[0]}</span>
                  </div>
                  <p>{m.message}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendReply} className="space-y-3 text-xs">
              <textarea
                rows={3}
                required
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type official concierge reply..."
                className="w-full bg-black border border-zinc-800 p-3 rounded text-white outline-none focus:border-amber-400"
              />
              <button type="submit" className="w-full py-3 bg-amber-400 text-black font-bold uppercase text-xs tracking-widest rounded hover:bg-white">
                Dispatch Reply to Client
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTickets;
