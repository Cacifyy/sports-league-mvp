import { useState } from "react";
import {
  divisionOptions,
  includedItems,
  pricingTiers,
  seasonDetails,
  submitRegistration,
  validateForm,
} from "../data/register";
import type { Division, RegistrationFormData, RegistrationType } from "../data/register";

const empty: RegistrationFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  registrationType: "join",
  teamName: "",
  division: "casual",
  agreedToWaiver: false,
  subscribeToUpdates: false,
};

export default function Register() {
  const [form, setForm] = useState<RegistrationFormData>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationFormData, string>>>({});
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof RegistrationFormData>(key: K, value: RegistrationFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = validateForm(form);
    if (!result.valid) { setErrors(result.errors); return; }
    setSubmitting(true);
    const res = await submitRegistration(form);
    setSubmitting(false);
    if (res.success) { setSuccess(res.message); setForm(empty); }
  }

  return (
    <div className="page">
      <div className="register-layout">
        <div className="form-card">
          <h1>Register for Summer 2025</h1>

          {success && <div className="success-msg">{success}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field-row">
              <div className="field">
                <label>First name</label>
                <input className={errors.firstName ? "error" : ""} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
                {errors.firstName && <div className="err-msg">{errors.firstName}</div>}
              </div>
              <div className="field">
                <label>Last name</label>
                <input className={errors.lastName ? "error" : ""} value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
                {errors.lastName && <div className="err-msg">{errors.lastName}</div>}
              </div>
            </div>

            <div className="field">
              <label>Email</label>
              <input type="email" className={errors.email ? "error" : ""} value={form.email} onChange={(e) => set("email", e.target.value)} />
              {errors.email && <div className="err-msg">{errors.email}</div>}
            </div>

            <div className="field">
              <label>Phone (optional)</label>
              <input value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
              {errors.phone && <div className="err-msg">{errors.phone}</div>}
            </div>

            <div className="field">
              <label>Registration type</label>
              <select value={form.registrationType} onChange={(e) => set("registrationType", e.target.value as RegistrationType)}>
                <option value="join">Join an existing team</option>
                <option value="new-team">Register a new team</option>
                <option value="free-agent">Sign up as free agent</option>
              </select>
            </div>

            {form.registrationType === "new-team" && (
              <div className="field">
                <label>Team name</label>
                <input className={errors.teamName ? "error" : ""} value={form.teamName ?? ""} onChange={(e) => set("teamName", e.target.value)} />
                {errors.teamName && <div className="err-msg">{errors.teamName}</div>}
              </div>
            )}

            <div className="field">
              <label>Division</label>
              <div className="division-grid">
                {divisionOptions.map((d) => (
                  <div key={d.id} className={`div-option${form.division === d.id ? " selected" : ""}`} onClick={() => set("division", d.id as Division)}>
                    <div className="name">{d.label}</div>
                    <div className="desc">{d.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="field">
              <label className="checkbox-row">
                <input type="checkbox" checked={form.agreedToWaiver} onChange={(e) => set("agreedToWaiver", e.target.checked)} />
                <span>I agree to the participant waiver and release of liability.</span>
              </label>
              {errors.agreedToWaiver && <div className="err-msg">{errors.agreedToWaiver}</div>}
            </div>

            <div className="field">
              <label className="checkbox-row">
                <input type="checkbox" checked={form.subscribeToUpdates} onChange={(e) => set("subscribeToUpdates", e.target.checked)} />
                <span>Send me league updates and news.</span>
              </label>
            </div>

            <button className="submit-btn" type="submit" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit registration"}
            </button>
          </form>
        </div>

        <div>
          <div className="sidebar-card" style={{ marginBottom: "1rem" }}>
            <h3>Season details</h3>
            {Object.entries(seasonDetails).map(([k, v]) => (
              <div key={k} className="detail-row">
                <span className="key">{k.replace(/([A-Z])/g, " $1")}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>

          <div className="sidebar-card" style={{ marginBottom: "1rem" }}>
            <h3>Pricing</h3>
            {pricingTiers.map((t) => (
              <div key={t.label} className="detail-row">
                <span className="key">{t.label}</span>
                <span>${t.pricePerPlayer}{t.note ? ` (${t.note})` : "/player"}</span>
              </div>
            ))}
          </div>

          <div className="sidebar-card">
            <h3>What's included</h3>
            <ul className="includes">
              {includedItems.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
