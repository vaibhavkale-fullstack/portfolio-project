const dashboardModel = require('../models/dashboard.model');

exports.calculateProfileStrength = async (userId) => {

  const profile = await dashboardModel.getProfileByUserId(userId);
  const education = await dashboardModel.getEducationCount(userId);
  const experience = await dashboardModel.getExperienceCount(userId);
  const project = await dashboardModel.getProjectCount(userId);

  let totalSections = 4;
  let completed = [];
  let missing = [];


  // PROFILE CHECK
  if (profile && profile.full_name && profile.bio && profile.title && profile.resume
     && profile.profile_image && profile.city && profile.email && 
     profile.phone && profile.website && profile.linkedin && profile.github)
  {
    completed.push({ key: "profile", label: "Profile Completed" });
  } else {
    missing.push({ key: "profile", label: "Complete Profile" });
  }
//console.log(profile.profile_image, missing,completed.length);


  // EDUCATION CHECK
  if (education && education.degree && education.field_of_study && education.institution
    && education.start_year && education.grade && education.status &&
    education.description) 
  {
    completed.push({ key: "education", label: "Education Added" });
  } else {
    missing.push({ key: "education", label: "Add Education" });
  }
//console.log("education", education.degree, completed.length);


  // EXPERIENCE CHECK
  if (experience && experience.company_name && experience.role && experience.employment_type
    && experience.start_date && experience.description && experience.tech_stack
    && experience.location)
  {
    completed.push({ key: "experience", label: "Experience Added" });
  } else {
    missing.push({ key: "experience", label: "Add Experience" });
  }

  // PROJECT CHECK
  if (project &&  project.title && project.short_description && project.description
    && project.tech_stack && project.github_url && project.live_url
    && project.project_type && project.status)
  {
    completed.push({ key: "projects", label: "Projects Added" });
  } else {
    missing.push({ key: "projects", label: "Add Project" });
  }

  const strength = Math.round((completed.length / totalSections) * 100);
//console.log(strength);

  return {
    strength,
    completed,
    missing
  };
};

//-------------------------------------------------------------------------

exports.getProfileViewsStats = async (userId) => {
//console.log("profileviews",userId);

  const totalViews = await dashboardModel.getTotalProfileViews(userId);
  const weeklyViews = await dashboardModel.getWeeklyProfileViews(userId);

  let percentageIncrease = 0;

  if (totalViews > 0) {
    percentageIncrease = Math.round((weeklyViews / totalViews) * 100);
  }

  return {
    totalViews,
    percentageIncrease
  };
};

//-------------- profile visitors----------------------------


// 1️⃣ Get user by username
exports.getUserByUsername = async (username) => {
  return await dashboardModel.findUserByUsername(username);
};


// 2️⃣ Get profile by user id
exports.getProfileByUserId = async (userId) => {
  return await dashboardModel.findProfileByUserId(userId);
};


// 3️⃣ Record profile view (with 5 min duplicate prevention)
exports.recordProfileView = async (userId, ip, userAgent) => {

  // 🔥 Check if same IP already viewed in last 5 minutes
  const recentView = await dashboardModel.checkRecentView(userId, ip);

  if (!recentView) {
    await dashboardModel.insertProfileView(userId, ip, userAgent);
  }

};

//--------------------------------------------------------------

exports.getRecruiterMessageStats = async (userId) => {

  const totalMessages = await dashboardModel.getTotalMessages(userId);
  const unreadMessages = await dashboardModel.getUnreadMessages(userId);

  return {
    totalMessages,
    unreadMessages
  };
};

//----------------------------------------------------------------

exports.markMessageAsRead = async(messageId) => {

    return await dashboardModel.markMessageAsRead(messageId);

};
