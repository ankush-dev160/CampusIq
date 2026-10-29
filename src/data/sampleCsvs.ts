// Downloadable CSV Templates and Sample Datasets

export const CSV_TEMPLATES: Record<string, { filename: string; template: string; sample: string }> = {
  academic: {
    filename: 'campusiq_academic_template.csv',
    template: 'student_id,cgpa,internal_marks,backlogs\n',
    sample: `student_id,cgpa,internal_marks,backlogs
CIQ-CS-022,7.85,82,0
CIQ-CS-001,8.95,92,0
CIQ-CS-002,7.20,68,1
CIQ-IT-003,5.40,44,2
CIQ-EC-004,8.10,85,0
CIQ-ME-005,6.15,55,1
`,
  },
  attendance: {
    filename: 'campusiq_attendance_template.csv',
    template: 'student_id,overall_attendance\n',
    sample: `student_id,overall_attendance
CIQ-CS-022,82.0
CIQ-CS-001,94.5
CIQ-CS-002,78.0
CIQ-IT-003,58.2
CIQ-EC-004,89.0
CIQ-ME-005,64.0
`,
  },
  lms: {
    filename: 'campusiq_lms_template.csv',
    template: 'student_id,lms_logins,assignment_completion\n',
    sample: `student_id,lms_logins,assignment_completion
CIQ-CS-022,26,88
CIQ-CS-001,35,95
CIQ-CS-002,18,75
CIQ-IT-003,6,42
CIQ-EC-004,28,90
CIQ-ME-005,8,48
`,
  },
  placement: {
    filename: 'campusiq_placement_template.csv',
    template: 'student_id,aptitude_score,coding_score,mock_interview_score,placement_preparation_participation\n',
    sample: `student_id,aptitude_score,coding_score,mock_interview_score,placement_preparation_participation
CIQ-CS-022,78,75,80,true
CIQ-CS-001,88,92,85,true
CIQ-CS-002,62,58,65,true
CIQ-IT-003,45,38,50,false
CIQ-EC-004,78,74,80,true
CIQ-ME-005,52,48,55,false
`,
  },
  skills: {
    filename: 'campusiq_skills_template.csv',
    template: 'student_id,technical_skill_score,soft_skill_score\n',
    sample: `student_id,technical_skill_score,soft_skill_score
CIQ-CS-022,82,79
CIQ-CS-001,90,85
CIQ-CS-002,65,70
CIQ-IT-003,48,55
CIQ-EC-004,82,80
CIQ-ME-005,58,62
`,
  },
  engagement: {
    filename: 'campusiq_engagement_template.csv',
    template: 'student_id,events_participated,club_participation,hackathons,certifications\n',
    sample: `student_id,events_participated,club_participation,hackathons,certifications
CIQ-CS-022,3,2,2,2
CIQ-CS-001,3,2,2,3
CIQ-CS-002,1,1,0,1
CIQ-IT-003,0,0,0,0
CIQ-EC-004,2,1,1,2
CIQ-ME-005,1,0,0,1
`,
  },
  feedback: {
    filename: 'campusiq_feedback_template.csv',
    template: 'student_id,student_satisfaction,faculty_feedback\n',
    sample: `student_id,student_satisfaction,faculty_feedback
CIQ-CS-022,4.5,Consistently Strong
CIQ-CS-001,4.8,Excellent
CIQ-CS-002,3.8,Good
CIQ-IT-003,2.5,Needs Attention
CIQ-EC-004,4.2,Good
CIQ-ME-005,3.0,Average
`,
  },
};
