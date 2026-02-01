/**
 * Hope Hospital Patient Database
 * Realistic patient records for evidence generation
 */

export interface PatientRecord {
  uhid: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contactNumber: string;
  address: string;
  admissionDate: string;
  dischargeDate?: string;
  department: string;
  diagnosis: string;
  consultingDoctor: string;
  bloodGroup: string;
  emergencyContact: string;
  insuranceProvider?: string;
  policyNumber?: string;
}

export interface StaffRecord {
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  qualification: string;
  joiningDate: string;
  contactNumber: string;
  email: string;
  shift?: 'Morning' | 'Evening' | 'Night';
}

export interface EquipmentRecord {
  equipmentId: string;
  name: string;
  category: string;
  manufacturer: string;
  purchaseDate: string;
  lastCalibrationDate: string;
  nextCalibrationDate: string;
  location: string;
  status: 'Active' | 'Under Maintenance' | 'Retired';
}

export interface IncidentRecord {
  incidentId: string;
  date: string;
  time: string;
  location: string;
  reportedBy: string;
  incidentType: string;
  description: string;
  actionTaken: string;
  status: 'Open' | 'Under Investigation' | 'Closed';
}

// Hope Hospital Patient Database
export const HOPE_HOSPITAL_PATIENTS: PatientRecord[] = [
  {
    uhid: 'HH/2024/0001',
    name: 'Rajesh Kumar Sharma',
    age: 45,
    gender: 'Male',
    contactNumber: '9876543210',
    address: '23, MG Road, Nagpur - 440001',
    admissionDate: '15-Jan-2024',
    dischargeDate: '18-Jan-2024',
    department: 'Cardiology',
    diagnosis: 'Acute Myocardial Infarction',
    consultingDoctor: 'Dr. Priya Deshmukh',
    bloodGroup: 'B+',
    emergencyContact: '9876543211 (Spouse)',
    insuranceProvider: 'Star Health Insurance',
    policyNumber: 'STR/2023/045612',
  },
  {
    uhid: 'HH/2024/0002',
    name: 'Sunita Ramesh Patil',
    age: 32,
    gender: 'Female',
    contactNumber: '9123456789',
    address: '45, Civil Lines, Nagpur - 440012',
    admissionDate: '16-Jan-2024',
    dischargeDate: '20-Jan-2024',
    department: 'Obstetrics & Gynecology',
    diagnosis: 'Normal Delivery - Female Child',
    consultingDoctor: 'Dr. Anita Mehta',
    bloodGroup: 'O+',
    emergencyContact: '9123456790 (Husband)',
    insuranceProvider: 'HDFC Ergo Health',
    policyNumber: 'HDF/2023/078934',
  },
  {
    uhid: 'HH/2024/0003',
    name: 'Anil Vasant Joshi',
    age: 58,
    gender: 'Male',
    contactNumber: '9234567890',
    address: '12, Dharampeth, Nagpur - 440010',
    admissionDate: '17-Jan-2024',
    department: 'Orthopedics',
    diagnosis: 'Fracture Right Femur',
    consultingDoctor: 'Dr. Vikram Singh',
    bloodGroup: 'A+',
    emergencyContact: '9234567891 (Son)',
    insuranceProvider: 'Bajaj Allianz',
    policyNumber: 'BAJ/2023/112345',
  },
  {
    uhid: 'HH/2024/0004',
    name: 'Meena Suresh Kapoor',
    age: 41,
    gender: 'Female',
    contactNumber: '9345678901',
    address: '78, Sadar, Nagpur - 440001',
    admissionDate: '18-Jan-2024',
    dischargeDate: '22-Jan-2024',
    department: 'General Surgery',
    diagnosis: 'Acute Appendicitis',
    consultingDoctor: 'Dr. Rajesh Kulkarni',
    bloodGroup: 'AB+',
    emergencyContact: '9345678902 (Husband)',
  },
  {
    uhid: 'HH/2024/0005',
    name: 'Prakash Narayan Rao',
    age: 67,
    gender: 'Male',
    contactNumber: '9456789012',
    address: '34, Sitabuldi, Nagpur - 440012',
    admissionDate: '19-Jan-2024',
    department: 'Nephrology',
    diagnosis: 'Chronic Kidney Disease Stage 4',
    consultingDoctor: 'Dr. Sanjay Deshpande',
    bloodGroup: 'B-',
    emergencyContact: '9456789013 (Daughter)',
    insuranceProvider: 'Care Health Insurance',
    policyNumber: 'CAR/2023/156789',
  },
  {
    uhid: 'HH/2024/0006',
    name: 'Kavita Ashok Bhosale',
    age: 28,
    gender: 'Female',
    contactNumber: '9567890123',
    address: '56, Ramdaspeth, Nagpur - 440010',
    admissionDate: '20-Jan-2024',
    dischargeDate: '21-Jan-2024',
    department: 'Pediatrics',
    diagnosis: 'Viral Fever',
    consultingDoctor: 'Dr. Neha Agarwal',
    bloodGroup: 'O+',
    emergencyContact: '9567890124 (Mother)',
  },
  {
    uhid: 'HH/2024/0007',
    name: 'Deepak Mohan Jaiswal',
    age: 52,
    gender: 'Male',
    contactNumber: '9678901234',
    address: '89, Laxmi Nagar, Nagpur - 440022',
    admissionDate: '21-Jan-2024',
    department: 'Neurology',
    diagnosis: 'Ischemic Stroke',
    consultingDoctor: 'Dr. Amit Verma',
    bloodGroup: 'A-',
    emergencyContact: '9678901235 (Wife)',
    insuranceProvider: 'Religare Health',
    policyNumber: 'REL/2023/234567',
  },
  {
    uhid: 'HH/2024/0008',
    name: 'Anjali Ramesh Thakur',
    age: 35,
    gender: 'Female',
    contactNumber: '9789012345',
    address: '23, Gandhibag, Nagpur - 440002',
    admissionDate: '22-Jan-2024',
    dischargeDate: '25-Jan-2024',
    department: 'ENT',
    diagnosis: 'Chronic Sinusitis',
    consultingDoctor: 'Dr. Sunil Patil',
    bloodGroup: 'B+',
    emergencyContact: '9789012346 (Husband)',
  },
  {
    uhid: 'HH/2024/0009',
    name: 'Vikas Shrikant Desai',
    age: 43,
    gender: 'Male',
    contactNumber: '9890123456',
    address: '67, Khamla, Nagpur - 440025',
    admissionDate: '23-Jan-2024',
    department: 'Gastroenterology',
    diagnosis: 'Peptic Ulcer Disease',
    consultingDoctor: 'Dr. Ashok Gupta',
    bloodGroup: 'O-',
    emergencyContact: '9890123457 (Brother)',
    insuranceProvider: 'Max Bupa Health',
    policyNumber: 'MAX/2023/345678',
  },
  {
    uhid: 'HH/2024/0010',
    name: 'Pooja Dinesh Kelkar',
    age: 29,
    gender: 'Female',
    contactNumber: '9901234567',
    address: '45, Manish Nagar, Nagpur - 440015',
    admissionDate: '24-Jan-2024',
    dischargeDate: '26-Jan-2024',
    department: 'Dermatology',
    diagnosis: 'Psoriasis',
    consultingDoctor: 'Dr. Priyanka Jain',
    bloodGroup: 'AB-',
    emergencyContact: '9901234568 (Mother)',
  },
];

// Hope Hospital Staff Database
export const HOPE_HOSPITAL_STAFF: StaffRecord[] = [
  {
    employeeId: 'HH/EMP/001',
    name: 'Dr. Shiraz Sheikh',
    designation: 'NABH Coordinator / Administrator',
    department: 'Administration',
    qualification: 'MBBS, MBA (Healthcare)',
    joiningDate: '01-Jan-2020',
    contactNumber: '9876501234',
    email: 'shiraz.sheikh@hopehospital.in',
  },
  {
    employeeId: 'HH/EMP/002',
    name: 'Jagruti Sharma',
    designation: 'Quality Manager / HR Head',
    department: 'Quality & HR',
    qualification: 'MBA (HR), Six Sigma Black Belt',
    joiningDate: '15-Feb-2020',
    contactNumber: '9876502345',
    email: 'jagruti.sharma@hopehospital.in',
  },
  {
    employeeId: 'HH/EMP/003',
    name: 'Gaurav Malhotra',
    designation: 'Hospital Administrator',
    department: 'Administration',
    qualification: 'MHA (Master of Hospital Administration)',
    joiningDate: '01-Mar-2020',
    contactNumber: '9876503456',
    email: 'gaurav.malhotra@hopehospital.in',
  },
  {
    employeeId: 'HH/EMP/004',
    name: 'Dr. Priya Deshmukh',
    designation: 'Senior Consultant Cardiologist',
    department: 'Cardiology',
    qualification: 'MBBS, MD (Cardiology)',
    joiningDate: '15-Apr-2020',
    contactNumber: '9876504567',
    email: 'priya.deshmukh@hopehospital.in',
  },
  {
    employeeId: 'HH/EMP/005',
    name: 'Nurse Sangeeta Patil',
    designation: 'Senior Staff Nurse',
    department: 'ICU',
    qualification: 'GNM, BSc Nursing',
    joiningDate: '01-Jun-2020',
    contactNumber: '9876505678',
    email: 'sangeeta.patil@hopehospital.in',
    shift: 'Morning',
  },
  {
    employeeId: 'HH/EMP/006',
    name: 'Ramesh Kumar',
    designation: 'Biomedical Engineer',
    department: 'Biomedical',
    qualification: 'BE (Biomedical)',
    joiningDate: '15-Jul-2020',
    contactNumber: '9876506789',
    email: 'ramesh.kumar@hopehospital.in',
  },
  {
    employeeId: 'HH/EMP/007',
    name: 'Sunita Reddy',
    designation: 'Pharmacist',
    department: 'Pharmacy',
    qualification: 'B.Pharm, Registered Pharmacist',
    joiningDate: '01-Aug-2020',
    contactNumber: '9876507890',
    email: 'sunita.reddy@hopehospital.in',
  },
  {
    employeeId: 'HH/EMP/008',
    name: 'Dr. Anita Mehta',
    designation: 'Consultant Gynecologist',
    department: 'Obstetrics & Gynecology',
    qualification: 'MBBS, MS (OBG)',
    joiningDate: '15-Sep-2020',
    contactNumber: '9876508901',
    email: 'anita.mehta@hopehospital.in',
  },
  {
    employeeId: 'HH/EMP/009',
    name: 'Rajesh Tiwari',
    designation: 'Lab Technician',
    department: 'Laboratory',
    qualification: 'DMLT',
    joiningDate: '01-Oct-2020',
    contactNumber: '9876509012',
    email: 'rajesh.tiwari@hopehospital.in',
    shift: 'Morning',
  },
  {
    employeeId: 'HH/EMP/010',
    name: 'Priyanka Singh',
    designation: 'Infection Control Nurse',
    department: 'Infection Control',
    qualification: 'BSc Nursing, IC Certification',
    joiningDate: '15-Nov-2020',
    contactNumber: '9876500123',
    email: 'priyanka.singh@hopehospital.in',
  },
];

// Hope Hospital Equipment Database
export const HOPE_HOSPITAL_EQUIPMENT: EquipmentRecord[] = [
  {
    equipmentId: 'HH/EQP/001',
    name: 'Ventilator - Drager Evita V300',
    category: 'Critical Care',
    manufacturer: 'Drager Medical',
    purchaseDate: '15-Jan-2022',
    lastCalibrationDate: '10-Dec-2024',
    nextCalibrationDate: '10-Jun-2025',
    location: 'ICU - Bed 3',
    status: 'Active',
  },
  {
    equipmentId: 'HH/EQP/002',
    name: 'Defibrillator - Philips HeartStart',
    category: 'Emergency',
    manufacturer: 'Philips Healthcare',
    purchaseDate: '20-Feb-2022',
    lastCalibrationDate: '15-Nov-2024',
    nextCalibrationDate: '15-May-2025',
    location: 'Emergency Department',
    status: 'Active',
  },
  {
    equipmentId: 'HH/EQP/003',
    name: 'Patient Monitor - Nihon Kohden',
    category: 'Monitoring',
    manufacturer: 'Nihon Kohden',
    purchaseDate: '05-Mar-2022',
    lastCalibrationDate: '20-Dec-2024',
    nextCalibrationDate: '20-Jun-2025',
    location: 'ICU - Bed 5',
    status: 'Active',
  },
  {
    equipmentId: 'HH/EQP/004',
    name: 'Autoclave - Tuttnauer 2840',
    category: 'Sterilization',
    manufacturer: 'Tuttnauer',
    purchaseDate: '10-Apr-2022',
    lastCalibrationDate: '05-Jan-2025',
    nextCalibrationDate: '05-Jul-2025',
    location: 'CSSD',
    status: 'Active',
  },
  {
    equipmentId: 'HH/EQP/005',
    name: 'X-Ray Machine - Siemens Mobilett',
    category: 'Radiology',
    manufacturer: 'Siemens Healthineers',
    purchaseDate: '25-May-2022',
    lastCalibrationDate: '12-Dec-2024',
    nextCalibrationDate: '12-Jun-2025',
    location: 'Radiology Department',
    status: 'Active',
  },
];

// Hope Hospital Incident Database
export const HOPE_HOSPITAL_INCIDENTS: IncidentRecord[] = [
  {
    incidentId: 'HH/INC/2024/001',
    date: '15-Jan-2024',
    time: '14:30',
    location: 'Ward 2A',
    reportedBy: 'Nurse Sangeeta Patil',
    incidentType: 'Medication Error (Near Miss)',
    description: 'Wrong medication picked for administration, caught during double-check before administration.',
    actionTaken: 'Immediate counseling of staff, reinforcement of double-check protocol. Process review initiated.',
    status: 'Closed',
  },
  {
    incidentId: 'HH/INC/2024/002',
    date: '18-Jan-2024',
    time: '10:15',
    location: 'Emergency Department',
    reportedBy: 'Dr. Amit Verma',
    incidentType: 'Equipment Malfunction',
    description: 'Suction machine failed during patient care in ED.',
    actionTaken: 'Backup equipment immediately deployed. Biomedical team notified and equipment repaired within 2 hours.',
    status: 'Closed',
  },
  {
    incidentId: 'HH/INC/2024/003',
    date: '22-Jan-2024',
    time: '08:45',
    location: 'ICU',
    reportedBy: 'Nurse Coordinator - ICU',
    incidentType: 'Patient Fall',
    description: 'Patient attempted to get up unassisted and slipped. No injury sustained.',
    actionTaken: 'Patient assessed, vitals stable. Family counseled. Side rails reinforced. Fall risk assessment updated.',
    status: 'Closed',
  },
];

// Utility functions to get realistic data
export function getRandomPatients(count: number = 5): PatientRecord[] {
  const shuffled = [...HOPE_HOSPITAL_PATIENTS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getRandomStaff(count: number = 3): StaffRecord[] {
  const shuffled = [...HOPE_HOSPITAL_STAFF].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getRandomEquipment(count: number = 3): EquipmentRecord[] {
  const shuffled = [...HOPE_HOSPITAL_EQUIPMENT].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getRandomIncidents(count: number = 2): IncidentRecord[] {
  const shuffled = [...HOPE_HOSPITAL_INCIDENTS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Get data based on evidence type
export function getRelevantData(evidenceType: string): {
  patients?: PatientRecord[];
  staff?: StaffRecord[];
  equipment?: EquipmentRecord[];
  incidents?: IncidentRecord[];
} {
  const type = evidenceType.toLowerCase();
  const data: ReturnType<typeof getRelevantData> = {};

  // Patient-related evidence
  if (type.includes('patient') || type.includes('admission') || type.includes('discharge') ||
      type.includes('care') || type.includes('record') || type.includes('assessment')) {
    data.patients = getRandomPatients(5);
  }

  // Staff-related evidence
  if (type.includes('staff') || type.includes('training') || type.includes('credential') ||
      type.includes('employee') || type.includes('roster') || type.includes('duty')) {
    data.staff = getRandomStaff(5);
  }

  // Equipment-related evidence
  if (type.includes('equipment') || type.includes('calibration') || type.includes('maintenance') ||
      type.includes('biomedical') || type.includes('device')) {
    data.equipment = getRandomEquipment(5);
  }

  // Incident-related evidence
  if (type.includes('incident') || type.includes('accident') || type.includes('error') ||
      type.includes('adverse') || type.includes('sentinel')) {
    data.incidents = getRandomIncidents(3);
  }

  return data;
}

export default {
  HOPE_HOSPITAL_PATIENTS,
  HOPE_HOSPITAL_STAFF,
  HOPE_HOSPITAL_EQUIPMENT,
  HOPE_HOSPITAL_INCIDENTS,
  getRandomPatients,
  getRandomStaff,
  getRandomEquipment,
  getRandomIncidents,
  getRelevantData,
};
