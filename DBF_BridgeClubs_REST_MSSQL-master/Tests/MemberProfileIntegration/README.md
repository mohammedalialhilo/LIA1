# Member profile and administration (club 9999)

The integration test copies an **offline** `9999.FDB` fixture into a unique temporary directory. Its API writes only to that copy. Never set `BC3_TEST_DATABASE` to the original BC3 database.

From `A:\LIA1` in PowerShell:

```powershell
$apiOutput = Join-Path $env:TEMP 'bc3-profile-api-build'
dotnet build 'DBF_BridgeClubs_REST_MSSQL-master/DBF_BridgeClubs_REST_MSSQL/DBF_BridgeClubs_REST_MSSQL.csproj' -p:OutDir="$apiOutput\"
$env:BC3_TEST_API_DLL = Join-Path $apiOutput 'DBF_BridgeClubs_REST_MSSQL.dll'
$env:BC3_TEST_DATABASE = (Resolve-Path '.inspection/migration-test/9999.FDB').Path
dotnet run --project 'DBF_BridgeClubs_REST_MSSQL-master/Tests/MemberProfileIntegration/MemberProfileIntegration.csproj' --no-launch-profile
```

The test checks editing and clearing contact fields, field validation, category changes and stale edits, combined search, CSV encoding and escaping, actual BC3 audit entries, unchanged subclub links and unchanged historical tables. The offline fixture must have a subclub and a member with `MEM_MEMBER.STATUS = 2`.

## Verified local BC3 model

- `MEM_MEMBER` stores the editable name, two address lines, country code, postal code, city, three phone numbers, email and `CLUB_START`. `MEMBER_NO` is read-only here. The API saves only supplied fields; JSON `null` clears an optional field.
- `MEM_MEMBER.STATUS` is the **contingent category** in this database, not an active/inactive switch. BC3's trigger text defines `2 = Kursus`, `3 = Primær`, `4 = Klub`, and `0 = Ingen`. The UI permits transitions only among 2, 3 and 4, with an expected-current-value check. A change is person-wide across subclubs.
- `MEM_MEMBER_CLUB` stores subclub affiliation, partner and substitute state. It has no verified inactive flag or end date. The API therefore does not offer deactivate/reactivate or membership end dates. Existing add, remove and transfer operations remain separate.
- `LIST_CLUB_STATUS` is empty in the fixture; `SYS_MAINCLUB.USE_CLUB_STATUS` and `USE_ACCOUNT` are `F`; `MEM_PAY_DETAIL` has no rows. The local database provides no club-specific fee rates, payment history, exemption or billing information. Those need a verified BC3/DBf source before implementation.
- `SYS_LOG` with `SYS_LOG_TEXT` supplies real member log entries. BC3 does not log every editable field. The history UI displays up to the latest 100 actual entries and does not derive entries from current values.
- Existing `MEM_MEMBER` triggers remain enabled. In particular, setting `STATUS` to 0 would clear partner and group values across subclubs, so the API refuses that transition. BC3's existing name-change trigger may update historical player display names; the implementation does not edit tournament or masterpoint records directly.

## API

- `PUT /api/Clubs/9999/SubClubs/{clubId}/Members/{memberId}` — partial person-field update for a linked member.
- `GET /api/Clubs/9999/Members/FeeCategories`
- `GET /api/Clubs/9999/Members/{memberId}/Administration`
- `PUT /api/Clubs/9999/Members/{memberId}/FeeCategory`
- `GET /api/Clubs/9999/Members/{memberId}/History`
- `GET /api/Clubs/9999/Members/Search` — filtered, sorted and paginated; partner/substitute filters require a subclub.
- `GET /api/Clubs/9999/Members/Export` — same filters, semicolon CSV with UTF-8 BOM; refuses more than 5,000 matches instead of silently truncating.

All new API routes are limited to club 9999. The existing local development access model is unchanged.

## Manual check

Open `http://localhost:8080/bc3/online/9999`, select **Medlemmer**, then open a member profile. Use **Rediger medlem** for a member linked to a subclub. Change and clear contact fields, save, reload and check the values. Change a supported contingent category and check the audit history and other subclub affiliations. On **Medlemmer**, combine city, subclub, category, substitute/partner and club-start filters; verify the count and pages, export CSV, and print the visible page. Check the existing partner and substitute controls on the profile. Use disposable member records for write checks.
