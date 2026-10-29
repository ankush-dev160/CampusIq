/**
 * Course Resources & Exam Materials Repository
 * Shared between Faculty (who upload/publish materials) and Students / Elara AI (who query & download them).
 */

export interface CourseResource {
  id: string;
  title: string;
  filename: string;
  subjectCode: string;
  subjectName: string;
  uploadedBy: string;
  facultyEmail?: string;
  uploadedDate?: string;
  fileType?: 'PDF' | string;
  fileFormat?: 'PDF' | string;
  fileSize: string;
  category: 'Exam Notes' | 'Question Bank' | 'Formula Sheet' | 'Lab Manual' | 'Model Paper' | 'Syllabus Guide' | string;
  examImportance: 'Critical' | 'High' | 'Recommended' | 'Official Exam Pack' | 'High Yield' | 'Formula Reference' | 'Standard' | string;
  unitsCovered: string | string[];
  description: string;
  keyTopics: string[];
  contentPreview?: string;
  downloadCount: number;
}

export const INITIAL_COURSE_RESOURCES: CourseResource[] = [
  {
    id: 'RES-CS501-01',
    title: 'Machine Learning Unit 1–5 Comprehensive Exam Revision Pack',
    filename: 'CS501_Machine_Learning_Unit1_5_Complete_Exam_Revision_Pack.pdf',
    subjectCode: 'CS501',
    subjectName: 'Machine Learning',
    uploadedBy: 'Dr. Priya Menon',
    facultyEmail: 'priya.menon@campusiq.edu',
    uploadedDate: 'Oct 24, 2025',
    fileType: 'PDF',
    fileSize: '3.8 MB',
    category: 'Exam Notes',
    examImportance: 'Critical',
    unitsCovered: 'Units 1 to 5 (Full Syllabus)',
    description: 'Faculty exam preparation compendium covering Gradient Descent mathematical proofs, SVM Maximum Margin dual formulations, Random Forests vs XGBoost ensemble derivations, and Multi-Layer Perceptron backpropagation calculus.',
    keyTopics: [
      'Gradient Descent & Learning Rate Convexity Analysis',
      'Logistic Regression Odds Ratio & Loss Optimization',
      'SVM Kernel Trick (RBF, Polynomial) & Lagrange Multipliers',
      'Ensemble Boosting: AdaBoost weight adjustments & XGBoost objective',
      'Neural Network Backprop matrix chain rule equations',
    ],
    contentPreview: `### CS501 Machine Learning — University Exam Quick Revision Summary

#### Unit 1: Supervised Foundations & Optimization
• Cost Function: J(θ) = 1/(2m) * Σ(h_θ(x^(i)) - y^(i))^2
• Batch Gradient Descent: θ_j := θ_j - α * (1/m) * Σ(h_θ(x^(i)) - y^(i)) * x_j^(i)
• Logistic Hypothesis: h_θ(x) = 1 / (1 + e^(-θ^T * x)), Cross-Entropy Loss: -[y*log(h) + (1-y)*log(1-h)]
• L1 Lasso vs L2 Ridge: Lasso drives irrelevant feature weights to exact zero (feature selection).

#### Unit 2: Decision Trees & Ensembles
• Entropy: H(S) = - Σ p_i * log2(p_i)
• Information Gain: IG(S, A) = H(S) - Σ (|S_v| / |S|) * H(S_v)
• Gini Impurity: 1 - Σ (p_i)^2 (Used by CART algorithms)
• Random Forests reduce variance via Bootstrap Aggregation + Random Subspace feature bagging.

#### Unit 3: Support Vector Machines
• Margin Distance: 2 / ||w||. Primal objective: min 1/2 * ||w||^2 s.t. y_i * (w^T * x_i + b) >= 1
• Dual formulation depends strictly on inner products: <x_i, x_j>, enabling Kernel mapping K(x_i, x_j).

#### High-Yield University Exam Questions:
1. Prove the convexity of Mean Squared Error cost function for linear regression. (8 Marks)
2. Derive the weight update rule for AdaBoost given misclassification error ε_m. (10 Marks)
3. Explain Soft Margin SVM with Slack Variables (C penalty trade-off). (8 Marks)`,
    downloadCount: 142,
  },
  {
    id: 'RES-CS501-02',
    title: 'Machine Learning End-Semester Solved Question Bank (2020–2024)',
    filename: 'CS501_Machine_Learning_EndSem_Solved_QuestionBank_2025.pdf',
    subjectCode: 'CS501',
    subjectName: 'Machine Learning',
    uploadedBy: 'Dr. Priya Menon',
    facultyEmail: 'priya.menon@campusiq.edu',
    uploadedDate: 'Oct 20, 2025',
    fileType: 'PDF',
    fileSize: '4.2 MB',
    category: 'Question Bank',
    examImportance: 'Critical',
    unitsCovered: 'All 5 Units Solved Questions',
    description: 'Compilation of 45 verified university examination questions with step-by-step numerical solutions, decision tree induction calculations, and confusion matrix ROC-AUC problems.',
    keyTopics: [
      'Solved numerical on Information Gain calculation',
      'Step-by-step Backprop numerical with 2 hidden layers',
      'K-Means clustering iterative centroid derivation',
      'PCA covariance matrix eigenvector calculation',
    ],
    contentPreview: `### CS501 Solved Question Bank Highlights
• Problem 1: Given a dataset of 14 weather records, calculate the Information Gain for Outlook, Temperature, and Humidity.
• Problem 2: Perform 2 iterations of K-Means on points P1(2,10), P2(2,5), P3(8,4), P4(5,8), P5(7,5) with centroids C1(2,10) and C2(5,8).
• Solution Keys: Verified by Dr. Priya Menon with step-marking breakdown.`,
    downloadCount: 198,
  },
  {
    id: 'RES-CS502-01',
    title: 'Computer Networks End-Sem Master Formula Sheet & Exam Notes',
    filename: 'CS502_Computer_Networks_EndSem_Exam_Compendium.pdf',
    subjectCode: 'CS502',
    subjectName: 'Computer Networks',
    uploadedBy: 'Prof. Suresh Kumar',
    facultyEmail: 'suresh.kumar@campusiq.edu',
    uploadedDate: 'Oct 26, 2025',
    fileType: 'PDF',
    fileSize: '2.9 MB',
    category: 'Formula Sheet',
    examImportance: 'Critical',
    unitsCovered: 'Units 1 to 5 (Full Syllabus)',
    description: 'High-yield formula sheet covering Sliding Window bandwidth-delay product calculations, CRC polynomial generator division proofs, VLSM IPv4 CIDR subnetting shortcuts, and Dijkstra Link State routing examples.',
    keyTopics: [
      'Sliding Window Protocols: Stop-and-Wait, Go-Back-N, Selective Repeat efficiency',
      'CRC Error Detection with generator polynomial division',
      'VLSM Subnetting calculation cheat sheet for CIDR prefixes',
      'TCP Congestion Control: Slow Start, Additive Increase Multiplicative Decrease (AIMD)',
      'Dijkstra SPF & Bellman-Ford Distance Vector count-to-infinity solution',
    ],
    contentPreview: `### CS502 Computer Networks — High Yield Exam Formula Sheet

#### Transmission & Propagation Delay:
• Transmission Delay (Tt) = L / B (Packet Length / Bandwidth)
• Propagation Delay (Tp) = d / v (Distance / Propagation Speed ~ 2x10^8 m/s)
• Efficiency (Stop-and-Wait): η = 1 / (1 + 2a), where a = Tp / Tt.
• Efficiency (Go-Back-N, window size N): η = N / (1 + 2a).
• Efficiency (Selective Repeat): η = N / (1 + 2a), sender window = 2^(n-1).

#### Subnetting & Addressing:
• Total Hosts in Subnet (/n prefix): 2^(32 - n) - 2 (subtract Network ID & Broadcast).
• Subnet Mask /26 = 255.255.255.192 (Block size = 64).

#### Must-Prepare Exam Derivations:
1. Derive maximum channel utilization formula for Selective Repeat protocol. (8 Marks)
2. Compute 16-bit CRC checksum for bitstream 11010011101100 with generator x^4 + x + 1. (10 Marks)
3. Step-by-step execution of Dijkstra algorithm for given 6-node network topology. (10 Marks)`,
    downloadCount: 165,
  },
  {
    id: 'RES-CS502-02',
    title: 'Computer Networks Model Exam Paper with Marking Scheme',
    filename: 'CS502_CN_Unit3_Routing_Protocols_Model_Paper.pdf',
    subjectCode: 'CS502',
    subjectName: 'Computer Networks',
    uploadedBy: 'Prof. Suresh Kumar',
    facultyEmail: 'suresh.kumar@campusiq.edu',
    uploadedDate: 'Oct 22, 2025',
    fileType: 'PDF',
    fileSize: '1.6 MB',
    category: 'Model Paper',
    examImportance: 'High',
    unitsCovered: 'Unit 3 & 4 (Network & Transport Layers)',
    description: 'Official model examination paper prepared by faculty for practice before mid-term and university end-semester evaluations.',
    keyTopics: [
      'IP Packet Header format dissection',
      'TCP 3-Way Handshake and 4-Way Connection Teardown',
      'Leaky Bucket and Token Bucket traffic shaping algorithms',
    ],
    contentPreview: `### CS502 Model Question Paper Preview
• Part A (10 x 2 = 20 Marks): Mandatory fundamental questions.
• Part B (5 x 16 = 80 Marks): Analytical network topology routing and subnetting calculations.
• Prepared by Department of Computer Science & Engineering.`,
    downloadCount: 112,
  },
  {
    id: 'RES-CS503-01',
    title: 'Operating Systems Kernel & Concurrency Exam Compendium',
    filename: 'CS503_OS_Kernel_Concurrency_Exam_Pack.pdf',
    subjectCode: 'CS503',
    subjectName: 'Operating Systems',
    uploadedBy: 'Dr. Anita Bose',
    facultyEmail: 'anita.bose@campusiq.edu',
    uploadedDate: 'Oct 25, 2025',
    fileType: 'PDF',
    fileSize: '3.4 MB',
    category: 'Exam Notes',
    examImportance: 'Critical',
    unitsCovered: 'Units 1 to 4 (Processes, Threads, Deadlocks, Memory)',
    description: 'In-depth notes on CPU Scheduling algorithms (Gantt charts, turnaround time), Semaphore synchronization patterns (Producer-Consumer, Dining Philosophers), Banker’s Deadlock Avoidance algorithm, and Virtual Memory Page Replacement.',
    keyTopics: [
      'Gantt Chart calculations: FCFS, SJF (Preemptive SRTF), Round Robin',
      'Critical Section conditions & Peterson’s Algorithm proof',
      'Banker’s Algorithm safety & resource request state matrix proof',
      'Page Replacement Algorithms: FIFO, Optimal, LRU with reference strings',
    ],
    contentPreview: `### CS503 Operating Systems — Core Exam Formulas & Algorithms

#### CPU Scheduling Metrics:
• Turnaround Time (TAT) = Completion Time - Arrival Time
• Waiting Time (WT) = Turnaround Time - Burst Time

#### Deadlock Detection & Banker's Algorithm:
• Need Matrix: Need[i][j] = Max[i][j] - Allocation[i][j]
• Safety Condition: Work = Available; If Need_i <= Work, Work += Allocation_i.

#### Classical Synchronization:
• Producer-Consumer: Mutex binary semaphore + Empty (counting N) + Full (counting 0).
• Readers-Writers: Preventing reader starvation using writer mutex.`,
    downloadCount: 130,
  },
  {
    id: 'RES-CS504-01',
    title: 'Database Systems Normalization & SQL Exam Workbook',
    filename: 'CS504_Database_Systems_Normalization_SQL_Exam_Workbook.pdf',
    subjectCode: 'CS504',
    subjectName: 'Database Systems',
    uploadedBy: 'Dr. Priya Menon',
    facultyEmail: 'priya.menon@campusiq.edu',
    uploadedDate: 'Oct 18, 2025',
    fileType: 'PDF',
    fileSize: '2.1 MB',
    category: 'Exam Notes',
    examImportance: 'High',
    unitsCovered: 'Units 2 to 4 (Relational Model, Normalization, Transactions)',
    description: 'Comprehensive workbook with step-by-step proofs for 1NF, 2NF, 3NF, and BCNF relational decomposition, losslessness and dependency preservation checks, and ACID transaction serializability graphs.',
    keyTopics: [
      'Functional Dependency Closure F+ and Minimal Canonical Cover',
      'Lossless Join Decomposition algorithm with tabular matrix method',
      'BCNF vs 3NF trade-off: Dependency preservation proof',
      'Two-Phase Locking (2PL) and Conflict Serializability precedence graphs',
    ],
    contentPreview: `### CS504 Database Systems — Normalization & Transactions Exam Guide
• Closure of Attribute Set: X+ computation algorithm.
• 3NF Definition: For every functional dependency X -> A, either X is a superkey, or A is a prime attribute.
• BCNF Definition: For every functional dependency X -> A, X MUST be a superkey.
• Conflict Equivalence: Precedence Graph (Serialization Graph) contains NO directed cycles.`,
    downloadCount: 95,
  },
  {
    id: 'RES-CS505-01',
    title: 'Software Engineering Agile & SRS Model Answers',
    filename: 'CS505_Software_Engineering_Agile_SRS_Model_Answers.pdf',
    subjectCode: 'CS505',
    subjectName: 'Software Engineering',
    uploadedBy: 'Prof. Suresh Kumar',
    facultyEmail: 'suresh.kumar@campusiq.edu',
    uploadedDate: 'Oct 15, 2025',
    fileType: 'PDF',
    fileSize: '1.8 MB',
    category: 'Exam Notes',
    examImportance: 'Recommended',
    unitsCovered: 'Units 1 to 3 (Agile, Requirements, Software Architecture)',
    description: 'IEEE 830 compliant Software Requirements Specification templates, UML Class & Sequence diagrams for university case studies, and Software Testing metric definitions (Cyclomatic Complexity).',
    keyTopics: [
      'Scrum Framework: Sprints, Epics, User Stories, and Burn-down charts',
      'McCabe’s Cyclomatic Complexity: V(G) = E - N + 2P',
      'SOLID Design Principles explained with code refactoring examples',
      'Black-Box vs White-Box Testing: Equivalence Partitioning & Boundary Value Analysis',
    ],
    contentPreview: `### CS505 Software Engineering Exam Notes
• McCabe Cyclomatic Complexity: V(G) = Predicate Nodes + 1 = Edges - Nodes + 2.
• Basis Path Testing: Constructing control flow graph to determine linearly independent execution paths.
• IEEE 830 SRS Standard structure: Scope, User Characteristics, Functional & Non-Functional Requirements.`,
    downloadCount: 88,
  },
];

const STORAGE_KEY = 'campusiq_shared_course_resources';

/**
 * Get all current course resources (from localStorage if modified by faculty, else initial)
 * Automatically sanitizes items so no property is undefined or throws runtime type errors.
 */
export function getCourseResources(subjectCode?: string): CourseResource[] {
  if (typeof window === 'undefined') return INITIAL_COURSE_RESOURCES;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    let parsed: any[] = saved ? JSON.parse(saved) : INITIAL_COURSE_RESOURCES;
    if (!Array.isArray(parsed)) parsed = INITIAL_COURSE_RESOURCES;

    const sanitized: CourseResource[] = parsed
      .filter(Boolean)
      .map((r, idx) => {
        const rawUnits = r.unitsCovered ?? 'Units 1 to 5 (Full Syllabus)';
        const unitsStr = Array.isArray(rawUnits) ? rawUnits.join(', ') : String(rawUnits);
        const rawTopics = r.keyTopics ?? ['Curriculum Core', 'Exam High-Yield'];
        const topicsArr = Array.isArray(rawTopics)
          ? rawTopics
          : typeof rawTopics === 'string'
          ? (rawTopics as string).split(',').map((t: string) => t.trim()).filter(Boolean)
          : ['Exam Revision'];

        return {
          id: r.id || `RES-GEN-${idx + 1}`,
          title: r.title || 'Course Exam Material',
          filename: r.filename || `${(r.subjectCode || 'CS500')}_Revision_Pack.pdf`,
          subjectCode: r.subjectCode || 'CS500',
          subjectName: r.subjectName || 'Computer Science',
          uploadedBy: r.uploadedBy || 'Faculty Member',
          facultyEmail: r.facultyEmail || 'faculty@campusiq.edu',
          uploadedDate: r.uploadedDate || r.uploadDate || 'Oct 2025',
          fileType: (r.fileType || r.fileFormat || 'PDF') as 'PDF',
          fileFormat: (r.fileFormat || r.fileType || 'PDF') as 'PDF',
          fileSize: r.fileSize || '2.4 MB',
          category: r.category || 'Exam Notes',
          examImportance: r.examImportance || 'High Yield',
          unitsCovered: unitsStr,
          description: r.description || `Official study guide provided by ${r.uploadedBy || 'faculty'} for ${r.subjectName || 'this subject'}.`,
          keyTopics: topicsArr,
          contentPreview: r.contentPreview || `### ${r.title || 'Exam Study Pack'}\n\nHigh-yield revision document and curriculum reference materials.`,
          downloadCount: typeof r.downloadCount === 'number' ? r.downloadCount : 45,
        };
      });

    if (subjectCode) {
      return sanitized.filter(r => (r.subjectCode || '').toLowerCase() === subjectCode.toLowerCase());
    }
    return sanitized;
  } catch {
    return INITIAL_COURSE_RESOURCES;
  }
}

/**
 * Save new or updated course resource (uploaded by faculty)
 */
export function addCourseResource(resource: Partial<CourseResource> & { title: string; subjectName: string }): CourseResource {
  const current = getCourseResources();
  const id = resource.id || `RES-${(resource.subjectCode || 'GEN').toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  const rawUnits = resource.unitsCovered ?? 'Units 1 to 5';
  const unitsStr = Array.isArray(rawUnits) ? rawUnits.join(', ') : String(rawUnits);
  const rawTopics = resource.keyTopics ?? ['Core concepts', 'Exam formulas', 'Model answers'];
  const topicsArr = Array.isArray(rawTopics)
    ? rawTopics
    : typeof rawTopics === 'string'
    ? (rawTopics as string).split(',').map((t: string) => t.trim()).filter(Boolean)
    : ['Core concepts'];

  const completeResource: CourseResource = {
    id,
    title: resource.title.trim(),
    filename: resource.filename || `${(resource.subjectCode || 'GEN')}_${resource.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
    subjectCode: resource.subjectCode || 'CS501',
    subjectName: resource.subjectName || 'Computer Science',
    uploadedBy: resource.uploadedBy || 'Faculty Member',
    facultyEmail: resource.facultyEmail || 'faculty@campusiq.edu',
    uploadedDate: resource.uploadedDate || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    fileType: 'PDF',
    fileFormat: 'PDF',
    fileSize: resource.fileSize || '2.8 MB',
    category: resource.category || 'Exam Notes',
    examImportance: resource.examImportance || 'High Yield',
    unitsCovered: unitsStr,
    description: resource.description || `Official study material provided by ${resource.uploadedBy || 'Faculty'} for ${resource.subjectName}.`,
    keyTopics: topicsArr,
    contentPreview: resource.contentPreview || `### ${resource.title}\n\nOfficial CampusIQ Study Pack for ${resource.subjectName} (${resource.subjectCode}).\nPublished by ${resource.uploadedBy || 'Faculty'} for comprehensive exam preparation.`,
    downloadCount: resource.downloadCount ?? 1,
  };

  const updated = [completeResource, ...current.filter(r => r.id !== id)];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('campusiq_resources_updated', { detail: updated }));
  }
  return completeResource;
}

/**
 * Delete a course resource
 */
export function deleteCourseResource(id: string): void {
  if (typeof window === 'undefined') return;
  const current = getCourseResources();
  const updated = current.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('campusiq_resources_updated', { detail: updated }));
}

/**
 * Direct file download trigger for students
 */
export function downloadResourceFile(res: CourseResource): void {
  if (typeof window === 'undefined') return;

  const unitsStr = Array.isArray(res.unitsCovered) ? res.unitsCovered.join(', ') : (res.unitsCovered || 'All Units');
  const topicsList = (res.keyTopics || []).map((t, i) => `  ${i + 1}. ${t}`).join('\n') || '  1. Comprehensive Exam Review';

  const textContent = `================================================================================
CAMPUSIQ ACADEMIC RESOURCE REPOSITORY — OFFICIAL STUDY PACK
================================================================================
COURSE: ${res.subjectName || 'General Subject'} (${res.subjectCode || 'GEN'})
DOCUMENT: ${res.title || 'Course Study Material'}
FACULTY INSTRUCTOR: ${res.uploadedBy || 'Faculty'} (${res.facultyEmail || 'faculty@campusiq.edu'})
DATE PUBLISHED: ${res.uploadedDate || 'Oct 2025'}
CATEGORY: ${res.category || 'Exam Notes'} | EXAM PRIORITY: ${res.examImportance || 'High Yield'}
FILE FORMAT: ${res.fileType || res.fileFormat || 'PDF'} (${res.fileSize || '2.4 MB'})
================================================================================

DESCRIPTION:
${res.description || 'Verified course resource published by faculty.'}

UNITS & TOPICS COVERED:
${unitsStr}
${topicsList}

================================================================================
EXAM PREPARATION STUDY GUIDE & HIGH-YIELD SUMMARY:
================================================================================
${res.contentPreview || 'High-yield exam review summary and model solutions.'}

================================================================================
VERIFIED BY CAMPUSIQ ACADEMIC COUNCIL & DEPARTMENT OF ${(res.subjectName || 'CS').toUpperCase()}
© 2025 CampusIQ · All Rights Reserved
================================================================================
`;

  const blob = new Blob([textContent], { type: 'application/pdf;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = res.filename || `${res.subjectCode || 'DOC'}_Study_Pack.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
