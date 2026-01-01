/**
 * Sample Job Descriptions for RedFlag.buzz
 * Each JD is designed to contain multiple red flags for demonstration purposes
 */

export interface SampleJobDescription {
  id: number;
  title: string;
  company: string;
  description: string;
  redFlags: string[]; // List of red flags contained in this JD
  expectedScore: number; // Expected risk score (0-100, lower = more risky)
}

export const sampleJobDescriptions: SampleJobDescription[] = [
  {
    id: 1,
    title: "Senior Software Engineer - Fast-Paced Startup",
    company: "HyperGrowth Tech Inc.",
    description: `Senior Software Engineer - Fast-Paced Startup

We're looking for a rockstar Senior Software Engineer to join our dynamic, fast-paced team! This is a unique opportunity to wear multiple hats and make a real impact.

What You'll Do:
• Work in a fast-paced, agile environment with tight deadlines
• Be a self-starter who can work independently with minimal supervision
• Join our "work hard, play hard" culture with occasional weekend work during crunch times
• Take ownership of critical features and be accountable for their success
• Collaborate with cross-functional teams in a high-pressure environment

Requirements:
• 5+ years of experience in software development
• Ability to thrive in ambiguity and rapidly changing priorities
• Willingness to go above and beyond when needed
• Strong problem-solving skills and ability to work under pressure
• Excellent communication skills for our high-frequency sync meetings

What We Offer:
• Competitive salary (details upon request)
• "Unlimited" PTO (subject to manager approval and project deadlines)
• Stock options that could be worth millions if we succeed
• Opportunity for rapid career growth in a flat organization
• Free snacks and a fun office environment

Join us and be part of something amazing! We're not just building software, we're changing the world.`,
    redFlags: [
      "Rockstar/ninja/guru terminology",
      "Fast-paced environment (often means overwork)",
      "Wear multiple hats (unclear responsibilities)",
      "Work hard, play hard culture (potential burnout)",
      "Occasional weekend work (poor work-life balance)",
      "Competitive salary (vague compensation)",
      "Unlimited PTO with restrictions (often unused)",
      "Stock options (high risk, low guarantee)"
    ],
    expectedScore: 35
  },
  {
    id: 2,
    title: "Digital Marketing Manager",
    company: "SocialBuzz Marketing Agency",
    description: `Digital Marketing Manager - SocialBuzz Marketing Agency

We need a Digital Marketing Manager who lives and breathes social media! This role requires someone who is always "on" and ready to engage with our audience 24/7.

Responsibilities:
• Manage all social media channels with real-time engagement
• Be available for after-hours and weekend posting when trends emerge
• Create viral content that drives massive engagement
• Work closely with our "family-like" team (we spend more time together than with actual family)
• Handle client communications across multiple time zones

Requirements:
• Must have 3+ years of social media management experience
• Willingness to be "always on" and responsive to notifications
• Ability to work flexible hours including evenings and weekends
• Strong multitasking skills (you'll be managing 10+ accounts simultaneously)
• Passion for going viral and creating trending content

Perks:
• "Flexible" working hours (you choose when to work your 60 hours/week)
• Performance-based bonuses (top 10% performers only)
• Exposure to high-profile clients
• Monthly team bonding events (mandatory attendance)
• Opportunity to build your personal brand

If you're ready to hustle and grind, apply now!`,
    redFlags: [
      "Always on/24-7 availability expectation",
      "After-hours and weekend work required",
      "Family-like team (blurred work-life boundaries)",
      "Flexible hours meaning long hours",
      "Performance-based bonuses for top performers only",
      "Mandatory team bonding events",
      "Hustle and grind culture"
    ],
    expectedScore: 25
  },
  {
    id: 3,
    title: "Customer Success Specialist",
    company: "SaaS Solutions Co.",
    description: `Customer Success Specialist - SaaS Solutions Co.

Join our customer success team and help our clients achieve their dreams! We're looking for someone with boundless energy and unlimited patience.

Key Responsibilities:
• Handle 50+ customer accounts simultaneously
• Maintain 95%+ customer satisfaction scores
• Work in our open office environment (collaboration is key!)
• Participate in daily stand-ups and weekly retrospectives
• Be the "face" of our company to all clients

What We're Looking For:
• 2+ years in customer service or success roles
• Exceptional emotional intelligence and empathy
• Ability to handle difficult conversations with grace
• Willingness to take on additional responsibilities as needed
• Positive attitude even in challenging situations

Benefits:
• Base salary plus uncapped commission (earn what you're worth!)
• Comprehensive health benefits (after 90-day probation)
• Professional development opportunities
• Dynamic work environment with ping pong and foosball
• Quarterly team offsites (work hard, play harder!)

Ready to make an impact? We'd love to hear from you!`,
    redFlags: [
      "Unrealistic workload (50+ accounts)",
      "High performance metrics (95%+ satisfaction)",
      "Open office environment (lack of privacy)",
      "Additional responsibilities as needed (scope creep)",
      "Uncapped commission (pressure to perform)",
      "Benefits after probation period",
      "Work hard, play harder culture"
    ],
    expectedScore: 40
  },
  {
    id: 4,
    title: "Sales Development Representative",
    company: "Revenue Rocket Inc.",
    description: `Sales Development Representative - Revenue Rocket Inc.

We're hunting for hungry SDRs who want to crush their quotas and earn big! This is a ground-floor opportunity at a rapidly scaling startup.

The Role:
• Make 100+ cold calls daily to generate qualified leads
• Hit monthly quotas that increase by 20% each quarter
• Work in our competitive, metrics-driven sales floor
• Participate in daily "pump-up" meetings at 8 AM sharp
• Learn from our top performers (they make 6 figures!)

Requirements:
• No experience required (we'll train the right attitude!)
• Competitive nature and desire to win
• Resilience in the face of rejection
• Willingness to work early/late hours to hit targets
• Track record of achievement (sports, academics, etc.)

Compensation:
• Base salary: $40,000
• OTE: $80,000+ (top performers earn $100k+)
• Spiffs and contests for top performers
• Accelerators for overachievement
• President's Club trip for #1 performer

If you're ready to grind, grow, and get rich, apply today!`,
    redFlags: [
      "Extreme cold calling requirements (100+ daily)",
      "Increasing quotas (20% quarterly increase)",
      "Metrics-driven with high pressure",
      "Early mandatory meetings",
      "Low base salary with unrealistic OTE",
      "Competitive environment fostering toxicity",
      "Get rich quick promises"
    ],
    expectedScore: 20
  },
  {
    id: 5,
    title: "Content Creator & Community Manager",
    company: "GenZ Media Collective",
    description: `Content Creator & Community Manager - GenZ Media Collective

We're a hip, young media company looking for someone who gets "it" - you know, the vibe. This role is perfect for someone who's always online and understands internet culture.

What You'll Do:
• Create 5+ pieces of content daily across all platforms
• Engage with our community 24/7 (DMs, comments, etc.)
• Stay on top of trends and pivot content strategy instantly
• Work remotely but be available for impromptu Zoom calls
• Build authentic connections with our audience

We Need Someone Who:
• Lives on TikTok, Instagram, and Twitter/X
• Has a "personal brand" or wants to build one
• Is comfortable being on camera and sharing personal stories
• Can work independently with little direction
• Understands that sometimes work = life

What You Get:
• "Influencer" level exposure and networking
• Creative freedom (within brand guidelines)
• Flexible schedule (create content whenever inspiration strikes!)
• Product samples and brand partnerships
• Opportunity to grow with us as we explode

Sound like you? Slide into our DMs with your portfolio!`,
    redFlags: [
      "Unrealistic content output (5+ pieces daily)",
      "24/7 community engagement expectation",
      "Impromptu availability required",
      "Work = life mentality",
      "Vague compensation structure",
      "Personal brand exploitation",
      "Informal application process"
    ],
    expectedScore: 45
  }
];

/**
 * Get a random sample job description
 */
export function getRandomSampleJD(): SampleJobDescription {
  const randomIndex = Math.floor(Math.random() * sampleJobDescriptions.length);
  return sampleJobDescriptions[randomIndex];
}

/**
 * Get a specific sample job description by ID
 */
export function getSampleJDById(id: number): SampleJobDescription | undefined {
  return sampleJobDescriptions.find(jd => jd.id === id);
}