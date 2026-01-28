import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with E2E test data...');

  // Get or create company
  let company = await prisma.company.findUnique({
    where: { name: 'LTI' },
  });

  if (!company) {
    company = await prisma.company.create({
      data: {
        name: 'LTI',
      },
    });
  }

  // Create Interview Flows
  let interviewFlow1 = await prisma.interviewFlow.findFirst({
    where: { description: 'Standard development interview process' },
  });

  if (!interviewFlow1) {
    interviewFlow1 = await prisma.interviewFlow.create({
      data: {
        description: 'Standard development interview process',
      },
    });
  }

  let interviewFlow2 = await prisma.interviewFlow.findFirst({
    where: { description: 'Data science interview process' },
  });

  if (!interviewFlow2) {
    interviewFlow2 = await prisma.interviewFlow.create({
      data: {
        description: 'Data science interview process',
      },
    });
  }

  let interviewFlow3 = await prisma.interviewFlow.findFirst({
    where: { description: 'Product Manager interview process' },
  });

  if (!interviewFlow3) {
    interviewFlow3 = await prisma.interviewFlow.create({
      data: {
        description: 'Product Manager interview process',
      },
    });
  }

  // Create Interview Types if they don't exist
  const interviewType1 = await prisma.interviewType.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'HR Interview',
      description: 'Assess overall fit, tech stack, salary range and availability',
    },
  });

  const interviewType2 = await prisma.interviewType.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Technical Interview',
      description: 'Assess technical skills',
    },
  });

  const interviewType3 = await prisma.interviewType.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Hiring manager interview',
      description: 'Assess cultural fit and professional goals',
    },
  });

  // Create Interview Steps for Flow 1
  const step1_1 = await prisma.interviewStep.upsert({
    where: { id: 101 },
    update: {},
    create: {
      interviewFlowId: interviewFlow1.id,
      interviewTypeId: interviewType1.id,
      name: 'Applied',
      orderIndex: 1,
    },
  });

  const step1_2 = await prisma.interviewStep.upsert({
    where: { id: 102 },
    update: {},
    create: {
      interviewFlowId: interviewFlow1.id,
      interviewTypeId: interviewType2.id,
      name: 'Interview',
      orderIndex: 2,
    },
  });

  const step1_3 = await prisma.interviewStep.upsert({
    where: { id: 103 },
    update: {},
    create: {
      interviewFlowId: interviewFlow1.id,
      interviewTypeId: interviewType3.id,
      name: 'Offer',
      orderIndex: 3,
    },
  });

  // Create Interview Steps for Flow 2
  const step2_1 = await prisma.interviewStep.upsert({
    where: { id: 201 },
    update: {},
    create: {
      interviewFlowId: interviewFlow2.id,
      interviewTypeId: interviewType1.id,
      name: 'Applied',
      orderIndex: 1,
    },
  });

  const step2_2 = await prisma.interviewStep.upsert({
    where: { id: 202 },
    update: {},
    create: {
      interviewFlowId: interviewFlow2.id,
      interviewTypeId: interviewType2.id,
      name: 'Interview',
      orderIndex: 2,
    },
  });

  const step2_3 = await prisma.interviewStep.upsert({
    where: { id: 203 },
    update: {},
    create: {
      interviewFlowId: interviewFlow2.id,
      interviewTypeId: interviewType3.id,
      name: 'Offer',
      orderIndex: 3,
    },
  });

  // Create Interview Steps for Flow 3
  const step3_1 = await prisma.interviewStep.upsert({
    where: { id: 301 },
    update: {},
    create: {
      interviewFlowId: interviewFlow3.id,
      interviewTypeId: interviewType1.id,
      name: 'Applied',
      orderIndex: 1,
    },
  });

  const step3_2 = await prisma.interviewStep.upsert({
    where: { id: 302 },
    update: {},
    create: {
      interviewFlowId: interviewFlow3.id,
      interviewTypeId: interviewType2.id,
      name: 'Interview',
      orderIndex: 2,
    },
  });

  const step3_3 = await prisma.interviewStep.upsert({
    where: { id: 303 },
    update: {},
    create: {
      interviewFlowId: interviewFlow3.id,
      interviewTypeId: interviewType3.id,
      name: 'Offer',
      orderIndex: 3,
    },
  });

  // Create Positions
  const position1 = await prisma.position.create({
    data: {
      title: 'Senior Full-Stack Engineer - E2E Test',
      description: 'Develop and maintain software applications for E2E testing.',
      status: 'Open',
      isVisible: true,
      location: 'Remote',
      jobDescription: 'Full-stack development',
      companyId: company.id,
      interviewFlowId: interviewFlow1.id,
      salaryMin: 50000,
      salaryMax: 80000,
      employmentType: 'Full-time',
      benefits: 'Health insurance, 401k, Paid time off',
      contactInfo: 'hr@lti.com',
      requirements: '3+ years of experience in software development',
      responsibilities: 'Develop, test, and maintain software solutions.',
      companyDescription: 'LTI is a leading HR solutions provider.',
      applicationDeadline: new Date('2025-12-31'),
    },
  });

  const position2 = await prisma.position.create({
    data: {
      title: 'Data Scientist - E2E Test',
      description: 'Analyze and interpret complex data for E2E testing.',
      status: 'Open',
      isVisible: true,
      location: 'Hybrid',
      jobDescription: 'Data analysis and machine learning',
      companyId: company.id,
      interviewFlowId: interviewFlow2.id,
      salaryMin: 60000,
      salaryMax: 90000,
      employmentType: 'Full-time',
      benefits: 'Health insurance, 401k, Paid time off, Stock options',
      contactInfo: 'hr@lti.com',
      requirements: 'Master degree in Data Science',
      responsibilities: 'Analyze data sets to derive business insights.',
      companyDescription: 'LTI is a leading HR solutions provider.',
      applicationDeadline: new Date('2025-12-31'),
    },
  });

  const position3 = await prisma.position.create({
    data: {
      title: 'Product Manager - E2E Test',
      description: 'Lead product strategy and development for E2E testing.',
      status: 'Open',
      isVisible: true,
      location: 'On-site',
      jobDescription: 'Product management and strategy',
      companyId: company.id,
      interviewFlowId: interviewFlow3.id,
      salaryMin: 70000,
      salaryMax: 100000,
      employmentType: 'Full-time',
      benefits: 'Health insurance, 401k, Bonuses',
      contactInfo: 'hr@lti.com',
      requirements: '5+ years of product management experience',
      responsibilities: 'Define product roadmap and strategy.',
      companyDescription: 'LTI is a leading HR solutions provider.',
      applicationDeadline: new Date('2025-12-31'),
    },
  });

  // Create Candidates for Position 1
  const candidates_pos1 = [];
  for (let i = 1; i <= 6; i++) {
    const candidate = await prisma.candidate.create({
      data: {
        firstName: `Engineer${i}`,
        lastName: `Test${i}`,
        email: `engineer${i}.test@example.com`,
        phone: `555000${i}000`,
        address: `${100 + i} Tech Street`,
        educations: {
          create: [
            {
              institution: 'Tech University',
              title: 'BS Computer Science',
              startDate: new Date('2015-09-01'),
              endDate: new Date('2019-06-01'),
            },
          ],
        },
        workExperiences: {
          create: [
            {
              company: 'Tech Company',
              position: 'Software Engineer',
              description: 'Built web applications',
              startDate: new Date('2019-07-01'),
              endDate: new Date('2023-08-01'),
            },
          ],
        },
        resumes: {
          create: [
            {
              filePath: `/resumes/engineer${i}_test.pdf`,
              fileType: 'application/pdf',
              uploadDate: new Date(),
            },
          ],
        },
      },
    });
    candidates_pos1.push(candidate);
  }

  // Create Candidates for Position 2
  const candidates_pos2 = [];
  for (let i = 1; i <= 5; i++) {
    const candidate = await prisma.candidate.create({
      data: {
        firstName: `DataScientist${i}`,
        lastName: `Test${i}`,
        email: `datascientist${i}.test@example.com`,
        phone: `555100${i}000`,
        address: `${200 + i} Data Street`,
        educations: {
          create: [
            {
              institution: 'Data University',
              title: 'MS Data Science',
              startDate: new Date('2016-09-01'),
              endDate: new Date('2020-06-01'),
            },
          ],
        },
        workExperiences: {
          create: [
            {
              company: 'Data Company',
              position: 'Data Analyst',
              description: 'Analyzed datasets',
              startDate: new Date('2020-07-01'),
              endDate: new Date('2023-08-01'),
            },
          ],
        },
        resumes: {
          create: [
            {
              filePath: `/resumes/datascientist${i}_test.pdf`,
              fileType: 'application/pdf',
              uploadDate: new Date(),
            },
          ],
        },
      },
    });
    candidates_pos2.push(candidate);
  }

  // Create Candidates for Position 3
  const candidates_pos3 = [];
  for (let i = 1; i <= 5; i++) {
    const candidate = await prisma.candidate.create({
      data: {
        firstName: `ProductManager${i}`,
        lastName: `Test${i}`,
        email: `productmanager${i}.test@example.com`,
        phone: `555200${i}000`,
        address: `${300 + i} Product Street`,
        educations: {
          create: [
            {
              institution: 'Business University',
              title: 'MBA',
              startDate: new Date('2014-09-01'),
              endDate: new Date('2016-06-01'),
            },
          ],
        },
        workExperiences: {
          create: [
            {
              company: 'Product Company',
              position: 'Product Lead',
              description: 'Led product initiatives',
              startDate: new Date('2018-07-01'),
              endDate: new Date('2023-08-01'),
            },
          ],
        },
        resumes: {
          create: [
            {
              filePath: `/resumes/productmanager${i}_test.pdf`,
              fileType: 'application/pdf',
              uploadDate: new Date(),
            },
          ],
        },
      },
    });
    candidates_pos3.push(candidate);
  }

  // Create Applications for Position 1 (Full-Stack Engineer)
  // Applied: 2 candidates
  const app1_1 = await prisma.application.create({
    data: {
      positionId: position1.id,
      candidateId: candidates_pos1[0].id,
      applicationDate: new Date(),
      currentInterviewStep: step1_1.id,
    },
  });

  const app1_2 = await prisma.application.create({
    data: {
      positionId: position1.id,
      candidateId: candidates_pos1[1].id,
      applicationDate: new Date(),
      currentInterviewStep: step1_1.id,
    },
  });

  // Interview: 2 candidates
  const app1_3 = await prisma.application.create({
    data: {
      positionId: position1.id,
      candidateId: candidates_pos1[2].id,
      applicationDate: new Date(),
      currentInterviewStep: step1_2.id,
    },
  });

  const app1_4 = await prisma.application.create({
    data: {
      positionId: position1.id,
      candidateId: candidates_pos1[3].id,
      applicationDate: new Date(),
      currentInterviewStep: step1_2.id,
    },
  });

  // Offer: 2 candidates
  const app1_5 = await prisma.application.create({
    data: {
      positionId: position1.id,
      candidateId: candidates_pos1[4].id,
      applicationDate: new Date(),
      currentInterviewStep: step1_3.id,
    },
  });

  const app1_6 = await prisma.application.create({
    data: {
      positionId: position1.id,
      candidateId: candidates_pos1[5].id,
      applicationDate: new Date(),
      currentInterviewStep: step1_3.id,
    },
  });

  // Create Applications for Position 2 (Data Scientist)
  // Applied: 2 candidates
  const app2_1 = await prisma.application.create({
    data: {
      positionId: position2.id,
      candidateId: candidates_pos2[0].id,
      applicationDate: new Date(),
      currentInterviewStep: step2_1.id,
    },
  });

  const app2_2 = await prisma.application.create({
    data: {
      positionId: position2.id,
      candidateId: candidates_pos2[1].id,
      applicationDate: new Date(),
      currentInterviewStep: step2_1.id,
    },
  });

  // Interview: 2 candidates
  const app2_3 = await prisma.application.create({
    data: {
      positionId: position2.id,
      candidateId: candidates_pos2[2].id,
      applicationDate: new Date(),
      currentInterviewStep: step2_2.id,
    },
  });

  const app2_4 = await prisma.application.create({
    data: {
      positionId: position2.id,
      candidateId: candidates_pos2[3].id,
      applicationDate: new Date(),
      currentInterviewStep: step2_2.id,
    },
  });

  // Offer: 1 candidate
  const app2_5 = await prisma.application.create({
    data: {
      positionId: position2.id,
      candidateId: candidates_pos2[4].id,
      applicationDate: new Date(),
      currentInterviewStep: step2_3.id,
    },
  });

  // Create Applications for Position 3 (Product Manager)
  // Applied: 2 candidates
  const app3_1 = await prisma.application.create({
    data: {
      positionId: position3.id,
      candidateId: candidates_pos3[0].id,
      applicationDate: new Date(),
      currentInterviewStep: step3_1.id,
    },
  });

  const app3_2 = await prisma.application.create({
    data: {
      positionId: position3.id,
      candidateId: candidates_pos3[1].id,
      applicationDate: new Date(),
      currentInterviewStep: step3_1.id,
    },
  });

  // Interview: 2 candidates
  const app3_3 = await prisma.application.create({
    data: {
      positionId: position3.id,
      candidateId: candidates_pos3[2].id,
      applicationDate: new Date(),
      currentInterviewStep: step3_2.id,
    },
  });

  const app3_4 = await prisma.application.create({
    data: {
      positionId: position3.id,
      candidateId: candidates_pos3[3].id,
      applicationDate: new Date(),
      currentInterviewStep: step3_2.id,
    },
  });

  // Offer: 1 candidate
  const app3_5 = await prisma.application.create({
    data: {
      positionId: position3.id,
      candidateId: candidates_pos3[4].id,
      applicationDate: new Date(),
      currentInterviewStep: step3_3.id,
    },
  });

  console.log('✅ E2E test data seeded successfully!');
  console.log(`Created ${3} positions with ${16} applications`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
