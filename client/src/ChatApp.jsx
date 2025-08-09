import React, { useState, useEffect, useRef } from 'react';

export default function ChatApp() {
  const [locale, setLocale] = useState('ru');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [paid, setPaid] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const words = input.trim().split(/\s+/).length;
    if (!paid && wordCount + words > 50) {
      alert(locale === 'ru' ? 'Доступно только 50 слов в пробной версии. Оплатите подписку для продолжения.' :
            locale === 'tr' ? 'Deneme sürümünde yalnızca 50 kelime kullanılabilir. Devam etmek için abone olun.' :
            'Only 50 words available in trial. Please subscribe to continue.');
      return;
    }

    setWordCount(prev => prev + words);

    const userMsg = { role: 'user', content: input, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const model = paid ? 'gpt-5' : 'gpt-4';
      const resp = await fetch(`/api/chat?locale=${locale}&model=${model}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content }),
      });
      if (!resp.ok) throw new Error(await resp.text());
      const data = await resp.json();
      const assistantMsg = { role: 'assistant', content: data.reply, id: Date.now()+1 };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'system', content: 'Ошибка: ' + e.message, id: Date.now()+2 }]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', padding:16}}>
      <div style={{width:'100%', maxWidth:800, background:'#fff', borderRadius:16, boxShadow:'0 4px 12px rgba(0,0,0,0.08)', overflow:'hidden'}}>
        <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:16, borderBottom:'1px solid #e5e7eb'}}>
          <h1 style={{fontSize:18, fontWeight:600}}>ChatGPT Multiregion {paid ? '(ChatGPT-5)' : '(GPT-4 Trial)'}</h1>
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <select value={locale} onChange={e => setLocale(e.target.value)} style={{padding:8, borderRadius:6}}>
              <option value="ru">Русский (RU)</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="es">Español</option>
              <option value="tr">Türkçe</option>
            </select>
            <button style={{padding:'6px 10px', borderRadius:6, background:'#f3f4f6'}}>Account</button>
          </div>
        </header>

        {!paid && (
          <div style={{background:'#FEF3C7', color:'#854D0E', textAlign:'center', padding:8, fontSize:13}}>
            {locale === 'ru' ? 'Вы используете пробную версию с GPT-4 (устаревшая модель). Доступно 50 слов бесплатно.' :
             locale === 'tr' ? 'Eski model GPT-4 ile deneme sürümünü kullanıyorsunuz. 50 kelime ücretsiz.' :
             'You are using a trial with GPT-4 (old model). 50 words available for free.'}
          </div>
        )}

        <main style={{padding:16, height:'60vh', overflowY:'auto'}}>
          {messages.length === 0 && (
            <div style={{textAlign:'center', color:'#6b7280'}}>
              {locale === 'ru' ? 'Начните общение — отправьте сообщение ниже' :
               locale === 'tr' ? 'Sohbete başlayın — aşağıya mesaj yazın' :
               'Start chatting — send a message below'}
            </div>
          )}

          {messages.map(m => (
            <div key={m.id} style={{margin:'12px 0', maxWidth:'80%', marginLeft: m.role === 'user' ? 'auto' : undefined, textAlign: m.role === 'user' ? 'right' : 'left'}}>
              <div style={{display:'inline-block', padding:'10px 16px', borderRadius:12, background: m.role === 'user' ? '#2563eb' : m.role === 'assistant' ? '#f3f4f6' : '#fee2e2', color: m.role === 'user' ? '#fff' : '#111'}}>
                {m.content}
              </div>
            </div>
          ))}
          <div ref={ref} />
        </main>

        <footer style={{padding:16, borderTop:'1px solid #e5e7eb'}}>
          <div style={{display:'flex', gap:8}}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={2}
              placeholder={locale === 'ru' ? 'Напишите сообщение...' :
                           locale === 'tr' ? 'Bir mesaj yazın...' :
                           'Write a message...'}
              style={{flex:1, padding:10, borderRadius:8, border:'1px solid #e5e7eb', resize:'none'}}
            />
            <button onClick={sendMessage} disabled={loading} style={{padding:'8px 14px', borderRadius:8, background:'#2563eb', color:'#fff'}}>
              {loading ? (locale === 'ru' ? 'Отправка...' :
                           locale === 'tr' ? 'Gönderiliyor...' :
                           'Sending...') :
               (locale === 'ru' ? 'Отправить' :
                locale === 'tr' ? 'Gönder' :
                'Send')}
            </button>
          </div>
        </footer>
      </div>

      {/* Оплата: DenizBank, СБП, автосписание */}
      <div style={{width:'100%', maxWidth:800, marginTop:16, padding:16, background:'#fff', borderRadius:12, boxShadow:'0 4px 12px rgba(0,0,0,0.06)'}}>
        <h2 style={{fontSize:16, fontWeight:600, marginBottom:8}}>
          {locale === 'ru' ? 'Оформить подписку — 199₽ / мес (курс конвертируется)' :
           locale === 'tr' ? 'Abonelik — Aylık 199₽ (kur çevrilir)' :
           'Subscription — 199₽ / month (currency converted)'}
        </h2>
        <div style={{display:'flex', flexDirection:'column', gap:12}}>
          <form onSubmit={(e) => { e.preventDefault(); setPaid(true); }} style={{display:'flex', gap:8}}>
            <input type="number" name="amount" placeholder={locale === 'ru' ? 'Сумма' : locale === 'tr' ? 'Tutar' : 'Amount'} defaultValue={199} required style={{flex:1, padding:10, borderRadius:8, border:'1px solid #e5e7eb'}} />
            <button type="submit" style={{padding:'10px 14px', borderRadius:8, background:'#10b981', color:'#fff'}}> {locale === 'ru' ? 'Оплатить' : locale === 'tr' ? 'Öde' : 'Pay'} </button>
          </form>

          <button onClick={() => { setPaid(true); }} style={{padding:'10px 14px', borderRadius:8, background:'#7c3aed', color:'#fff'}}> {locale === 'ru' ? 'Оплатить через СБП' : locale === 'tr' ? 'SBP ile Öde' : 'Pay via SBP'} </button>

          <label style={{display:'flex', alignItems:'center', gap:8}}>
            <input type="checkbox" onChange={(e) => { if (e.target.checked) alert(locale === 'ru' ? 'Автосписание подключено' : locale === 'tr' ? 'Otomatik ödeme etkinleştirildi' : 'Auto-renew enabled'); }} />
            {locale === 'ru' ? 'Подключить автосписание' : locale === 'tr' ? 'Otomatik ödeme etkinleştir' : 'Enable auto-renew'}
          </label>
        </div>
      </div>
    </div>
  );
}
