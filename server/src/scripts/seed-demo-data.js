const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Scheme = require('../models/Scheme');
const EligibilityRule = require('../models/EligibilityRule');
const Requirement = require('../models/Requirement');
const OfficialSource = require('../models/OfficialSource');
const SchemeVersion = require('../models/SchemeVersion');
const logger = require('../utils/logger');

const seedDemoData = async ({ silentIfPopulated = false } = {}) => {
  try {
    const existingCount = await Scheme.countDocuments();
    if (silentIfPopulated && existingCount > 0) {
      logger.info(`Database already populated with ${existingCount} schemes.`);
      return;
    }

    logger.info('Populating LabhSetu demo database with realistic schemes, rules, and accounts...');

    // Clear existing collections if running standalone seed
    if (!silentIfPopulated) {
      await Promise.all([
        User.deleteMany(),
        Profile.deleteMany(),
        Scheme.deleteMany(),
        EligibilityRule.deleteMany(),
        Requirement.deleteMany(),
        OfficialSource.deleteMany(),
        SchemeVersion.deleteMany(),
      ]);
    }

    // 1. Create Demo Users (Citizen, Admin, Operator)
    const citizenUser = await User.create({
      name: 'Rameshwar Kumar Sharma',
      email: 'citizen@labhsetu.gov.in',
      password: 'password123',
      role: 'citizen',
      phone: '+91 98765 43210',
      preferredLanguage: 'en',
      isDemo: true,
    });

    await Profile.create({
      userId: citizenUser._id,
      fullName: 'Rameshwar Kumar Sharma',
      dateOfBirth: new Date('1988-06-14'),
      age: 38,
      gender: 'male',
      maritalStatus: 'married',
      state: 'Uttar Pradesh',
      district: 'Lucknow',
      residenceType: 'rural',
      annualIncome: 180000,
      occupation: 'farmer',
      employmentStatus: 'self_employed',
      education: 'secondary',
      socialCategory: 'obc',
      disabilityStatus: false,
      isBPL: false,
      isFarmer: true,
      landHoldingHectares: 1.5,
      isStudent: false,
      hasBankAccount: true,
      familyMembersCount: 4,
    });

    const adminUser = await User.create({
      name: 'Priya N. Sundaram (Director of Digital Services)',
      email: 'admin@labhsetu.gov.in',
      password: 'password123',
      role: 'admin',
      phone: '+91 91234 56789',
      preferredLanguage: 'en',
      isDemo: true,
    });

    await User.create({
      name: 'Amit Verma (CSC District Operator)',
      email: 'operator@labhsetu.gov.in',
      password: 'password123',
      role: 'operator',
      phone: '+91 99887 76655',
      preferredLanguage: 'hi',
      isDemo: true,
    });

    // 2. Define Schemes data
    const schemesData = [
      {
        name: 'PM Kisan Samman Nidhi (PM-KISAN)',
        nameHi: 'प्रधानमंत्री किसान सम्मान निधि (पीएम-किसान)',
        slug: 'pm-kisan-samman-nidhi',
        department: 'Department of Agriculture and Farmers Welfare',
        ministry: 'Ministry of Agriculture and Farmers Welfare',
        shortDescription: 'Income support of ₹6,000 per year in three equal installments to all landholding farmer families across India.',
        shortDescriptionHi: 'देश भर के सभी भूमिधारक किसान परिवारों को प्रति वर्ष ₹6,000 की वित्तीय सहायता तीन समान किस्तों में प्रदान की जाती है।',
        fullDescription: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a Central Sector scheme with 100% funding from the Government of India. The scheme provides income support to all landholding farmer families across the country to supplement their financial needs for procuring agricultural inputs as well as domestic needs.',
        fullDescriptionHi: 'प्रधानमंत्री किसान सम्मान निधि भारत सरकार द्वारा 100% वित्तपोषित एक केंद्रीय क्षेत्र की योजना है। यह योजना देश के सभी भूमिधारक किसान परिवारों को कृषि आदानों की खरीद और घरेलू आवश्यकताओं के लिए आय सहायता प्रदान करती है।',
        category: 'Agriculture',
        benefitType: 'Direct Cash Transfer',
        benefitSummary: '₹6,000 per year transferred directly to bank account in 3 installments of ₹2,000 each.',
        benefitSummaryHi: '₹6,000 प्रति वर्ष तीन किस्तों (प्रत्येक ₹2,000) में सीधे बैंक खाते में हस्तांतरित।',
        detailedBenefits: [
          { title: 'First Tranche', amount: '₹2,000', frequency: 'April - July', description: 'Credited directly via DBT to Aadhaar-seeded bank account.' },
          { title: 'Second Tranche', amount: '₹2,000', frequency: 'August - November', description: 'Credited directly via DBT.' },
          { title: 'Third Tranche', amount: '₹2,000', frequency: 'December - March', description: 'Credited directly via DBT.' }
        ],
        stateScope: 'All India',
        officialPortalUrl: 'https://pmkisan.gov.in',
        tags: ['agriculture', 'farmers', 'dbt', 'cash assistance', 'kisan'],
        rules: [
          {
            field: 'isFarmer',
            operator: 'BOOLEAN_TRUE',
            title: 'Must be a Landholding Farmer',
            titleHi: 'भूमिधारक किसान होना अनिवार्य है',
            description: 'Applicant must own cultivable agricultural land.',
            descriptionHi: 'आवेदक के पास कृषि योग्य भूमि का स्वामित्व होना चाहिए।',
            isMandatory: true,
          },
          {
            field: 'annualIncome',
            operator: 'LESS_THAN_OR_EQUAL',
            value: 800000,
            title: 'Income Criteria',
            titleHi: 'आय सीमा',
            description: 'Income must not be under constitutional post exclusion.',
            descriptionHi: 'संवैधानिक पद धारकों को छूट प्राप्त नहीं है।',
            isMandatory: true,
          }
        ],
        requirements: [
          { title: 'Aadhaar Card', titleHi: 'आधार कार्ड', type: 'document', documentType: 'aadhaar', isMandatory: true, description: 'Mandatory UIDAI Aadhaar linked to mobile and bank.' },
          { title: 'Land Ownership Document (Khatauni / Khasra)', titleHi: 'भूमि स्वामित्व अभिलेख (खतौनी)', type: 'document', documentType: 'land_record', isMandatory: true, description: 'Official revenue land holding record in applicant name.' },
          { title: 'Aadhaar-seeded Bank Account Passbook', titleHi: 'आधार से लिंक बैंक पासबुक', type: 'document', documentType: 'bank_passbook', isMandatory: true, description: 'Bank passbook showing account number and IFSC.' }
        ],
        source: {
          title: 'PM-KISAN Official Operational Guidelines',
          department: 'Department of Agriculture & Farmers Welfare',
          url: 'https://pmkisan.gov.in/Documents/OperationalGuidelines.pdf',
          portalName: 'PM-Kisan Portal',
          applicationPortalUrl: 'https://pmkisan.gov.in/RegistrationFormNew.aspx',
          status: 'VERIFIED'
        },
        applicationSteps: [
          { stepNumber: 1, title: 'Document Verification', titleHi: 'दस्तावेज़ सत्यापन', description: 'Ensure your Aadhaar is linked to your bank account and land records are updated.', isOnline: true },
          { stepNumber: 2, title: 'Portal Registration', titleHi: 'पोर्टल पंजीकरण', description: 'Visit Farmers Corner on pmkisan.gov.in and click "New Farmer Registration".', isOnline: true, sourceUrl: 'https://pmkisan.gov.in/RegistrationFormNew.aspx' },
          { stepNumber: 3, title: 'Enter Land & Bank Details', titleHi: 'भूमि और बैंक विवरण भरें', description: 'Submit Khasra/Khatauni number, land area, and bank IFSC code.', isOnline: true },
          { stepNumber: 4, title: 'District State Approval', titleHi: 'जिला/राज्य सत्यापन', description: 'Application is verified by state nodal officer and tehsildar.', isOnline: false }
        ]
      },
      {
        name: 'Pradhan Mantri Awas Yojana - Gramin (PMAY-G)',
        nameHi: 'प्रधानमंत्री आवास योजना - ग्रामीण',
        slug: 'pm-awas-yojana-gramin',
        department: 'Ministry of Rural Development',
        ministry: 'Ministry of Rural Development',
        shortDescription: 'Financial grant of ₹1,20,000 (plains) to ₹1,30,000 (hilly/difficult areas) for construction of pucca house to rural homeless families.',
        shortDescriptionHi: 'ग्रामीण बेघर परिवारों को पक्का मकान बनाने के लिए ₹1,20,000 (मैदानी) से ₹1,30,000 (पहाड़ी क्षेत्र) की वित्तीय सहायता।',
        fullDescription: 'PMAY-G aims to provide a pucca house with basic amenities to all rural families who are homeless or living in kutcha or dilapidated houses. The cost of unit assistance is shared between Central and State governments in the ratio 60:40 in plain areas and 90:10 for North Eastern and Himalayan States.',
        fullDescriptionHi: 'पीएमएवाई-जी का उद्देश्य सभी ग्रामीण बेघर या कच्चे मकानों में रहने वाले परिवारों को बुनियादी सुविधाओं से युक्त पक्का मकान उपलब्ध कराना है।',
        category: 'Housing',
        benefitType: 'Direct Cash Transfer',
        benefitSummary: 'Direct financial assistance of ₹1,20,000 for house construction plus 90 days MGNREGA wages.',
        benefitSummaryHi: 'मकान निर्माण के लिए ₹1,20,000 की सीधी सहायता तथा मनरेगा के तहत 90 दिनों की अकुशल मजदूरी।',
        stateScope: 'All India',
        officialPortalUrl: 'https://pmayg.nic.in',
        tags: ['housing', 'rural', 'pucca house', 'gramin', 'homeless'],
        rules: [
          {
            field: 'residenceType',
            operator: 'EQUALS',
            value: 'rural',
            title: 'Rural Resident Only',
            titleHi: 'केवल ग्रामीण निवासी',
            description: 'Applicant must reside in a notified rural panchayat.',
            isMandatory: true,
          },
          {
            field: 'annualIncome',
            operator: 'LESS_THAN_OR_EQUAL',
            value: 200000,
            title: 'Low Income Criteria',
            titleHi: 'कम आय मानदंड',
            description: 'Family income must fall under low income / SECC deprivation criteria.',
            isMandatory: true,
          }
        ],
        requirements: [
          { title: 'Aadhaar Card of Family Head', titleHi: 'परिवार के मुखिया का आधार कार्ड', type: 'document', documentType: 'aadhaar', isMandatory: true },
          { title: 'Ration Card / BPL Proof', titleHi: 'राशन कार्ड / बीपीएल प्रमाण', type: 'document', documentType: 'ration_card', isMandatory: true },
          { title: 'Bank Account Passbook', titleHi: 'बैंक खाता पासबुक', type: 'document', documentType: 'bank_passbook', isMandatory: true },
          { title: 'Residence Certificate', titleHi: 'निवास प्रमाण पत्र', type: 'document', documentType: 'residence_certificate', isMandatory: true }
        ],
        source: {
          title: 'PMAY-G Guidelines & AwaasSoft Portal',
          department: 'Ministry of Rural Development',
          url: 'https://pmayg.nic.in/netiay/home.aspx',
          portalName: 'AwaasSoft',
          applicationPortalUrl: 'https://pmayg.nic.in',
          status: 'VERIFIED'
        },
        applicationSteps: [
          { stepNumber: 1, title: 'Panchayat SECC Identification', titleHi: 'ग्राम पंचायत पहचान', description: 'Beneficiary is identified through Gram Sabha based on SECC housing deprivation.', isOnline: false },
          { stepNumber: 2, title: 'Geo-Tagging of Existing Site', titleHi: 'मौजूदा स्थान की जियो-टैगिंग', description: 'Block officer captures geo-tagged photographs of existing kutcha structure.', isOnline: true },
          { stepNumber: 3, title: 'DBT Installment Release', titleHi: 'डीबीटी किस्तों का भुगतान', description: 'Assistance released in stages (Foundation, Lintel, Completion).', isOnline: true }
        ]
      },
      {
        name: 'Ayushman Bharat PM-JAY (Pradhan Mantri Jan Arogya Yojana)',
        nameHi: 'आयुष्मान भारत प्रधानमंत्री जन आरोग्य योजना (पीएम-जय)',
        slug: 'ayushman-bharat-pm-jay',
        department: 'National Health Authority',
        ministry: 'Ministry of Health and Family Welfare',
        shortDescription: 'World’s largest health insurance scheme offering cashless health cover of up to ₹5,00,000 per family per year for secondary and tertiary care hospitalization.',
        shortDescriptionHi: 'माध्यमिक और तृतीयक स्तर के अस्पताल में भर्ती होने पर प्रति परिवार प्रति वर्ष ₹5,00,000 तक का कैशलेस स्वास्थ्य कवर।',
        fullDescription: 'Ayushman Bharat National Health Protection Mission covers over 12 crore poor and vulnerable families (approximately 55 crore beneficiaries). Benefits are portable across any empanelled public or private hospital nationwide.',
        fullDescriptionHi: 'आयुष्मान भारत योजना 12 करोड़ से अधिक कमजोर परिवारों को देश भर के किसी भी संबद्ध अस्पताल में कैशलेस इलाज प्रदान करती है।',
        category: 'Health',
        benefitType: 'Free Service',
        benefitSummary: 'Cashless hospital treatment up to ₹5,00,000 per family per year across 27,000+ hospitals.',
        benefitSummaryHi: '27,000+ अस्पतालों में प्रति वर्ष प्रति परिवार ₹5,00,000 तक कैशलेस उपचार।',
        stateScope: 'All India',
        officialPortalUrl: 'https://beneficiary.nha.gov.in',
        tags: ['health', 'insurance', 'cashless', 'hospital', 'ayushman', 'pmjay'],
        rules: [
          {
            field: 'annualIncome',
            operator: 'LESS_THAN_OR_EQUAL',
            value: 250000,
            title: 'Income Limit',
            titleHi: 'आय सीमा',
            description: 'Annual household income must be within vulnerable category guidelines.',
            isMandatory: true,
          }
        ],
        requirements: [
          { title: 'Aadhaar Card', titleHi: 'आधार कार्ड', type: 'document', documentType: 'aadhaar', isMandatory: true },
          { title: 'Ration Card', titleHi: 'राशन कार्ड', type: 'document', documentType: 'ration_card', isMandatory: true }
        ],
        source: {
          title: 'National Health Authority Portal',
          department: 'Ministry of Health and Family Welfare',
          url: 'https://beneficiary.nha.gov.in',
          portalName: 'Ayushman Beneficiary Portal',
          applicationPortalUrl: 'https://beneficiary.nha.gov.in',
          status: 'VERIFIED'
        },
        applicationSteps: [
          { stepNumber: 1, title: 'Check Beneficiary Eligibility', titleHi: 'पात्रता खोजें', description: 'Enter Mobile / Aadhaar on beneficiary.nha.gov.in to verify entitlement.', isOnline: true },
          { stepNumber: 2, title: 'e-KYC Verification', titleHi: 'ई-केवाईसी सत्यापन', description: 'Complete Aadhaar OTP or biometric authentication.', isOnline: true },
          { stepNumber: 3, title: 'Download Ayushman Card', titleHi: 'आयुष्मान कार्ड डाउनलोड', description: 'Instant generation of PVC Ayushman Card with unique PM-JAY ID.', isOnline: true }
        ]
      },
      {
        name: 'Pradhan Mantri Mudra Yojana (PMMY) - Shishu & Kishore Loans',
        nameHi: 'प्रधानमंत्री मुद्रा योजना (पीएमएमवाई)',
        slug: 'pm-mudra-yojana',
        department: 'Department of Financial Services',
        ministry: 'Ministry of Finance',
        shortDescription: 'Collateral-free micro loans up to ₹10 Lakhs (Shishu up to ₹50k, Kishore up to ₹5L, Tarun up to ₹10L) to non-corporate, non-farm small/micro enterprises.',
        shortDescriptionHi: 'गैर-कॉर्पोरेट, गैर-कृषि लघु एवं सूक्ष्म उद्यमों के लिए ₹10 लाख तक का संपार्श्विक-मुक्त (बिना गारंटी) ऋण।',
        fullDescription: 'PMMY enables small shopkeepers, artisans, street vendors, and entrepreneurs to secure low-interest loans from Member Lending Institutions (Public, Private, Regional Rural Banks, NBFCs, and MFIs) without pledging collateral.',
        fullDescriptionHi: 'मुद्रा योजना छोटे व्यापारियों, कारीगरों और उद्यमियों को बिना किसी गारंटी के आसान ऋण प्रदान करती है।',
        category: 'Entrepreneurship',
        benefitType: 'Subsidized Loan',
        benefitSummary: 'Collateral-free enterprise loan up to ₹10,00,000 at subsidized RBI-mandated interest rates.',
        benefitSummaryHi: 'बिना किसी गारंटी के ₹10,00,000 तक का रियायती ब्याज दर पर व्यापारिक ऋण।',
        stateScope: 'All India',
        officialPortalUrl: 'https://www.mudra.org.in',
        tags: ['loan', 'business', 'entrepreneur', 'mudra', 'msme', 'credit'],
        rules: [
          {
            field: 'age',
            operator: 'GREATER_THAN_OR_EQUAL',
            value: 18,
            title: 'Minimum Age 18 Years',
            titleHi: 'न्यूनतम आयु 18 वर्ष',
            description: 'Applicant must be an adult Indian citizen.',
            isMandatory: true,
          }
        ],
        requirements: [
          { title: 'Identity Proof (Aadhaar / Voter ID)', titleHi: 'पहचान प्रमाण (आधार/मतदाता पत्र)', type: 'document', documentType: 'aadhaar', isMandatory: true },
          { title: 'PAN Card', titleHi: 'पैन कार्ड', type: 'document', documentType: 'pan', isMandatory: true },
          { title: 'Business Plan / Quotation of Machinery', titleHi: 'व्यापार प्रस्ताव / मशीनरी कोटेशन', type: 'document', documentType: 'other', isMandatory: false },
          { title: 'Bank Statement (Last 6 Months)', titleHi: 'बैंक विवरण (पिछले 6 माह)', type: 'document', documentType: 'bank_passbook', isMandatory: true }
        ],
        source: {
          title: 'MUDRA Official Loan Portal (Udyamimitra)',
          department: 'Department of Financial Services, Ministry of Finance',
          url: 'https://udyamimitra.in',
          portalName: 'Udyami Mitra',
          applicationPortalUrl: 'https://udyamimitra.in',
          status: 'VERIFIED'
        },
        applicationSteps: [
          { stepNumber: 1, title: 'Prepare Business Pitch', titleHi: 'व्यापार योजना तैयार करें', description: 'Outline proposed business model, costs, and expected revenues.', isOnline: false },
          { stepNumber: 2, title: 'Apply on Udyamimitra Portal', titleHi: 'पोर्टल पर आवेदन करें', description: 'Submit digital application on udyamimitra.in or visit nearest bank branch.', isOnline: true },
          { stepNumber: 3, title: 'Sanction & Mudra Card Issuance', titleHi: 'ऋण स्वीकृति एवं कार्ड जारी', description: 'Bank inspects enterprise and issues credit sanction along with Mudra RuPay card.', isOnline: true }
        ]
      },
      {
        name: 'National Means-cum-Merit Scholarship Scheme (NMMSS)',
        nameHi: 'राष्ट्रीय साधन-सह-योग्यता छात्रवृत्ति योजना',
        slug: 'national-means-cum-merit-scholarship',
        department: 'Department of School Education and Literacy',
        ministry: 'Ministry of Education',
        shortDescription: 'Scholarship of ₹12,000 per annum (₹1,000 per month) to meritorious students of economically weaker sections from Class IX to XII.',
        shortDescriptionHi: 'आर्थिक रूप से कमजोर वर्ग के मेधावी छात्रों को कक्षा 9 से 12 तक ₹12,000 प्रति वर्ष (₹1,000 प्रति माह) की छात्रवृत्ति।',
        fullDescription: 'NMMSS aims to prevent meritorious economically weaker students from dropping out of school at Class VIII and encourage them to continue secondary stage education.',
        fullDescriptionHi: 'कक्षा 8 के बाद पढ़ाई छोड़ने वाले मेधावी छात्रों को माध्यमिक शिक्षा जारी रखने के लिए वित्तीय प्रोत्साहन।',
        category: 'Education',
        benefitType: 'Scholarship',
        benefitSummary: '₹12,000 per annum credited directly to student bank account every year through Class 9 to 12.',
        benefitSummaryHi: 'कक्षा 9 से 12 तक प्रति वर्ष ₹12,000 की छात्रवृत्ति सीधे छात्र के बैंक खाते में।',
        stateScope: 'All India',
        officialPortalUrl: 'https://scholarships.gov.in',
        tags: ['education', 'scholarship', 'student', 'merit', 'school'],
        rules: [
          {
            field: 'annualIncome',
            operator: 'LESS_THAN_OR_EQUAL',
            value: 350000,
            title: 'Parental Income Limit ₹3.5 Lakh',
            titleHi: 'अभिभावक की वार्षिक आय ₹3.5 लाख से कम',
            description: 'Total parental annual income from all sources must not exceed ₹3,50,000.',
            isMandatory: true,
          }
        ],
        requirements: [
          { title: 'Student Aadhaar Card', titleHi: 'छात्र आधार कार्ड', type: 'document', documentType: 'aadhaar', isMandatory: true },
          { title: 'Income Certificate of Parents', titleHi: 'अभिभावक का आय प्रमाण पत्र', type: 'document', documentType: 'income_certificate', isMandatory: true },
          { title: 'Student Bank Passbook', titleHi: 'छात्र बैंक पासबुक', type: 'document', documentType: 'bank_passbook', isMandatory: true },
          { title: 'Class 7th/8th Marksheet', titleHi: 'कक्षा 7/8 अंकतालिका', type: 'document', documentType: 'student_id', isMandatory: true }
        ],
        source: {
          title: 'National Scholarship Portal (NSP)',
          department: 'Ministry of Education',
          url: 'https://scholarships.gov.in',
          portalName: 'National Scholarship Portal',
          applicationPortalUrl: 'https://scholarships.gov.in',
          status: 'VERIFIED'
        },
        applicationSteps: [
          { stepNumber: 1, title: 'State Level Selection Test', titleHi: 'राज्य स्तरीय परीक्षा', description: 'Appear in State Level MAT and SAT exam during Class VIII.', isOnline: false },
          { stepNumber: 2, title: 'Register on NSP Portal', titleHi: 'एनएसपी पोर्टल पर पंजीकरण', description: 'Fill application form on National Scholarship Portal using OTR number.', isOnline: true },
          { stepNumber: 3, title: 'Institute Verification', titleHi: 'विद्यालय सत्यापन', description: 'School Principal verifies marks and enrollment records digitally.', isOnline: true }
        ]
      },
      {
        name: 'Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)',
        nameHi: 'महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम (मनरेगा)',
        slug: 'mgnrega-job-guarantee',
        department: 'Department of Rural Development',
        ministry: 'Ministry of Rural Development',
        shortDescription: 'Legal guarantee of at least 100 days of unskilled wage employment per financial year to every rural household whose adult members volunteer to do manual work.',
        shortDescriptionHi: 'प्रत्येक ग्रामीण परिवार को वित्तीय वर्ष में कम से कम 100 दिनों के अकुशल मजदूरी रोजगार की कानूनी गारंटी।',
        fullDescription: 'MGNREGA is one of the world’s largest public works programmes designed to enhance livelihood security in rural areas by generating durable infrastructure assets.',
        fullDescriptionHi: 'ग्रामीण क्षेत्रों में टिकाऊ परिसंपत्तियों के निर्माण के साथ आजीविका सुरक्षा प्रदान करने वाला विश्व का सबसे बड़ा रोजगार कार्यक्रम।',
        category: 'Employment',
        benefitType: 'Direct Cash Transfer',
        benefitSummary: '100 days guaranteed wage employment at notified state daily wage rates with statutory unemployment allowance.',
        benefitSummaryHi: 'राज्य द्वारा अधिसूचित मजदूरी दर पर 100 दिनों का गारंटीकृत रोजगार।',
        stateScope: 'All India',
        officialPortalUrl: 'https://nrega.nic.in',
        tags: ['employment', 'rural', 'wages', 'job card', 'labor', 'mgnrega'],
        rules: [
          {
            field: 'age',
            operator: 'GREATER_THAN_OR_EQUAL',
            value: 18,
            title: 'Adult (18+ Years)',
            titleHi: 'वयस्क (18 वर्ष या अधिक)',
            description: 'Applicant must be an adult member of household.',
            isMandatory: true,
          },
          {
            field: 'residenceType',
            operator: 'EQUALS',
            value: 'rural',
            title: 'Rural Resident',
            titleHi: 'ग्रामीण निवासी',
            description: 'Must reside within local Gram Panchayat area.',
            isMandatory: true,
          }
        ],
        requirements: [
          { title: 'Aadhaar Card', titleHi: 'आधार कार्ड', type: 'document', documentType: 'aadhaar', isMandatory: true },
          { title: 'Ration Card / Proof of Residence', titleHi: 'राशन कार्ड / निवास प्रमाण', type: 'document', documentType: 'ration_card', isMandatory: true },
          { title: 'Bank / Post Office Passbook', titleHi: 'बैंक / डाकघर पासबुक', type: 'document', documentType: 'bank_passbook', isMandatory: true }
        ],
        source: {
          title: 'Ministry of Rural Development MGNREGA Portal',
          department: 'Ministry of Rural Development',
          url: 'https://nrega.nic.in',
          portalName: 'NREGA Soft',
          applicationPortalUrl: 'https://nrega.nic.in',
          status: 'VERIFIED'
        },
        applicationSteps: [
          { stepNumber: 1, title: 'Submit Job Card Application', titleHi: 'जॉब कार्ड हेतु आवेदन', description: 'Submit written or verbal application to Gram Panchayat office.', isOnline: false },
          { stepNumber: 2, title: 'Receive MGNREGA Job Card', titleHi: 'जॉब कार्ड प्राप्त करें', description: 'Panchayat verifies residence and issues Job Card within 15 days.', isOnline: false },
          { stepNumber: 3, title: 'Demand for Work', titleHi: 'काम की मांग करें', description: 'Submit work application; work must be provided within 5km radius or travel allowance given.', isOnline: false }
        ]
      }
    ];

    // Seed each scheme and its related documents
    for (const data of schemesData) {
      const { rules, requirements, source, applicationSteps, ...schemeFields } = data;

      const scheme = await Scheme.create({
        ...schemeFields,
        applicationSteps,
        version: 1,
        status: 'published',
        isDemo: true,
      });

      // Create official source
      const sourceDoc = await OfficialSource.create({
        schemeId: scheme._id,
        ...source,
      });

      // Create rules
      const ruleIds = [];
      for (const r of rules) {
        const ruleDoc = await EligibilityRule.create({
          schemeId: scheme._id,
          ...r,
        });
        ruleIds.push(ruleDoc._id);
      }

      // Create requirements
      const reqIds = [];
      for (const reqItem of requirements) {
        const reqDoc = await Requirement.create({
          schemeId: scheme._id,
          ...reqItem,
        });
        reqIds.push(reqDoc._id);
      }

      // Update scheme with references
      scheme.officialSources = [sourceDoc._id];
      scheme.eligibilityRules = ruleIds;
      scheme.requirements = reqIds;
      await scheme.save();

      // Create Version 1 snapshot
      await SchemeVersion.create({
        schemeId: scheme._id,
        versionNumber: 1,
        changesSummary: 'Initial verified scheme guidelines release.',
        snapshot: scheme.toObject(),
        verifiedBy: 'Central Verification Cell',
      });
    }

    logger.info(`Successfully seeded ${schemesData.length} schemes with rules, requirements, sources, and demo accounts.`);
  } catch (error) {
    logger.error('Error seeding demo data', { error: error.message });
  }
};

module.exports = seedDemoData;
