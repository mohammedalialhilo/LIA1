import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Bc3ApiError, addExistingMemberToSubclub } from "@/api/firebirdApi";
import { refreshAssignedMemberQueries, useExistingMembers } from "@/hooks/useExistingMembers";
import { useSubClubs } from "@/hooks/useSubClubs";
import "./edituser.css";

function assignmentError(cause: unknown): string {
  if (cause instanceof Bc3ApiError) {
    if (cause.status === 409) return "Medlemmet er allerede tilknyttet denne underklub.";
    if (cause.status === 404) return "Medlemmet eller underklubben blev ikke fundet.";
  }
  return "Medlemmet kunne ikke tilføjes. Prøv igen.";
}

export function AssignExistingMember({
  fdbNo,
  initialClubId,
}: {
  fdbNo: string;
  initialClubId?: number | undefined;
}) {
  const queryClient = useQueryClient();
  const underklubber = useSubClubs(fdbNo);
  const [clubId, setClubId] = useState(initialClubId ? String(initialClubId) : "");
  const [search, setSearch] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [savedMemberId, setSavedMemberId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const candidates = useExistingMembers(fdbNo, clubId, search);
  const selectedMember = candidates.data?.find((member) => member.memberId === selectedMemberId);
  const destination = underklubber.data?.find((club) => String(club.clubID) === clubId);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSavedMemberId(null);
    if (!destination) {
      setError("Vælg en underklub.");
      return;
    }
    if (!selectedMember || selectedMember.alreadyAssigned) {
      setError("Vælg et medlem, som ikke allerede er tilknyttet underklubben.");
      return;
    }

    setSaving(true);
    try {
      await addExistingMemberToSubclub(fdbNo, clubId, selectedMember.memberId);
      await refreshAssignedMemberQueries(queryClient, fdbNo, clubId);
      setSavedMemberId(selectedMember.memberId);
      setSelectedMemberId(null);
    } catch (cause) {
      setError(assignmentError(cause));
      if (cause instanceof Bc3ApiError && cause.status === 409) {
        await queryClient.invalidateQueries({
          queryKey: ["bc3", "existingMemberCandidates", fdbNo, clubId],
        });
        setSelectedMemberId(null);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edituser-container">
      <h2>Tilføj eksisterende medlem</h2>
      <form className="edituser-form" onSubmit={handleSubmit}>
        <label htmlFor="existing-member-club">Underklub *</label>
        <select
          id="existing-member-club"
          value={clubId}
          onChange={(event) => {
            setClubId(event.target.value);
            setSelectedMemberId(null);
            setSavedMemberId(null);
            setError(null);
          }}
          disabled={underklubber.isPending || underklubber.isError || saving}
          required
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
            Underklubberne kunne ikke hentes. Prøv igen.
          </p>
        )}

        <label htmlFor="existing-member-search">Søg efter medlem *</label>
        <input
          id="existing-member-search"
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setSelectedMemberId(null);
            setSavedMemberId(null);
            setError(null);
          }}
          placeholder="Navn eller DBF-medlemsnummer"
          disabled={!destination || saving}
          autoComplete="off"
          maxLength={40}
        />

        {!destination && <p>Vælg en underklub for at søge efter medlemmer.</p>}
        {destination && !search.trim() && <p>Indtast et navn eller medlemsnummer.</p>}
        {destination && search.trim() && candidates.isPending && <p>Søger efter medlemmer…</p>}
        {destination && search.trim() && candidates.isError && (
          <p className="edituser-error" role="alert">
            Søgningen kunne ikke gennemføres. Prøv igen.
          </p>
        )}
        {destination && search.trim() && candidates.isSuccess && candidates.data.length === 0 && (
          <p>Ingen medlemmer matcher søgningen.</p>
        )}
        {destination && candidates.isSuccess && candidates.data.length > 0 && (
          <fieldset className="edituser-candidates">
            <legend>Vælg medlem (højst 25 resultater)</legend>
            {candidates.data.map((member) => (
              <label className="edituser-candidate" key={member.memberId}>
                <input
                  type="radio"
                  name="existing-member"
                  value={member.memberId}
                  checked={selectedMemberId === member.memberId}
                  onChange={() => {
                    setSelectedMemberId(member.memberId);
                    setSavedMemberId(null);
                    setError(null);
                  }}
                  disabled={member.alreadyAssigned || saving}
                />
                <span>
                  <strong>{member.name || `Medlem ${member.memberId}`}</strong>
                  <span className="edituser-candidate-detail">
                    DBF-nr. {member.memberNo ?? "—"} · Underklubber:{" "}
                    {member.subclubs.length > 0
                      ? member.subclubs.map((club) => club.clubName).join(", ")
                      : "Ingen"}
                  </span>
                  {member.alreadyAssigned && (
                    <span className="edituser-candidate-assigned">
                      Allerede tilknyttet denne underklub
                    </span>
                  )}
                </span>
              </label>
            ))}
          </fieldset>
        )}

        {selectedMember && destination && (
          <div className="edituser-confirmation">
            <h3>Bekræft tilknytning</h3>
            <p>
              {selectedMember.name || `Medlem ${selectedMember.memberId}`} (DBF-nr.{" "}
              {selectedMember.memberNo ?? "—"}) til {destination.clubName}
            </p>
          </div>
        )}

        {error && (
          <p className="edituser-error" role="alert">
            {error}
          </p>
        )}
        {savedMemberId !== null && destination && (
          <p className="edituser-success" role="status">
            Medlemmet er nu tilføjet til underklubben.{" "}
            <Link
              to="/bc3/online/$clubNumber/subclubs/$clubId"
              params={{ clubNumber: fdbNo, clubId }}
            >
              Se underklubben
            </Link>
          </p>
        )}

        <div className="edituser-actions">
          <button type="submit" disabled={saving || !destination || !selectedMember}>
            {saving ? "Tilføjer medlem…" : "Tilføj medlem til underklub"}
          </button>
          {initialClubId ? (
            <Link
              className="edituser-cancel-link"
              to="/bc3/online/$clubNumber/subclubs/$clubId"
              params={{ clubNumber: fdbNo, clubId: String(initialClubId) }}
            >
              Annuller
            </Link>
          ) : (
            <Link
              className="edituser-cancel-link"
              to="/bc3/online/$clubNumber/medlemmer"
              params={{ clubNumber: fdbNo }}
            >
              Annuller
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}
