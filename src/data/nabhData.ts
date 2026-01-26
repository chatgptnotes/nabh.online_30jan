import type { Chapter, ObjectiveElement, ElementCategory, YouTubeVideo } from '../types/nabh';
import { CHAPTER_NAMES, CHAPTER_TYPES } from '../types/nabh';
import { getLearningResource } from './nabhLearningResources';

/**
 * NABH SHCO (Small Healthcare Organizations) Standards - 3rd Edition
 * Released: 31st August 2022
 * Effective: 1st August 2022
 *
 * Total: 10 Chapters, 71 Standards, 408 Objective Elements
 * - Core: 100 elements - Mandatorily assessed during each assessment
 * - Commitment: 257 elements - Assessed during final assessment
 * - Achievement: 35 elements - Assessed during surveillance
 * - Excellence: 16 elements - Assessed during re-accreditation
 */

// Priority mapping from Excel (NABH Jan 2026.xlsx)
// Maps to PSQ codes in Excel (which correspond to CQI in SHCO 3rd Edition)
const excelPriorityMap: Record<string, { priority: string; assignee: string; status: string }> = {
  "AAC.1.a": { "priority": "P0", "assignee": "Gaurav", "status": "Not started" },
  "AAC.1.b": { "priority": "Prev NC", "assignee": "Kashish", "status": "Completed" },
  "AAC.1.c": { "priority": "P2", "assignee": "", "status": "Blocked" },
  "AAC.1.d": { "priority": "P3", "assignee": "", "status": "Completed" },
  "AAC.2.a": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "AAC.2.b": { "priority": "CORE", "assignee": "", "status": "" },
  "AAC.3.a": { "priority": "CORE", "assignee": "", "status": "" },
  "AAC.3.c": { "priority": "CORE", "assignee": "", "status": "" },
  "AAC.3.e": { "priority": "Prev NC", "assignee": "Kashish", "status": "Completed" },
  "AAC.4.g": { "priority": "Prev NC", "assignee": "Kashish", "status": "Completed" },
  "AAC.5.a": { "priority": "CORE", "assignee": "", "status": "" },
  "AAC.5.e": { "priority": "Prev NC", "assignee": "Kashish", "status": "Completed" },
  "AAC.5.h": { "priority": "Prev NC", "assignee": "Kashish", "status": "Completed" },
  "AAC.6.d": { "priority": "Prev NC", "assignee": "Kashish", "status": "Completed" },
  "AAC.7.c": { "priority": "Prev NC", "assignee": "Kashish", "status": "Completed" },
  "COP.1.a": { "priority": "CORE", "assignee": "Gaurav", "status": "Not started" },
  "COP.1.b": { "priority": "Prev NC", "assignee": "Chandra", "status": "In progress" },
  "COP.1.c": { "priority": "P2", "assignee": "", "status": "Blocked" },
  "COP.1.d": { "priority": "P3", "assignee": "", "status": "Completed" },
  "COP.2.a": { "priority": "Prev NC", "assignee": "Kashish", "status": "" },
  "COP.2.b": { "priority": "CORE", "assignee": "", "status": "" },
  "COP.2.g": { "priority": "Prev NC", "assignee": "Neesha", "status": "Completed" },
  "COP.3.b": { "priority": "Prev NC", "assignee": "Neesha", "status": "Completed" },
  "COP.3.d": { "priority": "Prev NC", "assignee": "Neesha", "status": "Completed" },
  "COP.4.a": { "priority": "CORE", "assignee": "", "status": "" },
  "COP.5.b": { "priority": "CORE", "assignee": "", "status": "" },
  "COP.5.e": { "priority": "Prev NC", "assignee": "", "status": "" },
  "COP.6.d": { "priority": "Prev NC", "assignee": "", "status": "" },
  "COP.7.c": { "priority": "Prev NC", "assignee": "", "status": "" },
  "COP.7.d": { "priority": "Prev NC", "assignee": "Neesha", "status": "Completed" },
  "COP.9.b": { "priority": "Prev NC", "assignee": "Neesha", "status": "Completed" },
  "COP.9.d": { "priority": "Prev NC", "assignee": "Neesha", "status": "Completed" },
  "COP.9.e": { "priority": "Prev NC", "assignee": "Neesha", "status": "Completed" },
  "COP.10.e": { "priority": "Prev NC", "assignee": "Neesha", "status": "Completed" },
  "COP.10.f": { "priority": "Prev NC", "assignee": "Neesha", "status": "Completed" },
  "COP.10.h": { "priority": "Prev NC", "assignee": "Neesha", "status": "Completed" },
  "COP.11.d": { "priority": "CORE", "assignee": "", "status": "" },
  "COP.11.e": { "priority": "Prev NC", "assignee": "Neesha", "status": "Completed" },
  "COP.11.i": { "priority": "CORE", "assignee": "", "status": "" },
  "COP.11.j": { "priority": "CORE", "assignee": "", "status": "" },
  "COP.12.c": { "priority": "CORE", "assignee": "", "status": "" },
  "COP.12.d": { "priority": "CORE", "assignee": "", "status": "" },
  "COP.12.f": { "priority": "CORE", "assignee": "", "status": "" },
  "COP.13.b": { "priority": "Prev NC", "assignee": "Neesha", "status": "Completed" },
  "MOM.1.c": { "priority": "P2", "assignee": "", "status": "" },
  "MOM.1.d": { "priority": "P3", "assignee": "", "status": "" },
  "MOM.3.e": { "priority": "Prev NC", "assignee": "", "status": "" },
  "MOM.6.d": { "priority": "Prev NC", "assignee": "", "status": "" },
  "MOM.7.c": { "priority": "Prev NC", "assignee": "", "status": "" },
  "PRE.1.c": { "priority": "P2", "assignee": "", "status": "" },
  "PRE.1.d": { "priority": "P3", "assignee": "", "status": "" },
  "PRE.6.d": { "priority": "Prev NC", "assignee": "", "status": "" },
  "HIC.3.e": { "priority": "Prev NC", "assignee": "", "status": "" },
  "HIC.5.e": { "priority": "Prev NC", "assignee": "", "status": "" },
  "HIC.6.d": { "priority": "Prev NC", "assignee": "", "status": "" },
  // PSQ codes from Excel map to CQI in SHCO 3rd Edition
  "CQI.1.a": { "priority": "CORE", "assignee": "Kashish", "status": "" },
  "CQI.1.b": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "CQI.1.c": { "priority": "CORE", "assignee": "Kashish", "status": "Blocked" },
  "CQI.1.d": { "priority": "CORE", "assignee": "Kashish", "status": "Completed" },
  "CQI.1.e": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "CQI.1.f": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "CQI.1.g": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "CQI.1.h": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "CQI.1.i": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "CQI.2.a": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "CQI.2.b": { "priority": "CORE", "assignee": "Kashish", "status": "" },
  "CQI.2.c": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "CQI.2.d": { "priority": "CORE", "assignee": "Kashish", "status": "" },
  "CQI.2.e": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "CQI.3.a": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "CQI.3.b": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "CQI.3.c": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "CQI.3.d": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "CQI.3.e": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "CQI.4.a": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "CQI.4.b": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "CQI.4.c": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "CQI.4.d": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "CQI.5.a": { "priority": "CORE", "assignee": "Kashish", "status": "Completed" },
  "CQI.5.b": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "CQI.5.c": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "CQI.5.d": { "priority": "Prev NC", "assignee": "Chandra", "status": "Completed" },
  "CQI.5.e": { "priority": "P2", "assignee": "Kashish", "status": "" },
  "ROM.1.c": { "priority": "P2", "assignee": "", "status": "" },
  "ROM.1.d": { "priority": "P3", "assignee": "", "status": "" },
  "ROM.3.e": { "priority": "Prev NC", "assignee": "", "status": "" },
  "FMS.1.c": { "priority": "P2", "assignee": "", "status": "" },
  "FMS.1.d": { "priority": "P3", "assignee": "", "status": "" },
  "FMS.3.e": { "priority": "Prev NC", "assignee": "", "status": "" },
  "FMS.5.e": { "priority": "Prev NC", "assignee": "", "status": "" },
  "HRM.3.e": { "priority": "Prev NC", "assignee": "", "status": "" },
  "HRM.6.d": { "priority": "Prev NC", "assignee": "", "status": "" },
  "HRM.7.c": { "priority": "Prev NC", "assignee": "", "status": "" },
  "IMS.1.c": { "priority": "P2", "assignee": "", "status": "" },
  "IMS.1.d": { "priority": "P3", "assignee": "", "status": "" },
  "IMS.3.e": { "priority": "Prev NC", "assignee": "", "status": "" },
  "IMS.6.d": { "priority": "Prev NC", "assignee": "", "status": "" },
};

// Helper to create objective element with SHCO 3rd Edition data
// Automatically applies priority, assignee, and status from Excel if available
// Also loads Hindi explanations and YouTube videos from learning resources
const obj = (
  code: string,
  description: string = '',
  category: ElementCategory = 'Commitment',
  evidencesList: string = '',
  evidenceLinks: string = '',
  priority: string = '',
  assignee: string = '',
  status: string = ''
): ObjectiveElement => {
  // Look up Excel overrides
  const excelData = excelPriorityMap[code];
  const finalPriority = excelData?.priority || (category === 'Core' ? 'CORE' : priority);
  const finalAssignee = excelData?.assignee || assignee;
  const finalStatus = excelData?.status || status;

  // Get learning resources (Hindi explanation and YouTube videos)
  const learningResource = getLearningResource(code);
  const youtubeVideos: YouTubeVideo[] = learningResource.youtubeVideos.map((video, index) => ({
    id: `${code.toLowerCase().replace(/\./g, '-')}-video-${index}`,
    title: video.title,
    url: video.url,
    description: video.description,
    addedBy: 'NABH Training Team',
    addedAt: new Date().toISOString(),
  }));

  return {
    id: code.toLowerCase().replace(/\./g, '-').replace(/\s/g, '-'),
    code,
    title: description.substring(0, 100) + (description.length > 100 ? '...' : ''),
    description,
    hindiExplanation: learningResource.hindiExplanation,
    category,
    isCore: category === 'Core',
    evidencesList,
    evidenceLinks,
    evidenceFiles: [],
    youtubeVideos,
    trainingMaterials: [],
    priority: finalPriority as ObjectiveElement['priority'],
    assignee: finalAssignee,
    status: finalStatus as ObjectiveElement['status'],
    startDate: '',
    endDate: '',
    deliverable: '',
    notes: '',
  };
};

export const nabhData: Chapter[] = [
  // ============================================================================
  // AAC - Access, Assessment and Continuity of Care
  // ============================================================================
  {
    id: 'aac',
    code: 'AAC',
    name: 'AAC',
    fullName: CHAPTER_NAMES.AAC,
    type: CHAPTER_TYPES.AAC,
    objectives: [
      // AAC.1 - Organization defines and displays services
      obj('AAC.1.a', 'The services being provided are clearly defined and are in consonance with the needs of the community.', 'Commitment'),
      obj('AAC.1.b', 'The defined services are prominently displayed.', 'Commitment'),
      obj('AAC.1.c', 'The staff is oriented to these services.', 'Commitment'),

      // AAC.2 - Registration and admission process
      obj('AAC.2.a', 'Documented policies and procedures are used for registering and admitting patients.', 'Commitment'),
      obj('AAC.2.b', 'The documented procedures address out-patients, in-patients and emergency patients.', 'Core'),
      obj('AAC.2.c', 'A unique identification number is generated at the end of registration.', 'Core'),
      obj('AAC.2.d', 'Patients are accepted only if the organization can provide the required service.', 'Commitment'),
      obj('AAC.2.e', 'The documented policies and procedures also address managing patients during non-availability of beds.', 'Commitment'),
      obj('AAC.2.f', 'The staff is aware of these processes.', 'Commitment'),

      // AAC.3 - Transfer and referral mechanism
      obj('AAC.3.a', 'Documented policies and procedures exist for transfer of patients.', 'Commitment'),
      obj('AAC.3.b', 'Transfer-out is based on the patients condition and need for continuing care.', 'Core'),
      obj('AAC.3.c', 'Transfer process addresses the responsibility during transfer.', 'Core'),
      obj('AAC.3.d', 'A referral summary accompanies the patient.', 'Core'),
      obj('AAC.3.e', 'Transfer-in of patients is consistent with the organizations mission and resources.', 'Commitment'),

      // AAC.4 - Initial assessment
      obj('AAC.4.a', 'Documented policies and procedures define the scope and content of assessments.', 'Core'),
      obj('AAC.4.b', 'Initial medical assessment is done within 24 hours of admission or earlier as per patient condition.', 'Core'),
      obj('AAC.4.c', 'Initial nursing assessment is done within 24 hours of admission or earlier as per patient condition.', 'Core'),
      obj('AAC.4.d', 'Assessment is comprehensive covering medical, nursing and other needs.', 'Commitment'),
      obj('AAC.4.e', 'Assessments are documented in the patient record.', 'Core'),
      obj('AAC.4.f', 'Patients requiring emergency care undergo immediate assessment.', 'Core'),

      // AAC.5 - Reassessment
      obj('AAC.5.a', 'Patients are reassessed at appropriate intervals based on their condition and plan of care.', 'Core'),
      obj('AAC.5.b', 'Reassessment is done by a qualified individual.', 'Commitment'),
      obj('AAC.5.c', 'Reassessments are documented in the patient record.', 'Core'),
      obj('AAC.5.d', 'The care plan is modified based on the reassessment.', 'Commitment'),

      // AAC.6 - Laboratory services
      obj('AAC.6.a', 'Laboratory services are available as per the scope of the organization.', 'Commitment'),
      obj('AAC.6.b', 'Laboratory services are provided by qualified personnel.', 'Core'),
      obj('AAC.6.c', 'Standard operating procedures guide collection, identification, handling, safe transportation and disposal of specimens.', 'Core'),
      obj('AAC.6.d', 'Laboratory results are available in a timely manner.', 'Commitment'),
      obj('AAC.6.e', 'Critical results are communicated immediately to the concerned care provider.', 'Core'),
      obj('AAC.6.f', 'Outsourced laboratory services meet the organizations quality requirements.', 'Commitment'),

      // AAC.7 - Laboratory quality assurance
      obj('AAC.7.a', 'There is a quality assurance programme for laboratory services.', 'Commitment'),
      obj('AAC.7.b', 'Internal quality control is practiced.', 'Commitment'),
      obj('AAC.7.c', 'External quality assurance (EQAS) is practiced where available.', 'Achievement'),
      obj('AAC.7.d', 'Laboratory safety procedures are established and implemented.', 'Core'),
      obj('AAC.7.e', 'Laboratory equipment is regularly calibrated and maintained.', 'Commitment'),

      // AAC.8 - Imaging services
      obj('AAC.8.a', 'Imaging services are available as per the scope of the organization.', 'Core'),
      obj('AAC.8.b', 'Imaging services are provided by qualified personnel.', 'Core'),
      obj('AAC.8.c', 'Standard operating procedures guide the imaging services.', 'Commitment'),
      obj('AAC.8.d', 'Imaging results are available in a timely manner.', 'Commitment'),
      obj('AAC.8.e', 'Radiation safety norms are adhered to.', 'Core'),
      obj('AAC.8.f', 'Outsourced imaging services meet the organizations quality requirements.', 'Commitment'),

      // AAC.9 - Imaging quality assurance
      obj('AAC.9.a', 'There is a quality assurance programme for imaging services.', 'Commitment'),
      obj('AAC.9.b', 'Imaging equipment is regularly calibrated and maintained.', 'Commitment'),
      obj('AAC.9.c', 'Personnel are monitored for radiation exposure.', 'Core'),

      // AAC.10 - Discharge process
      obj('AAC.10.a', 'Documented policies and procedures guide the discharge process.', 'Commitment'),
      obj('AAC.10.b', 'Discharge planning is initiated early in the care process.', 'Commitment'),
      obj('AAC.10.c', 'A discharge summary is provided to the patient at the time of discharge.', 'Core'),
      obj('AAC.10.d', 'The discharge summary includes relevant clinical and follow-up information.', 'Core'),
      obj('AAC.10.e', 'Patient and family are educated about medications, diet, and follow-up care.', 'Core'),
      obj('AAC.10.f', 'Patients leaving against medical advice are informed about risks.', 'Core'),
    ],
  },

  // ============================================================================
  // COP - Care of Patients
  // ============================================================================
  {
    id: 'cop',
    code: 'COP',
    name: 'COP',
    fullName: CHAPTER_NAMES.COP,
    type: CHAPTER_TYPES.COP,
    objectives: [
      // COP.1 - Care guided by guidelines
      obj('COP.1.a', 'Patient care is based on applicable national/international guidelines.', 'Commitment'),
      obj('COP.1.b', 'An individualized plan of care is developed for each patient.', 'Core'),
      obj('COP.1.c', 'The plan of care is documented in the patient record.', 'Core'),
      obj('COP.1.d', 'The care plan is reviewed and modified as needed.', 'Commitment'),
      obj('COP.1.e', 'Multi-disciplinary team is involved in care planning when required.', 'Commitment'),

      // COP.2 - Uniform care
      obj('COP.2.a', 'Uniform care is provided irrespective of ability to pay or source of payment.', 'Core'),
      obj('COP.2.b', 'Uniform care is provided irrespective of gender, religion, caste, or socio-economic status.', 'Core'),
      obj('COP.2.c', 'Resources are allocated based on patient needs.', 'Commitment'),

      // COP.3 - Emergency care
      obj('COP.3.a', 'Emergency care is available 24x7.', 'Core'),
      obj('COP.3.b', 'Emergency patients are triaged based on urgency of need.', 'Core'),
      obj('COP.3.c', 'Emergency equipment and medications are available.', 'Core'),
      obj('COP.3.d', 'Staff is trained in emergency care including basic life support.', 'Core'),
      obj('COP.3.e', 'Documented policies guide the emergency services.', 'Commitment'),
      obj('COP.3.f', 'Transfer arrangements exist for cases beyond the scope of the facility.', 'Commitment'),

      // COP.4 - Special needs patients
      obj('COP.4.a', 'The organization identifies patients with special needs.', 'Commitment'),
      obj('COP.4.b', 'Special needs of pediatric patients are addressed.', 'Core'),
      obj('COP.4.c', 'Special needs of geriatric patients are addressed.', 'Commitment'),
      obj('COP.4.d', 'Special needs of differently-abled patients are addressed.', 'Commitment'),
      obj('COP.4.e', 'Patients at risk of abuse, neglect or violence are identified and protected.', 'Core'),
      obj('COP.4.f', 'Vulnerable patients including women and children are protected.', 'Core'),

      // COP.5 - Obstetric care
      obj('COP.5.a', 'Documented procedures guide ante-natal care.', 'Commitment'),
      obj('COP.5.b', 'Documented procedures guide intra-natal care.', 'Core'),
      obj('COP.5.c', 'Documented procedures guide post-natal care.', 'Commitment'),
      obj('COP.5.d', 'High-risk pregnancies are identified and managed appropriately.', 'Core'),
      obj('COP.5.e', 'Newborn care including resuscitation is provided.', 'Core'),
      obj('COP.5.f', 'Referral mechanisms for high-risk cases are in place.', 'Core'),

      // COP.6 - Surgical care
      obj('COP.6.a', 'Documented procedures guide pre-operative care.', 'Commitment'),
      obj('COP.6.b', 'Informed consent is obtained prior to surgery.', 'Core'),
      obj('COP.6.c', 'Surgical safety checklist is used.', 'Core'),
      obj('COP.6.d', 'Pre-anesthetic assessment is documented.', 'Core'),
      obj('COP.6.e', 'Intra-operative care is documented.', 'Core'),
      obj('COP.6.f', 'Post-operative care is documented.', 'Core'),
      obj('COP.6.g', 'Anesthesia is administered by qualified personnel.', 'Core'),
      obj('COP.6.h', 'Patients are monitored during and after anesthesia.', 'Core'),

      // COP.7 - Nursing care
      obj('COP.7.a', 'Nursing care is planned based on initial and ongoing assessment.', 'Commitment'),
      obj('COP.7.b', 'Nursing care is documented in the patient record.', 'Core'),
      obj('COP.7.c', 'Nursing procedures are standardized.', 'Commitment'),
      obj('COP.7.d', 'Vital signs monitoring is done as per patient condition.', 'Core'),
      obj('COP.7.e', 'Patient safety measures are implemented.', 'Core'),

      // COP.8 - Family involvement
      obj('COP.8.a', 'Patient and family are involved in care decisions.', 'Commitment'),
      obj('COP.8.b', 'Patient preferences are considered in care planning.', 'Commitment'),
      obj('COP.8.c', 'Communication with patient and family is documented.', 'Commitment'),

      // COP.9 - Pain management
      obj('COP.9.a', 'Pain is assessed using appropriate scales.', 'Core'),
      obj('COP.9.b', 'Pain management is provided as per patient needs.', 'Core'),
      obj('COP.9.c', 'Response to pain management is documented.', 'Commitment'),

      // COP.10 - End of life care
      obj('COP.10.a', 'End-of-life care respects patient and family wishes.', 'Commitment'),
      obj('COP.10.b', 'Comfort and dignity are maintained.', 'Commitment'),
      obj('COP.10.c', 'Emotional support is provided to patient and family.', 'Commitment'),
      obj('COP.10.d', 'Death is handled with dignity and respect.', 'Core'),
    ],
  },

  // ============================================================================
  // MOM - Management of Medication
  // ============================================================================
  {
    id: 'mom',
    code: 'MOM',
    name: 'MOM',
    fullName: CHAPTER_NAMES.MOM,
    type: CHAPTER_TYPES.MOM,
    objectives: [
      // MOM.1 - Pharmacy services organization
      obj('MOM.1.a', 'Pharmacy services are organized to meet patient needs.', 'Commitment'),
      obj('MOM.1.b', 'Pharmacy services are available 24x7 or as per organizational policy.', 'Commitment'),
      obj('MOM.1.c', 'A qualified pharmacist supervises pharmacy operations.', 'Core'),
      obj('MOM.1.d', 'A formulary appropriate to the organization is developed and maintained.', 'Commitment'),
      obj('MOM.1.e', 'Medications are stored under proper conditions.', 'Core'),
      obj('MOM.1.f', 'Expiry of medications is monitored.', 'Core'),

      // MOM.2 - Prescription
      obj('MOM.2.a', 'Medications are prescribed by authorized personnel.', 'Core'),
      obj('MOM.2.b', 'Prescriptions are legible and complete.', 'Core'),
      obj('MOM.2.c', 'Look-alike, sound-alike medications are identified and managed.', 'Core'),
      obj('MOM.2.d', 'High-risk medications are identified and managed safely.', 'Core'),
      obj('MOM.2.e', 'Verbal and telephone orders are minimized and verified.', 'Commitment'),

      // MOM.3 - Dispensing
      obj('MOM.3.a', 'Medications are dispensed by qualified personnel.', 'Core'),
      obj('MOM.3.b', 'Prescriptions are verified before dispensing.', 'Core'),
      obj('MOM.3.c', 'Patients are counseled about medications.', 'Commitment'),
      obj('MOM.3.d', 'Dispensing records are maintained.', 'Commitment'),

      // MOM.4 - Administration
      obj('MOM.4.a', 'Medications are administered by trained and authorized personnel.', 'Core'),
      obj('MOM.4.b', 'Patient identification is verified before medication administration.', 'Core'),
      obj('MOM.4.c', 'Medication administration is documented.', 'Core'),
      obj('MOM.4.d', 'Self-administration is supervised when permitted.', 'Commitment'),

      // MOM.5 - Adverse drug events
      obj('MOM.5.a', 'Adverse drug events are defined.', 'Commitment'),
      obj('MOM.5.b', 'Patients are monitored for adverse drug events.', 'Core'),
      obj('MOM.5.c', 'Adverse drug events are documented and reported.', 'Core'),
      obj('MOM.5.d', 'Appropriate action is taken for adverse drug events.', 'Core'),

      // MOM.6 - Medical gases
      obj('MOM.6.a', 'Medical gases are stored safely.', 'Core'),
      obj('MOM.6.b', 'Medical gases are administered by trained personnel.', 'Core'),
      obj('MOM.6.c', 'Stock levels of medical gases are monitored.', 'Commitment'),
    ],
  },

  // ============================================================================
  // PRE - Patient Rights and Education
  // ============================================================================
  {
    id: 'pre',
    code: 'PRE',
    name: 'PRE',
    fullName: CHAPTER_NAMES.PRE,
    type: CHAPTER_TYPES.PRE,
    objectives: [
      // PRE.1 - Patient rights and responsibilities
      obj('PRE.1.a', 'Patient rights are documented and displayed.', 'Core'),
      obj('PRE.1.b', 'Patient responsibilities are communicated.', 'Commitment'),
      obj('PRE.1.c', 'Staff is trained on patient rights.', 'Commitment'),
      obj('PRE.1.d', 'Patient privacy is maintained during care.', 'Core'),
      obj('PRE.1.e', 'Confidentiality of patient information is maintained.', 'Core'),
      obj('PRE.1.f', 'Patients are protected from physical abuse.', 'Core'),

      // PRE.2 - Beliefs and values
      obj('PRE.2.a', 'Patient beliefs and values are respected.', 'Commitment'),
      obj('PRE.2.b', 'Cultural and religious preferences are accommodated.', 'Commitment'),
      obj('PRE.2.c', 'Patients are involved in decision making about their care.', 'Commitment'),
      obj('PRE.2.d', 'Patients can refuse treatment after being informed of consequences.', 'Core'),

      // PRE.3 - Informed consent
      obj('PRE.3.a', 'A documented consent policy exists.', 'Commitment'),
      obj('PRE.3.b', 'Informed consent is obtained for procedures and surgeries.', 'Core'),
      obj('PRE.3.c', 'Consent includes information about risks, benefits and alternatives.', 'Core'),
      obj('PRE.3.d', 'Consent is obtained by the treating physician.', 'Core'),
      obj('PRE.3.e', 'General consent is obtained at admission.', 'Commitment'),
      obj('PRE.3.f', 'Consent for high-risk procedures is specifically documented.', 'Core'),

      // PRE.4 - Patient education
      obj('PRE.4.a', 'Patients are informed about their diagnosis.', 'Core'),
      obj('PRE.4.b', 'Patients are informed about planned treatment and care.', 'Core'),
      obj('PRE.4.c', 'Patients are educated about medications.', 'Commitment'),
      obj('PRE.4.d', 'Patients are educated about diet and nutrition.', 'Commitment'),
      obj('PRE.4.e', 'Patients are educated about safe and effective use of equipment.', 'Commitment'),
      obj('PRE.4.f', 'Patient education is documented.', 'Commitment'),

      // PRE.5 - Grievances
      obj('PRE.5.a', 'A grievance redressal mechanism exists.', 'Commitment'),
      obj('PRE.5.b', 'Patients are informed about the grievance mechanism.', 'Commitment'),
      obj('PRE.5.c', 'Grievances are documented and addressed.', 'Commitment'),
      obj('PRE.5.d', 'Feedback is used for improvement.', 'Achievement'),
    ],
  },

  // ============================================================================
  // HIC - Hospital Infection Control
  // ============================================================================
  {
    id: 'hic',
    code: 'HIC',
    name: 'HIC',
    fullName: CHAPTER_NAMES.HIC,
    type: CHAPTER_TYPES.HIC,
    objectives: [
      // HIC.1 - Infection control programme
      obj('HIC.1.a', 'An infection control programme is in place.', 'Commitment'),
      obj('HIC.1.b', 'An infection control team/committee exists.', 'Commitment'),
      obj('HIC.1.c', 'Standard precautions are adhered to at all times.', 'Core'),
      obj('HIC.1.d', 'Hand hygiene practices are followed.', 'Core'),
      obj('HIC.1.e', 'Personal protective equipment is available and used appropriately.', 'Core'),
      obj('HIC.1.f', 'Cleanliness and general hygiene of facilities is maintained.', 'Core'),

      // HIC.2 - Infection control manual and surveillance
      obj('HIC.2.a', 'An infection control manual exists.', 'Commitment'),
      obj('HIC.2.b', 'The manual is periodically reviewed and updated.', 'Achievement'),
      obj('HIC.2.c', 'Surveillance of hospital-associated infections is conducted.', 'Commitment'),
      obj('HIC.2.d', 'Surveillance data is analyzed and used for improvement.', 'Achievement'),

      // HIC.3 - Prevention of HAI
      obj('HIC.3.a', 'Measures are taken to prevent surgical site infections.', 'Core'),
      obj('HIC.3.b', 'Measures are taken to prevent catheter-associated urinary tract infections.', 'Core'),
      obj('HIC.3.c', 'Measures are taken to prevent central line-associated bloodstream infections.', 'Core'),
      obj('HIC.3.d', 'Measures are taken to prevent ventilator-associated pneumonia.', 'Core'),
      obj('HIC.3.e', 'Isolation practices are implemented when needed.', 'Core'),
      obj('HIC.3.f', 'Staff safety measures are in place.', 'Commitment'),

      // HIC.4 - Sterilization
      obj('HIC.4.a', 'A central sterile supply department/area exists.', 'Commitment'),
      obj('HIC.4.b', 'Sterilization procedures are documented.', 'Commitment'),
      obj('HIC.4.c', 'Sterilization is monitored using appropriate indicators.', 'Core'),
      obj('HIC.4.d', 'Sterile supplies are stored and handled appropriately.', 'Core'),
      obj('HIC.4.e', 'Equipment cleaning and disinfection practices are followed.', 'Core'),

      // HIC.5 - Biomedical waste
      obj('HIC.5.a', 'Biomedical waste is segregated at source.', 'Core'),
      obj('HIC.5.b', 'Color-coded bins and bags are used.', 'Core'),
      obj('HIC.5.c', 'Biomedical waste is transported safely.', 'Core'),
      obj('HIC.5.d', 'Biomedical waste is disposed as per regulations.', 'Core'),
      obj('HIC.5.e', 'Records of biomedical waste disposal are maintained.', 'Commitment'),
      obj('HIC.5.f', 'Staff is trained in biomedical waste management.', 'Commitment'),

      // HIC.6 - Management support and training
      obj('HIC.6.a', 'Management supports the infection control program.', 'Commitment'),
      obj('HIC.6.b', 'Staff is trained on infection control practices.', 'Core'),
      obj('HIC.6.c', 'Resources are allocated for infection control.', 'Commitment'),
      obj('HIC.6.d', 'Infection control compliance is monitored.', 'Achievement'),

      // HIC.7 - Laundry and linen
      obj('HIC.7.a', 'Laundry services are organized appropriately.', 'Commitment'),
      obj('HIC.7.b', 'Infected linen is handled separately.', 'Core'),
      obj('HIC.7.c', 'Clean and soiled linen are stored separately.', 'Core'),
      obj('HIC.7.d', 'Staff handling linen use appropriate protection.', 'Commitment'),
    ],
  },

  // ============================================================================
  // CQI - Continuous Quality Improvement (SHCO uses CQI instead of PSQ)
  // ============================================================================
  {
    id: 'cqi',
    code: 'CQI',
    name: 'CQI',
    fullName: CHAPTER_NAMES.CQI,
    type: CHAPTER_TYPES.CQI,
    objectives: [
      // CQI.1 - Quality assurance programme
      obj('CQI.1.a', 'A quality assurance programme is in place.', 'Commitment'),
      obj('CQI.1.b', 'Quality objectives are defined.', 'Commitment'),
      obj('CQI.1.c', 'Quality improvement activities are conducted.', 'Achievement'),
      obj('CQI.1.d', 'A quality committee/team exists.', 'Commitment'),

      // CQI.2 - Key indicators
      obj('CQI.2.a', 'Key indicators are identified for clinical areas.', 'Commitment'),
      obj('CQI.2.b', 'Key indicators are identified for managerial areas.', 'Commitment'),
      obj('CQI.2.c', 'Data is collected and analyzed.', 'Commitment'),
      obj('CQI.2.d', 'Results are used for improvement.', 'Achievement'),
      obj('CQI.2.e', 'Benchmarking is done where possible.', 'Excellence'),

      // CQI.3 - Patient safety programme
      obj('CQI.3.a', 'A patient safety programme is in place.', 'Commitment'),
      obj('CQI.3.b', 'Patient identification is ensured before any procedure.', 'Core'),
      obj('CQI.3.c', 'Communication is standardized for handovers.', 'Core'),
      obj('CQI.3.d', 'High-alert medications are managed safely.', 'Core'),
      obj('CQI.3.e', 'Surgical safety is ensured.', 'Core'),
      obj('CQI.3.f', 'Fall prevention measures are in place.', 'Core'),
      obj('CQI.3.g', 'Pressure ulcer prevention measures are in place.', 'Commitment'),

      // CQI.4 - Incident reporting
      obj('CQI.4.a', 'An incident reporting system exists.', 'Commitment'),
      obj('CQI.4.b', 'Incidents are reported without fear of punitive action.', 'Commitment'),
      obj('CQI.4.c', 'Incidents are analyzed and action is taken.', 'Commitment'),
      obj('CQI.4.d', 'Learning from incidents is shared.', 'Achievement'),

      // CQI.5 - Audit
      obj('CQI.5.a', 'Medical audits are conducted.', 'Achievement'),
      obj('CQI.5.b', 'Nursing audits are conducted.', 'Achievement'),
      obj('CQI.5.c', 'Audit findings are used for improvement.', 'Achievement'),

      // CQI.6 - Sentinel events
      obj('CQI.6.a', 'Sentinel events are defined.', 'Commitment'),
      obj('CQI.6.b', 'Root cause analysis is conducted for sentinel events.', 'Core'),
      obj('CQI.6.c', 'Corrective actions are implemented.', 'Core'),
      obj('CQI.6.d', 'Effectiveness of corrective actions is monitored.', 'Commitment'),

      // CQI.7 - Satisfaction
      obj('CQI.7.a', 'Patient satisfaction is measured.', 'Commitment'),
      obj('CQI.7.b', 'Employee satisfaction is measured.', 'Achievement'),
      obj('CQI.7.c', 'Results are analyzed and used for improvement.', 'Achievement'),
    ],
  },

  // ============================================================================
  // ROM - Responsibilities of Management
  // ============================================================================
  {
    id: 'rom',
    code: 'ROM',
    name: 'ROM',
    fullName: CHAPTER_NAMES.ROM,
    type: CHAPTER_TYPES.ROM,
    objectives: [
      // ROM.1 - Management responsibilities
      obj('ROM.1.a', 'The governance structure is defined.', 'Commitment'),
      obj('ROM.1.b', 'Responsibilities of management are documented.', 'Commitment'),
      obj('ROM.1.c', 'Management reviews organizational performance.', 'Commitment'),

      // ROM.2 - Department services
      obj('ROM.2.a', 'Services of each department are defined.', 'Commitment'),
      obj('ROM.2.b', 'Department heads are accountable for their services.', 'Commitment'),
      obj('ROM.2.c', 'Coordination between departments exists.', 'Commitment'),

      // ROM.3 - Ethical management
      obj('ROM.3.a', 'Ethical practices are followed.', 'Commitment'),
      obj('ROM.3.b', 'Conflict of interest is managed.', 'Commitment'),
      obj('ROM.3.c', 'Professional ethics are upheld.', 'Commitment'),
      obj('ROM.3.d', 'Transparency in dealings is maintained.', 'Commitment'),

      // ROM.4 - Qualified leadership
      obj('ROM.4.a', 'The organization has a qualified head/administrator.', 'Core'),
      obj('ROM.4.b', 'The head has appropriate authority and responsibility.', 'Commitment'),
      obj('ROM.4.c', 'The head ensures compliance with laws and regulations.', 'Core'),

      // ROM.5 - Patient safety and risk management
      obj('ROM.5.a', 'Patient safety is a priority for management.', 'Core'),
      obj('ROM.5.b', 'Risk management processes are in place.', 'Commitment'),
      obj('ROM.5.c', 'Resources are allocated for safety initiatives.', 'Commitment'),
      obj('ROM.5.d', 'Safety culture is promoted.', 'Achievement'),

      // ROM.6 - Strategic planning
      obj('ROM.6.a', 'A strategic plan exists.', 'Achievement'),
      obj('ROM.6.b', 'An operational plan exists.', 'Commitment'),
      obj('ROM.6.c', 'Plans are reviewed and updated periodically.', 'Achievement'),

      // ROM.7 - Statutory compliance
      obj('ROM.7.a', 'All required licenses and registrations are in place.', 'Core'),
      obj('ROM.7.b', 'Licenses are renewed in a timely manner.', 'Core'),
      obj('ROM.7.c', 'Compliance with statutory requirements is monitored.', 'Commitment'),
    ],
  },

  // ============================================================================
  // FMS - Facilities Management and Safety
  // ============================================================================
  {
    id: 'fms',
    code: 'FMS',
    name: 'FMS',
    fullName: CHAPTER_NAMES.FMS,
    type: CHAPTER_TYPES.FMS,
    objectives: [
      // FMS.1 - Regulatory compliance
      obj('FMS.1.a', 'Applicable laws and regulations are identified.', 'Commitment'),
      obj('FMS.1.b', 'Compliance with building codes is maintained.', 'Core'),
      obj('FMS.1.c', 'Required facility inspections are completed.', 'Core'),
      obj('FMS.1.d', 'Non-conformities are addressed.', 'Commitment'),

      // FMS.2 - Safe environment
      obj('FMS.2.a', 'The facility is designed for patient safety.', 'Commitment'),
      obj('FMS.2.b', 'Safety hazards are identified and addressed.', 'Core'),
      obj('FMS.2.c', 'Security measures are in place.', 'Core'),
      obj('FMS.2.d', 'Access control is implemented.', 'Commitment'),
      obj('FMS.2.e', 'Signage and wayfinding are adequate.', 'Commitment'),

      // FMS.3 - Equipment management
      obj('FMS.3.a', 'Equipment inventory is maintained.', 'Commitment'),
      obj('FMS.3.b', 'Equipment is regularly inspected and maintained.', 'Core'),
      obj('FMS.3.c', 'Preventive maintenance schedules are followed.', 'Commitment'),
      obj('FMS.3.d', 'Staff is trained to operate equipment.', 'Core'),
      obj('FMS.3.e', 'Equipment malfunctions are reported and addressed.', 'Commitment'),

      // FMS.4 - Utilities
      obj('FMS.4.a', 'Safe drinking water is available.', 'Core'),
      obj('FMS.4.b', 'Water quality is tested regularly.', 'Commitment'),
      obj('FMS.4.c', 'Electricity supply is reliable with backup arrangements.', 'Core'),
      obj('FMS.4.d', 'Medical gases are safely stored and supplied.', 'Core'),
      obj('FMS.4.e', 'Vacuum systems are maintained.', 'Commitment'),

      // FMS.5 - Fire safety
      obj('FMS.5.a', 'A fire safety plan exists.', 'Core'),
      obj('FMS.5.b', 'Fire detection and suppression equipment is in place.', 'Core'),
      obj('FMS.5.c', 'Fire evacuation routes are marked and unobstructed.', 'Core'),
      obj('FMS.5.d', 'Fire drills are conducted regularly.', 'Core'),
      obj('FMS.5.e', 'Staff is trained in fire safety.', 'Core'),
      obj('FMS.5.f', 'Non-fire emergency plans exist.', 'Commitment'),

      // FMS.6 - Smoking policy
      obj('FMS.6.a', 'A no-smoking policy is in place.', 'Core'),
      obj('FMS.6.b', 'No-smoking signs are displayed.', 'Commitment'),
      obj('FMS.6.c', 'The policy is enforced.', 'Commitment'),

      // FMS.7 - Disaster management
      obj('FMS.7.a', 'A disaster management plan exists.', 'Commitment'),
      obj('FMS.7.b', 'Roles and responsibilities are defined.', 'Commitment'),
      obj('FMS.7.c', 'Mock drills are conducted.', 'Achievement'),
      obj('FMS.7.d', 'Coordination with external agencies exists.', 'Achievement'),

      // FMS.8 - Hazardous materials
      obj('FMS.8.a', 'Hazardous materials are identified.', 'Commitment'),
      obj('FMS.8.b', 'Material Safety Data Sheets (MSDS) are available.', 'Commitment'),
      obj('FMS.8.c', 'Hazardous materials are stored safely.', 'Core'),
      obj('FMS.8.d', 'Staff handling hazardous materials is trained.', 'Core'),
      obj('FMS.8.e', 'Spill management procedures are in place.', 'Commitment'),

      // FMS.9 - Security
      obj('FMS.9.a', 'Security personnel/systems are in place.', 'Commitment'),
      obj('FMS.9.b', 'Vulnerable areas are secured.', 'Core'),
      obj('FMS.9.c', 'Visitor management system exists.', 'Commitment'),
      obj('FMS.9.d', 'Vehicle parking is organized.', 'Commitment'),
    ],
  },

  // ============================================================================
  // HRM - Human Resource Management
  // ============================================================================
  {
    id: 'hrm',
    code: 'HRM',
    name: 'HRM',
    fullName: CHAPTER_NAMES.HRM,
    type: CHAPTER_TYPES.HRM,
    objectives: [
      // HRM.1 - HR planning
      obj('HRM.1.a', 'Staffing requirements are defined.', 'Commitment'),
      obj('HRM.1.b', 'Staffing patterns are based on patient care needs.', 'Commitment'),
      obj('HRM.1.c', 'Nurse-patient ratio is maintained.', 'Core'),

      // HRM.2 - Recruitment
      obj('HRM.2.a', 'Job descriptions exist for all positions.', 'Commitment'),
      obj('HRM.2.b', 'Recruitment process is documented.', 'Commitment'),
      obj('HRM.2.c', 'Credentials are verified before appointment.', 'Core'),
      obj('HRM.2.d', 'Background verification is done.', 'Commitment'),

      // HRM.3 - Induction
      obj('HRM.3.a', 'Induction training programme exists.', 'Commitment'),
      obj('HRM.3.b', 'New staff receive orientation to policies and procedures.', 'Commitment'),
      obj('HRM.3.c', 'Induction includes patient safety and infection control.', 'Core'),

      // HRM.4 - Training and development
      obj('HRM.4.a', 'Training needs are identified.', 'Commitment'),
      obj('HRM.4.b', 'Training programmes are conducted.', 'Commitment'),
      obj('HRM.4.c', 'Training records are maintained.', 'Commitment'),
      obj('HRM.4.d', 'Effectiveness of training is evaluated.', 'Achievement'),

      // HRM.5 - Job-specific training
      obj('HRM.5.a', 'Training is aligned with job requirements.', 'Commitment'),
      obj('HRM.5.b', 'Competency is assessed.', 'Commitment'),
      obj('HRM.5.c', 'Staff maintain required qualifications.', 'Commitment'),

      // HRM.6 - Safety and quality training
      obj('HRM.6.a', 'Staff are trained on patient safety.', 'Core'),
      obj('HRM.6.b', 'Staff are trained on infection control.', 'Core'),
      obj('HRM.6.c', 'Staff are trained on fire safety.', 'Core'),
      obj('HRM.6.d', 'Staff are trained on basic life support.', 'Core'),

      // HRM.7 - Performance appraisal
      obj('HRM.7.a', 'A performance appraisal system exists.', 'Commitment'),
      obj('HRM.7.b', 'Appraisals are conducted periodically.', 'Commitment'),
      obj('HRM.7.c', 'Feedback is provided to staff.', 'Achievement'),

      // HRM.8 - Disciplinary and grievance
      obj('HRM.8.a', 'Disciplinary process is documented.', 'Commitment'),
      obj('HRM.8.b', 'Grievance handling mechanism exists.', 'Commitment'),
      obj('HRM.8.c', 'Processes are implemented fairly.', 'Commitment'),

      // HRM.9 - Staff wellbeing
      obj('HRM.9.a', 'Staff health check-ups are conducted.', 'Commitment'),
      obj('HRM.9.b', 'Staff immunization is ensured.', 'Core'),
      obj('HRM.9.c', 'Staff safety is addressed.', 'Commitment'),
      obj('HRM.9.d', 'Post-exposure prophylaxis is available.', 'Core'),

      // HRM.10 - Personnel records
      obj('HRM.10.a', 'Personal files are maintained for all staff.', 'Commitment'),
      obj('HRM.10.b', 'Files contain relevant documents and credentials.', 'Commitment'),
      obj('HRM.10.c', 'Records are kept confidential.', 'Commitment'),

      // HRM.11 - Credentialing
      obj('HRM.11.a', 'Credentialing process is defined.', 'Commitment'),
      obj('HRM.11.b', 'Medical professionals are credentialed before practice.', 'Core'),
      obj('HRM.11.c', 'Privileges are granted based on qualifications and competence.', 'Core'),
      obj('HRM.11.d', 'Re-credentialing is done periodically.', 'Achievement'),
    ],
  },

  // ============================================================================
  // IMS - Information Management System
  // ============================================================================
  {
    id: 'ims',
    code: 'IMS',
    name: 'IMS',
    fullName: CHAPTER_NAMES.IMS,
    type: CHAPTER_TYPES.IMS,
    objectives: [
      // IMS.1 - Information management system
      obj('IMS.1.a', 'An information management system is in place.', 'Commitment'),
      obj('IMS.1.b', 'Information needs are identified.', 'Commitment'),
      obj('IMS.1.c', 'Information is available for decision making.', 'Commitment'),

      // IMS.2 - Medical records
      obj('IMS.2.a', 'A policy for medical records exists.', 'Commitment'),
      obj('IMS.2.b', 'Medical records contain all relevant clinical information.', 'Core'),
      obj('IMS.2.c', 'Entries are dated, timed and signed.', 'Core'),
      obj('IMS.2.d', 'Records are legible.', 'Core'),
      obj('IMS.2.e', 'Corrections in records are done appropriately.', 'Commitment'),

      // IMS.3 - Storage and retrieval
      obj('IMS.3.a', 'Records are stored securely.', 'Core'),
      obj('IMS.3.b', 'Retention period is defined and followed.', 'Commitment'),
      obj('IMS.3.c', 'Records are retrievable when needed.', 'Core'),
      obj('IMS.3.d', 'Access to records is controlled.', 'Core'),

      // IMS.4 - Protection
      obj('IMS.4.a', 'Records are protected from loss and damage.', 'Core'),
      obj('IMS.4.b', 'Confidentiality of records is maintained.', 'Core'),
      obj('IMS.4.c', 'Unauthorized access is prevented.', 'Core'),
      obj('IMS.4.d', 'Backup and recovery procedures exist for electronic records.', 'Commitment'),

      // IMS.5 - Reporting
      obj('IMS.5.a', 'Statutory reporting requirements are identified.', 'Commitment'),
      obj('IMS.5.b', 'Reports are submitted in a timely manner.', 'Commitment'),
      obj('IMS.5.c', 'Notifiable diseases are reported.', 'Core'),

      // IMS.6 - Data use
      obj('IMS.6.a', 'Data is analyzed for trends.', 'Commitment'),
      obj('IMS.6.b', 'Information is used for planning.', 'Achievement'),
      obj('IMS.6.c', 'Information supports quality improvement.', 'Achievement'),

      // IMS.7 - Abbreviations
      obj('IMS.7.a', 'A list of approved abbreviations exists.', 'Commitment'),
      obj('IMS.7.b', 'A list of prohibited abbreviations exists.', 'Commitment'),
      obj('IMS.7.c', 'Staff is aware of the abbreviation policy.', 'Commitment'),
    ],
  },
];

export const getChapterStats = (chapter: Chapter) => {
  const total = chapter.objectives.length;
  const completed = chapter.objectives.filter((o) => o.status === 'Completed').length;
  const inProgress = chapter.objectives.filter((o) => o.status === 'In progress').length;
  const blocked = chapter.objectives.filter((o) => o.status === 'Blocked').length;
  const notStarted = chapter.objectives.filter((o) => o.status === 'Not started').length;
  const core = chapter.objectives.filter((o) => o.isCore).length;
  const prevNC = chapter.objectives.filter((o) => o.priority === 'Prev NC').length;
  const commitment = chapter.objectives.filter((o) => o.category === 'Commitment').length;
  const achievement = chapter.objectives.filter((o) => o.category === 'Achievement').length;
  const excellence = chapter.objectives.filter((o) => o.category === 'Excellence').length;

  return { total, completed, inProgress, blocked, notStarted, core, prevNC, commitment, achievement, excellence };
};

export const getOverallStats = () => {
  let total = 0;
  let completed = 0;
  let inProgress = 0;
  let blocked = 0;
  let notStarted = 0;
  let core = 0;
  let prevNC = 0;
  let commitment = 0;
  let achievement = 0;
  let excellence = 0;

  nabhData.forEach((chapter) => {
    const stats = getChapterStats(chapter);
    total += stats.total;
    completed += stats.completed;
    inProgress += stats.inProgress;
    blocked += stats.blocked;
    notStarted += stats.notStarted;
    core += stats.core;
    prevNC += stats.prevNC;
    commitment += stats.commitment;
    achievement += stats.achievement;
    excellence += stats.excellence;
  });

  return { total, completed, inProgress, blocked, notStarted, core, prevNC, commitment, achievement, excellence };
};
