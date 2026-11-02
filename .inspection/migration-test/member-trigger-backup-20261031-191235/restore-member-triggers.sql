SET TERM ^ ;
ALTER TRIGGER MEM_MEMBER_BI0 ACTIVE AS
begin
  new.is_address_ok = address_ok(0, new.address_1, new.zip_code);

  if (not New.Name is null) then begin
    New.First_Name = Get_First_Name(New.Name);
    New.Middle_Name = Get_Middle_Name(New.Name);
    New.Last_Name = Get_Last_Name(New.Name);
  end

  if (new.name_changed is null) then
    new.name_changed = current_timestamp;
  if (new.address_1_changed is null) then
    new.address_1_changed = current_timestamp;
  if (new.address_2_changed is null) then
    new.address_2_changed = current_timestamp;
  if (new.zip_code_changed is null) then
    new.zip_code_changed = current_timestamp;
  if (new.phone_1_changed is null) then
    new.phone_1_changed = current_timestamp;
  if (new.phone_2_changed is null) then
    new.phone_2_changed = current_timestamp;
  if (new.phone_3_changed is null) then
    new.phone_3_changed = current_timestamp;
  if (new.email_changed is null) then
    new.email_changed = current_timestamp;
  if (new.cpr_changed is null) then
    new.cpr_changed = current_timestamp;
  if (new.status_changed is null) then
    new.status_changed = current_timestamp;
end^
ALTER TRIGGER MEM_MEMBER_AI0 ACTIVE AS
begin
  insert into mem_matchcode
    (member_id, match_type, match_string)
  values
    (new.member_id, 1, get_match_code(0, 1, new.first_name, substring(new.last_name FROM 1 for 20), new.zip_code));

  insert into mem_matchcode
    (member_id, match_type, match_string)
  values
    (new.member_id, 2, get_match_code(0, 2, new.first_name, substring(new.last_name FROM 1 for 20), new.zip_code));

  execute procedure stamp_log(2, new.member_id, new.last_changed_by, 15, null, null);

  delete from mem_member_deleted
  where member_no = new.member_no;
end^
ALTER TRIGGER MEM_MEMBER_BU0 ACTIVE AS
begin
  if (new.name <> old.name) then begin
    New.First_Name = Get_First_Name(New.Name);
    New.Middle_Name = Get_Middle_Name(New.Name);
    New.Last_Name = Get_Last_Name(New.Name);
  end

  if (coalesce(new.address_1, '') <> coalesce(old.address_1, '') or
      coalesce(new.zip_code, '') <> coalesce(old.zip_code, '')) then
    new.is_address_ok = address_ok(0, new.address_1, new.zip_code);

  if (old.total_bronze <> new.total_bronze or
      old.total_silver <> new.total_silver or
      old.total_gold <> new.total_gold) then begin
    new.total_master = truncate((new.total_bronze + new.total_silver * 10 + new.total_gold * 100) / 100);
    new.club_title_level = calc_mp_title(0, new.total_bronze, new.total_silver, new.total_gold, new.total_master);
  end

  if (old.name <> new.name) then
    new.name_changed = current_timestamp;

  if (coalesce(new.address_1, '') <> coalesce(old.address_1, '')) then
    new.address_1_changed = current_timestamp;

  if (coalesce(new.address_2, '') <> coalesce(old.address_2, '')) then
    new.address_2_changed = current_timestamp;

  if (coalesce(new.zip_code, '') <> coalesce(old.zip_code, '')) then
    new.zip_code_changed = current_timestamp;

  if (coalesce(new.phone_1, '') <> coalesce(old.phone_1, '')) then
    new.phone_1_changed = current_timestamp;

  if (coalesce(new.phone_2, '') <> coalesce(old.phone_2, '')) then
    new.phone_2_changed = current_timestamp;

  if (coalesce(new.phone_3, '') <> coalesce(old.phone_3, '')) then
    new.phone_3_changed = current_timestamp;

  if (coalesce(new.email, '') <> coalesce(old.email, '')) then
    new.email_changed = current_timestamp;

  if (coalesce(new.cpr, '') <> coalesce(old.cpr, '')) then
    new.cpr_changed = current_timestamp;

  if (old.status <> new.status) then
    new.status_changed = current_timestamp;
end^
ALTER TRIGGER MEM_MEMBER_AU0 ACTIVE as
declare variable OLDSTATUS char(7);
declare variable NEWSTATUS char(7);
begin
  if (new.STATUS = 0 and
      new.FUTURE_STATUS = 0 and
      old.STATUS > 0) then
  begin
    update MEM_MEMBER_CLUB
    set PARTNER_ID = 0,
        PARTNER_FIRST = 'F',
        GROUP_INDEX = -1
    where MEM_MEMBER_CLUB.MEMBER_ID = new.MEMBER_ID;
  end

  /* LVJ: 03-01-2012 MEGA GRIMT hardcoded  */
  if (new.STATUS <> old.STATUS) then
  begin
    OLDSTATUS = 'Ukendt';
    NEWSTATUS = 'Ukendt';

    if (old.STATUS = 0) then
      OLDSTATUS = '(Ingen)';

    if (old.STATUS = 2) then
      OLDSTATUS = 'Kursus';

    if (old.STATUS = 3) then
      OLDSTATUS = 'Primaer';

    if (old.STATUS = 4) then
      OLDSTATUS = 'Klub';

    if (new.STATUS = 0) then
      NEWSTATUS = '(Ingen)';

    if (new.STATUS = 2) then
      NEWSTATUS = 'Kursus';

    if (new.STATUS = 3) then
      NEWSTATUS = 'Primaer';

    if (new.STATUS = 4) then
      NEWSTATUS = 'Klub';

    execute procedure STAMP_LOG(2, new.MEMBER_ID, new.LAST_CHANGED_BY, 17, OLDSTATUS, NEWSTATUS);
  end

  if (new.NAME <> old.NAME) then
  begin
    update MASTERPOINTS
    set MASTERPOINTS.playername = new.NAME
    where MASTERPOINTS.fkplayerid = new.MEMBER_ID;
  end

  if (coalesce(new.NAME, '') <> coalesce(old.NAME, '')) then
    execute procedure STAMP_LOG(2, new.MEMBER_ID, new.LAST_CHANGED_BY, 2, old.NAME, new.NAME);

  if (coalesce(new.ADDRESS_1, '') <> coalesce(old.ADDRESS_1, '')) then
    execute procedure STAMP_LOG(2, new.MEMBER_ID, new.LAST_CHANGED_BY, 3, old.ADDRESS_1, new.ADDRESS_1);

  if (coalesce(new.ADDRESS_2, '') <> coalesce(old.ADDRESS_2, '')) then
    execute procedure STAMP_LOG(2, new.MEMBER_ID, new.LAST_CHANGED_BY, 4, old.ADDRESS_2, new.ADDRESS_2);

  if (coalesce(new.ZIP_CODE, '') <> coalesce(old.ZIP_CODE, '')) then
    execute procedure STAMP_LOG(2, new.MEMBER_ID, new.LAST_CHANGED_BY, 5, old.ZIP_CODE, new.ZIP_CODE);

  if (coalesce(new.CITY, '') <> coalesce(old.CITY, '')) then
    execute procedure STAMP_LOG(2, new.MEMBER_ID, new.LAST_CHANGED_BY, 6, old.CITY, new.CITY);

  if (coalesce(new.PHONE_1, '') <> coalesce(old.PHONE_1, '')) then
    execute procedure STAMP_LOG(2, new.MEMBER_ID, new.LAST_CHANGED_BY, 7, old.PHONE_1, new.PHONE_1);

  if (coalesce(new.PHONE_2, '') <> coalesce(old.PHONE_2, '')) then
    execute procedure STAMP_LOG(2, new.MEMBER_ID, new.LAST_CHANGED_BY, 7, old.PHONE_2, new.PHONE_2);

  if (coalesce(new.PHONE_3, '') <> coalesce(old.PHONE_3, '')) then
    execute procedure STAMP_LOG(2, new.MEMBER_ID, new.LAST_CHANGED_BY, 7, old.PHONE_3, new.PHONE_3);

  if (coalesce(new.EMAIL, '') <> coalesce(old.EMAIL, '')) then
    execute procedure STAMP_LOG(2, new.MEMBER_ID, new.LAST_CHANGED_BY, 8, old.EMAIL, new.EMAIL);

  if (new.FIRST_NAME <> old.FIRST_NAME or new.LAST_NAME <> old.LAST_NAME or new.ZIP_CODE <> old.ZIP_CODE) then
  begin
    update MEM_MATCHCODE
    set MATCH_STRING = GET_MATCH_CODE(0, 1, new.FIRST_NAME, substring(new.LAST_NAME from 1 for 20), new.ZIP_CODE)
    where MEM_MATCHCODE.MEMBER_ID = new.MEMBER_ID and
          MEM_MATCHCODE.MATCH_TYPE = 1;

    update MEM_MATCHCODE
    set MATCH_STRING = GET_MATCH_CODE(0, 2, new.FIRST_NAME, substring(new.LAST_NAME from 1 for 20), new.ZIP_CODE)
    where MEM_MATCHCODE.MEMBER_ID = new.MEMBER_ID and
          MEM_MATCHCODE.MATCH_TYPE = 3;
  end
end^
SET TERM ; ^
