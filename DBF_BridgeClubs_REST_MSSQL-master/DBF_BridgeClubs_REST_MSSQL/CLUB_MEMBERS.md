# Club member API

The member management routes use the Firebird database for club 9999. `9999` is
the database/organization number (`SYS_MAINCLUB.ORG_CLUB_NO`); `clubId` is the
`MEM_CLUB.CLUB_ID` of a subclub. SQL Server tables created by `Tools/FdbToSql`
are an import snapshot and are not a write target for these routes.

In a local checkout, the API uses `Data/9999.FDB` beside the solution and keeps
the credentials from `Secret.ConnectionString`. Set `FIREBIRD_CONNECTION_STRING`
to override this path for another installation. POST and PUT do not require a
write key. The API has no implemented login or authorization system, so anyone
who can reach these endpoints can change club members. Keep the API restricted
to a trusted network until authentication is available.

The frontend form is available at `/bc3/online/9999/subclubs/{clubId}`. The
member management controller permits CORS requests so the frontend can call
the API from its own origin.

Routes:

- `GET /api/Clubs/9999/SubClubs/{clubId}/Members`
- `GET /api/Clubs/9999/SubClubs/{clubId}/Members/{memberId}`
- `POST /api/Clubs/9999/SubClubs/{clubId}/Members`
- `PUT /api/Clubs/9999/SubClubs/{clubId}/Members/{memberId}`

Example POST body:

```json
{"name":"Test Member","memberNo":123456,"city":"Stockholm","email":"test@example.org"}
```

`name` is required and limited to 40 characters. `memberNo` is optional and
must be positive and unused if supplied. Firebird generates `memberId` through
the `MEMBER` generator and the membership ID through `MEMBER_CLUB`. The API does
not generate `memberNo` because the database's `MEMBER_NO` generator is unused
in the inspected records and has value zero.

Example PUT body:

```json
{"city":"Uppsala","phone1":"0701234567"}
```

PUT changes only supplied editable values. Omitted values remain unchanged;
explicit JSON `null` clears an optional field to SQL NULL. Supported fields
include both address lines, country, postal code, city, all three telephone
numbers, email and club start date. Name may be changed but cannot be cleared.
Member and club IDs, member number, point totals, and database-managed fields
cannot be changed here.

The workspace `9999.FDB` already contains Firebird-native replacements for the
member triggers that previously called `BC3UDF.dll`. They keep basic member
inserts, edits, logs, and membership links working without that library. These
replacements do not reproduce all BC3 behavior: address changes mark
`IS_ADDRESS_OK` as `F`, match-code and name splitting are approximations, and
master-point changes are rejected. The original trigger definitions and a
database backup are in `Data/member-trigger-backup-20261031-191334/`. Apply
this workaround to other database files only after reviewing those differences.
