export const calculateAtsScore = (resumeData) => {
    let score = 0;
    const improvements = [];

    // +10 if name provided
    if (resumeData.personalInfo.name && resumeData.personalInfo.name.trim() !== '') {
        score += 10;
    } else {
        improvements.push("Add a full name (+10 points)");
    }

    // +10 if email provided
    if (resumeData.personalInfo.email && resumeData.personalInfo.email.trim() !== '') {
        score += 10;
    } else {
        improvements.push("Add a professional email (+10 points)");
    }

    // +10 if summary > 50 chars
    if (resumeData.summary && resumeData.summary.trim().length > 50) {
        score += 10;
    } else {
        improvements.push("Add a professional summary > 50 chars (+10 points)");
    }

    // +15 if at least 1 experience entry with bullets
    if (resumeData.experience && resumeData.experience.some(e => e.description && e.description.trim() !== '')) {
        score += 15;
    } else {
        improvements.push("Add an experience entry with bullets (+15 points)");
    }

    // +10 if at least 1 education entry
    if (resumeData.education && resumeData.education.length > 0) {
        score += 10;
    } else {
        improvements.push("Add your education history (+10 points)");
    }

    // +10 if at least 5 skills added
    const totalSkills = (resumeData.skills?.technical?.length || 0) +
        (resumeData.skills?.soft?.length || 0) +
        (resumeData.skills?.tools?.length || 0);
    if (totalSkills >= 5) {
        score += 10;
    } else {
        improvements.push("Add at least 5 skills (+10 points)");
    }

    // +10 if at least 1 project added
    if (resumeData.projects && resumeData.projects.length > 0) {
        score += 10;
    } else {
        improvements.push("Add at least one project (+10 points)");
    }

    // +5 if phone provided
    if (resumeData.personalInfo.phone && resumeData.personalInfo.phone.trim() !== '') {
        score += 5;
    } else {
        improvements.push("Add a phone number (+5 points)");
    }

    // +5 if LinkedIn provided
    if (resumeData.links && resumeData.links.linkedin && resumeData.links.linkedin.trim() !== '') {
        score += 5;
    } else {
        improvements.push("Add your LinkedIn profile (+5 points)");
    }

    // +5 if GitHub provided
    if (resumeData.links && resumeData.links.github && resumeData.links.github.trim() !== '') {
        score += 5;
    } else {
        improvements.push("Add your GitHub profile (+5 points)");
    }

    // +10 if summary contains action verbs
    const actionVerbs = /built|led|designed|improved|created|optimized|automated|developed|implemented/i;
    if (resumeData.summary && actionVerbs.test(resumeData.summary.trim())) {
        score += 10;
    } else {
        improvements.push("Use action verbs in your summary (built, led, etc.) (+10 points)");
    }

    return { score, improvements };
};
