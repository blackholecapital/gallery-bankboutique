# Pass 4A Smoke Checklist

## Preconditions
- Install dependencies: `npm install`
- Run dev server: `npm run dev`

## Happy Path Checks
1. **Sign-in**
   - Open `/auth/login`
   - Sign in with any email
   - Confirm signed-in state appears
   - Refresh browser and confirm session remains active

2. **Onboarding**
   - Open `/onboarding`
   - Enter display name and bio
   - Complete onboarding and confirm success message
   - Navigate to `/profile` and verify seeded values load

3. **Discovery**
   - Open `/discovery`
   - Confirm loading then empty/list state
   - Trigger Like/Pass/Message intent on a profile when available

4. **Profile save**
   - Open `/profile`
   - Edit display name/bio
   - Save and confirm local success message

5. **Inbox open/reply**
   - Open `/inbox`
   - Confirm thread list or empty state
   - Open a thread if present
   - Save a reply preview and confirm thread preview updates

6. **Settings save/toggle**
   - Open `/settings`
   - Toggle theme mode
   - Verify feature flags render

## Verification Commands
- `npm run typecheck`
- `npm run build`
- `npm run lint`
