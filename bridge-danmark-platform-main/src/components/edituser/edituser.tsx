import { useEffect, useRef, useState } from "react";
import type { ClubMember } from "@/api/firebirdApi";
import { useClubMembers } from "@/hooks/useClubMembers";
import { EditMember } from "./EditMember";
import { memberSaveError } from "./memberForm";
import "./edituser.css";

export default function EditUser({
  fdbNo,
  clubId,
  initialMemberId,
}: {
  fdbNo: string;
  clubId: string;
  initialMemberId: number | undefined;
}) {
  const members = useClubMembers(fdbNo, clubId);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const selectedFromLink = useRef<number | null>(null);

  useEffect(() => {
    if (!initialMemberId || selectedFromLink.current === initialMemberId || !members.data) return;
    const member = members.data.find((item) => item.memberId === initialMemberId);
    if (!member) {
      setError("Medlemmet findes ikke i denne underklub.");
      return;
    }
    selectedFromLink.current = initialMemberId;
    setEditingId(member.memberId);
    formRef.current?.scrollIntoView({ block: "start" });
  }, [initialMemberId, members.data]);

  const handleEdit = (member: ClubMember) => {
    setEditingId(member.memberId);
    setMessage(null);
    setError(null);
    formRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  const selectedMember = members.data?.find((member) => member.memberId === editingId);

  return (
    <div className="edituser-container" id="edituser">
      <h2>Administrer medlemmer</h2>

      <div ref={formRef} className="edituser-form-anchor">
        {selectedMember && (
          <EditMember
            key={selectedMember.memberId}
            fdbNo={fdbNo}
            clubId={clubId}
            member={selectedMember}
            onCancel={() => setEditingId(null)}
            onSaved={() => {
              setEditingId(null);
              setMessage("Ændringerne er gemt.");
            }}
          />
        )}
      </div>

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

      <section className="edituser-list">
        <h3>Medlemmer ({members.data?.length ?? 0})</h3>
        {members.isPending ? (
          <p>Henter medlemmer…</p>
        ) : members.isError ? (
          <p className="edituser-error" role="alert">
            {memberSaveError(members.error)}
          </p>
        ) : members.data.length === 0 ? (
          <p>Der er ingen medlemmer i underklubben endnu.</p>
        ) : (
          members.data.map((member) => (
            <article className="edituser-card" key={member.memberId}>
              <div className="edituser-details">
                <h4>{member.name ?? `Medlem ${member.memberId}`}</h4>
                {member.memberNo && <p>Medlemsnr.: {member.memberNo}</p>}
                <p>E-mail: {member.email || "-"}</p>
                <p>Telefon: {member.phone1 || "-"}</p>
                <p>Adresse: {member.address1 || "-"}</p>
              </div>
              <button type="button" onClick={() => handleEdit(member)}>
                Rediger
              </button>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
