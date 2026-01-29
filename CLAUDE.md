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
- Button exists in code but user reports not seeing it
- Possible issues: styling, visibility, caching, or functionality

## ACTION PLAN
1. Verify current code structure
2. Fix button visibility and styling
3. Implement proper YouTube search functionality
4. Add loading states and error handling
5. Test thoroughly
6. Deploy with cache-busting
7. Verify on production

## QUALITY BARS
- Zero TypeScript errors
- Button clearly visible with proper contrast
- Functional YouTube search
- Loading states implemented
- Error handling in place

## VERSION TRACKING
- Version format: 1.x (increments on each push)
- Footer shows version, date, repo name
