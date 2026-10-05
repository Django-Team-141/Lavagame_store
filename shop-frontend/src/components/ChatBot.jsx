import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api.js";

const initialMessage = { role: "assistant", content: "سلام 👋 من دستیار هوشمند لاوا گیم هستم. درباره محصولات، خرید یا امکانات فروشگاه بپرس." };

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, loading]);

  async function sendMessage(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const history = [...messages, { role: "user", content: text }];
    setMessages(history); setInput(""); setLoading(true);
    try {
      const data = await api.chat(text, history.slice(-10));
      setMessages(cur => [...cur, { role: "assistant", content: data.answer || "پاسخی دریافت نشد." }]);
    } catch (error) {
      setMessages(cur => [...cur, { role: "assistant", content: error.message || "فعلاً ارتباط با دستیار برقرار نشد." }]);
    } finally { setLoading(false); }
  }

  return <div className="lava-chat" dir="rtl">
    {open && <section className="lava-chat-panel">
      <header className="lava-chat-header"><div className="lava-chat-avatar">L</div><div><strong>دستیار لاوا گیم</strong><span><i /> آنلاین</span></div><button onClick={() => setOpen(false)}>×</button></header>
      <div className="lava-chat-messages">{messages.map((m,i)=><div key={i} className={`lava-chat-message ${m.role}`}>{m.content}</div>)}{loading&&<div className="lava-chat-message assistant typing"><i/><i/><i/></div>}<div ref={endRef}/></div>
      <form className="lava-chat-form" onSubmit={sendMessage}><input value={input} onChange={e=>setInput(e.target.value)} placeholder="پیامت را بنویس..." maxLength={500} disabled={loading}/><button disabled={loading||!input.trim()}>➤</button></form>
    </section>}
    {!open && <span className="lava-chat-hint">دستیار لاوا گیم</span>}
    <button className="lava-chat-toggle" onClick={()=>setOpen(v=>!v)} aria-label="دستیار">{open?"×":"✦"}</button>
  </div>;
}
