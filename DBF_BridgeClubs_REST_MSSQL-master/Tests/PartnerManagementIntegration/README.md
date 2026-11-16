# Partner and substitute integration test

Run against an **offline** club 9999 Firebird test database. The test copies it to a unique temporary directory, starts the API on `127.0.0.1`, and writes fixtures only to that copy. Do not point it at a live database file.

```powershell
$env:BC3_TEST_DATABASE = 'C:\path\to\offline\9999.FDB'
$env:BC3_TEST_API_DLL = 'C:\path\to\built\DBF_BridgeClubs_REST_MSSQL.dll'
dotnet run --project DBF_BridgeClubs_REST_MSSQL-master/Tests/PartnerManagementIntegration/PartnerManagementIntegration.csproj
```

The database needs two subclubs. The test checks real partner assignment, change and removal; reciprocal `PARTNER_ID` values; complementary `PARTNER_FIRST` values; duplicate, self, cross-subclub and stale-request conflicts; Danish candidate search; `IS_SUBSTITUTE` persistence as `T`/`F`; unrelated subclub preservation; and unchanged historical tournament table contents.

## Verified BC3 semantics

- `MEM_MEMBER_CLUB.PARTNER_ID` contains the other member's `MEM_MEMBER.MEMBER_ID`, scoped to the same `CLUB_ID`. Existing pairs are reciprocal.
- `MEM_MEMBER_CLUB_AU0` maintains the opposite row's `PARTNER_ID` and complementary `PARTNER_FIRST` value. `MEM_MEMBER_CLUB_BU0` sets `PARTNER_FIRST='F'` when a member has no partner. The module treats `PARTNER_FIRST` as BC3's pair order flag; it does not infer seating from it.
- `IS_SUBSTITUTE` is a membership-level `T`/`F` status. The existing trigger logs changes with BC3 status codes 12 and 13; updating the flag leaves the regular partnership intact.
- `SECTIONPLAYER.SUBSTITUTE` is a separate historical section-player flag. The inspected test database has only `0` values, and the field does not identify a playing date, replacement member, or restoration state. Occasion-specific substitute assignment is therefore not exposed as a write operation; the supported feature is membership-level substitute status and search.
