/**
 * NABH SHCO (Small Healthcare Organizations) Standards - 3rd Edition
 * Released: 31st August 2022
 * Effective: 1st August 2022
 *
 * Total: 10 Chapters, 71 Standards, 408 Objective Elements
 * - Core (C): 100 elements - Mandatorily assessed during each assessment
 * - Commitment (CM): 257 elements - Assessed during final assessment
 * - Achievement (A): 35 elements - Assessed during surveillance
 * - Excellence (E): 16 elements - Assessed during re-accreditation
 *
 * Sources:
 * - NABH Official Portal: https://nabh.co/shco/
 * - NABH SHCO Standards 3rd Edition PDF
 */

export type ElementCategory = 'Core' | 'Commitment' | 'Achievement' | 'Excellence';

export interface ObjectiveElement {
  code: string;
  description: string;
  category: ElementCategory;
  isCore: boolean;
}

export interface Standard {
  code: string;
  title: string;
  intent?: string;
  objectiveElements: ObjectiveElement[];
}

export interface Chapter {
  code: string;
  name: string;
  fullName: string;
  type: 'Patient Centered' | 'Organization Centered';
  standards: Standard[];
}

export const nabhShcoStandards: Chapter[] = [
  // ============================================
  // CHAPTER 1: ACCESS, ASSESSMENT AND CONTINUITY OF CARE (AAC)
  // ============================================
  {
    code: 'AAC',
    name: 'AAC',
    fullName: 'Access, Assessment and Continuity of Care',
    type: 'Patient Centered',
    standards: [
      {
        code: 'AAC.1',
        title: 'The organization defines and displays the services it can provide.',
        intent: 'To ensure patients and community are aware of services available at the healthcare facility.',
        objectiveElements: [
          {
            code: 'AAC.1.a',
            description: 'The services being provided are clearly defined and are in consonance with the needs of the community.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'AAC.1.b',
            description: 'The defined services are prominently displayed.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'AAC.1.c',
            description: 'The staff is oriented to these services.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'AAC.2',
        title: 'The organization has a well-defined registration and admission process.',
        intent: 'To ensure smooth patient flow from registration to admission with proper documentation.',
        objectiveElements: [
          {
            code: 'AAC.2.a',
            description: 'Documented policies and procedures are used for registering and admitting patients.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'AAC.2.b',
            description: 'The documented procedures address out-patients, in-patients and emergency patients.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'AAC.2.c',
            description: 'A unique identification number is generated at the end of registration.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'AAC.2.d',
            description: 'Patients are accepted only if the organization can provide the required service.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'AAC.2.e',
            description: 'The documented policies and procedures also address managing patients during non-availability of beds.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'AAC.2.f',
            description: 'The staff is aware of these processes.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'AAC.3',
        title: 'There is an appropriate mechanism for transfer (in and out) or referral of patients.',
        intent: 'To ensure safe patient transfer with appropriate communication and documentation.',
        objectiveElements: [
          {
            code: 'AAC.3.a',
            description: 'Documented policies and procedures exist for transfer of patients.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'AAC.3.b',
            description: 'Transfer-out is based on the patients condition and need for continuing care.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'AAC.3.c',
            description: 'Transfer process addresses the responsibility during transfer.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'AAC.3.d',
            description: 'A referral summary accompanies the patient.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'AAC.3.e',
            description: 'Transfer-in of patients is consistent with the organizations mission and resources.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'AAC.4',
        title: 'Patients cared for by the organization undergo an established initial assessment.',
        intent: 'To ensure comprehensive initial patient assessment for appropriate care planning.',
        objectiveElements: [
          {
            code: 'AAC.4.a',
            description: 'Documented policies and procedures define the scope and content of assessments.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'AAC.4.b',
            description: 'Initial medical assessment is done within 24 hours of admission or earlier as per patient condition.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'AAC.4.c',
            description: 'Initial nursing assessment is done within 24 hours of admission or earlier as per patient condition.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'AAC.4.d',
            description: 'Assessment is comprehensive covering medical, nursing and other needs.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'AAC.4.e',
            description: 'Assessments are documented in the patient record.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'AAC.4.f',
            description: 'Patients requiring emergency care undergo immediate assessment.',
            category: 'Core',
            isCore: true
          }
        ]
      },
      {
        code: 'AAC.5',
        title: 'Patients cared for by the organization undergo a regular reassessment.',
        intent: 'To monitor patient progress and modify care plan accordingly.',
        objectiveElements: [
          {
            code: 'AAC.5.a',
            description: 'Patients are reassessed at appropriate intervals based on their condition and plan of care.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'AAC.5.b',
            description: 'Reassessment is done by a qualified individual.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'AAC.5.c',
            description: 'Reassessments are documented in the patient record.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'AAC.5.d',
            description: 'The care plan is modified based on the reassessment.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'AAC.6',
        title: 'Laboratory services are provided as per the scope of services of the organization.',
        intent: 'To ensure availability of quality laboratory services for patient care.',
        objectiveElements: [
          {
            code: 'AAC.6.a',
            description: 'Laboratory services are available as per the scope of the organization.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'AAC.6.b',
            description: 'Laboratory services are provided by qualified personnel.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'AAC.6.c',
            description: 'Standard operating procedures guide collection, identification, handling, safe transportation and disposal of specimens.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'AAC.6.d',
            description: 'Laboratory results are available in a timely manner.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'AAC.6.e',
            description: 'Critical results are communicated immediately to the concerned care provider.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'AAC.6.f',
            description: 'Outsourced laboratory services meet the organizations quality requirements.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'AAC.7',
        title: 'There is an established laboratory quality assurance and safety programme.',
        intent: 'To ensure accuracy, reliability and safety of laboratory services.',
        objectiveElements: [
          {
            code: 'AAC.7.a',
            description: 'There is a quality assurance programme for laboratory services.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'AAC.7.b',
            description: 'Internal quality control is practiced.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'AAC.7.c',
            description: 'External quality assurance (EQAS) is practiced where available.',
            category: 'Achievement',
            isCore: false
          },
          {
            code: 'AAC.7.d',
            description: 'Laboratory safety procedures are established and implemented.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'AAC.7.e',
            description: 'Laboratory equipment is regularly calibrated and maintained.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'AAC.8',
        title: 'Imaging services are provided as per the scope of services of the organization.',
        intent: 'To ensure availability of quality imaging services for patient diagnosis.',
        objectiveElements: [
          {
            code: 'AAC.8.a',
            description: 'Imaging services are available as per the scope of the organization.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'AAC.8.b',
            description: 'Imaging services are provided by qualified personnel.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'AAC.8.c',
            description: 'Standard operating procedures guide the imaging services.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'AAC.8.d',
            description: 'Imaging results are available in a timely manner.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'AAC.8.e',
            description: 'Radiation safety norms are adhered to.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'AAC.8.f',
            description: 'Outsourced imaging services meet the organizations quality requirements.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'AAC.9',
        title: 'There is an established imaging quality assurance and safety programme.',
        intent: 'To ensure quality and safety in imaging services.',
        objectiveElements: [
          {
            code: 'AAC.9.a',
            description: 'There is a quality assurance programme for imaging services.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'AAC.9.b',
            description: 'Imaging equipment is regularly calibrated and maintained.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'AAC.9.c',
            description: 'Personnel are monitored for radiation exposure.',
            category: 'Core',
            isCore: true
          }
        ]
      },
      {
        code: 'AAC.10',
        title: 'The organization has a defined discharge process.',
        intent: 'To ensure safe discharge with appropriate planning and education.',
        objectiveElements: [
          {
            code: 'AAC.10.a',
            description: 'Documented policies and procedures guide the discharge process.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'AAC.10.b',
            description: 'Discharge planning is initiated early in the care process.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'AAC.10.c',
            description: 'A discharge summary is provided to the patient at the time of discharge.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'AAC.10.d',
            description: 'The discharge summary includes relevant clinical and follow-up information.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'AAC.10.e',
            description: 'Patient and family are educated about medications, diet, and follow-up care.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'AAC.10.f',
            description: 'Patients leaving against medical advice are informed about risks.',
            category: 'Core',
            isCore: true
          }
        ]
      }
    ]
  },

  // ============================================
  // CHAPTER 2: CARE OF PATIENTS (COP)
  // ============================================
  {
    code: 'COP',
    name: 'COP',
    fullName: 'Care of Patients',
    type: 'Patient Centered',
    standards: [
      {
        code: 'COP.1',
        title: 'Care of patients is guided by applicable national/international guidelines and includes care planning.',
        intent: 'To ensure evidence-based, standardized care with proper planning.',
        objectiveElements: [
          {
            code: 'COP.1.a',
            description: 'Patient care is based on applicable national/international guidelines.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'COP.1.b',
            description: 'An individualized plan of care is developed for each patient.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'COP.1.c',
            description: 'The plan of care is documented in the patient record.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'COP.1.d',
            description: 'The care plan is reviewed and modified as needed.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'COP.1.e',
            description: 'Multi-disciplinary team is involved in care planning when required.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'COP.2',
        title: 'Uniform care is provided to all patients.',
        intent: 'To ensure equitable care regardless of patient background or status.',
        objectiveElements: [
          {
            code: 'COP.2.a',
            description: 'Uniform care is provided irrespective of ability to pay or source of payment.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'COP.2.b',
            description: 'Uniform care is provided irrespective of gender, religion, caste, or socio-economic status.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'COP.2.c',
            description: 'Resources are allocated based on patient needs.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'COP.3',
        title: 'The organization provides care to patients with emergency and urgent needs.',
        intent: 'To ensure immediate and appropriate emergency care.',
        objectiveElements: [
          {
            code: 'COP.3.a',
            description: 'Emergency care is available 24x7.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'COP.3.b',
            description: 'Emergency patients are triaged based on urgency of need.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'COP.3.c',
            description: 'Emergency equipment and medications are available.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'COP.3.d',
            description: 'Staff is trained in emergency care including basic life support.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'COP.3.e',
            description: 'Documented policies guide the emergency services.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'COP.3.f',
            description: 'Transfer arrangements exist for cases beyond the scope of the facility.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'COP.4',
        title: 'The organization identifies and provides care for patients with special needs.',
        intent: 'To address needs of vulnerable patient populations.',
        objectiveElements: [
          {
            code: 'COP.4.a',
            description: 'The organization identifies patients with special needs.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'COP.4.b',
            description: 'Special needs of pediatric patients are addressed.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'COP.4.c',
            description: 'Special needs of geriatric patients are addressed.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'COP.4.d',
            description: 'Special needs of differently-abled patients are addressed.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'COP.4.e',
            description: 'Patients at risk of abuse, neglect or violence are identified and protected.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'COP.4.f',
            description: 'Vulnerable patients including women and children are protected.',
            category: 'Core',
            isCore: true
          }
        ]
      },
      {
        code: 'COP.5',
        title: 'Documented procedures guide the care of obstetric patients.',
        intent: 'To ensure safe maternal and newborn care.',
        objectiveElements: [
          {
            code: 'COP.5.a',
            description: 'Documented procedures guide ante-natal care.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'COP.5.b',
            description: 'Documented procedures guide intra-natal care.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'COP.5.c',
            description: 'Documented procedures guide post-natal care.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'COP.5.d',
            description: 'High-risk pregnancies are identified and managed appropriately.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'COP.5.e',
            description: 'Newborn care including resuscitation is provided.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'COP.5.f',
            description: 'Referral mechanisms for high-risk cases are in place.',
            category: 'Core',
            isCore: true
          }
        ]
      },
      {
        code: 'COP.6',
        title: 'Documented procedures guide the care of patients undergoing surgical procedures.',
        intent: 'To ensure safe surgical care.',
        objectiveElements: [
          {
            code: 'COP.6.a',
            description: 'Documented procedures guide pre-operative care.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'COP.6.b',
            description: 'Informed consent is obtained prior to surgery.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'COP.6.c',
            description: 'Surgical safety checklist is used.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'COP.6.d',
            description: 'Pre-anesthetic assessment is documented.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'COP.6.e',
            description: 'Intra-operative care is documented.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'COP.6.f',
            description: 'Post-operative care is documented.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'COP.6.g',
            description: 'Anesthesia is administered by qualified personnel.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'COP.6.h',
            description: 'Patients are monitored during and after anesthesia.',
            category: 'Core',
            isCore: true
          }
        ]
      },
      {
        code: 'COP.7',
        title: 'Documented procedures guide the nursing care.',
        intent: 'To ensure quality nursing care delivery.',
        objectiveElements: [
          {
            code: 'COP.7.a',
            description: 'Nursing care is planned based on initial and ongoing assessment.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'COP.7.b',
            description: 'Nursing care is documented in the patient record.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'COP.7.c',
            description: 'Nursing procedures are standardized.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'COP.7.d',
            description: 'Vital signs monitoring is done as per patient condition.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'COP.7.e',
            description: 'Patient safety measures are implemented.',
            category: 'Core',
            isCore: true
          }
        ]
      },
      {
        code: 'COP.8',
        title: 'Patient and family are involved in care decisions.',
        intent: 'To promote patient-centered care with family involvement.',
        objectiveElements: [
          {
            code: 'COP.8.a',
            description: 'Patient and family are involved in care decisions.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'COP.8.b',
            description: 'Patient preferences are considered in care planning.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'COP.8.c',
            description: 'Communication with patient and family is documented.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'COP.9',
        title: 'Procedures for pain management are in place.',
        intent: 'To ensure effective pain assessment and management.',
        objectiveElements: [
          {
            code: 'COP.9.a',
            description: 'Pain is assessed using appropriate scales.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'COP.9.b',
            description: 'Pain management is provided as per patient needs.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'COP.9.c',
            description: 'Response to pain management is documented.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'COP.10',
        title: 'End-of-life care is provided respecting patient wishes and dignity.',
        intent: 'To ensure compassionate end-of-life care.',
        objectiveElements: [
          {
            code: 'COP.10.a',
            description: 'End-of-life care respects patient and family wishes.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'COP.10.b',
            description: 'Comfort and dignity are maintained.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'COP.10.c',
            description: 'Emotional support is provided to patient and family.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'COP.10.d',
            description: 'Death is handled with dignity and respect.',
            category: 'Core',
            isCore: true
          }
        ]
      }
    ]
  },

  // ============================================
  // CHAPTER 3: MANAGEMENT OF MEDICATION (MOM)
  // ============================================
  {
    code: 'MOM',
    name: 'MOM',
    fullName: 'Management of Medication',
    type: 'Patient Centered',
    standards: [
      {
        code: 'MOM.1',
        title: 'Documented procedures guide the organization of pharmacy services and usage of medication.',
        intent: 'To ensure safe and effective pharmacy operations.',
        objectiveElements: [
          {
            code: 'MOM.1.a',
            description: 'Pharmacy services are organized to meet patient needs.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'MOM.1.b',
            description: 'Pharmacy services are available 24x7 or as per organizational policy.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'MOM.1.c',
            description: 'A qualified pharmacist supervises pharmacy operations.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'MOM.1.d',
            description: 'A formulary appropriate to the organization is developed and maintained.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'MOM.1.e',
            description: 'Medications are stored under proper conditions.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'MOM.1.f',
            description: 'Expiry of medications is monitored.',
            category: 'Core',
            isCore: true
          }
        ]
      },
      {
        code: 'MOM.2',
        title: 'Documented procedures guide the prescription of medications.',
        intent: 'To ensure safe and appropriate medication prescribing.',
        objectiveElements: [
          {
            code: 'MOM.2.a',
            description: 'Medications are prescribed by authorized personnel.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'MOM.2.b',
            description: 'Prescriptions are legible and complete.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'MOM.2.c',
            description: 'Look-alike, sound-alike medications are identified and managed.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'MOM.2.d',
            description: 'High-risk medications are identified and managed safely.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'MOM.2.e',
            description: 'Verbal and telephone orders are minimized and verified.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'MOM.3',
        title: 'Documented procedures guide the safe dispensing of medications.',
        intent: 'To ensure accurate and safe medication dispensing.',
        objectiveElements: [
          {
            code: 'MOM.3.a',
            description: 'Medications are dispensed by qualified personnel.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'MOM.3.b',
            description: 'Prescriptions are verified before dispensing.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'MOM.3.c',
            description: 'Patients are counseled about medications.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'MOM.3.d',
            description: 'Dispensing records are maintained.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'MOM.4',
        title: 'There are defined procedures for medication administration.',
        intent: 'To ensure safe medication administration.',
        objectiveElements: [
          {
            code: 'MOM.4.a',
            description: 'Medications are administered by trained and authorized personnel.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'MOM.4.b',
            description: 'Patient identification is verified before medication administration.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'MOM.4.c',
            description: 'Medication administration is documented.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'MOM.4.d',
            description: 'Self-administration is supervised when permitted.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'MOM.5',
        title: 'Patients are monitored for adverse drug events after medication administration.',
        intent: 'To detect and manage adverse drug events.',
        objectiveElements: [
          {
            code: 'MOM.5.a',
            description: 'Adverse drug events are defined.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'MOM.5.b',
            description: 'Patients are monitored for adverse drug events.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'MOM.5.c',
            description: 'Adverse drug events are documented and reported.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'MOM.5.d',
            description: 'Appropriate action is taken for adverse drug events.',
            category: 'Core',
            isCore: true
          }
        ]
      },
      {
        code: 'MOM.6',
        title: 'Documented procedures guide the use of medical gases.',
        intent: 'To ensure safe handling and use of medical gases.',
        objectiveElements: [
          {
            code: 'MOM.6.a',
            description: 'Medical gases are stored safely.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'MOM.6.b',
            description: 'Medical gases are administered by trained personnel.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'MOM.6.c',
            description: 'Stock levels of medical gases are monitored.',
            category: 'Commitment',
            isCore: false
          }
        ]
      }
    ]
  },

  // ============================================
  // CHAPTER 4: PATIENT RIGHTS AND EDUCATION (PRE)
  // ============================================
  {
    code: 'PRE',
    name: 'PRE',
    fullName: 'Patient Rights and Education',
    type: 'Patient Centered',
    standards: [
      {
        code: 'PRE.1',
        title: 'The organization protects patient and family rights during care and informs them about their responsibilities.',
        intent: 'To ensure patients are aware of and exercise their rights.',
        objectiveElements: [
          {
            code: 'PRE.1.a',
            description: 'Patient rights are documented and displayed.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'PRE.1.b',
            description: 'Patient responsibilities are communicated.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'PRE.1.c',
            description: 'Staff is trained on patient rights.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'PRE.1.d',
            description: 'Patient privacy is maintained during care.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'PRE.1.e',
            description: 'Confidentiality of patient information is maintained.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'PRE.1.f',
            description: 'Patients are protected from physical abuse.',
            category: 'Core',
            isCore: true
          }
        ]
      },
      {
        code: 'PRE.2',
        title: 'Patient rights support individual beliefs, values and involve the patient and family in decision making processes.',
        intent: 'To respect patient autonomy and cultural values.',
        objectiveElements: [
          {
            code: 'PRE.2.a',
            description: 'Patient beliefs and values are respected.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'PRE.2.b',
            description: 'Cultural and religious preferences are accommodated.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'PRE.2.c',
            description: 'Patients are involved in decision making about their care.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'PRE.2.d',
            description: 'Patients can refuse treatment after being informed of consequences.',
            category: 'Core',
            isCore: true
          }
        ]
      },
      {
        code: 'PRE.3',
        title: 'A documented policy for obtaining patient and/or families consent exists for informed decision making about their care.',
        intent: 'To ensure informed consent is obtained.',
        objectiveElements: [
          {
            code: 'PRE.3.a',
            description: 'A documented consent policy exists.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'PRE.3.b',
            description: 'Informed consent is obtained for procedures and surgeries.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'PRE.3.c',
            description: 'Consent includes information about risks, benefits and alternatives.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'PRE.3.d',
            description: 'Consent is obtained by the treating physician.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'PRE.3.e',
            description: 'General consent is obtained at admission.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'PRE.3.f',
            description: 'Consent for high-risk procedures is specifically documented.',
            category: 'Core',
            isCore: true
          }
        ]
      },
      {
        code: 'PRE.4',
        title: 'Patients and families have a right to information and education about their health.',
        intent: 'To ensure patients receive appropriate health education.',
        objectiveElements: [
          {
            code: 'PRE.4.a',
            description: 'Patients are informed about their diagnosis.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'PRE.4.b',
            description: 'Patients are informed about planned treatment and care.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'PRE.4.c',
            description: 'Patients are educated about medications.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'PRE.4.d',
            description: 'Patients are educated about diet and nutrition.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'PRE.4.e',
            description: 'Patients are educated about safe and effective use of equipment.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'PRE.4.f',
            description: 'Patient education is documented.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'PRE.5',
        title: 'The organization addresses patient grievances and complaints.',
        intent: 'To ensure patient feedback is addressed appropriately.',
        objectiveElements: [
          {
            code: 'PRE.5.a',
            description: 'A grievance redressal mechanism exists.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'PRE.5.b',
            description: 'Patients are informed about the grievance mechanism.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'PRE.5.c',
            description: 'Grievances are documented and addressed.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'PRE.5.d',
            description: 'Feedback is used for improvement.',
            category: 'Achievement',
            isCore: false
          }
        ]
      }
    ]
  },

  // ============================================
  // CHAPTER 5: HOSPITAL INFECTION CONTROL (HIC)
  // ============================================
  {
    code: 'HIC',
    name: 'HIC',
    fullName: 'Hospital Infection Control',
    type: 'Patient Centered',
    standards: [
      {
        code: 'HIC.1',
        title: 'The organization has an infection control programme.',
        intent: 'To establish a comprehensive infection control program.',
        objectiveElements: [
          {
            code: 'HIC.1.a',
            description: 'An infection control programme is in place.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HIC.1.b',
            description: 'An infection control team/committee exists.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HIC.1.c',
            description: 'Standard precautions are adhered to at all times.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'HIC.1.d',
            description: 'Hand hygiene practices are followed.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'HIC.1.e',
            description: 'Personal protective equipment is available and used appropriately.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'HIC.1.f',
            description: 'Cleanliness and general hygiene of facilities is maintained.',
            category: 'Core',
            isCore: true
          }
        ]
      },
      {
        code: 'HIC.2',
        title: 'The hospital has an infection control manual which is periodically updated and conducts surveillance activities.',
        intent: 'To guide infection control activities and monitor infections.',
        objectiveElements: [
          {
            code: 'HIC.2.a',
            description: 'An infection control manual exists.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HIC.2.b',
            description: 'The manual is periodically reviewed and updated.',
            category: 'Achievement',
            isCore: false
          },
          {
            code: 'HIC.2.c',
            description: 'Surveillance of hospital-associated infections is conducted.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HIC.2.d',
            description: 'Surveillance data is analyzed and used for improvement.',
            category: 'Achievement',
            isCore: false
          }
        ]
      },
      {
        code: 'HIC.3',
        title: 'The hospital takes actions to prevent or reduce the risks of Hospital Associated Infections (HAI) in patients and employees.',
        intent: 'To reduce healthcare-associated infections.',
        objectiveElements: [
          {
            code: 'HIC.3.a',
            description: 'Measures are taken to prevent surgical site infections.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'HIC.3.b',
            description: 'Measures are taken to prevent catheter-associated urinary tract infections.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'HIC.3.c',
            description: 'Measures are taken to prevent central line-associated bloodstream infections.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'HIC.3.d',
            description: 'Measures are taken to prevent ventilator-associated pneumonia.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'HIC.3.e',
            description: 'Isolation practices are implemented when needed.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'HIC.3.f',
            description: 'Staff safety measures are in place.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'HIC.4',
        title: 'There are documented procedures for sterilization activities.',
        intent: 'To ensure effective sterilization of equipment and supplies.',
        objectiveElements: [
          {
            code: 'HIC.4.a',
            description: 'A central sterile supply department/area exists.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HIC.4.b',
            description: 'Sterilization procedures are documented.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HIC.4.c',
            description: 'Sterilization is monitored using appropriate indicators.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'HIC.4.d',
            description: 'Sterile supplies are stored and handled appropriately.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'HIC.4.e',
            description: 'Equipment cleaning and disinfection practices are followed.',
            category: 'Core',
            isCore: true
          }
        ]
      },
      {
        code: 'HIC.5',
        title: 'Statutory provisions with regard to Bio-Medical Waste (BMW) management are complied with.',
        intent: 'To ensure proper biomedical waste management.',
        objectiveElements: [
          {
            code: 'HIC.5.a',
            description: 'Biomedical waste is segregated at source.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'HIC.5.b',
            description: 'Color-coded bins and bags are used.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'HIC.5.c',
            description: 'Biomedical waste is transported safely.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'HIC.5.d',
            description: 'Biomedical waste is disposed as per regulations.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'HIC.5.e',
            description: 'Records of biomedical waste disposal are maintained.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HIC.5.f',
            description: 'Staff is trained in biomedical waste management.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'HIC.6',
        title: 'The infection control program is supported by hospital management and includes training of staff.',
        intent: 'To ensure management support and staff competency in infection control.',
        objectiveElements: [
          {
            code: 'HIC.6.a',
            description: 'Management supports the infection control program.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HIC.6.b',
            description: 'Staff is trained on infection control practices.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'HIC.6.c',
            description: 'Resources are allocated for infection control.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HIC.6.d',
            description: 'Infection control compliance is monitored.',
            category: 'Achievement',
            isCore: false
          }
        ]
      },
      {
        code: 'HIC.7',
        title: 'Laundry and linen management processes are in place.',
        intent: 'To ensure safe handling of laundry and linen.',
        objectiveElements: [
          {
            code: 'HIC.7.a',
            description: 'Laundry services are organized appropriately.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HIC.7.b',
            description: 'Infected linen is handled separately.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'HIC.7.c',
            description: 'Clean and soiled linen are stored separately.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'HIC.7.d',
            description: 'Staff handling linen use appropriate protection.',
            category: 'Commitment',
            isCore: false
          }
        ]
      }
    ]
  },

  // ============================================
  // CHAPTER 6: CONTINUOUS QUALITY IMPROVEMENT (CQI)
  // ============================================
  {
    code: 'CQI',
    name: 'CQI',
    fullName: 'Continuous Quality Improvement',
    type: 'Organization Centered',
    standards: [
      {
        code: 'CQI.1',
        title: 'The organization has a quality assurance programme.',
        intent: 'To establish a systematic approach to quality improvement.',
        objectiveElements: [
          {
            code: 'CQI.1.a',
            description: 'A quality assurance programme is in place.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'CQI.1.b',
            description: 'Quality objectives are defined.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'CQI.1.c',
            description: 'Quality improvement activities are conducted.',
            category: 'Achievement',
            isCore: false
          },
          {
            code: 'CQI.1.d',
            description: 'A quality committee/team exists.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'CQI.2',
        title: 'The organization identifies key quality indicators to monitor clinical and managerial performance.',
        intent: 'To measure and monitor organizational performance.',
        objectiveElements: [
          {
            code: 'CQI.2.a',
            description: 'Key indicators are identified for clinical areas.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'CQI.2.b',
            description: 'Key indicators are identified for managerial areas.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'CQI.2.c',
            description: 'Data is collected and analyzed.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'CQI.2.d',
            description: 'Results are used for improvement.',
            category: 'Achievement',
            isCore: false
          },
          {
            code: 'CQI.2.e',
            description: 'Benchmarking is done where possible.',
            category: 'Excellence',
            isCore: false
          }
        ]
      },
      {
        code: 'CQI.3',
        title: 'The organization has a patient safety programme.',
        intent: 'To establish a culture of patient safety.',
        objectiveElements: [
          {
            code: 'CQI.3.a',
            description: 'A patient safety programme is in place.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'CQI.3.b',
            description: 'Patient identification is ensured before any procedure.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'CQI.3.c',
            description: 'Communication is standardized for handovers.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'CQI.3.d',
            description: 'High-alert medications are managed safely.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'CQI.3.e',
            description: 'Surgical safety is ensured.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'CQI.3.f',
            description: 'Fall prevention measures are in place.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'CQI.3.g',
            description: 'Pressure ulcer prevention measures are in place.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'CQI.4',
        title: 'The organization has an incident reporting and learning system.',
        intent: 'To learn from incidents and near-misses.',
        objectiveElements: [
          {
            code: 'CQI.4.a',
            description: 'An incident reporting system exists.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'CQI.4.b',
            description: 'Incidents are reported without fear of punitive action.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'CQI.4.c',
            description: 'Incidents are analyzed and action is taken.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'CQI.4.d',
            description: 'Learning from incidents is shared.',
            category: 'Achievement',
            isCore: false
          }
        ]
      },
      {
        code: 'CQI.5',
        title: 'There is an established system for audit of patient care services.',
        intent: 'To systematically review and improve patient care.',
        objectiveElements: [
          {
            code: 'CQI.5.a',
            description: 'Medical audits are conducted.',
            category: 'Achievement',
            isCore: false
          },
          {
            code: 'CQI.5.b',
            description: 'Nursing audits are conducted.',
            category: 'Achievement',
            isCore: false
          },
          {
            code: 'CQI.5.c',
            description: 'Audit findings are used for improvement.',
            category: 'Achievement',
            isCore: false
          }
        ]
      },
      {
        code: 'CQI.6',
        title: 'Sentinel events are intensively analyzed.',
        intent: 'To conduct root cause analysis of serious events.',
        objectiveElements: [
          {
            code: 'CQI.6.a',
            description: 'Sentinel events are defined.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'CQI.6.b',
            description: 'Root cause analysis is conducted for sentinel events.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'CQI.6.c',
            description: 'Corrective actions are implemented.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'CQI.6.d',
            description: 'Effectiveness of corrective actions is monitored.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'CQI.7',
        title: 'Patient and employee satisfaction is measured.',
        intent: 'To understand stakeholder satisfaction and improve services.',
        objectiveElements: [
          {
            code: 'CQI.7.a',
            description: 'Patient satisfaction is measured.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'CQI.7.b',
            description: 'Employee satisfaction is measured.',
            category: 'Achievement',
            isCore: false
          },
          {
            code: 'CQI.7.c',
            description: 'Results are analyzed and used for improvement.',
            category: 'Achievement',
            isCore: false
          }
        ]
      }
    ]
  },

  // ============================================
  // CHAPTER 7: RESPONSIBILITIES OF MANAGEMENT (ROM)
  // ============================================
  {
    code: 'ROM',
    name: 'ROM',
    fullName: 'Responsibilities of Management',
    type: 'Organization Centered',
    standards: [
      {
        code: 'ROM.1',
        title: 'The responsibilities of the management are defined.',
        intent: 'To ensure clear governance structure and accountability.',
        objectiveElements: [
          {
            code: 'ROM.1.a',
            description: 'The governance structure is defined.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'ROM.1.b',
            description: 'Responsibilities of management are documented.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'ROM.1.c',
            description: 'Management reviews organizational performance.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'ROM.2',
        title: 'The services provided by each department are documented.',
        intent: 'To ensure clarity about departmental services and scope.',
        objectiveElements: [
          {
            code: 'ROM.2.a',
            description: 'Services of each department are defined.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'ROM.2.b',
            description: 'Department heads are accountable for their services.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'ROM.2.c',
            description: 'Coordination between departments exists.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'ROM.3',
        title: 'The organization is managed by the leaders in an ethical manner.',
        intent: 'To ensure ethical management practices.',
        objectiveElements: [
          {
            code: 'ROM.3.a',
            description: 'Ethical practices are followed.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'ROM.3.b',
            description: 'Conflict of interest is managed.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'ROM.3.c',
            description: 'Professional ethics are upheld.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'ROM.3.d',
            description: 'Transparency in dealings is maintained.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'ROM.4',
        title: 'A suitably qualified and experienced individual heads the organization.',
        intent: 'To ensure competent leadership.',
        objectiveElements: [
          {
            code: 'ROM.4.a',
            description: 'The organization has a qualified head/administrator.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'ROM.4.b',
            description: 'The head has appropriate authority and responsibility.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'ROM.4.c',
            description: 'The head ensures compliance with laws and regulations.',
            category: 'Core',
            isCore: true
          }
        ]
      },
      {
        code: 'ROM.5',
        title: 'Leaders ensure that patient safety aspects and risk management issues are an integral part of patient care and hospital management.',
        intent: 'To integrate safety and risk management into organizational culture.',
        objectiveElements: [
          {
            code: 'ROM.5.a',
            description: 'Patient safety is a priority for management.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'ROM.5.b',
            description: 'Risk management processes are in place.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'ROM.5.c',
            description: 'Resources are allocated for safety initiatives.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'ROM.5.d',
            description: 'Safety culture is promoted.',
            category: 'Achievement',
            isCore: false
          }
        ]
      },
      {
        code: 'ROM.6',
        title: 'The organization has a documented strategic and operational plan.',
        intent: 'To ensure systematic planning for organizational growth.',
        objectiveElements: [
          {
            code: 'ROM.6.a',
            description: 'A strategic plan exists.',
            category: 'Achievement',
            isCore: false
          },
          {
            code: 'ROM.6.b',
            description: 'An operational plan exists.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'ROM.6.c',
            description: 'Plans are reviewed and updated periodically.',
            category: 'Achievement',
            isCore: false
          }
        ]
      },
      {
        code: 'ROM.7',
        title: 'Statutory and regulatory requirements are complied with.',
        intent: 'To ensure legal compliance.',
        objectiveElements: [
          {
            code: 'ROM.7.a',
            description: 'All required licenses and registrations are in place.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'ROM.7.b',
            description: 'Licenses are renewed in a timely manner.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'ROM.7.c',
            description: 'Compliance with statutory requirements is monitored.',
            category: 'Commitment',
            isCore: false
          }
        ]
      }
    ]
  },

  // ============================================
  // CHAPTER 8: FACILITIES MANAGEMENT AND SAFETY (FMS)
  // ============================================
  {
    code: 'FMS',
    name: 'FMS',
    fullName: 'Facilities Management and Safety',
    type: 'Organization Centered',
    standards: [
      {
        code: 'FMS.1',
        title: 'The organization is aware of and complies with the relevant rules and regulations, laws and bylaws and requisite facility inspection requirements.',
        intent: 'To ensure regulatory compliance for facilities.',
        objectiveElements: [
          {
            code: 'FMS.1.a',
            description: 'Applicable laws and regulations are identified.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'FMS.1.b',
            description: 'Compliance with building codes is maintained.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'FMS.1.c',
            description: 'Required facility inspections are completed.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'FMS.1.d',
            description: 'Non-conformities are addressed.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'FMS.2',
        title: 'The organizations environment and facilities operate to ensure safety of patients, their families, staff and visitors.',
        intent: 'To provide a safe physical environment.',
        objectiveElements: [
          {
            code: 'FMS.2.a',
            description: 'The facility is designed for patient safety.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'FMS.2.b',
            description: 'Safety hazards are identified and addressed.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'FMS.2.c',
            description: 'Security measures are in place.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'FMS.2.d',
            description: 'Access control is implemented.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'FMS.2.e',
            description: 'Signage and wayfinding are adequate.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'FMS.3',
        title: 'The organization has a program for clinical and support service equipment management.',
        intent: 'To ensure proper equipment management and maintenance.',
        objectiveElements: [
          {
            code: 'FMS.3.a',
            description: 'Equipment inventory is maintained.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'FMS.3.b',
            description: 'Equipment is regularly inspected and maintained.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'FMS.3.c',
            description: 'Preventive maintenance schedules are followed.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'FMS.3.d',
            description: 'Staff is trained to operate equipment.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'FMS.3.e',
            description: 'Equipment malfunctions are reported and addressed.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'FMS.4',
        title: 'The organization has provisions for safe water, electricity, medical gases and vacuum systems.',
        intent: 'To ensure reliable utility services.',
        objectiveElements: [
          {
            code: 'FMS.4.a',
            description: 'Safe drinking water is available.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'FMS.4.b',
            description: 'Water quality is tested regularly.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'FMS.4.c',
            description: 'Electricity supply is reliable with backup arrangements.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'FMS.4.d',
            description: 'Medical gases are safely stored and supplied.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'FMS.4.e',
            description: 'Vacuum systems are maintained.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'FMS.5',
        title: 'Plans for fire and non-fire emergencies within the facilities are in place.',
        intent: 'To ensure preparedness for internal emergencies.',
        objectiveElements: [
          {
            code: 'FMS.5.a',
            description: 'A fire safety plan exists.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'FMS.5.b',
            description: 'Fire detection and suppression equipment is in place.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'FMS.5.c',
            description: 'Fire evacuation routes are marked and unobstructed.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'FMS.5.d',
            description: 'Fire drills are conducted regularly.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'FMS.5.e',
            description: 'Staff is trained in fire safety.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'FMS.5.f',
            description: 'Non-fire emergency plans exist.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'FMS.6',
        title: 'The organization has a smoking limitation policy.',
        intent: 'To maintain a smoke-free environment.',
        objectiveElements: [
          {
            code: 'FMS.6.a',
            description: 'A no-smoking policy is in place.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'FMS.6.b',
            description: 'No-smoking signs are displayed.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'FMS.6.c',
            description: 'The policy is enforced.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'FMS.7',
        title: 'The organization plans for handling community emergencies, epidemics and other disasters.',
        intent: 'To ensure preparedness for external emergencies.',
        objectiveElements: [
          {
            code: 'FMS.7.a',
            description: 'A disaster management plan exists.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'FMS.7.b',
            description: 'Roles and responsibilities are defined.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'FMS.7.c',
            description: 'Mock drills are conducted.',
            category: 'Achievement',
            isCore: false
          },
          {
            code: 'FMS.7.d',
            description: 'Coordination with external agencies exists.',
            category: 'Achievement',
            isCore: false
          }
        ]
      },
      {
        code: 'FMS.8',
        title: 'The organization has a plan for the management of hazardous materials.',
        intent: 'To ensure safe handling of hazardous materials.',
        objectiveElements: [
          {
            code: 'FMS.8.a',
            description: 'Hazardous materials are identified.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'FMS.8.b',
            description: 'Material Safety Data Sheets (MSDS) are available.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'FMS.8.c',
            description: 'Hazardous materials are stored safely.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'FMS.8.d',
            description: 'Staff handling hazardous materials is trained.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'FMS.8.e',
            description: 'Spill management procedures are in place.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'FMS.9',
        title: 'The organization has systems in place to provide a safe and secure environment.',
        intent: 'To ensure overall facility security.',
        objectiveElements: [
          {
            code: 'FMS.9.a',
            description: 'Security personnel/systems are in place.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'FMS.9.b',
            description: 'Vulnerable areas are secured.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'FMS.9.c',
            description: 'Visitor management system exists.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'FMS.9.d',
            description: 'Vehicle parking is organized.',
            category: 'Commitment',
            isCore: false
          }
        ]
      }
    ]
  },

  // ============================================
  // CHAPTER 9: HUMAN RESOURCE MANAGEMENT (HRM)
  // ============================================
  {
    code: 'HRM',
    name: 'HRM',
    fullName: 'Human Resource Management',
    type: 'Organization Centered',
    standards: [
      {
        code: 'HRM.1',
        title: 'The organization has a documented system of human resource planning.',
        intent: 'To ensure adequate staffing.',
        objectiveElements: [
          {
            code: 'HRM.1.a',
            description: 'Staffing requirements are defined.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HRM.1.b',
            description: 'Staffing patterns are based on patient care needs.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HRM.1.c',
            description: 'Nurse-patient ratio is maintained.',
            category: 'Core',
            isCore: true
          }
        ]
      },
      {
        code: 'HRM.2',
        title: 'The organization implements a defined process for staff recruitment.',
        intent: 'To ensure fair and effective recruitment.',
        objectiveElements: [
          {
            code: 'HRM.2.a',
            description: 'Job descriptions exist for all positions.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HRM.2.b',
            description: 'Recruitment process is documented.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HRM.2.c',
            description: 'Credentials are verified before appointment.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'HRM.2.d',
            description: 'Background verification is done.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'HRM.3',
        title: 'Staff are provided induction training at the time of joining the organization.',
        intent: 'To orient new staff to the organization.',
        objectiveElements: [
          {
            code: 'HRM.3.a',
            description: 'Induction training programme exists.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HRM.3.b',
            description: 'New staff receive orientation to policies and procedures.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HRM.3.c',
            description: 'Induction includes patient safety and infection control.',
            category: 'Core',
            isCore: true
          }
        ]
      },
      {
        code: 'HRM.4',
        title: 'There is an ongoing program for professional training and development of the staff.',
        intent: 'To ensure continuous professional development.',
        objectiveElements: [
          {
            code: 'HRM.4.a',
            description: 'Training needs are identified.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HRM.4.b',
            description: 'Training programmes are conducted.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HRM.4.c',
            description: 'Training records are maintained.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HRM.4.d',
            description: 'Effectiveness of training is evaluated.',
            category: 'Achievement',
            isCore: false
          }
        ]
      },
      {
        code: 'HRM.5',
        title: 'Staff are appropriately trained based on their specific job description.',
        intent: 'To ensure competency in job functions.',
        objectiveElements: [
          {
            code: 'HRM.5.a',
            description: 'Training is aligned with job requirements.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HRM.5.b',
            description: 'Competency is assessed.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HRM.5.c',
            description: 'Staff maintain required qualifications.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'HRM.6',
        title: 'Staff are trained on safety and quality-related aspects.',
        intent: 'To ensure staff competency in safety and quality.',
        objectiveElements: [
          {
            code: 'HRM.6.a',
            description: 'Staff are trained on patient safety.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'HRM.6.b',
            description: 'Staff are trained on infection control.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'HRM.6.c',
            description: 'Staff are trained on fire safety.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'HRM.6.d',
            description: 'Staff are trained on basic life support.',
            category: 'Core',
            isCore: true
          }
        ]
      },
      {
        code: 'HRM.7',
        title: 'An appraisal system for evaluating the performance of an employee exists as an integral part of the human resources management process.',
        intent: 'To assess and improve staff performance.',
        objectiveElements: [
          {
            code: 'HRM.7.a',
            description: 'A performance appraisal system exists.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HRM.7.b',
            description: 'Appraisals are conducted periodically.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HRM.7.c',
            description: 'Feedback is provided to staff.',
            category: 'Achievement',
            isCore: false
          }
        ]
      },
      {
        code: 'HRM.8',
        title: 'Process for disciplinary and grievance handling is defined and implemented in the organization.',
        intent: 'To ensure fair handling of disciplinary issues and grievances.',
        objectiveElements: [
          {
            code: 'HRM.8.a',
            description: 'Disciplinary process is documented.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HRM.8.b',
            description: 'Grievance handling mechanism exists.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HRM.8.c',
            description: 'Processes are implemented fairly.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'HRM.9',
        title: 'The organization promotes staff well-being and addresses their health and safety needs.',
        intent: 'To ensure staff health and safety.',
        objectiveElements: [
          {
            code: 'HRM.9.a',
            description: 'Staff health check-ups are conducted.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HRM.9.b',
            description: 'Staff immunization is ensured.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'HRM.9.c',
            description: 'Staff safety is addressed.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HRM.9.d',
            description: 'Post-exposure prophylaxis is available.',
            category: 'Core',
            isCore: true
          }
        ]
      },
      {
        code: 'HRM.10',
        title: 'There is documented personnel information for each staff member.',
        intent: 'To maintain accurate staff records.',
        objectiveElements: [
          {
            code: 'HRM.10.a',
            description: 'Personal files are maintained for all staff.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HRM.10.b',
            description: 'Files contain relevant documents and credentials.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HRM.10.c',
            description: 'Records are kept confidential.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'HRM.11',
        title: 'There is a process for credentialing and privileging of medical professionals permitted to provide patient care without supervision.',
        intent: 'To ensure only qualified professionals provide care.',
        objectiveElements: [
          {
            code: 'HRM.11.a',
            description: 'Credentialing process is defined.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'HRM.11.b',
            description: 'Medical professionals are credentialed before practice.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'HRM.11.c',
            description: 'Privileges are granted based on qualifications and competence.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'HRM.11.d',
            description: 'Re-credentialing is done periodically.',
            category: 'Achievement',
            isCore: false
          }
        ]
      }
    ]
  },

  // ============================================
  // CHAPTER 10: INFORMATION MANAGEMENT SYSTEM (IMS)
  // ============================================
  {
    code: 'IMS',
    name: 'IMS',
    fullName: 'Information Management System',
    type: 'Organization Centered',
    standards: [
      {
        code: 'IMS.1',
        title: 'The organization has a well-defined information management system.',
        intent: 'To establish an effective information management framework.',
        objectiveElements: [
          {
            code: 'IMS.1.a',
            description: 'An information management system is in place.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'IMS.1.b',
            description: 'Information needs are identified.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'IMS.1.c',
            description: 'Information is available for decision making.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'IMS.2',
        title: 'Patient medical records are comprehensive and are maintained as per policy.',
        intent: 'To ensure complete and accurate medical records.',
        objectiveElements: [
          {
            code: 'IMS.2.a',
            description: 'A policy for medical records exists.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'IMS.2.b',
            description: 'Medical records contain all relevant clinical information.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'IMS.2.c',
            description: 'Entries are dated, timed and signed.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'IMS.2.d',
            description: 'Records are legible.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'IMS.2.e',
            description: 'Corrections in records are done appropriately.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'IMS.3',
        title: 'Medical records are stored and retrieved as per policy.',
        intent: 'To ensure secure storage and easy retrieval of records.',
        objectiveElements: [
          {
            code: 'IMS.3.a',
            description: 'Records are stored securely.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'IMS.3.b',
            description: 'Retention period is defined and followed.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'IMS.3.c',
            description: 'Records are retrievable when needed.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'IMS.3.d',
            description: 'Access to records is controlled.',
            category: 'Core',
            isCore: true
          }
        ]
      },
      {
        code: 'IMS.4',
        title: 'Patient medical records are protected from loss, destruction, tampering and unauthorized access.',
        intent: 'To ensure confidentiality and integrity of records.',
        objectiveElements: [
          {
            code: 'IMS.4.a',
            description: 'Records are protected from loss and damage.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'IMS.4.b',
            description: 'Confidentiality of records is maintained.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'IMS.4.c',
            description: 'Unauthorized access is prevented.',
            category: 'Core',
            isCore: true
          },
          {
            code: 'IMS.4.d',
            description: 'Backup and recovery procedures exist for electronic records.',
            category: 'Commitment',
            isCore: false
          }
        ]
      },
      {
        code: 'IMS.5',
        title: 'The organization submits data and reports to external agencies as required.',
        intent: 'To ensure regulatory reporting compliance.',
        objectiveElements: [
          {
            code: 'IMS.5.a',
            description: 'Statutory reporting requirements are identified.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'IMS.5.b',
            description: 'Reports are submitted in a timely manner.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'IMS.5.c',
            description: 'Notifiable diseases are reported.',
            category: 'Core',
            isCore: true
          }
        ]
      },
      {
        code: 'IMS.6',
        title: 'Data and information are used for planning and improvement.',
        intent: 'To use data for organizational improvement.',
        objectiveElements: [
          {
            code: 'IMS.6.a',
            description: 'Data is analyzed for trends.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'IMS.6.b',
            description: 'Information is used for planning.',
            category: 'Achievement',
            isCore: false
          },
          {
            code: 'IMS.6.c',
            description: 'Information supports quality improvement.',
            category: 'Achievement',
            isCore: false
          }
        ]
      },
      {
        code: 'IMS.7',
        title: 'The organization maintains a list of abbreviations and symbols standardized across the organization.',
        intent: 'To prevent confusion from abbreviations.',
        objectiveElements: [
          {
            code: 'IMS.7.a',
            description: 'A list of approved abbreviations exists.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'IMS.7.b',
            description: 'A list of prohibited abbreviations exists.',
            category: 'Commitment',
            isCore: false
          },
          {
            code: 'IMS.7.c',
            description: 'Staff is aware of the abbreviation policy.',
            category: 'Commitment',
            isCore: false
          }
        ]
      }
    ]
  }
];

// Helper functions
export const getAllObjectiveElements = (): ObjectiveElement[] => {
  const elements: ObjectiveElement[] = [];
  nabhShcoStandards.forEach(chapter => {
    chapter.standards.forEach(standard => {
      elements.push(...standard.objectiveElements);
    });
  });
  return elements;
};

export const getCoreElements = (): ObjectiveElement[] => {
  return getAllObjectiveElements().filter(e => e.isCore);
};

export const getCommitmentElements = (): ObjectiveElement[] => {
  return getAllObjectiveElements().filter(e => e.category === 'Commitment');
};

export const getAchievementElements = (): ObjectiveElement[] => {
  return getAllObjectiveElements().filter(e => e.category === 'Achievement');
};

export const getExcellenceElements = (): ObjectiveElement[] => {
  return getAllObjectiveElements().filter(e => e.category === 'Excellence');
};

export const getStatistics = () => {
  const allElements = getAllObjectiveElements();
  return {
    totalChapters: nabhShcoStandards.length,
    totalStandards: nabhShcoStandards.reduce((acc, ch) => acc + ch.standards.length, 0),
    totalElements: allElements.length,
    coreElements: allElements.filter(e => e.category === 'Core').length,
    commitmentElements: allElements.filter(e => e.category === 'Commitment').length,
    achievementElements: allElements.filter(e => e.category === 'Achievement').length,
    excellenceElements: allElements.filter(e => e.category === 'Excellence').length,
  };
};
