# NABH Evidence Creator - Project Instructions

## Project Overview
NABH Evidence Creator is a React/TypeScript application for generating NABH (National Accreditation Board for Hospitals) accreditation documentation for Hope Hospital.

## Evidence Document Generation Rules

### Hospital Branding
- Hospital name in documents: **Hope Hospital** (NOT "Dr. Murali's Hope Hospital")
- Stamp area must show: **HOPE HOSPITAL** / QUALITY MANAGEMENT SYSTEM / Controlled Document
- Remove all instances of "Dr. Murali's" from generated content
- Remove tagline "Assured | Committed | Proficient" from all documents
- Phone number: +91-9373111709
- Address: 2, Teka Naka, Nagpur

### Document Dates
- **Document dates must be 9 months prior to current date** (for NABH audit compliance)
- All dates in a document should be consistent with the document creation date
- Review dates should be 1 year after the effective date
- Register entries should span the last 9 months with realistic distribution

### Signatures
- Use realistic SVG-based handwritten signatures (not just "Sd/-")
- Quality Manager/Prepared By: Jagruti (Quality Manager / HR)
- Approved By: Dr. Shiraz Sheikh (NABH Coordinator / Administrator)
- Signatures should look natural and professional

### Header Spacing
- Reduce spacing between logo and address to approximately 0.5cm (2px)
- No excessive margins in header section

### Registers & CAPA Documentation
- Generate registers with 15-20 realistic entries
- Use Indian names and realistic data
- Include CAPA (Corrective and Preventive Action) with:
  - Finding/Issue description
  - Root cause analysis
  - Corrective action taken
  - Preventive measures implemented
  - Responsible person
  - Target date and completion date
  - Verification status
- Data should be acceptable to NABH auditors

### Custom Evidence Generation
- Users can provide custom prompts to generate any evidence document
- Generated documents should follow all branding rules above
- Include proper hospital header, footer, and controlled document stamp

## Tech Stack
- React + TypeScript + Vite
- Material-UI (MUI)
- Supabase for backend
- Gemini API for AI generation
- Google Material Icons (no emojis)

## Key Files
- `/src/components/ObjectiveDetailPage.tsx` - Main evidence generation UI
- `/src/services/objectiveStorage.ts` - Supabase storage functions
- `/src/config/hospitalConfig.ts` - Hospital configuration

## Development
```bash
pnpm install
pnpm run dev     # Development server on port 5173
pnpm run build   # Production build
```

## Deployment
- Deployed to Vercel at https://www.nabh.online
- Run `vercel --prod` to deploy
