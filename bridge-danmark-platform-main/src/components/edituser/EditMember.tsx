import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { updateClubMember, type ClubMember, type UpdateClubMember } from "@/api/firebirdApi";
import { MemberFields } from "./MemberFields";
import {
  formFromMember,
  memberSaveError,
  refreshMemberQueries,
  type MemberForm,
} from "./memberForm";
import "./edituser.css";

export function EditMember({
  fdbNo,
  clubId,
  member,
  onCancel,
  onSaved,
}: {
  fdbNo: string;
  clubId: string;
  member: ClubMember;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<MemberForm>(() => formFromMember(member));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name as keyof MemberForm;
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    if (!form.name.trim()) {
      setError("Indtast et navn.");
      return;
    }

    const changes: UpdateClubMember = {};
    if (form.name.trim() !== (member.name ?? "")) changes.name = form.name.trim();
    if (form.email.trim() !== (member.email ?? "")) changes.email = form.email.trim() || null;
    if (form.phone1.trim() !== (member.phone1 ?? "")) changes.phone1 = form.phone1.trim() || null;
    if (form.phone2.trim() !== (member.phone2 ?? "")) changes.phone2 = form.phone2.trim() || null;
    if (form.phone3.trim() !== (member.phone3 ?? "")) changes.phone3 = form.phone3.trim() || null;
    if (form.address1.trim() !== (member.address1 ?? ""))
      changes.address1 = form.address1.trim() || null;
    if (form.address2.trim() !== (member.address2 ?? ""))
      changes.address2 = form.address2.trim() || null;
    if (form.zipCode.trim() !== (member.zipCode ?? ""))
      changes.zipCode = form.zipCode.trim() || null;
    if (form.city.trim() !== (member.city ?? "")) changes.city = form.city.trim() || null;
    if (form.countryCode.trim().toUpperCase() !== (member.countryCode ?? ""))
      changes.countryCode = form.countryCode.trim().toUpperCase() || null;
    if (form.clubStart !== (member.clubStart ?? "")) changes.clubStart = form.clubStart || null;
    if (Object.keys(changes).length === 0) {
      setMessage("Der er ingen ændringer at gemme.");
      return;
    }

    setSaving(true);
    try {
      await updateClubMember(fdbNo, clubId, member.memberId, changes);
      await refreshMemberQueries(queryClient, fdbNo, clubId);
      onSaved();
    } catch (cause) {
      setError(memberSaveError(cause));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="edituser-form" onSubmit={handleSubmit}>
      <h3>Rediger medlem</h3>
      <label htmlFor="edituser-current-member-no">DBf-medlemsnummer</label>
      <input id="edituser-current-member-no" value={member.memberNo ?? "—"} readOnly />
      <MemberFields form={form} onChange={handleChange} showMemberNo={false} />
      {error && (
        <p className="edituser-error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="edituser-success" role="status">
          {message}
        </p>
      )}
      <div className="edituser-actions">
        <button type="submit" disabled={saving}>
          {saving ? "Gemmer…" : "Gem ændringer"}
        </button>
        <button type="button" className="cancel-button" onClick={onCancel} disabled={saving}>
          Annuller
        </button>
      </div>
    </form>
  );
}
