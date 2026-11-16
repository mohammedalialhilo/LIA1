import type { ChangeEvent } from "react";
import type { MemberForm } from "./memberForm";

export function MemberFields({
  form,
  onChange,
  showMemberNo,
}: {
  form: MemberForm;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  showMemberNo: boolean;
}) {
  return (
    <>
      <label htmlFor="edituser-name">Navn *</label>
      <input
        id="edituser-name"
        name="name"
        value={form.name}
        onChange={onChange}
        placeholder="Indtast navn"
        maxLength={40}
        required
      />

      {showMemberNo && (
        <>
          <label htmlFor="edituser-member-no">Medlemsnummer</label>
          <input
            id="edituser-member-no"
            name="memberNo"
            type="number"
            min="1"
            step="1"
            value={form.memberNo}
            onChange={onChange}
            placeholder="Valgfrit"
          />
        </>
      )}

      <label htmlFor="edituser-email">E-mail</label>
      <input
        id="edituser-email"
        name="email"
        type="email"
        value={form.email}
        onChange={onChange}
        placeholder="Indtast e-mailadresse"
        maxLength={40}
      />

      <label htmlFor="edituser-phone">Telefon</label>
      <input
        id="edituser-phone"
        name="phone1"
        type="tel"
        value={form.phone1}
        onChange={onChange}
        placeholder="Indtast telefonnummer"
        maxLength={20}
      />

      <label htmlFor="edituser-phone2">Telefon 2</label>
      <input
        id="edituser-phone2"
        name="phone2"
        type="tel"
        value={form.phone2}
        onChange={onChange}
        placeholder="Valgfrit"
        maxLength={20}
      />

      <label htmlFor="edituser-phone3">Telefon 3</label>
      <input
        id="edituser-phone3"
        name="phone3"
        type="tel"
        value={form.phone3}
        onChange={onChange}
        placeholder="Valgfrit"
        maxLength={20}
      />

      <label htmlFor="edituser-address">Adresse</label>
      <input
        id="edituser-address"
        name="address1"
        value={form.address1}
        onChange={onChange}
        placeholder="Indtast adresse"
        maxLength={40}
      />

      <label htmlFor="edituser-address2">Adresse 2</label>
      <input
        id="edituser-address2"
        name="address2"
        value={form.address2}
        onChange={onChange}
        placeholder="Valgfrit"
        maxLength={40}
      />

      <label htmlFor="edituser-zip">Postnummer</label>
      <input
        id="edituser-zip"
        name="zipCode"
        value={form.zipCode}
        onChange={onChange}
        placeholder="Indtast postnummer"
        maxLength={10}
      />

      <label htmlFor="edituser-city">By</label>
      <input
        id="edituser-city"
        name="city"
        value={form.city}
        onChange={onChange}
        placeholder="Indtast by"
        maxLength={20}
      />

      <label htmlFor="edituser-country">Landekode</label>
      <input
        id="edituser-country"
        name="countryCode"
        value={form.countryCode}
        onChange={onChange}
        placeholder="F.eks. DK"
        maxLength={5}
      />

      <label htmlFor="edituser-club-start">Klubstart</label>
      <input
        id="edituser-club-start"
        name="clubStart"
        type="date"
        value={form.clubStart}
        onChange={onChange}
      />
    </>
  );
}
