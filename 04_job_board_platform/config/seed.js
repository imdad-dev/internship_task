require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const Employer = require("../models/Employer");
const Candidate = require("../models/Candidate");
const JobListing = require("../models/JobListing");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB for seeding...");

  // ---------- Admin ----------
  const existingAdmin = await Admin.findOne({ username: process.env.ADMIN_USERNAME || "admin" });
  if (!existingAdmin) {
    await Admin.create({
      name: "Platform Admin",
      username: process.env.ADMIN_USERNAME || "admin",
      email: process.env.ADMIN_EMAIL || "admin@jobboard.com",
      password: process.env.ADMIN_PASSWORD || "admin123",
    });
    console.log("✅ Default admin created (see .env for credentials)");
  } else {
    console.log("ℹ️  Admin already exists, skipping");
  }

  // ---------- Employers ----------
  let employers = await Employer.find();
  if (employers.length === 0) {
    employers = await Employer.insertMany([
      {
        companyName: "Nimbus Cloud Systems",
        contactName: "Ananya Rao",
        email: "hr@nimbuscloud.example",
        password: "password123",
        industry: "Cloud Infrastructure",
        website: "https://nimbuscloud.example",
        about: "Building resilient cloud infrastructure tools for fast-growing engineering teams.",
        logoLetter: "N",
      },
      {
        companyName: "Pixel & Pine Studio",
        contactName: "Karan Mehta",
        email: "careers@pixelpine.example",
        password: "password123",
        industry: "Design",
        website: "https://pixelpine.example",
        about: "A product design studio partnering with startups to ship thoughtful interfaces.",
        logoLetter: "P",
      },
      {
        companyName: "Fernbank Analytics",
        contactName: "Sara Ahmed",
        email: "jobs@fernbank.example",
        password: "password123",
        industry: "Data & Analytics",
        website: "https://fernbank.example",
        about: "Turning messy data into decisions for retail and logistics clients worldwide.",
        logoLetter: "F",
      },
    ]);
    console.log("✅ 3 sample employers created (password123 for all)");
  }

  // ---------- Candidates ----------
  let candidates = await Candidate.find();
  if (candidates.length === 0) {
    candidates = await Candidate.insertMany([
      {
        name: "Rhea Kapoor",
        email: "rhea.kapoor@example.com",
        password: "password123",
        headline: "Frontend Developer",
        skills: ["React", "JavaScript", "CSS", "TypeScript"],
        location: "Bangalore, India",
        experienceYears: 2,
      },
      {
        name: "Devansh Iyer",
        email: "devansh.iyer@example.com",
        password: "password123",
        headline: "Backend Engineer",
        skills: ["Node.js", "MongoDB", "Express", "Docker"],
        location: "Pune, India",
        experienceYears: 3,
      },
    ]);
    console.log("✅ 2 sample candidates created (password123 for all)");
  }

  // ---------- Job Listings ----------
  const jobCount = await JobListing.countDocuments();
  if (jobCount === 0) {
    await JobListing.insertMany([
      {
        employer: employers[0]._id,
        title: "Backend Engineer (Node.js)",
        description: "Design and maintain APIs powering our cloud orchestration dashboard. Work closely with SRE on reliability and scale.",
        requirements: "2+ years with Node.js/Express, comfortable with MongoDB or SQL, understanding of REST API design.",
        category: "Engineering",
        jobType: "Full-Time",
        location: "Bangalore, India (Hybrid)",
        salaryMin: 800000,
        salaryMax: 1400000,
        skillsRequired: ["Node.js", "Express", "MongoDB", "REST APIs"],
      },
      {
        employer: employers[0]._id,
        title: "DevOps Intern",
        description: "Support our infra team with CI/CD pipeline improvements and monitoring dashboards.",
        requirements: "Basic Linux knowledge, familiarity with Docker, currently pursuing a CS degree.",
        category: "Engineering",
        jobType: "Internship",
        location: "Remote",
        salaryMin: 15000,
        salaryMax: 25000,
        skillsRequired: ["Linux", "Docker", "CI/CD"],
      },
      {
        employer: employers[1]._id,
        title: "Product Designer",
        description: "Own end-to-end design for our client projects, from wireframes to polished, animated prototypes.",
        requirements: "Portfolio showing shipped product work, strong Figma skills, comfortable presenting to clients.",
        category: "Design",
        jobType: "Full-Time",
        location: "Remote",
        salaryMin: 700000,
        salaryMax: 1100000,
        skillsRequired: ["Figma", "UI Design", "Prototyping"],
      },
      {
        employer: employers[1]._id,
        title: "UX Research Contractor",
        description: "Run user interviews and usability tests for a 3-month engagement with one of our fintech clients.",
        requirements: "Experience moderating research sessions, comfortable synthesizing findings into actionable reports.",
        category: "Design",
        jobType: "Contract",
        location: "Remote",
        salaryMin: 60000,
        salaryMax: 90000,
        skillsRequired: ["User Research", "Usability Testing"],
      },
      {
        employer: employers[2]._id,
        title: "Data Analyst",
        description: "Build dashboards and forecasting models for retail clients using our internal analytics platform.",
        requirements: "SQL proficiency, experience with BI tools, strong communication for client-facing reports.",
        category: "Engineering",
        jobType: "Full-Time",
        location: "Pune, India",
        salaryMin: 600000,
        salaryMax: 950000,
        skillsRequired: ["SQL", "Python", "Data Visualization"],
      },
      {
        employer: employers[2]._id,
        title: "Marketing Associate",
        description: "Own content calendar and campaign reporting across our social and email channels.",
        requirements: "1+ years in a marketing role, comfortable with analytics tools, strong writing skills.",
        category: "Marketing",
        jobType: "Part-Time",
        location: "Remote",
        salaryMin: 300000,
        salaryMax: 450000,
        skillsRequired: ["Content Marketing", "Analytics", "Copywriting"],
      },
    ]);
    console.log("✅ 6 sample job listings created");
  }

  console.log("🌱 Seeding complete!");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
