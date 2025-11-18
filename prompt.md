FINAL PROJECT SPECIFICATION — AI Resume Builder Platform (MERN Stack)

With Public Pages + User Panel + Admin Panel + Role-Based Navigation + ATS Tools

This is the full and final prompt for developing the AI Resume Builder System.

1. PROJECT OVERVIEW

Build a full MERN-based AI Resume Builder Web Application including:

1. Public Website

Home, About, Contact, Login, Signup

2. User Panel

AI Resume Builder, ATS Score Checker, Templates, Download System, Role-Based Improvements

3. Admin Panel

User Management, Feature Controls, Template Management, Analytics, Contact Form Management

Admins and Users must have completely separate dashboards and navigation bars.
After login, each should be redirected to the correct panel automatically.

Admins are not allowed to sign up publicly — they are created manually by developer/super admin.

2. PUBLIC WEBSITE (Pre-Login Pages)
A. Home Page

Hero section with platform introduction.

Highlights of features:

AI Resume Builder

ATS Score Checker

Resume Templates

AI Content Improvement

Export Options (PDF/ODF)

Call-to-Action buttons:

Login

Signup

Create Resume

B. About Page

Description of platform mission.

Benefits of AI-generated resumes.

Explanation of ATS (Applicant Tracking System).

How the platform improves job success rates.

C. Contact Page

Contact form with:

Name

Email

Message

All submissions must be stored for admin review.

Dedicated support email also shown.

D. Login Page

Login using email + password.

Single login portal for:

Users

Admins

After login → system checks role and redirects to:

User Dashboard (if user)

Admin Dashboard (if admin)

E. Signup Page (Users Only)

Fields: Name, Email, Password

Creates only User accounts

Admin accounts cannot be created from here.

3. ROLE-BASED LOGIN REDIRECTION

After login:

User → User Panel Dashboard

Admin → Admin Panel Dashboard

Ensures correct access control and prevents cross-panel access.

4. ROLE-SPECIFIC NAVIGATION BARS
A. Public Navbar (Before Login)

Visible on Home / About / Contact / Login / Signup
Includes:

Home

About

Contact

Login

Signup

B. User Navbar (After Login as User)

Includes:

Dashboard

Resume Builder

ATS Score Checker

Templates

AI Tools

My Downloads

Profile

Logout

C. Admin Navbar (After Login as Admin)

Includes:

Dashboard

User Management

Resume Management

Template Management

Feature Control

Contact Messages

Analytics

Logout

Each navbar must be isolated to its own role-specific panel.

5. LOGOUT FEATURE

Both Admin and User navbar must contain a Logout button that:

Clears authentication tokens

Prevents access to dashboards after logout

Redirects back to the Home Page

6. USER PANEL FEATURES (Registered Users)
A. User Dashboard

Displays:

Total resumes created

Recent resumes

ATS score summary/history

Notifications

B. Resume Builder

User can:

Create resume from scratch or with AI assistance

Edit and customize sections

Add/remove sections

Drag & drop reorder

Control:

Fonts

Colors

Margins/spacing

Layout styles

Save multiple versions of resumes

Supported Resume Sections:

Personal Details

Summary

Education

Experience

Projects

Skills

Achievements

Certifications

Languages

Custom Sections

C. AI Tools

User can:

Auto-generate complete resume

Rewrite any section

Improve weak paragraphs

Insert job-specific keywords

Make content ATS-friendly

Fix grammar + clarity

Rewrite for:

Specific job role

Specific job description

Enhance metrics and action verbs

D. ATS Score Checker

Provides:

Total ATS Score (0–100)

Keyword match analysis

Skill relevance

Formatting problems

Weak content warnings

Missing sections

Readability issues

Also gives:

Detailed improvement suggestions

Option: Auto-Improve Resume with AI

E. Templates & Customization

Users can:

Choose from multiple ATS-friendly templates

Preview templates

Customize style

Apply themes and colors

F. Download Options

User can download resume in:

PDF

ODF (.odt)

Optional DOCX support

Exports must preserve:

Layout

Styling

ATS compatibility

G. Role-Specific ATS Tools

Enhancements based on role:

Fresher

Student

Developer

Designer

Manager

Experienced Professional

Each role receives:

Role-targeted keywords

Tailored ATS scoring logic

Matching suggestions

7. ADMIN PANEL FEATURES (Admins Only)
A. Admin Dashboard

Shows metrics:

Total users

Total resumes

Monthly usage trends

ATS score checks

AI tool usage

Template usage statistics

Contact form messages

B. User Management

Admin can:

View all users

Block/unblock users

Activate/deactivate accounts

Delete accounts

View user activity summary

C. Feature Control

Admin can enable/disable:

AI Resume Generator

AI Improver Tools

ATS Score Checker

Templates

Download Formats

Custom Sections

Role-Specific ATS Scoring

Any major platform feature

Allows complete platform control.

D. Resume Management

Admin can:

View all generated resumes

Delete resumes

Restrict downloads for specific users

E. Template Management

Admin can:

Add templates

Remove templates

Activate/deactivate templates

Assign templates to specific user roles

F. Contact Form Management

Admin can view:

Name

Email

Message

Submission time

Admin can:

Delete message

Mark as resolved

G. Analytics

Admin can analyze:

User growth trends

Resume creation stats

ATS checks

Most used templates

Popular job roles

AI usage metrics

8. SYSTEM REQUIREMENTS

Clean, modern, responsive UI/UX

Smooth real-time resume editing

Accurate ATS scoring and AI improvements

Pixel-perfect download formats

Secure authentication

Strict role-based access control

Optimized performance with scalable MERN structure

9. FINAL DELIVERABLE (COMPLETE PLATFORM)
Public Pages

Home

About

Contact

Login

Signup

User Panel

User Dashboard

Resume Builder

AI Tools

Templates

ATS Checker

Downloads

Profile

User Navbar (with Logout)

Admin Panel

Admin Dashboard

User Management

Resume Management

Template Management

Feature Controls

Contact Messages

Analytics

Admin Navbar (with Logout)
