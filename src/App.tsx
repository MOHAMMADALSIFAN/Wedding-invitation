import { useEffect, useState } from 'react'
import { ArrowDown, ArrowRight, CalendarDays, Check, ChevronUp, Clock3, Heart, MapPin, Menu, Music2, Pause, Share2, X } from 'lucide-react'
import { invitation as info } from './config'
import { toast, useToast } from './hooks/use-toast'

const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${info.venue}, ${info.address}`)}`
const arabicBismillah = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'
const arabicDua = 'بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ'

function Ornament({ light = false }: { light?: boolean }) {
  return <div className={`ornament ${light ? 'ornament-light' : ''}`} aria-hidden="true"><span /><i>✦</i><span /></div>
}
function StarPattern({ className = '' }: { className?: string }) {
  return <div className={`star-pattern ${className}`} aria-hidden="true" />
}
function CoverDecoration() {
  return <div className="cover-decoration" aria-hidden="true">
    {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(corner => <svg key={corner} className={`cover-corner ${corner}`} viewBox="0 0 160 160" fill="none">
      <path d="M8 150V8h142M18 125V18h107M28 95V28h67" stroke="currentColor" strokeWidth=".8" />
      <g stroke="currentColor" strokeWidth=".9">
        {Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx="55" cy="35" rx="8" ry="22" transform={`rotate(${i * 45} 55 55)`} />)}
        <circle cx="55" cy="55" r="9" /><circle cx="55" cy="55" r="4" fill="currentColor" />
        <path d="M55 95c0 28 40 15 40 42M95 55c28 0 15 40 42 40M64 111c19-12 26 0 18 13-12 0-18-5-18-13ZM111 64c-12 19 0 26 13 18 0-12-5-18-13-18Z" />
      </g>
      <path d="m109 25 5 8-5 8-5-8ZM25 109l8 5 8-5-8-5Z" fill="currentColor" />
    </svg>)}
    <div className="cover-halo" />
  </div>
}
function useCountdown() {
  const calculate = () => {
    const seconds = Math.max(0, Math.floor((new Date(info.dateTime).getTime() - Date.now()) / 1000))
    return { days: Math.floor(seconds / 86400), hours: Math.floor(seconds % 86400 / 3600), minutes: Math.floor(seconds % 3600 / 60), seconds: seconds % 60 }
  }
  const [remaining, setRemaining] = useState(calculate)
  useEffect(() => { const id = window.setInterval(() => setRemaining(calculate()), 1000); return () => window.clearInterval(id) }, [])
  return remaining
}
function makeCalendar() {
  const calendarStamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const escapeIcs = (value: string) => value.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n')
  const content = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Alsifan Haleema Invitation//EN', 'BEGIN:VEVENT', `UID:alsifan-haleema-20270117@wedding.invitation`, `DTSTAMP:${calendarStamp(new Date().toISOString())}`, `DTSTART:${calendarStamp(info.dateTime)}`, `DTEND:${calendarStamp(info.dateTimeEnd)}`, `SUMMARY:${escapeIcs(`Nikkah of ${info.groom} & ${info.bride}`)}`, `LOCATION:${escapeIcs(`${info.venue}, ${info.address}`)}`, 'DESCRIPTION:Nikkah at 11:00 AM followed by banquet. We look forward to celebrating with you.', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
  const file = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(file)
  const a = document.createElement('a'); a.href = url; a.download = 'Alsifan-Haleema-Nikkah.ics'; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  toast('Calendar invite downloaded', 'Open the .ics file to add the Nikkah to your calendar.')
}

function App() {
  const [opened, setOpened] = useState(false)
  const [musicOpen, setMusicOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [copyDone, setCopyDone] = useState(false)
  const countdown = useCountdown()
  const { activeToast, dismiss } = useToast()

  function openInvitation() {
    setOpened(true)
    setMusicOpen(true)
    window.setTimeout(() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }
  function goTo(id: string) {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }
  async function shareInvite() {
    if (navigator.share) {
      try { await navigator.share({ title: `${info.groom} & ${info.bride} · Nikkah`, text: `Join us on ${info.dateLabel} at ${info.timeLabel} for our Nikkah!`, url: location.href }); return } catch { /* cancelled or unavailable */ }
    }
    try {
      await navigator.clipboard.writeText(location.href)
      setCopyDone(true); toast('Link copied', 'Share the invitation with family and friends.')
      setTimeout(() => setCopyDone(false), 2500)
    } catch { toast('Sharing unavailable', 'Copy the website address from your browser to share.') }
  }

  return <div className="invitation-shell grain">
    {!opened && <div className="cover-screen" role="dialog" aria-label="Wedding invitation cover">
      <StarPattern className="cover-pattern" />
      <div className="cover-border"><div className="cover-border-inner"><CoverDecoration /><div className="cover-content">
        <div className="cover-top animate-rise"><span className="tiny-cap">THE NIKKAH INVITATION</span><span className="eight-star">۞</span></div>
        <p className="arabic cover-bismillah animate-rise reveal-delay-1" lang="ar" dir="rtl">{arabicBismillah}</p>
        <p className="tiny-cap cover-translit animate-rise reveal-delay-1">IN THE NAME OF ALLAH, THE MOST GRACIOUS, THE MOST MERCIFUL</p>
        <Ornament />
        <p className="cover-intro animate-rise reveal-delay-2">With love, we begin our forever</p>
        <h1 className="cover-names animate-rise reveal-delay-2"><span>Alsifan</span><em>&</em><span>Haleema</span></h1>
        <p className="cover-date animate-rise reveal-delay-3">17 · JANUARY · 2027</p>
        <p className="cover-location animate-rise reveal-delay-3">SINGAPORE</p>
        <button className="open-button animate-rise reveal-delay-4" onClick={openInvitation}>OPEN INVITATION <ArrowRight size={17} /></button>
        <p className="cover-foot">A BEAUTIFUL BEGINNING, IN SHAA ALLAH</p>
      </div></div></div>
    </div>}

    <header className="site-header">
      <button className="logo-mark" onClick={() => goTo('home')} aria-label="Back to top">A <span>&</span> H</button>
      <nav className={`header-links ${menuOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
        <button onClick={() => goTo('invitation')}>The Invitation</button>
        <button onClick={() => goTo('details')}>The Celebration</button>
        <button onClick={() => goTo('dua')}>Our Dua</button>
      </nav>
      <div className="header-actions"><span className="header-date header-event-location"><span>17 JAN 2027</span><a href={mapUrl} target="_blank" rel="noreferrer">{info.venue} · {info.address}</a></span><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X size={22}/> : <Menu size={22}/>}</button></div>
    </header>

    <main>
      <section id="home" className="hero-section">
        <StarPattern className="page-pattern hero-pattern" />
        <div className="hero-ornamental-frame"><CoverDecoration /></div>
        <div className="hero-decor hero-decor-left" aria-hidden="true">✳</div><div className="hero-decor hero-decor-right" aria-hidden="true">✳</div>
        <div className="hero-main reveal">
          <p className="arabic hero-arabic" lang="ar" dir="rtl">{arabicBismillah}</p>
          <p className="eyebrow">BISMILLAHIR RAHMANIR RAHEEM</p>
          <Ornament />
          <p className="hero-kicker">WITH THE BLESSINGS OF ALLAH</p>
          <p className="hero-intro">You are cordially invited to celebrate the Nikkah of</p>
          <h2 className="hero-names">
            <span className="hero-person-name">Mohammad <strong>Alsifan</strong></span>
            <em>&</em>
            <span className="hero-person-name">Haleema <strong>Thasneem</strong></span>
          </h2>
          <p className="hero-tagline">Two souls, one beautiful journey.</p>
          <div className="hero-date-rule"><span>✦</span><p>SUNDAY <b>·</b> 17 JANUARY 2027 <b>·</b> 11:00 AM</p><span>✦</span></div>
          <button className="scroll-cue" onClick={() => goTo('invitation')}>SCROLL TO DISCOVER <ArrowDown size={16}/></button>
        </div>
        <div className="hero-bottom-border" aria-hidden="true" />
      </section>

      <section id="invitation" className="invitation-section section-pad">
        <StarPattern className="page-pattern" />
        <div className="content-wrap"><div className="section-marker">01 <span>—</span> THE INVITATION</div>
          <p className="arabic greeting" lang="ar" dir="rtl">السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ</p>
          <p className="eyebrow">ASSALAMU ALAIKUM WA RAHMATULLAHI WA BARAKATUH</p>
          <h2 className="section-heading">With the blessings <em>of Allah.</em></h2>
          <Ornament />
          <p className="invitation-copy family-invitation-copy"><strong>Together with our families, we joyfully invite you to join us as we begin our journey in marriage. Your presence, love and duas would make these days all the more special.</strong></p>
          <div className="couple-display family-display">
            <div className="person">
              <p className="family-caption">Parents of the groom</p>
              <p className="family-names">{info.groomParents.split(' & ').map((name, index) => <span key={name}>{index > 0 && <span className="family-and">&</span>}<strong>{name}</strong></span>)}</p>
              <p className="person-label">THE GROOM</p>
              <h3>{info.groom}</h3>
              <p className="qualification">{info.groomQualification}</p>
            </div>
            <div className="person">
              <p className="family-caption">Parents of the bride</p>
              <p className="family-names">{info.brideParents.split(' & ').map((name, index) => <span key={name}>{index > 0 && <span className="family-and">&</span>}<strong>{name}</strong></span>)}</p>
              <p className="person-label">THE BRIDE</p>
              <h3>{info.bride}</h3>
              <p className="qualification">{info.brideQualification}</p>
            </div>
          </div>
          <div className="blessing-banner"><span>✧</span><p>May Allah bless this union with love, mercy and barakah.</p><span>✧</span></div>
        </div>
      </section>

      <section id="details" className="details-section section-pad"><StarPattern className="details-pattern" />
        <div className="content-wrap"><div className="section-marker section-marker-light">02 <span>—</span> THE CELEBRATION</div>
          <p className="eyebrow eyebrow-gold">IN SHAA ALLAH</p><h2 className="section-heading section-heading-light">The blessed <em>occasion.</em></h2><Ornament light/>
          <p className="details-lead">Nikkah will be solemnized on</p>
          <div className="event-panel"><div className="event-frame">
            <div className="event-topline">YOU ARE WARMLY INVITED</div><div className="event-title">Nikkah</div><div className="event-calendar"><span className="event-day">17</span><div><span className="event-month">JANUARY</span><span className="event-year">2027</span></div></div>
            <div className="event-meta"><div><CalendarDays size={19}/><span>Sunday</span></div><div><Clock3 size={19}/><span>11:00 AM SGT</span></div></div>
            <div className="event-divider"/><MapPin className="location-icon" size={27}/><h3>{info.venue}</h3><p className="venue-address">{info.address}</p><p className="banquet-note">Followed by banquet</p>
            <div className="event-buttons"><a className="btn btn-gold" href={mapUrl} target="_blank" rel="noreferrer"><MapPin size={17}/> GET DIRECTIONS</a><button className="btn btn-outline" onClick={makeCalendar}><CalendarDays size={17}/> ADD TO CALENDAR</button></div>
          </div></div>
          <p className="time-note">All timings are Singapore time (SGT).</p>
        </div>
      </section>

      <section className="countdown-section section-pad"><StarPattern className="page-pattern" /><div className="content-wrap"><p className="eyebrow">UNTIL OUR FOREVER BEGINS</p><h2 className="section-heading">Counting down <em>the days.</em></h2><div className="countdown-grid">{Object.entries(countdown).map(([unit, number]) => <div className="count-unit" key={unit}><strong>{String(number).padStart(2, '0')}</strong><span>{unit.toUpperCase()}</span></div>)}</div><p className="countdown-note">Every moment brings us closer, In Shaa Allah.</p></div></section>

      <section id="dua" className="dua-section section-pad"><StarPattern className="page-pattern" /><div className="content-wrap"><div className="section-marker">03 <span>—</span> A PRAYER FOR THE COUPLE</div><div className="dua-symbol">۞</div><p className="eyebrow">KEEP US IN YOUR DUAS</p><h2 className="section-heading">Joined together <em>in goodness.</em></h2><p className="arabic dua-arabic" lang="ar" dir="rtl">{arabicDua}</p><p className="dua-translit">Baarakallaahu laka, wa baaraka alaika,<br/>wa jama'a bainakumaa fee khair.</p><p className="dua-translation">“May Allah bless you, shower His blessings upon you, and join you together in goodness.”</p><Ornament /><p className="ameen">Ameen.</p></div></section>

      <footer className="footer"><StarPattern className="footer-pattern"/><div className="footer-content"><p className="eyebrow eyebrow-gold">WITH LOVE & GRATITUDE</p><h2>Alsifan <em>&</em> Haleema</h2><p>We look forward to sharing this blessed day with you.</p><div className="footer-actions"><button onClick={shareInvite}><Share2 size={16}/>{copyDone ? 'LINK COPIED' : 'SHARE INVITATION'}</button><button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setOpened(false) }}><ChevronUp size={16}/> VIEW COVER AGAIN</button></div><span className="footer-last">17 JANUARY 2027 · SINGAPORE · IN SHAA ALLAH</span></div></footer>
    </main>

    {opened && <div className="floating-controls"><button className="float-button" onClick={shareInvite} aria-label="Share invitation" title="Share invitation"><Share2 size={19}/></button><button className={`float-button music-button ${musicOpen ? 'music-is-open' : ''}`} onClick={() => setMusicOpen(!musicOpen)} aria-label={musicOpen ? 'Stop music' : 'Play music'} title={musicOpen ? 'Stop music' : 'Play music'} aria-pressed={musicOpen}>{musicOpen ? <Pause size={19}/> : <Music2 size={19}/>}</button></div>}
    {musicOpen && <iframe
      className="background-music"
      src={`https://www.youtube-nocookie.com/embed/${info.youtubeVideoId}?autoplay=1&loop=1&playlist=${info.youtubeVideoId}&controls=0&rel=0&playsinline=1`}
      title="Background wedding music"
      allow="autoplay; encrypted-media"
      referrerPolicy="strict-origin-when-cross-origin"
      tabIndex={-1}
      aria-hidden="true"
    />}
    {activeToast && <div className="toast" role="status"><span className="toast-icon"><Check size={17}/></span><div><strong>{activeToast.title}</strong>{activeToast.description && <small>{activeToast.description}</small>}</div><button onClick={dismiss} aria-label="Dismiss notification"><X size={16}/></button></div>}
    <span className="sr-only"><Heart/> Wedding invitation for {info.groom} and {info.bride}</span>
  </div>
}
export default App
