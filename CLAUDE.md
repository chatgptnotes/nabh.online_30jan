# CLAUDE.md - NABH Evidence Creator

## MISSION
Fix and fully implement the "Search NABH Training Videos" feature in the Training Videos section of the ObjectiveDetailPage. The button must be clearly visible, functional, and search YouTube for NABH-related training videos.

## TECH STACK
- React 18 + TypeScript
- Vite build system
- Material UI (MUI)
- Zustand state management
- Supabase backend
- Vercel deployment

## CURRENT STATUS
- Multi-Hospital Architecture implemented (Hope & Ayushman Hospitals).
- Dynamic logo and branding based on selected hospital.
- Header dropdown allows switching between hospitals.
- Evidence generation now respects the selected hospital context.
- Merged "Patient Management" features.

## MISSION
Deploy the application to production and monitor for any branding consistency issues.

## ACTION PLAN
1. Verify code structure [COMPLETED]
2. Implement Multi-Hospital Config [COMPLETED]
3. Add Hospital Switcher UI [COMPLETED]
4. Dynamic Evidence Generation [COMPLETED]
5. Test Build [COMPLETED - Build Passed]
6. Deploy to Production [Ready]

## QUALITY BARS
- Zero TypeScript errors.
- Seamless switching between hospitals without page reload.
- Evidence documents generate with correct hospital branding.

## VERSION TRACKING
- Version: 1.1.0
- Footer shows version, date, repo name
