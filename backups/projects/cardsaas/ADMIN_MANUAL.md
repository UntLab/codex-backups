# CardSaaS Admin Manual

This guide is for the workspace owner or any user who has admin access inside CardSaaS.

## 1. What an Admin Controls

Admin access is the final publishing and moderation layer inside the workspace.

An admin can:

- approve cards
- move cards between `pending`, `active`, and `paused`
- review audit activity
- manage admin notes
- control owner-level state
- monitor leads and public card readiness

## 2. How Admin Access Is Granted

Admin access is controlled through the project configuration.

In the current setup:

- users whose email is present in `ADMIN_EMAILS` automatically receive admin access
- after sign-in, admin users see the `Admin` section in the dashboard

## 3. Main Admin Areas

### Dashboard

The dashboard gives the fastest overview of:

- how many cards exist
- how many are live
- how many are pending
- whether anything is blocked

It is also the quickest place to jump into a card and review its state.

### Admin Section

This is the main moderation area.

Here an admin can:

- filter cards by state
- search cards
- review card owners
- change card status
- save notes
- inspect audit activity

## 4. Understanding Card Statuses

Every card can be in one of three main states:

### Pending

- card exists in the workspace
- card is not yet publicly approved
- public access should not be treated as final

### Active

- card is approved
- card is publicly visible
- public link can be shared safely

### Paused

- card is intentionally blocked
- public access is disabled
- used for temporary shutdown or compliance review

## 5. The Main Approval Flow

The normal admin review flow is:

1. operator creates a card
2. card enters `pending`
3. admin opens the card or reviews it from the admin area
4. admin verifies the employee information
5. admin switches the card to `active`
6. admin confirms the public route works

If the card is not ready:

1. keep it in `pending`
2. or move it to `paused`
3. add an admin note if needed

## 6. What to Check Before Activating a Card

Before switching a card to `active`, verify:

- profile photo is correct
- full name is correct
- job title is correct
- primary phone is correct
- secondary phone is correct if used
- email is correct
- office address is correct
- slug is clean and readable
- public card layout looks correct
- front/back switching works
- save contact works
- share works

## 7. Working with the Formag Corporate Template

`Formag Corporate` is the main built-in template.

As admin, your job is not to rebuild the template each time. Instead, you review that the card-specific data is correct:

- photo
- full name
- job title
- phone numbers
- email
- office address
- slug

The following remain fixed at the template level:

- company branding
- website
- theme
- back-side structure

## 8. How to Activate a Card

1. Sign in to `https://v.2ai.az/login`
2. Open `Dashboard` or `Admin`
3. Find the card
4. Change its status to `Active`
5. Open the public card
6. Validate the live experience

Recommended post-activation check:

- open the public link on mobile
- tap phone
- tap email
- tap office
- tap website
- test `Save contact`
- test `Share card`

## 9. How to Pause a Card

Pause a card if:

- information is wrong
- the employee is no longer active
- the card should not be public temporarily
- the card needs corrections before going live again

Flow:

1. Find the card
2. Change state to `Paused`
3. Add an internal note if the pause needs explanation

## 10. How to Use Admin Notes

Admin notes are for internal moderation only.

Use them for:

- pending reasons
- missing data reminders
- correction requests
- internal approval history

Good examples:

- `Need updated office address before activation`
- `Confirmed by HR, can activate`
- `Pause until photo is replaced`

## 11. Owner-Level Actions

In some cases, the admin area allows actions at the owner level.

This is useful when:

- one owner has multiple cards
- all cards from one owner need activation
- all cards from one owner need to be paused

Use owner-level actions carefully, because they affect more than one card.

## 12. Audit Activity

Audit activity helps the admin see what changed and when.

Typical audit items include:

- status changes
- owner-level actions
- note updates
- moderation changes

This is useful for:

- internal accountability
- understanding why a card changed state
- tracking admin actions over time

## 13. Leads Oversight

Admins should periodically review `Leads`.

Check:

- new leads are appearing correctly
- lead data looks valid
- follow-up process exists outside the app if required

Depending on configuration, leads may also trigger email notifications.

## 14. Password Recovery Support

The user-facing password reset flow works through Resend.

As admin, you only need to explain the correct process:

1. user opens `Forgot password?`
2. enters email
3. receives reset link
4. sets a new password

If the user still cannot recover access, then admin investigation is needed.

## 15. Daily Admin Checklist

Recommended daily routine:

1. Sign in
2. Open `Dashboard`
3. Review counts for live, pending, and paused cards
4. Open `Admin`
5. Review pending cards
6. Activate ready cards
7. Pause incorrect cards if needed
8. Review admin notes and audit activity
9. Check leads
10. Open at least one public card as a smoke test

## 16. Pre-Publication Admin Checklist

Before treating a card as fully ready:

- card is `active`
- public URL opens
- content is correct
- no placeholder data remains
- photo is correct
- contact actions work
- QR works
- save contact works
- back side opens correctly

## 17. Troubleshooting for Admins

### A user says the card exists but is not public

Check whether it is:

- still `pending`
- or already `paused`

### A user says login works, but they do not see Admin

Check whether the user email is included in `ADMIN_EMAILS`.

### A public card opens, but something is wrong

Check:

- card status
- slug
- saved employee data
- whether the latest edits were saved

### Save Contact behaves differently on different phones

That is expected to some degree. The system uses standards-based `vCard` delivery, and the exact behavior depends on browser and OS.

## 18. Operational Notes

Current production assumptions:

- domain: `https://v.2ai.az`
- password reset uses Resend
- uploads use Cloudinary
- manual activation is enabled
- `Formag Corporate` is the main system template

## 19. Short Version

If you only need the shortest admin workflow:

1. Sign in
2. Review pending cards
3. Verify employee data
4. Switch ready cards to `Active`
5. Test the public card
6. Pause anything incorrect
