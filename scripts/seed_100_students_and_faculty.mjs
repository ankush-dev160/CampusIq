import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const EXCEL_RAW_PATH = path.join(ROOT_DIR, 'src/data/excelRawData.json');
const SERVER_STUDENTS_PATH = path.join(ROOT_DIR, 'server/seed-data/json/students.json');
const SERVER_FACULTY_PATH = path.join(ROOT_DIR, 'server/seed-data/json/faculty.json');

// 1. Define the 10 Faculty Members
export const FACULTY_LIST = [
  {
    id: 'FAC-01',
    employeeId: 'FAC-CSE-001',
    name: 'Dr. Priya Menon',
    email: 'priya.menon@edupulse.edu',
    phone: '9845123401',
    gender: 'Female',
    department: 'Computer Science',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    designation: 'Professor & HOD',
    qualification: 'Ph.D. in Computer Science (IIT Madras)',
    experienceYears: 16,
    joiningYear: 2010,
    subjects: ['Machine Learning', 'Database Systems'],
    students_count: 54,
    avatar_initials: 'PM',
    status: 'Active'
  },
  {
    id: 'FAC-02',
    employeeId: 'FAC-CSE-002',
    name: 'Prof. Suresh Kumar',
    email: 'suresh.kumar@edupulse.edu',
    phone: '9845123402',
    gender: 'Male',
    department: 'Computer Science',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    qualification: 'M.Tech, Ph.D. (IIT Delhi)',
    experienceYears: 12,
    joiningYear: 2014,
    subjects: ['Computer Networks', 'Software Engineering'],
    students_count: 54,
    avatar_initials: 'SK',
    status: 'Active'
  },
  {
    id: 'FAC-03',
    employeeId: 'FAC-CSE-003',
    name: 'Dr. Anita Bose',
    email: 'anita.bose@edupulse.edu',
    phone: '9845123403',
    gender: 'Female',
    department: 'Computer Science',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    designation: 'Assistant Professor',
    qualification: 'Ph.D. in Algorithms (ISI Kolkata)',
    experienceYears: 8,
    joiningYear: 2018,
    subjects: ['Operating Systems', 'Algorithm Design'],
    students_count: 48,
    avatar_initials: 'AB',
    status: 'Active'
  },
  {
    id: 'FAC-04',
    employeeId: 'FAC-IT-001',
    name: 'Prof. Rajeshwar Rao',
    email: 'rajeshwar.rao@edupulse.edu',
    phone: '9845123404',
    gender: 'Male',
    department: 'Information Technology',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    designation: 'Professor & HOD',
    qualification: 'Ph.D. in Distributed Systems (BITS Pilani)',
    experienceYears: 18,
    joiningYear: 2008,
    subjects: ['Cloud Computing', 'Distributed Systems'],
    students_count: 52,
    avatar_initials: 'RR',
    status: 'Active'
  },
  {
    id: 'FAC-05',
    employeeId: 'FAC-ECE-001',
    name: 'Dr. Meenakshi Sundaram',
    email: 'meenakshi.sundaram@edupulse.edu',
    phone: '9845123405',
    gender: 'Female',
    department: 'Electronics & Comm.',
    departmentCode: 'ECE',
    departmentName: 'Electronics & Communication Engineering',
    designation: 'Associate Professor & HOD',
    qualification: 'Ph.D. in VLSI & Signal Processing (IISc Bangalore)',
    experienceYears: 14,
    joiningYear: 2012,
    subjects: ['Digital Signal Processing', 'VLSI Design'],
    students_count: 46,
    avatar_initials: 'MS',
    status: 'Active'
  },
  {
    id: 'FAC-06',
    employeeId: 'FAC-ME-001',
    name: 'Prof. Vikramaditya Rathore',
    email: 'vikramaditya.rathore@edupulse.edu',
    phone: '9845123406',
    gender: 'Male',
    department: 'Mechanical Eng.',
    departmentCode: 'ME',
    departmentName: 'Mechanical Engineering',
    designation: 'Professor & HOD',
    qualification: 'Ph.D. in Thermal Engineering (IIT Roorkee)',
    experienceYears: 20,
    joiningYear: 2006,
    subjects: ['Thermodynamics', 'Fluid Mechanics'],
    students_count: 42,
    avatar_initials: 'VR',
    status: 'Active'
  },
  {
    id: 'FAC-07',
    employeeId: 'FAC-CE-001',
    name: 'Dr. Kavita Deshmukh',
    email: 'kavita.deshmukh@edupulse.edu',
    phone: '9845123407',
    gender: 'Female',
    department: 'Civil Eng.',
    departmentCode: 'CE',
    departmentName: 'Civil Engineering',
    designation: 'Associate Professor & HOD',
    qualification: 'Ph.D. in Structural Engineering (IIT Bombay)',
    experienceYears: 11,
    joiningYear: 2015,
    subjects: ['Structural Analysis', 'Geotechnical Eng.'],
    students_count: 40,
    avatar_initials: 'KD',
    status: 'Active'
  },
  {
    id: 'FAC-08',
    employeeId: 'FAC-CSE-004',
    name: 'Prof. Harish Chandra Verma',
    email: 'harish.verma@edupulse.edu',
    phone: '9845123408',
    gender: 'Male',
    department: 'Computer Science',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    designation: 'Professor & AI Research Chair',
    qualification: 'Ph.D. in Artificial Intelligence (IIT Kanpur)',
    experienceYears: 22,
    joiningYear: 2004,
    subjects: ['Artificial Intelligence', 'Deep Learning'],
    students_count: 58,
    avatar_initials: 'HV',
    status: 'Active'
  },
  {
    id: 'FAC-09',
    employeeId: 'FAC-IT-002',
    name: 'Dr. Ananya Sen',
    email: 'ananya.sen@edupulse.edu',
    phone: '9845123409',
    gender: 'Female',
    department: 'Information Technology',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    designation: 'Assistant Professor',
    qualification: 'Ph.D. in Information Security (IIIT Hyderabad)',
    experienceYears: 7,
    joiningYear: 2019,
    subjects: ['Cyber Security', 'Cryptography & Network Security'],
    students_count: 50,
    avatar_initials: 'AS',
    status: 'Active'
  },
  {
    id: 'FAC-10',
    employeeId: 'FAC-ECE-002',
    name: 'Prof. Amitav Banerjee',
    email: 'amitav.banerjee@edupulse.edu',
    phone: '9845123410',
    gender: 'Male',
    department: 'Electronics & Comm.',
    departmentCode: 'ECE',
    departmentName: 'Electronics & Communication Engineering',
    designation: 'Associate Professor',
    qualification: 'Ph.D. in Embedded Systems (IIT Kharagpur)',
    experienceYears: 13,
    joiningYear: 2013,
    subjects: ['Embedded Systems', 'IoT & Microcontrollers'],
    students_count: 45,
    avatar_initials: 'AB',
    status: 'Active'
  }
];

// Helper: Calculate AI Risk Level
function computeRisk(cgpa, attendance, backlogs) {
  if (cgpa < 6.0 || attendance < 65 || backlogs >= 2) return 'High';
  if (cgpa < 7.2 || attendance < 75 || backlogs === 1) return 'Moderate';
  return 'Low';
}

// 2. Base list of 100 students
// Required 8 students prominently positioned
const REQUIRED_STUDENTS = [
  {
    name: 'Ankush Sonkar',
    gender: 'Male',
    department: 'Computer Science',
    deptCode: 'CSE',
    year: 3,
    sem: 5,
    cgpa: 8.75,
    attendance: 88,
    backlogs: 0,
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    lms: 14,
    assignments: 92,
    scholarship: 'Yes'
  },
  {
    name: 'Anmol Nishad',
    gender: 'Male',
    department: 'Information Technology',
    deptCode: 'IT',
    year: 3,
    sem: 6,
    cgpa: 7.92,
    attendance: 81,
    backlogs: 0,
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    lms: 11,
    assignments: 86,
    scholarship: 'Yes'
  },
  {
    name: 'Aman Chaubey',
    gender: 'Male',
    department: 'Computer Science',
    deptCode: 'CSE',
    year: 4,
    sem: 7,
    cgpa: 8.45,
    attendance: 85,
    backlogs: 0,
    city: 'Kanpur',
    state: 'Uttar Pradesh',
    lms: 15,
    assignments: 94,
    scholarship: 'Yes'
  },
  {
    name: 'Kaushik Shinde',
    gender: 'Male',
    department: 'Computer Science',
    deptCode: 'CSE',
    year: 2,
    sem: 3,
    cgpa: 8.12,
    attendance: 83,
    backlogs: 0,
    city: 'Mumbai',
    state: 'Maharashtra',
    lms: 12,
    assignments: 90,
    scholarship: 'No'
  },
  {
    name: 'Yash Sharma',
    gender: 'Male',
    department: 'Electronics & Comm.',
    deptCode: 'ECE',
    year: 4,
    sem: 8,
    cgpa: 7.60,
    attendance: 76,
    backlogs: 1,
    city: 'Delhi',
    state: 'Delhi',
    lms: 9,
    assignments: 78,
    scholarship: 'No'
  },
  {
    name: 'Amaan Khan',
    gender: 'Male',
    department: 'Mechanical Eng.',
    deptCode: 'ME',
    year: 2,
    sem: 4,
    cgpa: 7.35,
    attendance: 79,
    backlogs: 0,
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    lms: 10,
    assignments: 82,
    scholarship: 'No'
  },
  {
    name: 'Nishant Manjhi',
    gender: 'Male',
    department: 'Civil Eng.',
    deptCode: 'CE',
    year: 1,
    sem: 2,
    cgpa: 6.85,
    attendance: 72,
    backlogs: 1,
    city: 'Patna',
    state: 'Bihar',
    lms: 7,
    assignments: 70,
    scholarship: 'Yes'
  },
  {
    name: 'Aryan Gupta',
    gender: 'Male',
    department: 'Computer Science',
    deptCode: 'CSE',
    year: 1,
    sem: 1,
    cgpa: 9.15,
    attendance: 94,
    backlogs: 0,
    city: 'Indore',
    state: 'Madhya Pradesh',
    lms: 18,
    assignments: 98,
    scholarship: 'Yes'
  },
  {
    name: 'Ganesh Sharma',
    gender: 'Male',
    department: 'Computer Science',
    deptCode: 'CSE',
    year: 3,
    sem: 5,
    cgpa: 7.85,
    attendance: 82,
    backlogs: 0,
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    lms: 7,
    assignments: 88,
    scholarship: 'Yes'
  }
];

// Target semester distribution (Sem 1 to Sem 8):
// Sem 1: 13, Sem 2: 12, Sem 3: 13, Sem 4: 12, Sem 5: 13, Sem 6: 12, Sem 7: 13, Sem 8: 12 = 100 students
const SEM_TARGETS = {
  1: { year: 1, target: 13 },
  2: { year: 1, target: 12 },
  3: { year: 2, target: 13 },
  4: { year: 2, target: 12 },
  5: { year: 3, target: 13 },
  6: { year: 3, target: 12 },
  7: { year: 4, target: 13 },
  8: { year: 4, target: 12 },
};

const semCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
for (const s of REQUIRED_STUDENTS) {
  semCounts[s.sem]++;
}

// Cohort pool of student names & attributes to fill remaining 91 slots
const POOL_NAMES = [
  { name: 'Diya Nair', gender: 'Female', city: 'Kochi', state: 'Kerala' },
  { name: 'Rohan Patel', gender: 'Male', city: 'Ahmedabad', state: 'Gujarat' },
  { name: 'Ananya Verma', gender: 'Female', city: 'Jaipur', state: 'Rajasthan' },
  { name: 'Priya Reddy', gender: 'Female', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Aditya Iyer', gender: 'Male', city: 'Chennai', state: 'Tamil Nadu' },
  { name: 'Sneha Chopra', gender: 'Female', city: 'Chandigarh', state: 'Punjab' },
  { name: 'Vikram Malhotra', gender: 'Male', city: 'Delhi', state: 'Delhi' },
  { name: 'Isha Mehta', gender: 'Female', city: 'Surat', state: 'Gujarat' },
  { name: 'Rahul Kulkarni', gender: 'Male', city: 'Pune', state: 'Maharashtra' },
  { name: 'Pooja Deshmukh', gender: 'Female', city: 'Nagpur', state: 'Maharashtra' },
  { name: 'Arjun Sen', gender: 'Male', city: 'Kolkata', state: 'West Bengal' },
  { name: 'Meera Joshi', gender: 'Female', city: 'Dehradun', state: 'Uttarakhand' },
  { name: 'Varun Pillai', gender: 'Male', city: 'Bengaluru', state: 'Karnataka' },
  { name: 'Neha Shukla', gender: 'Female', city: 'Varanasi', state: 'Uttar Pradesh' },
  { name: 'Siddharth Rao', gender: 'Male', city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { name: 'Tanvi Agarwal', gender: 'Female', city: 'Agra', state: 'Uttar Pradesh' },
  { name: 'Gaurav Thakur', gender: 'Male', city: 'Shimla', state: 'Himachal Pradesh' },
  { name: 'Riya Chatterjee', gender: 'Female', city: 'Kolkata', state: 'West Bengal' },
  { name: 'Kunal Bansal', gender: 'Male', city: 'Indore', state: 'Madhya Pradesh' },
  { name: 'Anika Roy', gender: 'Female', city: 'Bhubaneswar', state: 'Odisha' },
  { name: 'Dhruv Pandey', gender: 'Male', city: 'Prayagraj', state: 'Uttar Pradesh' },
  { name: 'Sanya Mukherjee', gender: 'Female', city: 'Ranchi', state: 'Jharkhand' },
  { name: 'Harsh Saxena', gender: 'Male', city: 'Bhopal', state: 'Madhya Pradesh' },
  { name: 'Tara Bhattacharya', gender: 'Female', city: 'Guwahati', state: 'Assam' },
  { name: 'Rishi Mishra', gender: 'Male', city: 'Gorakhpur', state: 'Uttar Pradesh' },
  { name: 'Kavya Tiwari', gender: 'Female', city: 'Gwalior', state: 'Madhya Pradesh' },
  { name: 'Nikhil Chauhan', gender: 'Male', city: 'Noida', state: 'Uttar Pradesh' },
  { name: 'Simran Kaur', gender: 'Female', city: 'Amritsar', state: 'Punjab' },
  { name: 'Devendra Yadav', gender: 'Male', city: 'Kanpur', state: 'Uttar Pradesh' },
  { name: 'Shreya Sengupta', gender: 'Female', city: 'Kolkata', state: 'West Bengal' },
  { name: 'Kartik Bhatia', gender: 'Male', city: 'Faridabad', state: 'Haryana' },
  { name: 'Ishaan Trivedi', gender: 'Male', city: 'Vadodara', state: 'Gujarat' },
  { name: 'Ritika Dubey', gender: 'Female', city: 'Jabalpur', state: 'Madhya Pradesh' },
  { name: 'Manav Kaushik', gender: 'Male', city: 'Gurugram', state: 'Haryana' },
  { name: 'Aditi Srivastava', gender: 'Female', city: 'Lucknow', state: 'Uttar Pradesh' },
  { name: 'Sahil Qureshi', gender: 'Male', city: 'Aligarh', state: 'Uttar Pradesh' },
  { name: 'Prachi Naik', gender: 'Female', city: 'Goa', state: 'Goa' },
  { name: 'Chirag Hegde', gender: 'Male', city: 'Mangalore', state: 'Karnataka' },
  { name: 'Muskan Khatun', gender: 'Female', city: 'Patna', state: 'Bihar' },
  { name: 'Tushar Ansari', gender: 'Male', city: 'Bareilly', state: 'Uttar Pradesh' },
  { name: 'Swati Bisht', gender: 'Female', city: 'Nainital', state: 'Uttarakhand' },
  { name: 'Mohit Chandel', gender: 'Male', city: 'Jammu', state: 'Jammu & Kashmir' },
  { name: 'Pallavi Gowda', gender: 'Female', city: 'Mysuru', state: 'Karnataka' },
  { name: 'Ayush Rajput', gender: 'Male', city: 'Udaipur', state: 'Rajasthan' },
  { name: 'Juhi Sethi', gender: 'Female', city: 'Ludhiana', state: 'Punjab' },
  { name: 'Vishal Mahato', gender: 'Male', city: 'Dhanbad', state: 'Jharkhand' },
  { name: 'Shruti Kamat', gender: 'Female', city: 'Hubli', state: 'Karnataka' },
  { name: 'Alok Ranjan', gender: 'Male', city: 'Muzaffarpur', state: 'Bihar' },
  { name: 'Tanya Dewan', gender: 'Female', city: 'Rohtak', state: 'Haryana' },
  { name: 'Deepak Rathore', gender: 'Male', city: 'Jodhpur', state: 'Rajasthan' },
  { name: 'Sakshi Sheikh', gender: 'Female', city: 'Aurangabad', state: 'Maharashtra' },
  { name: 'Rohit Negi', gender: 'Male', city: 'Dehradun', state: 'Uttarakhand' },
  { name: 'Payal Somani', gender: 'Female', city: 'Bhilwara', state: 'Rajasthan' },
  { name: 'Mayank Mishra', gender: 'Male', city: 'Jhansi', state: 'Uttar Pradesh' },
  { name: 'Kriti Singhania', gender: 'Female', city: 'Raipur', state: 'Chhattisgarh' },
  { name: 'Sumit Paul', gender: 'Male', city: 'Siliguri', state: 'West Bengal' },
  { name: 'Divya Nambiar', gender: 'Female', city: 'Kozhikode', state: 'Kerala' },
  { name: 'Abhinav Tyagi', gender: 'Male', city: 'Meerut', state: 'Uttar Pradesh' },
  { name: 'Preeti Grewal', gender: 'Female', city: 'Patiala', state: 'Punjab' },
  { name: 'Naveen Swaminathan', gender: 'Male', city: 'Madurai', state: 'Tamil Nadu' },
  { name: 'Shilpa Shetty', gender: 'Female', city: 'Udupi', state: 'Karnataka' },
  { name: 'Chetan Bhagat', gender: 'Male', city: 'Kolhapur', state: 'Maharashtra' },
  { name: 'Ritu Vashishta', gender: 'Female', city: 'Kurukshetra', state: 'Haryana' },
  { name: 'Ankit Porwal', gender: 'Male', city: 'Kota', state: 'Rajasthan' },
  { name: 'Bhavna Barman', gender: 'Female', city: 'Tezpur', state: 'Assam' },
  { name: 'Rajat Khurana', gender: 'Male', city: 'Jalandhar', state: 'Punjab' },
  { name: 'Radhika Menaria', gender: 'Female', city: 'Ajmer', state: 'Rajasthan' },
  { name: 'Saurabh Solanki', gender: 'Male', city: 'Bhavnagar', state: 'Gujarat' },
  { name: 'Akanksha Gokhale', gender: 'Female', city: 'Thane', state: 'Maharashtra' },
  { name: 'Pankaj Mathur', gender: 'Male', city: 'Mathura', state: 'Uttar Pradesh' },
  { name: 'Monika Rawat', gender: 'Female', city: 'Haridwar', state: 'Uttarakhand' },
  { name: 'Ashish Bhowmick', gender: 'Male', city: 'Agartala', state: 'Tripura' },
  { name: 'Shweta Marathe', gender: 'Female', city: 'Nashik', state: 'Maharashtra' },
  { name: 'Jitendra Sahoo', gender: 'Male', city: 'Cuttack', state: 'Odisha' },
  { name: 'Vandana Panwar', gender: 'Female', city: 'Bikaner', state: 'Rajasthan' },
  { name: 'Hemant Godara', gender: 'Male', city: 'Hisar', state: 'Haryana' },
  { name: 'Jyoti Sangwan', gender: 'Female', city: 'Panipat', state: 'Haryana' },
  { name: 'Tarun Lamba', gender: 'Male', city: 'Karnal', state: 'Haryana' },
  { name: 'Komal Ahluwalia', gender: 'Female', city: 'Mohali', state: 'Punjab' },
  { name: 'Vikas Rathi', gender: 'Male', city: 'Sonipat', state: 'Haryana' },
  { name: 'Aarti Mandloi', gender: 'Female', city: 'Ujjain', state: 'Madhya Pradesh' },
  { name: 'Sandeep Bhati', gender: 'Male', city: 'Ghaziabad', state: 'Uttar Pradesh' },
  { name: 'Sonam Dorjee', gender: 'Female', city: 'Gangtok', state: 'Sikkim' },
  { name: 'Lokesh Choudhary', gender: 'Male', city: 'Sikar', state: 'Rajasthan' },
  { name: 'Reena Tirkey', gender: 'Female', city: 'Rourkela', state: 'Odisha' },
  { name: 'Vinay Paswan', gender: 'Male', city: 'Gaya', state: 'Bihar' },
  { name: 'Anjali Sondhi', gender: 'Female', city: 'Bathinda', state: 'Punjab' },
  { name: 'Harish Nadar', gender: 'Male', city: 'Tirunelveli', state: 'Tamil Nadu' },
  { name: 'Deepa Warrier', gender: 'Female', city: 'Thrissur', state: 'Kerala' },
  { name: 'Mukesh Soren', gender: 'Male', city: 'Jamshedpur', state: 'Jharkhand' },
  { name: 'Suman Mahapatra', gender: 'Female', city: 'Sambalpur', state: 'Odisha' }
];

const DEPARTMENTS = [
  { name: 'Computer Science', code: 'CSE', full: 'Computer Science & Engineering' },
  { name: 'Information Technology', code: 'IT', full: 'Information Technology' },
  { name: 'Electronics & Comm.', code: 'ECE', full: 'Electronics & Communication Engineering' },
  { name: 'Mechanical Eng.', code: 'ME', full: 'Mechanical Engineering' },
  { name: 'Civil Eng.', code: 'CE', full: 'Civil Engineering' }
];

// Combine all 100 students
const all100Students = [...REQUIRED_STUDENTS];

let poolIdx = 0;
// Distribute across semesters to reach exact targets
for (let sem = 1; sem <= 8; sem++) {
  const needed = SEM_TARGETS[sem].target - semCounts[sem];
  const year = SEM_TARGETS[sem].year;

  for (let i = 0; i < needed; i++) {
    const p = POOL_NAMES[poolIdx % POOL_NAMES.length];
    poolIdx++;

    const deptObj = DEPARTMENTS[(sem + i) % DEPARTMENTS.length];
    
    // Vary metrics realistically
    let cgpa, attendance, backlogs, lms, assignments;
    const mode = (i + sem) % 4;
    if (mode === 0) {
      // High performer
      cgpa = Number((8.4 + (i * 0.13) % 1.5).toFixed(2));
      attendance = 86 + ((i * 3) % 12);
      backlogs = 0;
      lms = 12 + ((i * 2) % 8);
      assignments = 90 + ((i * 2) % 10);
    } else if (mode === 1) {
      // Solid performer
      cgpa = Number((7.2 + (i * 0.11) % 1.2).toFixed(2));
      attendance = 77 + ((i * 3) % 10);
      backlogs = 0;
      lms = 8 + ((i * 2) % 7);
      assignments = 80 + ((i * 3) % 15);
    } else if (mode === 2) {
      // Moderate / mild backlogs
      cgpa = Number((6.2 + (i * 0.14) % 1.1).toFixed(2));
      attendance = 68 + ((i * 3) % 9);
      backlogs = (i % 2 === 0) ? 1 : 0;
      lms = 5 + ((i * 2) % 6);
      assignments = 65 + ((i * 4) % 15);
    } else {
      // High risk / needs support
      cgpa = Number((4.8 + (i * 0.17) % 1.3).toFixed(2));
      attendance = 54 + ((i * 4) % 14);
      backlogs = 1 + (i % 3);
      lms = 2 + ((i * 2) % 5);
      assignments = 50 + ((i * 5) % 20);
    }

    all100Students.push({
      name: p.name,
      gender: p.gender,
      department: deptObj.name,
      deptCode: deptObj.code,
      year,
      sem,
      cgpa: Math.min(9.85, cgpa),
      attendance: Math.min(98, attendance),
      backlogs,
      city: p.city,
      state: p.state,
      lms,
      assignments: Math.min(100, assignments),
      scholarship: (i % 3 === 0) ? 'Yes' : 'No'
    });
  }
}

console.log(`Generated ${all100Students.length} total students.`);

// Format for excelRawData.json
const excelDataRows = all100Students.map((s, idx) => {
  const studentId = idx === 8 && s.name === 'Ganesh Sharma' ? 'STU000' : `STU${String(idx + 1).padStart(3, '0')}`;
  const nameParts = s.name.toLowerCase().split(' ');
  const emailSlug = `${nameParts[0]}.${nameParts[nameParts.length - 1]}`;
  const email = `${emailSlug}${s.year}${s.sem}@edupulse.edu`;
  const age = 17 + s.year + (s.sem % 2 === 0 ? 1 : 0);
  const phone = `98${String(10000000 + idx * 83713).slice(0, 8)}`;
  const risk = computeRisk(s.cgpa, s.attendance, s.backlogs);

  return {
    "Student ID": studentId,
    "Full Name": s.name,
    "Email": email,
    "Age": age,
    "Gender": s.gender,
    "Phone (Dummy)": phone,
    "City": s.city,
    "Course": s.department,
    "Year of Study": s.year,
    "Semester": s.sem,
    "Attendance (%)": s.attendance,
    "CGPA": s.cgpa,
    "Assignments Completed (%)": s.assignments,
    "LMS Activity (hrs/week)": s.lms,
    "Backlogs": s.backlogs,
    "Scholarship Status": s.scholarship,
    "Enrollment Status": "Active",
    "AI Risk Level (Demo)": risk
  };
});

// Format for server students.json
const serverStudentRows = all100Students.map((s, idx) => {
  const admissionYear = 2026 - s.year;
  const rollNo = `${admissionYear}${s.deptCode}${String(idx + 1).padStart(3, '0')}`;
  const nameParts = s.name.toLowerCase().split(' ');
  const emailSlug = `${nameParts[0]}.${nameParts[nameParts.length - 1]}`;
  const email = `${emailSlug}@ustu.edu.in`;
  const phone = `98${String(10000000 + idx * 83713).slice(0, 8)}`;
  const dobYear = 2008 - s.year;
  const dob = `${dobYear}-${String((idx % 12) + 1).padStart(2, '0')}-${String((idx % 28) + 1).padStart(2, '0')}`;
  const bloodGroups = ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-'];
  const bloodGroup = bloodGroups[idx % bloodGroups.length];
  const creditsPerSem = 20;
  const totalCreditsEarned = Math.max(0, (s.sem - 1) * creditsPerSem - (s.backlogs * 4));

  const deptMeta = DEPARTMENTS.find(d => d.code === s.deptCode) || DEPARTMENTS[0];

  return {
    id: rollNo,
    name: s.name,
    rollNo: rollNo,
    email: email,
    phone: phone,
    gender: s.gender,
    dob: dob,
    branch: s.deptCode,
    branchName: deptMeta.full,
    division: (idx % 2 === 0) ? 'A' : 'B',
    year: s.year,
    currentSemester: s.sem,
    admissionYear: admissionYear,
    batch: `${admissionYear}-${admissionYear + 4}`,
    bloodGroup: bloodGroup,
    address: {
      city: s.city,
      state: s.state
    },
    guardianName: `${s.name.split(' ')[0]}'s Guardian`,
    guardianPhone: `91${String(20000000 + idx * 74911).slice(0, 8)}`,
    cgpa: s.cgpa,
    activeBacklogs: s.backlogs,
    totalCreditsEarned: totalCreditsEarned,
    status: 'Active'
  };
});

// Format server faculty.json
const serverFacultyRows = FACULTY_LIST.map(f => ({
  id: f.employeeId,
  employeeId: f.employeeId,
  name: f.name,
  email: f.email,
  phone: f.phone,
  gender: f.gender,
  department: f.departmentCode,
  departmentName: f.departmentName,
  designation: f.designation,
  qualification: f.qualification,
  experienceYears: f.experienceYears,
  joiningYear: f.joiningYear,
  assignedSubjects: f.subjects,
  status: 'Active'
}));

// Write files
fs.writeFileSync(EXCEL_RAW_PATH, JSON.stringify(excelDataRows, null, 2), 'utf8');
console.log(`✓ Written ${excelDataRows.length} rows to ${EXCEL_RAW_PATH}`);

fs.writeFileSync(SERVER_STUDENTS_PATH, JSON.stringify(serverStudentRows, null, 2), 'utf8');
console.log(`✓ Written ${serverStudentRows.length} rows to ${SERVER_STUDENTS_PATH}`);

fs.writeFileSync(SERVER_FACULTY_PATH, JSON.stringify(serverFacultyRows, null, 2), 'utf8');
console.log(`✓ Written ${serverFacultyRows.length} faculty rows to ${SERVER_FACULTY_PATH}`);
