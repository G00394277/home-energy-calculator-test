import { useEffect, useState } from "react";
import { calculateRoom, getAppliances } from "../api.js";

export default function Calculator() {
  const [appliances, setAppliances] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState({ length_m: 4, width_m: 3, height_m: 2.4, target_temp_c: 20, insulation: "average" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAppliances().then(data => { setAppliances(data); if (data.length) setSelectedId(String(data[0].id)); })
      .catch(e => setError(e.message));
  }, []);

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.type === "range" || e.target.type === "number" ? Number(e.target.value) : e.target.value });
    setResult(null);
  }

  async function submit(e) {
    e.preventDefault(); setError(""); setResult(null);
    const appliance = appliances.find(a => String(a.id) === selectedId);
    if (!appliance) { setError("Add an appliance first, then select it here."); return; }
    try {
      setResult(await calculateRoom({ ...form, appliance_kw: appliance.output_kw }));
    } catch (e) { setError(e.message); }
  }

  return (
    <main className="page">
      <div className="page-heading"><div><div className="eyebrow">ROOM TOOL</div><h1>Room heating calculator</h1><p>Explore a simplified estimate using room volume and insulation category.</p></div></div>
      {error && <div className="alert error">{error}</div>}
      <div className="calculator-layout">
        <form className="panel calculator-form" onSubmit={submit}>
          <h2>Room details</h2>
          <div className="form-grid three">
            <label>Length (m)<input name="length_m" type="number" min="0.1" step="0.1" value={form.length_m} onChange={change} required /></label>
            <label>Width (m)<input name="width_m" type="number" min="0.1" step="0.1" value={form.width_m} onChange={change} required /></label>
            <label>Height (m)<input name="height_m" type="number" min="0.1" step="0.1" value={form.height_m} onChange={change} required /></label>
          </div>
          <div className="field-block">
            <div className="range-heading"><label htmlFor="target_temp_c">Target temperature</label><strong>{form.target_temp_c}°C</strong></div>
            <input id="target_temp_c" name="target_temp_c" type="range" min="16" max="22" step="1" value={form.target_temp_c} onChange={change} />
            <div className="range-labels"><span>16°C</span><span>22°C</span></div>
          </div>
          <label>Insulation level
            <select name="insulation" value={form.insulation} onChange={change}>
              <option value="poor">Poor</option><option value="average">Average</option><option value="good">Good</option>
            </select>
          </label>
          <label>Heating appliance
            <select value={selectedId} onChange={e => setSelectedId(e.target.value)}>
              <option value="">Select an appliance</option>
              {appliances.map(a => <option key={a.id} value={a.id}>{a.manufacturer} {a.model} ({a.output_kw} kW)</option>)}
            </select>
          </label>
          <button className="button primary full-button" type="submit">Calculate estimate →</button>
        </form>
        <section className="panel result-panel">
          <div className="eyebrow">CALCULATION RESULT</div><h2>Your room</h2>
          {result ? <>
            <div className="result-number">{result.estimated_heat_demand_kw}<span> kW</span></div>
            <p className="result-caption">Simplified estimated heat demand</p>
            <div className={`status ${result.nominally_suitable ? "good" : "warning"}`}>{result.nominally_suitable ? "Nominal output meets estimate" : "Selected output is below estimate"}</div>
            <div className={`status ${result.potential_oversizing_warning ? "warning" : "good"}`}>{result.potential_oversizing_warning ? "Potential oversizing — investigate further" : "No oversizing flag from this simple screen"}</div>
            <div className="result-details"><div><span>Room volume</span><strong>{result.volume_m3} m³</strong></div><div><span>Appliance output</span><strong>{result.selected_appliance_kw} kW</strong></div></div>
            <p className="disclaimer">{result.warning}</p>
          </> : <div className="empty-result"><div className="empty-symbol">⌁</div><p>Enter your room details and choose an appliance to see an estimate.</p></div>}
        </section>
      </div>
      <div className="alert info"><strong>Important:</strong> This is a demonstration calculation, not a validated heat-loss model. It cannot predict whether a room will reach 24°C within one hour. Do not use it to select real heating equipment.</div>
    </main>
  );
}
