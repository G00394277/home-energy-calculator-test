import { useEffect, useState } from "react";
import { createAppliance, deleteAppliance, getAppliances, updateAppliance } from "../api.js";

const emptyForm = {
  image_url: "", manufacturer: "", model: "", output_kw: "",
  efficiency_percent: "", description: ""
};

export default function Appliances() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    try { setItems(await getAppliances()); setError(""); }
    catch (e) { setError(e.message); }
  }
  useEffect(() => { refresh(); }, []);

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError("");
    const payload = {
      ...form,
      image_url: form.image_url.trim() || null,
      output_kw: Number(form.output_kw),
      efficiency_percent: Number(form.efficiency_percent),
      description: form.description.trim() || null
    };
    try {
      if (editingId) await updateAppliance(editingId, payload);
      else await createAppliance(payload);
      setForm(emptyForm); setEditingId(null); await refresh();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  function edit(item) {
    setEditingId(item.id);
    setForm({
      image_url: item.image_url || "", manufacturer: item.manufacturer,
      model: item.model, output_kw: String(item.output_kw),
      efficiency_percent: String(item.efficiency_percent),
      description: item.description || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id) {
    if (!window.confirm("Delete this appliance?")) return;
    try { await deleteAppliance(id); await refresh(); }
    catch (e) { setError(e.message); }
  }

  return (
    <main className="page">
      <div className="page-heading"><div><div className="eyebrow">LIBRARY</div><h1>Heating appliances</h1><p>Maintain the heaters available to your room calculations.</p></div><span className="count-pill">{items.length} saved</span></div>
      {error && <div className="alert error">{error}. Check that Docker services are running.</div>}
      <section className="panel form-panel">
        <h2>{editingId ? "Edit appliance" : "Add an appliance"}</h2>
        <form onSubmit={submit} className="form-grid">
          <label>Manufacturer<input name="manufacturer" value={form.manufacturer} onChange={change} required maxLength="120" /></label>
          <label>Model<input name="model" value={form.model} onChange={change} required maxLength="120" /></label>
          <label>Output (kW)<input name="output_kw" type="number" min="0.01" step="0.01" value={form.output_kw} onChange={change} required /></label>
          <label>Efficiency (%)<input name="efficiency_percent" type="number" min="0.01" max="100" step="0.1" value={form.efficiency_percent} onChange={change} required /></label>
          <label className="wide">Image URL (optional)<input name="image_url" type="url" value={form.image_url} onChange={change} placeholder="https://..." /></label>
          <label className="wide">Description<textarea name="description" value={form.description} onChange={change} rows="3" /></label>
          <div className="form-actions wide">
            <button className="button primary" disabled={busy}>{busy ? "Saving…" : editingId ? "Save changes" : "Add appliance"}</button>
            {editingId && <button type="button" className="button secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>}
          </div>
        </form>
      </section>
      <section className="section">
        <div className="section-title"><h2>Your appliances</h2><button className="text-button" onClick={refresh}>Refresh ↻</button></div>
        {items.length === 0 ? <div className="empty-state">No appliances yet. Add one using the form above.</div> :
          <div className="appliance-grid">{items.map(item => <article className="appliance-card" key={item.id}>
            {item.image_url ? <img src={item.image_url} alt={`${item.manufacturer} ${item.model}`} onError={e => { e.currentTarget.style.display = "none"; }} /> : <div className="image-placeholder">HEAT</div>}
            <div className="appliance-content"><div className="eyebrow">{item.manufacturer}</div><h3>{item.model}</h3>
              <div className="spec-row"><span>{item.output_kw} kW output</span><span>{item.efficiency_percent}% efficiency</span></div>
              {item.description && <p>{item.description}</p>}
              <div className="card-actions"><button className="text-button" onClick={() => edit(item)}>Edit</button><button className="text-button danger-text" onClick={() => remove(item.id)}>Delete</button></div>
            </div>
          </article>)}</div>}
      </section>
    </main>
  );
}
