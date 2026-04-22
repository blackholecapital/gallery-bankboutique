# Prototype Scope

## v1 Includes
- Onboarding and auth flows
- Profile surfaces
- Discovery surfaces
- Inbox surfaces
- Settings surfaces
- Local seed data for prototype operation

## Explicit Exclusions
- Real backend services
- Push notifications
- Payments
- Search infrastructure
- Analytics pipeline
- Production authentication

## Notes
- The prototype remains local-first.
- Data access must stay behind repository boundaries.
- This pass introduces structure only so later passes can add contracts and implementation safely.
