import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="page">
      <section className="hero">
        <div className="eyebrow">HOME ENERGY · IRELAND</div>
        <h1>Make your home’s<br /><em>energy work smarter.</em></h1>
        <p className="hero-copy">A starting point for understanding heating appliances, room heat demand and household energy use.</p>
        <div className="actions">
          <Link className="button primary" to="/calculator">Open room calculator</Link>
          <Link className="button secondary" to="/appliances">Manage appliances</Link>
        </div>
        <div className="hero-note">Built to grow: smart meter insights, energy costs, carbon and BER modelling.</div>
      </section>
      <section className="feature-grid">
        <Link to="/appliances" className="feature-card">
          <div className="feature-icon">01</div><h2>Appliance library</h2>
          <p>Keep a catalogue of heaters, their rated output and efficiency.</p><span>Manage appliances →</span>
        </Link>
        <Link to="/calculator" className="feature-card">
          <div className="feature-icon">02</div><h2>Room calculator</h2>
          <p>Enter room dimensions, insulation and a target temperature.</p><span>Estimate heat demand →</span>
        </Link>
        <div className="feature-card muted">
          <div className="feature-icon">03</div><h2>Energy insights</h2>
          <p>Future module for ESB Networks smart meter data, tariffs and costs.</p><span>Planned feature</span>
        </div>
      </section>
    </main>
  );
}
