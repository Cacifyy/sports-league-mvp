import { Link } from "react-router-dom";
import { ctaBanner, featureStats, formatSeasonStrip, seasonInfo } from "../data/home";

export default function Home() {
  const strip = formatSeasonStrip(seasonInfo);

  return (
    <div className="page">
      <div className="hero">
        <h1>JOSH IS <span>GAY</span> AS FUCK</h1>
        <p>Three divisions. Ten weeks. One champion. Join DodgeCity this summer.</p>
        <Link to="/register" className="btn">Register now</Link>
      </div>

      <div className="strip">
        {Object.entries(strip).map(([key, val]) => (
          <div key={key} className="strip-item">
            <div className="label">{key}</div>
            <div className="value">{val}</div>
          </div>
        ))}
      </div>

      <div className="stats-grid">
        {featureStats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="val">{s.value}</div>
            <div className="lbl">{s.label}</div>
            <div className="desc">{s.description}</div>
          </div>
        ))}
      </div>

      <div className="cta-banner">
        <h2>{ctaBanner.heading}</h2>
        <p>{ctaBanner.subtext}</p>
        <Link to="/register" className="btn">{ctaBanner.buttonLabel}</Link>
      </div>
    </div>
  );
}
