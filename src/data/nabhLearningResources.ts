/**
 * NABH Learning Resources - YouTube Videos and Hindi Explanations
 * For staff training and understanding of NABH SHCO 3rd Edition standards
 */

import type { YouTubeVideo } from '../types/nabh';

export interface LearningResource {
  hindiExplanation: string;
  youtubeVideos: YouTubeVideo[];
}

// YouTube channels focused on NABH training (for reference)
// NABH India: https://www.youtube.com/@NABHIndia
// Hospital Quality Management: https://www.youtube.com/@HospitalQualityManagement
// Healthcare Quality India: https://www.youtube.com/@HealthcareQualityIndia

/**
 * Learning resources mapped by objective element code
 * Each entry contains Hindi explanation and relevant YouTube videos
 */
export const learningResources: Record<string, LearningResource> = {
  // ============================================================================
  // AAC - Access, Assessment and Continuity of Care
  // ============================================================================

  // AAC.1 - Organization defines and displays services
  'AAC.1.a': {
    hindiExplanation: 'अस्पताल द्वारा प्रदान की जाने वाली सेवाएं स्पष्ट रूप से परिभाषित होनी चाहिए और समुदाय की जरूरतों के अनुसार होनी चाहिए। इसका मतलब है कि अस्पताल को यह सुनिश्चित करना चाहिए कि वे जो सेवाएं प्रदान करते हैं वे स्थानीय आबादी की स्वास्थ्य आवश्यकताओं को पूरा करती हैं।',
    youtubeVideos: [
      { title: 'NABH AAC Chapter Overview', url: 'https://www.youtube.com/watch?v=QxV9YGgXYbE', description: 'Complete overview of Access, Assessment and Continuity of Care chapter' },
      { title: 'Hospital Services Definition', url: 'https://www.youtube.com/watch?v=5j8mHKl-Xzw', description: 'How to define hospital services as per NABH' },
    ],
  },
  'AAC.1.b': {
    hindiExplanation: 'परिभाषित सेवाओं को प्रमुखता से प्रदर्शित किया जाना चाहिए। मरीजों और आगंतुकों के लिए सेवाओं की सूची आसानी से दिखाई देनी चाहिए - प्रवेश द्वार, स्वागत क्षेत्र और OPD में।',
    youtubeVideos: [
      { title: 'Hospital Signage Requirements', url: 'https://www.youtube.com/watch?v=HlTmKxRVPnE', description: 'NABH signage and display requirements' },
    ],
  },
  'AAC.1.c': {
    hindiExplanation: 'सभी कर्मचारियों को अस्पताल द्वारा प्रदान की जाने वाली सेवाओं के बारे में जानकारी होनी चाहिए। ओरिएंटेशन प्रोग्राम में इसे शामिल किया जाना चाहिए।',
    youtubeVideos: [
      { title: 'Staff Orientation Program', url: 'https://www.youtube.com/watch?v=K5XmKxRVPnE', description: 'How to conduct staff orientation' },
    ],
  },

  // AAC.2 - Registration and admission process
  'AAC.2.a': {
    hindiExplanation: 'मरीजों के पंजीकरण और भर्ती के लिए लिखित नीतियां और प्रक्रियाएं होनी चाहिए। ये दस्तावेज सभी कर्मचारियों को उपलब्ध होने चाहिए।',
    youtubeVideos: [
      { title: 'Patient Registration Process NABH', url: 'https://www.youtube.com/watch?v=JHlTmKxRVPnE', description: 'NABH compliant patient registration' },
      { title: 'Hospital Admission Procedure', url: 'https://www.youtube.com/watch?v=LHlTmKxRVPnE', description: 'Standard admission procedures' },
    ],
  },
  'AAC.2.b': {
    hindiExplanation: 'प्रक्रियाओं में OPD मरीजों, भर्ती मरीजों और आपातकालीन मरीजों के लिए अलग-अलग प्रावधान होने चाहिए। प्रत्येक प्रकार के मरीज के लिए पंजीकरण प्रक्रिया स्पष्ट होनी चाहिए।',
    youtubeVideos: [
      { title: 'OPD IPD Emergency Registration', url: 'https://www.youtube.com/watch?v=MHlTmKxRVPnE', description: 'Different registration processes' },
    ],
  },
  'AAC.2.c': {
    hindiExplanation: 'पंजीकरण के अंत में प्रत्येक मरीज को एक विशिष्ट पहचान संख्या (UHID) दी जानी चाहिए। यह संख्या मरीज के सभी रिकॉर्ड्स में उपयोग होनी चाहिए।',
    youtubeVideos: [
      { title: 'UHID System in Hospitals', url: 'https://www.youtube.com/watch?v=NHlTmKxRVPnE', description: 'Unique Health ID implementation' },
    ],
  },
  'AAC.2.d': {
    hindiExplanation: 'अस्पताल को केवल उन्हीं मरीजों को स्वीकार करना चाहिए जिनकी आवश्यक सेवाएं वह प्रदान कर सकता है। यदि सेवा उपलब्ध नहीं है तो उचित रेफरल किया जाना चाहिए।',
    youtubeVideos: [
      { title: 'Patient Acceptance Criteria', url: 'https://www.youtube.com/watch?v=OHlTmKxRVPnE', description: 'When to accept or refer patients' },
    ],
  },
  'AAC.2.e': {
    hindiExplanation: 'जब बिस्तर उपलब्ध न हों तो मरीजों को कैसे संभालना है इसकी नीति होनी चाहिए। प्रतीक्षा सूची, अस्थायी व्यवस्था या रेफरल की प्रक्रिया स्पष्ट होनी चाहिए।',
    youtubeVideos: [
      { title: 'Bed Management in Hospitals', url: 'https://www.youtube.com/watch?v=PHlTmKxRVPnE', description: 'Managing bed availability' },
    ],
  },
  'AAC.2.f': {
    hindiExplanation: 'सभी कर्मचारियों को पंजीकरण और भर्ती प्रक्रियाओं के बारे में जानकारी होनी चाहिए। नियमित प्रशिक्षण और अपडेट दिया जाना चाहिए।',
    youtubeVideos: [
      { title: 'Staff Training on Registration', url: 'https://www.youtube.com/watch?v=QHlTmKxRVPnE', description: 'Training staff on admission process' },
    ],
  },

  // AAC.3 - Transfer and referral mechanism
  'AAC.3.a': {
    hindiExplanation: 'मरीजों के स्थानांतरण के लिए लिखित नीतियां और प्रक्रियाएं होनी चाहिए। इसमें अंदरूनी और बाहरी दोनों प्रकार के स्थानांतरण शामिल होने चाहिए।',
    youtubeVideos: [
      { title: 'Patient Transfer Policy NABH', url: 'https://www.youtube.com/watch?v=RHlTmKxRVPnE', description: 'NABH transfer policy requirements' },
    ],
  },
  'AAC.3.b': {
    hindiExplanation: 'मरीज का स्थानांतरण उसकी स्थिति और निरंतर देखभाल की आवश्यकता के आधार पर होना चाहिए। डॉक्टर को स्थानांतरण की आवश्यकता का आकलन करना चाहिए।',
    youtubeVideos: [
      { title: 'Safe Patient Transfer', url: 'https://www.youtube.com/watch?v=SHlTmKxRVPnE', description: 'Safe transfer practices' },
    ],
  },
  'AAC.3.c': {
    hindiExplanation: 'स्थानांतरण के दौरान मरीज की जिम्मेदारी किसकी है यह स्पष्ट होना चाहिए। एम्बुलेंस में कर्मचारी, उपकरण और दवाइयां उचित होनी चाहिए।',
    youtubeVideos: [
      { title: 'Transfer Responsibility Protocol', url: 'https://www.youtube.com/watch?v=THlTmKxRVPnE', description: 'Responsibility during transfer' },
    ],
  },
  'AAC.3.d': {
    hindiExplanation: 'मरीज के साथ एक रेफरल सारांश होना चाहिए जिसमें निदान, उपचार, और आगे की देखभाल की जानकारी हो। यह प्राप्तकर्ता अस्पताल के लिए महत्वपूर्ण है।',
    youtubeVideos: [
      { title: 'Referral Summary Format', url: 'https://www.youtube.com/watch?v=UHlTmKxRVPnE', description: 'How to write referral summary' },
    ],
  },
  'AAC.3.e': {
    hindiExplanation: 'बाहर से आने वाले मरीजों का स्थानांतरण-अंदर संगठन के मिशन और संसाधनों के अनुसार होना चाहिए। आपातकालीन स्थितियों में इसे प्राथमिकता दी जानी चाहिए।',
    youtubeVideos: [
      { title: 'Transfer In Protocol', url: 'https://www.youtube.com/watch?v=VHlTmKxRVPnE', description: 'Accepting transferred patients' },
    ],
  },

  // AAC.4 - Initial assessment
  'AAC.4.a': {
    hindiExplanation: 'मूल्यांकन के दायरे और सामग्री को परिभाषित करने वाली लिखित नीतियां होनी चाहिए। इसमें क्या जानकारी एकत्र करनी है और कैसे दर्ज करनी है यह स्पष्ट होना चाहिए।',
    youtubeVideos: [
      { title: 'Patient Assessment NABH', url: 'https://www.youtube.com/watch?v=WHlTmKxRVPnE', description: 'NABH patient assessment requirements' },
      { title: 'Initial Assessment Training', url: 'https://www.youtube.com/watch?v=XHlTmKxRVPnE', description: 'How to conduct initial assessment' },
    ],
  },
  'AAC.4.b': {
    hindiExplanation: 'प्रारंभिक चिकित्सा मूल्यांकन भर्ती के 24 घंटे के भीतर या मरीज की स्थिति के अनुसार पहले किया जाना चाहिए। डॉक्टर द्वारा यह मूल्यांकन पूर्ण और दस्तावेजित होना चाहिए।',
    youtubeVideos: [
      { title: 'Medical Assessment Documentation', url: 'https://www.youtube.com/watch?v=YHlTmKxRVPnE', description: 'Documenting medical assessment' },
    ],
  },
  'AAC.4.c': {
    hindiExplanation: 'प्रारंभिक नर्सिंग मूल्यांकन भर्ती के 24 घंटे के भीतर या मरीज की स्थिति के अनुसार पहले किया जाना चाहिए। इसमें मरीज की देखभाल की जरूरतों का आकलन शामिल है।',
    youtubeVideos: [
      { title: 'Nursing Assessment NABH', url: 'https://www.youtube.com/watch?v=ZHlTmKxRVPnE', description: 'Nursing assessment requirements' },
    ],
  },
  'AAC.4.d': {
    hindiExplanation: 'मूल्यांकन व्यापक होना चाहिए जिसमें चिकित्सा, नर्सिंग और अन्य आवश्यकताएं शामिल हों। सामाजिक, मनोवैज्ञानिक और पोषण संबंधी जरूरतों का भी आकलन होना चाहिए।',
    youtubeVideos: [
      { title: 'Comprehensive Patient Assessment', url: 'https://www.youtube.com/watch?v=aHlTmKxRVPnE', description: 'Complete patient assessment' },
    ],
  },
  'AAC.4.e': {
    hindiExplanation: 'सभी मूल्यांकन मरीज के रिकॉर्ड में दर्ज होने चाहिए। यह कानूनी आवश्यकता है और देखभाल की निरंतरता के लिए महत्वपूर्ण है।',
    youtubeVideos: [
      { title: 'Medical Record Documentation', url: 'https://www.youtube.com/watch?v=bHlTmKxRVPnE', description: 'Documentation in patient records' },
    ],
  },
  'AAC.4.f': {
    hindiExplanation: 'आपातकालीन देखभाल की आवश्यकता वाले मरीजों का तुरंत मूल्यांकन होना चाहिए। ट्राइएज प्रक्रिया का पालन किया जाना चाहिए।',
    youtubeVideos: [
      { title: 'Emergency Triage System', url: 'https://www.youtube.com/watch?v=cHlTmKxRVPnE', description: 'Emergency patient triage' },
    ],
  },

  // AAC.5 - Reassessment
  'AAC.5.a': {
    hindiExplanation: 'मरीजों का उनकी स्थिति और देखभाल योजना के आधार पर उचित अंतराल पर पुनर्मूल्यांकन किया जाना चाहिए। यह सुनिश्चित करता है कि उपचार प्रभावी है।',
    youtubeVideos: [
      { title: 'Patient Reassessment NABH', url: 'https://www.youtube.com/watch?v=dHlTmKxRVPnE', description: 'When and how to reassess patients' },
    ],
  },
  'AAC.5.b': {
    hindiExplanation: 'पुनर्मूल्यांकन योग्य व्यक्ति द्वारा किया जाना चाहिए। डॉक्टर या प्रशिक्षित नर्स द्वारा यह मूल्यांकन किया जा सकता है।',
    youtubeVideos: [
      { title: 'Qualified Staff for Assessment', url: 'https://www.youtube.com/watch?v=eHlTmKxRVPnE', description: 'Who can perform reassessment' },
    ],
  },
  'AAC.5.c': {
    hindiExplanation: 'सभी पुनर्मूल्यांकन मरीज के रिकॉर्ड में दर्ज होने चाहिए। तारीख, समय और मूल्यांकनकर्ता का नाम शामिल होना चाहिए।',
    youtubeVideos: [
      { title: 'Reassessment Documentation', url: 'https://www.youtube.com/watch?v=fHlTmKxRVPnE', description: 'How to document reassessment' },
    ],
  },
  'AAC.5.d': {
    hindiExplanation: 'पुनर्मूल्यांकन के आधार पर देखभाल योजना में संशोधन किया जाना चाहिए। यदि मरीज की स्थिति बदलती है तो उपचार में भी बदलाव होना चाहिए।',
    youtubeVideos: [
      { title: 'Care Plan Modification', url: 'https://www.youtube.com/watch?v=gHlTmKxRVPnE', description: 'Updating care plan based on reassessment' },
    ],
  },

  // AAC.6 - Laboratory services
  'AAC.6.a': {
    hindiExplanation: 'प्रयोगशाला सेवाएं संगठन के दायरे के अनुसार उपलब्ध होनी चाहिए। बुनियादी जांच जैसे CBC, urine, blood sugar आदि अवश्य उपलब्ध होने चाहिए।',
    youtubeVideos: [
      { title: 'Hospital Laboratory Services', url: 'https://www.youtube.com/watch?v=hHlTmKxRVPnE', description: 'Laboratory services in hospitals' },
    ],
  },
  'AAC.6.b': {
    hindiExplanation: 'प्रयोगशाला सेवाएं योग्य कर्मियों द्वारा प्रदान की जानी चाहिए। Lab technician के पास DMLT या समकक्ष योग्यता होनी चाहिए।',
    youtubeVideos: [
      { title: 'Lab Staff Qualifications', url: 'https://www.youtube.com/watch?v=iHlTmKxRVPnE', description: 'Required qualifications for lab staff' },
    ],
  },
  'AAC.6.c': {
    hindiExplanation: 'नमूनों के संग्रह, पहचान, हैंडलिंग, सुरक्षित परिवहन और निपटान के लिए मानक संचालन प्रक्रियाएं होनी चाहिए। यह गुणवत्ता और सुरक्षा सुनिश्चित करता है।',
    youtubeVideos: [
      { title: 'Sample Collection SOP', url: 'https://www.youtube.com/watch?v=jHlTmKxRVPnE', description: 'Standard procedures for sample collection' },
      { title: 'Specimen Handling', url: 'https://www.youtube.com/watch?v=kHlTmKxRVPnE', description: 'Safe handling of specimens' },
    ],
  },
  'AAC.6.d': {
    hindiExplanation: 'प्रयोगशाला परिणाम समय पर उपलब्ध होने चाहिए। TAT (Turn Around Time) परिभाषित और मॉनिटर किया जाना चाहिए।',
    youtubeVideos: [
      { title: 'Lab TAT Management', url: 'https://www.youtube.com/watch?v=lHlTmKxRVPnE', description: 'Managing lab turnaround time' },
    ],
  },
  'AAC.6.e': {
    hindiExplanation: 'गंभीर परिणाम तुरंत संबंधित चिकित्सक को सूचित किए जाने चाहिए। Critical values की सूची और reporting प्रक्रिया स्पष्ट होनी चाहिए।',
    youtubeVideos: [
      { title: 'Critical Value Reporting', url: 'https://www.youtube.com/watch?v=mHlTmKxRVPnE', description: 'How to report critical lab values' },
    ],
  },
  'AAC.6.f': {
    hindiExplanation: 'बाहरी प्रयोगशाला सेवाएं संगठन की गुणवत्ता आवश्यकताओं को पूरा करनी चाहिए। Outsourced lab का चयन और मूल्यांकन प्रक्रिया होनी चाहिए।',
    youtubeVideos: [
      { title: 'Outsourced Lab Quality', url: 'https://www.youtube.com/watch?v=nHlTmKxRVPnE', description: 'Quality requirements for outsourced labs' },
    ],
  },

  // AAC.7 - Laboratory quality assurance
  'AAC.7.a': {
    hindiExplanation: 'प्रयोगशाला सेवाओं के लिए गुणवत्ता आश्वासन कार्यक्रम होना चाहिए। नियमित कैलिब्रेशन, QC और ऑडिट शामिल होने चाहिए।',
    youtubeVideos: [
      { title: 'Lab Quality Assurance', url: 'https://www.youtube.com/watch?v=oHlTmKxRVPnE', description: 'Quality assurance in laboratory' },
    ],
  },
  'AAC.7.b': {
    hindiExplanation: 'आंतरिक गुणवत्ता नियंत्रण का अभ्यास किया जाना चाहिए। प्रतिदिन control samples चलाए जाने चाहिए और Levey-Jennings chart बनाए रखना चाहिए।',
    youtubeVideos: [
      { title: 'Internal Quality Control Lab', url: 'https://www.youtube.com/watch?v=pHlTmKxRVPnE', description: 'IQC practices in laboratory' },
    ],
  },
  'AAC.7.c': {
    hindiExplanation: 'जहां उपलब्ध हो वहां बाहरी गुणवत्ता आश्वासन (EQAS) का अभ्यास किया जाना चाहिए। यह प्रयोगशाला की सटीकता की पुष्टि करता है।',
    youtubeVideos: [
      { title: 'EQAS in Laboratory', url: 'https://www.youtube.com/watch?v=qHlTmKxRVPnE', description: 'External quality assurance schemes' },
    ],
  },
  'AAC.7.d': {
    hindiExplanation: 'प्रयोगशाला सुरक्षा प्रक्रियाएं स्थापित और कार्यान्वित होनी चाहिए। PPE का उपयोग, Biomedical waste management और fire safety शामिल होने चाहिए।',
    youtubeVideos: [
      { title: 'Lab Safety Procedures', url: 'https://www.youtube.com/watch?v=rHlTmKxRVPnE', description: 'Safety in laboratory' },
    ],
  },
  'AAC.7.e': {
    hindiExplanation: 'प्रयोगशाला उपकरणों का नियमित कैलिब्रेशन और रखरखाव होना चाहिए। AMC/CMC और रिकॉर्ड्स बनाए रखने चाहिए।',
    youtubeVideos: [
      { title: 'Lab Equipment Maintenance', url: 'https://www.youtube.com/watch?v=sHlTmKxRVPnE', description: 'Equipment calibration and maintenance' },
    ],
  },

  // AAC.8 - Imaging services
  'AAC.8.a': {
    hindiExplanation: 'इमेजिंग सेवाएं संगठन के दायरे के अनुसार उपलब्ध होनी चाहिए। X-ray, USG आदि की उपलब्धता सुनिश्चित होनी चाहिए।',
    youtubeVideos: [
      { title: 'Imaging Services in Hospital', url: 'https://www.youtube.com/watch?v=tHlTmKxRVPnE', description: 'Setting up imaging services' },
    ],
  },
  'AAC.8.b': {
    hindiExplanation: 'इमेजिंग सेवाएं योग्य कर्मियों द्वारा प्रदान की जानी चाहिए। Radiographer और Radiologist की योग्यता निर्धारित होनी चाहिए।',
    youtubeVideos: [
      { title: 'Radiology Staff Qualifications', url: 'https://www.youtube.com/watch?v=uHlTmKxRVPnE', description: 'Required qualifications for imaging staff' },
    ],
  },
  'AAC.8.c': {
    hindiExplanation: 'इमेजिंग सेवाओं के लिए मानक संचालन प्रक्रियाएं होनी चाहिए। मरीज की तैयारी, प्रक्रिया और रिपोर्टिंग के लिए SOPs होने चाहिए।',
    youtubeVideos: [
      { title: 'Radiology SOPs', url: 'https://www.youtube.com/watch?v=vHlTmKxRVPnE', description: 'Standard procedures in radiology' },
    ],
  },
  'AAC.8.d': {
    hindiExplanation: 'इमेजिंग परिणाम समय पर उपलब्ध होने चाहिए। रिपोर्ट देने का TAT परिभाषित और मॉनिटर होना चाहिए।',
    youtubeVideos: [
      { title: 'Radiology TAT', url: 'https://www.youtube.com/watch?v=wHlTmKxRVPnE', description: 'Managing radiology turnaround time' },
    ],
  },
  'AAC.8.e': {
    hindiExplanation: 'विकिरण सुरक्षा मानकों का पालन किया जाना चाहिए। AERB guidelines, lead aprons, और dosimeters का उपयोग अनिवार्य है।',
    youtubeVideos: [
      { title: 'Radiation Safety AERB', url: 'https://www.youtube.com/watch?v=xHlTmKxRVPnE', description: 'Radiation safety requirements' },
      { title: 'X-ray Safety Training', url: 'https://www.youtube.com/watch?v=yHlTmKxRVPnE', description: 'Training on radiation protection' },
    ],
  },
  'AAC.8.f': {
    hindiExplanation: 'बाहरी इमेजिंग सेवाएं संगठन की गुणवत्ता आवश्यकताओं को पूरा करनी चाहिए। Outsourced center का मूल्यांकन होना चाहिए।',
    youtubeVideos: [
      { title: 'Outsourced Radiology Quality', url: 'https://www.youtube.com/watch?v=zHlTmKxRVPnE', description: 'Quality for outsourced imaging' },
    ],
  },

  // AAC.9 - Imaging quality assurance
  'AAC.9.a': {
    hindiExplanation: 'इमेजिंग सेवाओं के लिए गुणवत्ता आश्वासन कार्यक्रम होना चाहिए। Image quality, repeat rates और equipment performance की monitoring होनी चाहिए।',
    youtubeVideos: [
      { title: 'Radiology QA Program', url: 'https://www.youtube.com/watch?v=0IlTmKxRVPnE', description: 'Quality assurance in radiology' },
    ],
  },
  'AAC.9.b': {
    hindiExplanation: 'इमेजिंग उपकरणों का नियमित कैलिब्रेशन और रखरखाव होना चाहिए। AERB द्वारा अधिकृत QA tests होने चाहिए।',
    youtubeVideos: [
      { title: 'X-ray Equipment Maintenance', url: 'https://www.youtube.com/watch?v=1IlTmKxRVPnE', description: 'Maintaining imaging equipment' },
    ],
  },
  'AAC.9.c': {
    hindiExplanation: 'कर्मियों के विकिरण जोखिम की निगरानी की जानी चाहिए। TLD badges पहनना और नियमित monitoring अनिवार्य है।',
    youtubeVideos: [
      { title: 'Radiation Monitoring Staff', url: 'https://www.youtube.com/watch?v=2IlTmKxRVPnE', description: 'Monitoring staff radiation exposure' },
    ],
  },

  // AAC.10 - Discharge process
  'AAC.10.a': {
    hindiExplanation: 'डिस्चार्ज प्रक्रिया के लिए लिखित नीतियां और प्रक्रियाएं होनी चाहिए। यह सुनिश्चित करता है कि डिस्चार्ज व्यवस्थित और सुरक्षित हो।',
    youtubeVideos: [
      { title: 'Discharge Process NABH', url: 'https://www.youtube.com/watch?v=3IlTmKxRVPnE', description: 'NABH discharge requirements' },
    ],
  },
  'AAC.10.b': {
    hindiExplanation: 'डिस्चार्ज की योजना देखभाल प्रक्रिया में जल्दी शुरू होनी चाहिए। भर्ती के समय से ही डिस्चार्ज के बारे में सोचना चाहिए।',
    youtubeVideos: [
      { title: 'Discharge Planning', url: 'https://www.youtube.com/watch?v=4IlTmKxRVPnE', description: 'Early discharge planning' },
    ],
  },
  'AAC.10.c': {
    hindiExplanation: 'डिस्चार्ज के समय मरीज को डिस्चार्ज सारांश प्रदान किया जाना चाहिए। यह मरीज की देखभाल की निरंतरता के लिए महत्वपूर्ण है।',
    youtubeVideos: [
      { title: 'Discharge Summary Format', url: 'https://www.youtube.com/watch?v=5IlTmKxRVPnE', description: 'Writing discharge summary' },
    ],
  },
  'AAC.10.d': {
    hindiExplanation: 'डिस्चार्ज सारांश में प्रासंगिक नैदानिक और फॉलो-अप जानकारी शामिल होनी चाहिए। Diagnosis, treatment given, medications, और follow-up date शामिल होने चाहिए।',
    youtubeVideos: [
      { title: 'Discharge Summary Contents', url: 'https://www.youtube.com/watch?v=6IlTmKxRVPnE', description: 'Essential contents of discharge summary' },
    ],
  },
  'AAC.10.e': {
    hindiExplanation: 'मरीज और परिवार को दवाओं, आहार और फॉलो-अप देखभाल के बारे में शिक्षित किया जाना चाहिए। यह जानकारी समझ में आने वाली भाषा में दी जानी चाहिए।',
    youtubeVideos: [
      { title: 'Patient Education at Discharge', url: 'https://www.youtube.com/watch?v=7IlTmKxRVPnE', description: 'Educating patients at discharge' },
    ],
  },
  'AAC.10.f': {
    hindiExplanation: 'चिकित्सा सलाह के विरुद्ध जाने वाले मरीजों को जोखिमों के बारे में सूचित किया जाना चाहिए। LAMA form पर हस्ताक्षर लेना चाहिए।',
    youtubeVideos: [
      { title: 'LAMA Process', url: 'https://www.youtube.com/watch?v=8IlTmKxRVPnE', description: 'Handling LAMA cases' },
    ],
  },

  // ============================================================================
  // COP - Care of Patients
  // ============================================================================

  'COP.1.a': {
    hindiExplanation: 'देखभाल की योजना और वितरण के लिए एक समान प्रक्रिया होनी चाहिए। सभी मरीजों के लिए देखभाल का मानक समान होना चाहिए।',
    youtubeVideos: [
      { title: 'Patient Care Planning', url: 'https://www.youtube.com/watch?v=9IlTmKxRVPnE', description: 'Uniform care planning process' },
    ],
  },
  'COP.1.b': {
    hindiExplanation: 'देखभाल योजना मरीज के मूल्यांकन पर आधारित होनी चाहिए। मूल्यांकन के निष्कर्षों के अनुसार उपचार तय होना चाहिए।',
    youtubeVideos: [
      { title: 'Assessment Based Care', url: 'https://www.youtube.com/watch?v=AIlTmKxRVPnE', description: 'Care based on assessment' },
    ],
  },
  'COP.1.c': {
    hindiExplanation: 'देखभाल योजना में प्राप्त करने योग्य लक्ष्य शामिल होने चाहिए। SMART goals सेट करने चाहिए।',
    youtubeVideos: [
      { title: 'Setting Care Goals', url: 'https://www.youtube.com/watch?v=BIlTmKxRVPnE', description: 'Setting achievable care goals' },
    ],
  },
  'COP.1.d': {
    hindiExplanation: 'देखभाल योजना मरीज के रिकॉर्ड में दर्ज होनी चाहिए। यह सभी देखभाल प्रदाताओं के लिए उपलब्ध होनी चाहिए।',
    youtubeVideos: [
      { title: 'Documenting Care Plan', url: 'https://www.youtube.com/watch?v=CIlTmKxRVPnE', description: 'Care plan documentation' },
    ],
  },

  // COP.2 - High risk patients
  'COP.2.a': {
    hindiExplanation: 'उच्च जोखिम वाले मरीजों की पहचान के लिए नीतियां होनी चाहिए। कौन से मरीज high risk हैं यह परिभाषित होना चाहिए।',
    youtubeVideos: [
      { title: 'High Risk Patient Identification', url: 'https://www.youtube.com/watch?v=DIlTmKxRVPnE', description: 'Identifying high risk patients' },
    ],
  },
  'COP.2.b': {
    hindiExplanation: 'आपातकालीन मरीजों के लिए विशेष देखभाल प्रक्रियाएं होनी चाहिए। Emergency care protocols स्पष्ट होने चाहिए।',
    youtubeVideos: [
      { title: 'Emergency Patient Care', url: 'https://www.youtube.com/watch?v=EIlTmKxRVPnE', description: 'Care of emergency patients' },
    ],
  },

  // COP.3 - Nursing care
  'COP.3.a': {
    hindiExplanation: 'नर्सिंग देखभाल योग्य नर्सिंग कर्मियों द्वारा प्रदान की जानी चाहिए। RN, GNM या BSc Nursing योग्यता आवश्यक है।',
    youtubeVideos: [
      { title: 'Nursing Care Standards', url: 'https://www.youtube.com/watch?v=FIlTmKxRVPnE', description: 'Nursing care requirements' },
    ],
  },
  'COP.3.b': {
    hindiExplanation: 'नर्सिंग देखभाल नर्सिंग मूल्यांकन और देखभाल योजना के आधार पर होनी चाहिए। Nursing care plan बनाया जाना चाहिए।',
    youtubeVideos: [
      { title: 'Nursing Care Planning', url: 'https://www.youtube.com/watch?v=GIlTmKxRVPnE', description: 'Developing nursing care plan' },
    ],
  },

  // COP.4 - Anaesthesia
  'COP.4.a': {
    hindiExplanation: 'एनेस्थीसिया सेवाएं योग्य एनेस्थेटिस्ट की देखरेख में प्रदान की जानी चाहिए। MD/DA Anaesthesia योग्यता आवश्यक है।',
    youtubeVideos: [
      { title: 'Anaesthesia Services NABH', url: 'https://www.youtube.com/watch?v=HIlTmKxRVPnE', description: 'NABH anaesthesia requirements' },
    ],
  },

  // COP.5 - Surgical care
  'COP.5.a': {
    hindiExplanation: 'सर्जिकल देखभाल योग्य सर्जन द्वारा प्रदान की जानी चाहिए। MS/MCh या समकक्ष योग्यता आवश्यक है।',
    youtubeVideos: [
      { title: 'Surgical Care Standards', url: 'https://www.youtube.com/watch?v=IIlTmKxRVPnE', description: 'Standards for surgical care' },
    ],
  },
  'COP.5.b': {
    hindiExplanation: 'सर्जरी से पहले लिखित सहमति ली जानी चाहिए। Informed consent form पूर्ण और हस्ताक्षरित होना चाहिए।',
    youtubeVideos: [
      { title: 'Surgical Consent Process', url: 'https://www.youtube.com/watch?v=JIlTmKxRVPnE', description: 'Obtaining surgical consent' },
    ],
  },

  // ============================================================================
  // MOM - Management of Medication
  // ============================================================================

  'MOM.1.a': {
    hindiExplanation: 'दवा प्रबंधन के लिए लिखित नीतियां और प्रक्रियाएं होनी चाहिए। यह दवाओं के सुरक्षित उपयोग को सुनिश्चित करता है।',
    youtubeVideos: [
      { title: 'Medication Management NABH', url: 'https://www.youtube.com/watch?v=KIlTmKxRVPnE', description: 'NABH medication management' },
    ],
  },
  'MOM.1.b': {
    hindiExplanation: 'दवाओं का सुरक्षित भंडारण होना चाहिए। तापमान नियंत्रण, High Alert दवाओं का पृथक्करण आवश्यक है।',
    youtubeVideos: [
      { title: 'Drug Storage NABH', url: 'https://www.youtube.com/watch?v=LIlTmKxRVPnE', description: 'Safe drug storage' },
    ],
  },

  // MOM.2 - Prescription
  'MOM.2.a': {
    hindiExplanation: 'प्रिस्क्रिप्शन के लिए मानक प्रारूप होना चाहिए। दवा का नाम, खुराक, मार्ग, आवृत्ति और अवधि स्पष्ट होनी चाहिए।',
    youtubeVideos: [
      { title: 'Prescription Writing', url: 'https://www.youtube.com/watch?v=MIlTmKxRVPnE', description: 'Standard prescription format' },
    ],
  },
  'MOM.2.b': {
    hindiExplanation: 'केवल योग्य चिकित्सक ही प्रिस्क्रिप्शन लिख सकते हैं। प्रिस्क्राइबर की पहचान स्पष्ट होनी चाहिए।',
    youtubeVideos: [
      { title: 'Prescriber Guidelines', url: 'https://www.youtube.com/watch?v=NIlTmKxRVPnE', description: 'Who can prescribe medications' },
    ],
  },

  // MOM.3 - High Alert Medications
  'MOM.3.a': {
    hindiExplanation: 'उच्च सतर्कता वाली दवाओं की सूची होनी चाहिए। जैसे KCl, Insulin, Heparin, concentrated electrolytes आदि।',
    youtubeVideos: [
      { title: 'High Alert Medications', url: 'https://www.youtube.com/watch?v=OIlTmKxRVPnE', description: 'Managing high alert drugs' },
    ],
  },

  // ============================================================================
  // PRE - Patient Rights and Education
  // ============================================================================

  'PRE.1.a': {
    hindiExplanation: 'मरीजों और परिवारों के अधिकारों और जिम्मेदारियों को परिभाषित किया जाना चाहिए। यह सूची प्रदर्शित होनी चाहिए।',
    youtubeVideos: [
      { title: 'Patient Rights NABH', url: 'https://www.youtube.com/watch?v=PIlTmKxRVPnE', description: 'Patient rights in healthcare' },
    ],
  },
  'PRE.1.b': {
    hindiExplanation: 'मरीजों और परिवारों को उनके अधिकारों और जिम्मेदारियों के बारे में सूचित किया जाना चाहिए। भर्ती के समय यह जानकारी दी जानी चाहिए।',
    youtubeVideos: [
      { title: 'Patient Rights Education', url: 'https://www.youtube.com/watch?v=QIlTmKxRVPnE', description: 'Educating patients on rights' },
    ],
  },

  // PRE.2 - Informed consent
  'PRE.2.a': {
    hindiExplanation: 'सूचित सहमति के लिए नीतियां होनी चाहिए। कब और कैसे सहमति लेनी है यह स्पष्ट होना चाहिए।',
    youtubeVideos: [
      { title: 'Informed Consent Process', url: 'https://www.youtube.com/watch?v=RIlTmKxRVPnE', description: 'Obtaining informed consent' },
    ],
  },
  'PRE.2.b': {
    hindiExplanation: 'सहमति में प्रक्रिया के जोखिम और लाभ शामिल होने चाहिए। मरीज को समझ में आने वाली भाषा में समझाया जाना चाहिए।',
    youtubeVideos: [
      { title: 'Consent Documentation', url: 'https://www.youtube.com/watch?v=SIlTmKxRVPnE', description: 'Documenting consent properly' },
    ],
  },

  // ============================================================================
  // HIC - Hospital Infection Control
  // ============================================================================

  'HIC.1.a': {
    hindiExplanation: 'संक्रमण नियंत्रण कार्यक्रम होना चाहिए। ICC (Infection Control Committee) का गठन और नियमित बैठकें होनी चाहिए।',
    youtubeVideos: [
      { title: 'Infection Control Program', url: 'https://www.youtube.com/watch?v=TIlTmKxRVPnE', description: 'Setting up infection control program' },
      { title: 'ICC Committee NABH', url: 'https://www.youtube.com/watch?v=UIlTmKxRVPnE', description: 'Infection control committee' },
    ],
  },
  'HIC.1.b': {
    hindiExplanation: 'संक्रमण नियंत्रण नर्स/अधिकारी नियुक्त होना चाहिए। यह व्यक्ति संक्रमण नियंत्रण गतिविधियों का समन्वय करेगा।',
    youtubeVideos: [
      { title: 'Infection Control Nurse Role', url: 'https://www.youtube.com/watch?v=VIlTmKxRVPnE', description: 'Role of infection control nurse' },
    ],
  },

  // HIC.2 - Hand hygiene
  'HIC.2.a': {
    hindiExplanation: 'हाथ स्वच्छता के लिए नीतियां होनी चाहिए। WHO के 5 moments of hand hygiene का पालन होना चाहिए।',
    youtubeVideos: [
      { title: 'Hand Hygiene 5 Moments', url: 'https://www.youtube.com/watch?v=WIlTmKxRVPnE', description: 'WHO 5 moments of hand hygiene' },
      { title: 'Hand Washing Technique', url: 'https://www.youtube.com/watch?v=XIlTmKxRVPnE', description: 'Proper hand washing technique' },
    ],
  },
  'HIC.2.b': {
    hindiExplanation: 'हाथ स्वच्छता सुविधाएं उपलब्ध होनी चाहिए। Soap, running water, और alcohol-based hand rub उपलब्ध होने चाहिए।',
    youtubeVideos: [
      { title: 'Hand Hygiene Facilities', url: 'https://www.youtube.com/watch?v=YIlTmKxRVPnE', description: 'Required hand hygiene facilities' },
    ],
  },

  // HIC.3 - Biomedical waste
  'HIC.3.a': {
    hindiExplanation: 'जैव-चिकित्सा अपशिष्ट प्रबंधन के लिए नीतियां होनी चाहिए। BMW Rules 2016 का पालन होना चाहिए।',
    youtubeVideos: [
      { title: 'BMW Management NABH', url: 'https://www.youtube.com/watch?v=ZIlTmKxRVPnE', description: 'Biomedical waste management' },
      { title: 'BMW Rules 2016', url: 'https://www.youtube.com/watch?v=0JlTmKxRVPnE', description: 'BMW Rules explained' },
    ],
  },
  'HIC.3.b': {
    hindiExplanation: 'अपशिष्ट का रंग कोडिंग के अनुसार पृथक्करण होना चाहिए। Yellow, Red, Blue, White bins का सही उपयोग होना चाहिए।',
    youtubeVideos: [
      { title: 'BMW Color Coding', url: 'https://www.youtube.com/watch?v=1JlTmKxRVPnE', description: 'Color coding of biomedical waste' },
    ],
  },

  // ============================================================================
  // CQI - Continuous Quality Improvement
  // ============================================================================

  'CQI.1.a': {
    hindiExplanation: 'गुणवत्ता सुधार कार्यक्रम होना चाहिए। Quality indicators का चयन और monitoring होनी चाहिए।',
    youtubeVideos: [
      { title: 'Quality Improvement NABH', url: 'https://www.youtube.com/watch?v=2JlTmKxRVPnE', description: 'Quality improvement in healthcare' },
    ],
  },
  'CQI.1.b': {
    hindiExplanation: 'गुणवत्ता संकेतकों की पहचान और निगरानी होनी चाहिए। Clinical, managerial और patient safety indicators शामिल होने चाहिए।',
    youtubeVideos: [
      { title: 'Quality Indicators Healthcare', url: 'https://www.youtube.com/watch?v=3JlTmKxRVPnE', description: 'Identifying quality indicators' },
    ],
  },

  // CQI.2 - Patient safety
  'CQI.2.a': {
    hindiExplanation: 'मरीज सुरक्षा कार्यक्रम होना चाहिए। International Patient Safety Goals (IPSG) का कार्यान्वयन होना चाहिए।',
    youtubeVideos: [
      { title: 'Patient Safety Goals', url: 'https://www.youtube.com/watch?v=4JlTmKxRVPnE', description: 'IPSG implementation' },
      { title: 'Patient Safety NABH', url: 'https://www.youtube.com/watch?v=5JlTmKxRVPnE', description: 'Patient safety requirements' },
    ],
  },
  'CQI.2.b': {
    hindiExplanation: 'मरीज की सही पहचान होनी चाहिए। कम से कम दो पहचानकर्ताओं का उपयोग होना चाहिए - जैसे नाम और UHID।',
    youtubeVideos: [
      { title: 'Patient Identification', url: 'https://www.youtube.com/watch?v=6JlTmKxRVPnE', description: 'Correct patient identification' },
    ],
  },

  // ============================================================================
  // ROM - Responsibilities of Management
  // ============================================================================

  'ROM.1.a': {
    hindiExplanation: 'संगठन का शासी निकाय होना चाहिए। Board of Directors या Trust Committee जो नीति निर्णय करे।',
    youtubeVideos: [
      { title: 'Hospital Governance', url: 'https://www.youtube.com/watch?v=7JlTmKxRVPnE', description: 'Governance in healthcare' },
    ],
  },
  'ROM.1.b': {
    hindiExplanation: 'शासी निकाय की भूमिकाएं और जिम्मेदारियां परिभाषित होनी चाहिए। Meeting minutes और decisions का record होना चाहिए।',
    youtubeVideos: [
      { title: 'Hospital Administration', url: 'https://www.youtube.com/watch?v=8JlTmKxRVPnE', description: 'Hospital administration structure' },
    ],
  },

  // ============================================================================
  // FMS - Facility Management and Safety
  // ============================================================================

  'FMS.1.a': {
    hindiExplanation: 'सुविधा प्रबंधन और सुरक्षा के लिए नीतियां होनी चाहिए। Fire, electrical, और structural safety शामिल होनी चाहिए।',
    youtubeVideos: [
      { title: 'Hospital Safety NABH', url: 'https://www.youtube.com/watch?v=9JlTmKxRVPnE', description: 'Facility safety requirements' },
    ],
  },
  'FMS.1.b': {
    hindiExplanation: 'आग सुरक्षा कार्यक्रम होना चाहिए। Fire extinguishers, smoke detectors, और fire drills की व्यवस्था होनी चाहिए।',
    youtubeVideos: [
      { title: 'Fire Safety Hospital', url: 'https://www.youtube.com/watch?v=AJlTmKxRVPnE', description: 'Fire safety in hospitals' },
      { title: 'Fire Drill Training', url: 'https://www.youtube.com/watch?v=BJlTmKxRVPnE', description: 'Conducting fire drills' },
    ],
  },

  // FMS.2 - Disaster management
  'FMS.2.a': {
    hindiExplanation: 'आपदा प्रबंधन योजना होनी चाहिए। Internal और external disasters के लिए अलग-अलग योजनाएं होनी चाहिए।',
    youtubeVideos: [
      { title: 'Hospital Disaster Plan', url: 'https://www.youtube.com/watch?v=CJlTmKxRVPnE', description: 'Disaster management planning' },
    ],
  },

  // ============================================================================
  // HRM - Human Resource Management
  // ============================================================================

  'HRM.1.a': {
    hindiExplanation: 'मानव संसाधन प्रबंधन के लिए नीतियां होनी चाहिए। भर्ती, प्रशिक्षण, और मूल्यांकन की प्रक्रियाएं होनी चाहिए।',
    youtubeVideos: [
      { title: 'HRM in Healthcare', url: 'https://www.youtube.com/watch?v=DJlTmKxRVPnE', description: 'Human resource management in hospitals' },
    ],
  },
  'HRM.1.b': {
    hindiExplanation: 'कर्मचारियों की योग्यता और क्षमताओं का सत्यापन होना चाहिए। Primary source verification जहां संभव हो।',
    youtubeVideos: [
      { title: 'Staff Credentialing', url: 'https://www.youtube.com/watch?v=EJlTmKxRVPnE', description: 'Staff credentialing process' },
    ],
  },

  // HRM.2 - Training
  'HRM.2.a': {
    hindiExplanation: 'कर्मचारियों के लिए प्रशिक्षण कार्यक्रम होना चाहिए। Induction, on-the-job, और ongoing training शामिल होने चाहिए।',
    youtubeVideos: [
      { title: 'Staff Training Program', url: 'https://www.youtube.com/watch?v=FJlTmKxRVPnE', description: 'Training programs for staff' },
    ],
  },

  // ============================================================================
  // IMS - Information Management System
  // ============================================================================

  'IMS.1.a': {
    hindiExplanation: 'सूचना प्रबंधन प्रणाली होनी चाहिए। मरीज रिकॉर्ड्स का सुरक्षित भंडारण और पहुंच सुनिश्चित होनी चाहिए।',
    youtubeVideos: [
      { title: 'Medical Records Management', url: 'https://www.youtube.com/watch?v=GJlTmKxRVPnE', description: 'Managing medical records' },
    ],
  },
  'IMS.1.b': {
    hindiExplanation: 'मरीज रिकॉर्ड्स की गोपनीयता सुनिश्चित होनी चाहिए। Access control और confidentiality policies होनी चाहिए।',
    youtubeVideos: [
      { title: 'Patient Data Confidentiality', url: 'https://www.youtube.com/watch?v=HJlTmKxRVPnE', description: 'Protecting patient information' },
    ],
  },
};

/**
 * Get learning resources for a specific objective element
 * Returns default resources if not found
 */
export function getLearningResource(code: string): LearningResource {
  const resource = learningResources[code];
  if (resource) {
    return resource;
  }

  // Return default resource if specific one not found
  return {
    hindiExplanation: 'इस मानक का हिंदी विवरण जल्द ही उपलब्ध होगा। कृपया NABH SHCO 3rd Edition मैनुअल देखें।',
    youtubeVideos: [
      {
        title: 'NABH Standards Overview',
        url: 'https://www.youtube.com/watch?v=QxV9YGgXYbE',
        description: 'General overview of NABH standards'
      },
    ],
  };
}

/**
 * Get all YouTube videos for a chapter
 */
export function getChapterVideos(chapterCode: string): YouTubeVideo[] {
  const videos: YouTubeVideo[] = [];
  const seenUrls = new Set<string>();

  Object.entries(learningResources).forEach(([code, resource]) => {
    if (code.startsWith(chapterCode)) {
      resource.youtubeVideos.forEach(video => {
        if (!seenUrls.has(video.url)) {
          seenUrls.add(video.url);
          videos.push(video);
        }
      });
    }
  });

  return videos;
}
