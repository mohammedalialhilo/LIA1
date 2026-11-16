import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { createClubMember } from "@/api/firebirdApi";
import { useSubClubs } from "@/hooks/useSubClubs";
import { MemberFields } from "./MemberFields";
import { emptyForm, memberSaveError, refreshMemberQueries, type MemberForm } from "./memberForm";
import "./edituser.css";

export function AddMember({ fdbNo }: { fdbNo: string }) {
  const underklubber = useSubClubs(fdbNo);
  const queryClient = useQueryClient();
  const [clubId, setClubId] = useState("");
  const [form, setForm] = useState<MemberForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [createdMemberId, setCreatedMemberId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name as keyof MemberForm;
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setCreatedMemberId(null);
    if (!clubId || !underklubber.data?.some((club) => String(club.clubID) === clubId)) {
      setError("Vælg en underklub.");
      return;
    }
    if (!form.name.trim()) {
      setError("Indtast et navn.");
      return;
    }
    const memberNo = form.memberNo.trim();
    if (memberNo && (!Number.isSafeInteger(Number(memberNo)) || Number(memberNo) <= 0)) {
      setError("Medlemsnummeret skal være et positivt heltal.");
      return;
    }

    setSaving(true);
    try {
      const created = await createClubMember(fdbNo, clubId, {
        name: form.name.trim(),
        ...(memberNo && { memberNo: Number(memberNo) }),
        ...(form.email.trim() && { email: form.email.trim() }),
        ...(form.phone1.trim() && { phone1: form.phone1.trim() }),
        ...(form.phone2.trim() && { phone2: form.phone2.trim() }),
        ...(form.phone3.trim() && { phone3: form.phone3.trim() }),
        ...(form.address1.trim() && { address1: form.address1.trim() }),
        ...(form.address2.trim() && { address2: form.address2.trim() }),
        ...(form.zipCode.trim() && { zipCode: form.zipCode.trim() }),
        ...(form.city.trim() && { city: form.city.trim() }),
        ...(form.countryCode.trim() && { countryCode: form.countryCode.trim().toUpperCase() }),
        ...(form.clubStart && { clubStart: form.clubStart }),
      });
      await refreshMemberQueries(queryClient, fdbNo, clubId);
      setCreatedMemberId(created.memberId);
      setForm({ ...emptyForm });
    } catch (cause) {
      setError(memberSaveError(cause));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edituser-container">
      <h2>Tilføj medlem</h2>
      <form className="edituser-form" onSubmit={handleSubmit}>
        <h3>Nyt medlem</h3>
        <label htmlFor="edituser-club">Underklub *</label>
        <select
          id="edituser-club"
          value={clubId}
          onChange={(event) => setClubId(event.target.value)}
          required
          disabled={underklubber.isPending || underklubber.isError || saving}
        >
          <option value="">Vælg underklub</option>
          {underklubber.data?.map((club) => (
            <option key={club.clubID} value={club.clubID}>
              {club.clubName}
            </option>
          ))}
        </select>
        {underklubber.isPending && <p>Henter underklubber…</p>}
        {underklubber.isError && (
          <p className="edituser-error" role="alert">
            {memberSaveError(underklubber.error)}
          </p>
        )}
        {underklubber.isSuccess && underklubber.data.length === 0 && (
          <p className="edituser-error" role="alert">
            Der findes ingen underklubber at tilføje medlemmet til.
          </p>
        )}

        <MemberFields form={form} onChange={handleChange} showMemberNo />

        {error && (
          <p className="edituser-error" role="alert">
            {error}
          </p>
        )}
        {createdMemberId !== null && (
          <p className="edituser-success" role="status">
            Medlemmet er tilføjet.{" "}
            <Link
              to="/bc3/online/$clubNumber/members/$memberId"
              params={{ clubNumber: fdbNo, memberId: String(createdMemberId) }}
            >
              Se medlem
            </Link>
          </p>
        )}
        <div className="edituser-actions">
          <button
            type="submit"
            disabled={saving || !underklubber.isSuccess || underklubber.data.length === 0}
          >
            {saving ? "Gemmer…" : "Tilføj medlem"}
          </button>
        </div>
      </form>
    </div>
  );
}
