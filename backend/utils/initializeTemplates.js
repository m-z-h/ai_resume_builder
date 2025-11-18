import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Template from '../models/Template.js';
import connectDB from '../config/db.js';

dotenv.config();

// Connect to database
await connectDB();

// Create a default admin user ID (in a real app, you would retrieve this from the database)
const defaultAdminId = new mongoose.Types.ObjectId();

const sampleTemplates = [
  {
    name: 'Professional',
    description: 'A clean, professional template perfect for most industries',
    category: 'General',
    tags: ['professional', 'clean', 'ATS-friendly'],
    isAtsFriendly: true,
    isFree: true,
    createdBy: defaultAdminId,
    htmlStructure: `
      <div class="resume-container">
        <header class="header">
          <h1 class="name">{{personalInfo.firstName}} {{personalInfo.lastName}}</h1>
          <div class="contact-info">
            <p>{{personalInfo.email}} | {{personalInfo.phone}}</p>
            <p>{{personalInfo.address}} | {{personalInfo.linkedin}}</p>
          </div>
        </header>
        
        <section class="summary">
          <h2>Professional Summary</h2>
          <p>{{personalInfo.summary}}</p>
        </section>
        
        <section class="experience">
          <h2>Work Experience</h2>
          {{#each experience}}
          <div class="job">
            <h3>{{this.position}} - {{this.company}}</h3>
            <p class="date">{{formatDate this.startDate}} - {{#if this.isCurrent}}Present{{else}}{{formatDate this.endDate}}{{/if}}</p>
            <p>{{this.description}}</p>
            <ul>
              {{#each this.achievements}}
              <li>{{this}}</li>
              {{/each}}
            </ul>
          </div>
          {{/each}}
        </section>
        
        <section class="education">
          <h2>Education</h2>
          {{#each education}}
          <div class="degree">
            <h3>{{this.degree}} - {{this.institution}}</h3>
            <p class="date">{{formatDate this.startDate}} - {{formatDate this.endDate}}</p>
            <p>{{this.description}}</p>
          </div>
          {{/each}}
        </section>
        
        <section class="skills">
          <h2>Skills</h2>
          <ul>
            {{#each skills}}
            <li>{{this.name}} ({{this.level}})</li>
            {{/each}}
          </ul>
        </section>
      </div>
    `,
    cssStyles: `
      .resume-container {
        font-family: Arial, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      
      .header {
        text-align: center;
        border-bottom: 2px solid #333;
        padding-bottom: 10px;
        margin-bottom: 20px;
      }
      
      .name {
        font-size: 24px;
        margin: 0 0 10px 0;
      }
      
      .contact-info {
        font-size: 14px;
      }
      
      h2 {
        font-size: 18px;
        border-bottom: 1px solid #ccc;
        padding-bottom: 5px;
        margin: 20px 0 10px 0;
      }
      
      .job, .degree {
        margin-bottom: 15px;
      }
      
      .job h3, .degree h3 {
        font-size: 16px;
        margin: 0 0 5px 0;
      }
      
      .date {
        font-style: italic;
        color: #666;
        font-size: 14px;
        margin: 0 0 10px 0;
      }
      
      ul {
        margin: 10px 0;
        padding-left: 20px;
      }
      
      li {
        margin-bottom: 5px;
      }
    `,
    customizableOptions: {
      fonts: [
        { name: 'Font Family', value: 'Arial, sans-serif' }
      ],
      colors: {
        primary: '#333333',
        secondary: '#666666',
        accent: '#000000'
      },
      spacing: {
        sectionPadding: '20px',
        lineHeight: '1.5'
      }
    },
    allowedRoles: []
  },
  {
    name: 'Modern',
    description: 'A contemporary design with clean lines and modern styling',
    category: 'Creative',
    tags: ['modern', 'creative', 'design'],
    isAtsFriendly: true,
    isFree: false,
    price: 9.99,
    createdBy: defaultAdminId,
    htmlStructure: `
      <div class="resume-container">
        <header class="header">
          <div class="name-section">
            <h1 class="name">{{personalInfo.firstName}} {{personalInfo.lastName}}</h1>
            <div class="title">{{personalInfo.title}}</div>
          </div>
          <div class="contact-section">
            <div class="contact-item">
              <span class="label">Email:</span>
              <span class="value">{{personalInfo.email}}</span>
            </div>
            <div class="contact-item">
              <span class="label">Phone:</span>
              <span class="value">{{personalInfo.phone}}</span>
            </div>
            <div class="contact-item">
              <span class="label">LinkedIn:</span>
              <span class="value">{{personalInfo.linkedin}}</span>
            </div>
          </div>
        </header>
        
        <div class="content">
          <section class="summary">
            <h2 class="section-title">Summary</h2>
            <p>{{personalInfo.summary}}</p>
          </section>
          
          <div class="two-column">
            <div class="column">
              <section class="experience">
                <h2 class="section-title">Experience</h2>
                {{#each experience}}
                <div class="job">
                  <h3>{{this.position}}</h3>
                  <div class="company">{{this.company}}</div>
                  <div class="date">{{formatDate this.startDate}} - {{#if this.isCurrent}}Present{{else}}{{formatDate this.endDate}}{{/if}}</div>
                  <p>{{this.description}}</p>
                  <ul>
                    {{#each this.achievements}}
                    <li>{{this}}</li>
                    {{/each}}
                  </ul>
                </div>
                {{/each}}
              </section>
            </div>
            
            <div class="column">
              <section class="skills">
                <h2 class="section-title">Skills</h2>
                <ul>
                  {{#each skills}}
                  <li>{{this.name}} ({{this.level}})</li>
                  {{/each}}
                </ul>
              </section>
              
              <section class="education">
                <h2 class="section-title">Education</h2>
                {{#each education}}
                <div class="degree">
                  <h3>{{this.degree}}</h3>
                  <div class="institution">{{this.institution}}</div>
                  <div class="date">{{formatDate this.startDate}} - {{formatDate this.endDate}}</div>
                  <p>{{this.description}}</p>
                </div>
                {{/each}}
              </section>
            </div>
          </div>
        </div>
      </div>
    `,
    cssStyles: `
      .resume-container {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        max-width: 900px;
        margin: 0 auto;
        padding: 30px;
      }
      
      .header {
        display: flex;
        justify-content: space-between;
        border-bottom: 3px solid #2c3e50;
        padding-bottom: 20px;
        margin-bottom: 30px;
      }
      
      .name {
        font-size: 32px;
        margin: 0 0 5px 0;
        color: #2c3e50;
      }
      
      .title {
        font-size: 18px;
        color: #7f8c8d;
        font-weight: normal;
      }
      
      .contact-section {
        text-align: right;
      }
      
      .contact-item {
        margin-bottom: 8px;
      }
      
      .label {
        font-weight: bold;
        color: #2c3e50;
      }
      
      .section-title {
        font-size: 20px;
        color: #2c3e50;
        border-bottom: 2px solid #3498db;
        padding-bottom: 5px;
        margin: 0 0 15px 0;
      }
      
      .two-column {
        display: flex;
        gap: 30px;
      }
      
      .column {
        flex: 1;
      }
      
      .job, .degree {
        margin-bottom: 20px;
      }
      
      .job h3, .degree h3 {
        font-size: 18px;
        margin: 0 0 5px 0;
        color: #34495e;
      }
      
      .company, .institution {
        font-weight: bold;
        color: #7f8c8d;
      }
      
      .date {
        font-style: italic;
        color: #95a5a6;
        font-size: 14px;
        margin: 0 0 10px 0;
      }
      
      ul {
        margin: 10px 0;
        padding-left: 20px;
      }
      
      li {
        margin-bottom: 5px;
      }
    `,
    customizableOptions: {
      fonts: [
        { name: 'Font Family', value: "'Helvetica Neue', Helvetica, Arial, sans-serif" }
      ],
      colors: {
        primary: '#2c3e50',
        secondary: '#7f8c8d',
        accent: '#3498db'
      },
      spacing: {
        sectionPadding: '30px',
        lineHeight: '1.6'
      }
    },
    allowedRoles: []
  }
];

const importData = async () => {
  try {
    await Template.deleteMany();
    
    const createdTemplates = await Template.insertMany(sampleTemplates);
    
    console.log('Templates imported successfully!');
    console.log(`Created ${createdTemplates.length} templates`);
    
    process.exit();
  } catch (error) {
    console.error('Error importing templates:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Template.deleteMany();
    
    console.log('Templates destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error destroying templates:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  await destroyData();
} else {
  await importData();
}