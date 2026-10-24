# EduPulse Seed Dataset (dummy data)

Everything here is synthetic. Names, phones and emails are not real people.

Counts: 200 students, 30 faculty, 10 admins, 4000 mark rows, 600 semester results, 33,393 daily attendance rows, 800 fee rows.

## Logins
- Email format for everyone: firstname.lastname@ustu.edu.in (lowercase)
- Password for everyone: @123 (users.json already holds a bcrypt hash of it; plain list in csv/logins_demo.csv for demo use only)
- Test accounts: ankush.sonkar@ustu.edu.in (2024CSE001, 3rd yr CSE, Div A), aman.chaubey@ustu.edu.in (2024CSE002, 3rd yr CSE, Div A)

## Students
- 4 years x 6 branches: CSE 52, AIML 36, IT 32, ECE 32, ME 28, CE 20. Divisions A/B. 50 students per year.
- Current semester: Year1 = Sem1, Year2 = Sem3, Year3 = Sem5, Year4 = Sem7.
- Year 1 students have no completed semester yet, so cgpa is null and they have only current-sem internals, attendance and fees.
- Roll no format: admissionYear + branch + serial (e.g. 2024CSE001).

## Files (json/ and csv/, same content)
students, faculty, admins, users, subjects, enrollments_current, marks, semester_results (SGPA, CGPA, backlogs per sem), attendance_summary (all semesters), attendance_daily (current sem, 3 Aug to 23 Oct 2026), fees, payments (receipts), resources, assignments, submissions, quizzes, quiz_attempts, discussion_threads, discussion_replies, problems, feedback, notifications, holidays.

## Rules inside the data
- Grading: O>=90 (10), A+>=80 (9), A>=70 (8), B+>=60 (7), B>=50 (6), C>=45 (5), P>=40 (4), F (0). Fail if exam < 24/60 or total < 40.
- Marks: internal /20, midsem /20, exam /60. Current-semester exam marks are Pending (null).
- SGPA is credit weighted. CGPA is cumulative; a cleared backlog counts as P (4).
- Attendance threshold used by the app: 75%.
- About 60% good, 25% average, 15% at-risk students, with attendance and marks correlated plus noise. Some at-risk students show a falling attendance trend (useful for Round 2 engagement-drop prediction).

## Not included (seeder should generate if needed)
Quiz questions, coursework units/topics, actual files for resources.
