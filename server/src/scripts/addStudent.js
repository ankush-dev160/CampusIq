import { admitStudent } from '../services/studentAdmissionService.js';

// Parse command line arguments:
// node server/src/scripts/addStudent.js --name "Rohan Gupta" --branch CSE --year 1 --division A --phone 9876501234
const args = process.argv.slice(2);
const params = {};

for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) {
    const key = args[i].replace(/^--/, '');
    const val = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
    params[key] = val;
  }
}

if (!params.name || !params.branch || !params.phone) {
  console.log(`
Usage:
  node server/src/scripts/addStudent.js --name "<Name>" --branch <Branch> --phone <10-digit> [options]

Required:
  --name       Full Student Name (e.g. "Rohan Gupta")
  --branch     Branch: CSE, AIML, IT, ECE, ME, CE
  --phone      10-digit mobile number starting with 6-9

Optional:
  --year       Year (1 to 4, default: 1)
  --division   Division (A or B, default: A)
  --gender     Gender (Male/Female/Other, default: Male)
  --dob        Date of birth (YYYY-MM-DD, default: 2008-01-01)
  --city       City (default: Jaipur)
  --state      State (default: Rajasthan)
  --guardian   Guardian Name
  --gphone     Guardian Phone
  --sample     Toggle sample marks/attendance history (default: false)
  `);
  process.exit(1);
}

try {
  const result = admitStudent({
    name: params.name,
    branch: params.branch,
    year: params.year || 1,
    division: params.division || 'A',
    gender: params.gender || 'Male',
    dob: params.dob || '2008-01-01',
    phone: params.phone,
    guardianName: params.guardian,
    guardianPhone: params.gphone,
    city: params.city || 'Jaipur',
    state: params.state || 'Rajasthan',
    generateSampleHistory: !!params.sample,
  });

  console.log('\n=============================================');
  console.log(' STUDENT ADMISSION SUCCESSFUL');
  console.log('=============================================');
  console.log(`Roll Number   : ${result.credentials.rollNo}`);
  console.log(`Student Name  : ${result.student.name}`);
  console.log(`Branch & Year : ${result.student.branch} Year ${result.student.year} (Sem ${result.student.currentSemester})`);
  console.log(`Division      : ${result.student.division}`);
  console.log(`Email Address : ${result.credentials.email}`);
  console.log(`Default Pass  : ${result.credentials.defaultPassword}`);
  console.log(`Must Change PW: ${result.credentials.mustChangePassword}`);
  console.log(`Subjects Enr. : ${result.enrolledSubjectsCount} subjects (${result.enrolledSubjects.join(', ')})`);
  console.log(`Fee Records   : ${result.feesCreatedCount} semester ledger items created`);
  console.log('=============================================\n');
} catch (err) {
  console.error('\nADMISSION ERROR:', err.message, '\n');
  process.exit(1);
}
