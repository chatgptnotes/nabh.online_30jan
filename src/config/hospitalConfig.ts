/**
 * Hospital Configuration and Team Structure
 * Dr. Murali's Hope Hospital - NABH Accreditation Team
 */

export interface TeamMember {
  name: string;
  role: string;
  designation: string;
  department: string;
  responsibilities: string[];
}

export interface HospitalInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
}

// Hospital Information
export const HOSPITAL_INFO: HospitalInfo = {
  name: "Dr. Murali's Hope Hospital",
  address: '2, Teka Naka, Nagpur',
  phone: '+91-XXXX-XXXXXX',
  email: 'info@hopehospital.com',
  website: 'www.hopehospital.com',
  logo: '/assets/hope-hospital-logo.png',
};

// NABH Team Structure
export const NABH_TEAM: TeamMember[] = [
  {
    name: 'Dr. Shiraz Sheikh',
    role: 'NABH Coordinator',
    designation: 'NABH Coordinator / Administrator',
    department: 'Quality & Administration',
    responsibilities: [
      'Coordinate the planning, implementation, and monitoring of NABH accreditation',
      'Conduct gap analysis and formulate action plans',
      'Arrange training programs on NABH standards for all staff',
      'Maintain updated documentation and evidence for compliance',
      'Liaise with external assessors and accreditation bodies',
      'Conduct internal audits and help implement corrective actions',
    ],
  },
  {
    name: 'Gaurav',
    role: 'Administrator',
    designation: 'Hospital Administrator',
    department: 'Administration',
    responsibilities: [
      'Overall hospital administration',
      'Support NABH accreditation efforts',
      'Resource allocation and management',
      'Coordination with all departments',
    ],
  },
  {
    name: 'Kashish',
    role: 'NABH Champion / MRD',
    designation: 'NABH Champion - Medical Records Department',
    department: 'Medical Records',
    responsibilities: [
      'Implement NABH protocols within MRD department',
      'Conduct departmental training and orientation sessions',
      'Monitor and maintain department-specific quality indicators',
      'Ensure proper documentation and record-keeping',
      'Identify areas of non-conformance and facilitate improvements',
    ],
  },
  {
    name: 'Jagruti',
    role: 'Quality Manager / HR',
    designation: 'Quality Manager & HR Head',
    department: 'Quality & Human Resources',
    responsibilities: [
      'Develop and implement the hospital Quality Management System (QMS)',
      'Oversee clinical and non-clinical audits',
      'Manage hospital-wide performance indicators and dashboards',
      'Facilitate root cause analysis and quality improvement projects',
      'Support incident reporting and management systems',
      'Prepare periodic quality reports for management review',
      'HR management and staff development',
    ],
  },
  {
    name: 'Chandra',
    role: 'Department Staff',
    designation: 'Staff Member',
    department: 'Operations',
    responsibilities: [],
  },
  {
    name: 'Diksha',
    role: 'Department Staff',
    designation: 'Staff Member',
    department: 'Operations',
    responsibilities: [],
  },
  {
    name: 'Javed',
    role: 'Department Staff',
    designation: 'Staff Member',
    department: 'Operations',
    responsibilities: [],
  },
  {
    name: 'Neesha',
    role: 'Department Staff',
    designation: 'Staff Member',
    department: 'Nursing',
    responsibilities: [],
  },
  {
    name: 'Chandraprakash Bisen',
    role: 'Infection Control Nurse',
    designation: 'Infection Control Nurse',
    department: 'Infection Control',
    responsibilities: [
      'Implement infection control protocols',
      'Monitor hospital-acquired infections',
      'Conduct infection control training',
      'Surveillance and reporting of infections',
      'Hand hygiene compliance monitoring',
    ],
  },
  {
    name: 'Farsana',
    role: 'Head Nurse',
    designation: 'Head Nurse / Nursing In-charge',
    department: 'Nursing',
    responsibilities: [
      'Oversee nursing staff and patient care',
      'Ensure nursing protocols compliance',
      'Staff scheduling and management',
      'Quality of nursing care monitoring',
    ],
  },
  {
    name: 'Roma',
    role: 'Department Staff',
    designation: 'Staff Member',
    department: 'Operations',
    responsibilities: [],
  },
  {
    name: 'Sachin',
    role: 'Department Staff',
    designation: 'Staff Member',
    department: 'Operations',
    responsibilities: [],
  },
  {
    name: 'Sikaander',
    role: 'Department Staff',
    designation: 'Staff Member',
    department: 'Operations',
    responsibilities: [],
  },
  {
    name: 'Sonali',
    role: 'Department Staff',
    designation: 'Staff Member',
    department: 'Operations',
    responsibilities: [],
  },
  {
    name: 'Suraj',
    role: 'Department Staff',
    designation: 'Staff Member',
    department: 'Operations',
    responsibilities: [],
  },
];

// Get team member by name
export const getTeamMember = (name: string): TeamMember | undefined => {
  return NABH_TEAM.find(member => member.name.toLowerCase() === name.toLowerCase());
};

// Get NABH Coordinator
export const getNABHCoordinator = (): TeamMember => {
  return NABH_TEAM.find(member => member.role === 'NABH Coordinator')!;
};

// Get Quality Manager
export const getQualityManager = (): TeamMember | undefined => {
  return NABH_TEAM.find(member => member.role.includes('Quality Manager'));
};

// Assignee options for dropdowns
export const ASSIGNEE_OPTIONS = NABH_TEAM.map(member => ({
  value: member.name,
  label: `${member.name} - ${member.role}`,
  role: member.role,
  department: member.department,
}));

// Role summary for AI prompts
export const TEAM_SUMMARY = `
NABH Accreditation Team - Dr. Murali's Hope Hospital:

1. NABH Coordinator: Dr. Shiraz Sheikh
   - Central figure responsible for driving NABH accreditation
   - Coordinates with all departments for compliance
   - Conducts gap analysis, training, and internal audits
   - Maintains documentation and liaises with assessors

2. Administrator: Gaurav
   - Overall hospital administration
   - Supports NABH accreditation efforts

3. NABH Champion / MRD: Kashish
   - Departmental lead for Medical Records
   - Implements NABH protocols within department
   - Monitors quality indicators and documentation

4. Quality Manager / HR: Jagruti
   - Oversees Quality Management System (QMS)
   - Manages performance indicators and audits
   - Facilitates quality improvement projects
   - HR management and staff development

5. Infection Control Nurse: Chandraprakash Bisen
   - Implements infection control protocols
   - Monitors hospital-acquired infections
   - Conducts infection control training
   - Hand hygiene compliance monitoring

6. Head Nurse: Farsana
   - Oversees nursing staff and patient care
   - Ensures nursing protocols compliance
   - Quality of nursing care monitoring
`;

// Detailed NABH Assessor Prompt for Evidence Generation
export const NABH_ASSESSOR_PROMPT = `You are acting as a NABH assessor and quality consultant for SHCO 3rd Edition.

Using the objective element description provided, generate COMPREHENSIVE, PRACTICAL, and AUDIT-READY evidences for Dr. Murali's Hope Hospital.

KEY STAFF MEMBERS:
- NABH Coordinator: Dr. Shiraz Sheikh
- Administrator: Gaurav
- NABH Champion / MRD: Kashish
- Quality Manager / HR: Jagruti
- Infection Control Nurse: Chandraprakash Bisen
- Head Nurse: Farsana

Follow these STRICT rules:

1. Generate evidences exactly as expected during NABH onsite assessment.
2. Align evidences to SHCO 3rd Edition only.
3. Avoid generic statements. Each evidence must be tangible, verifiable, and hospital-usable.
4. Write evidences in clear bullet points.
5. Assume a functional NABH-compliant hospital.
6. Do NOT mention NABH clauses in the output unless specifically asked.
7. Do NOT repeat the interpretation text.
8. Separate evidences into logical sub-headings.

Mandatory Evidence Categories to cover (as applicable):
- Policy / SOP evidence
- Registers / Logs / Formats
- Records / Filled samples
- Committee involvement
- Training & competency
- Monitoring & audit
- Corrective & preventive actions
- Display / communication evidence
- Statutory or safety linkage if relevant

Formatting Rules:
- Each evidence on a new line starting with a number or bullet.
- Clear headings.
- Professional hospital documentation language.
- No assumptions outside NABH scope.

Output structure:

Objective Element:
[Write the objective element]

Evidence:

1. Policy / SOP Evidence
- ...

2. Records & Registers
- ...

3. Implementation Evidence
- ...

4. Monitoring & Review
- ...

5. Training & Awareness
- ...

6. Committee / Governance Oversight
- ...

7. Sample Measurable Outputs (if applicable)
- ...

End with:
"These evidences demonstrate effective implementation, monitoring, and continual improvement as per NABH SHCO 3rd Edition requirements."`;
