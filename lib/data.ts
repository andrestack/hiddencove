// export const clientOnboardingQuestions = {
//   appearanceAndStylePreferences: [
//     "What are you not liking about your current hair?",
//     "What are you liking?",
//     "What is the priority to achieve today?",
//     "When your hair is out, what is important to you?",
//     "When it's up, what is important to you?",
//     "What is the feeling or vibe you want for today?",
//     "Are you happy with your current hairstyle?",
//     "Interested in trying a new hair color or style?",
//     "If you could have your dream hair today, what would that look like?",
//     "Do you have any pictures of colours that you like?",
//     "What do you like about this photo?",
//     "What don't you like about this picture?",
//   ],
//   routineAndCare: [
//     "What's your current hair care routine?",
//     "What is your home care routine like?",
//     "How has your current shampoo and conditioner been feeling on your scalp?",
//     "Are you using salon quality hair care?",
//     "Are you using tank water?",
//     "How much time do you typically spend on styling your hair?",
//     "How much time will you dedicate to the tone of your hair?",
//     "How much time will you allow to your hair styling?",
//   ],
//   goalsAndConcerns: [
//     "Any specific hair concerns or issues?",
//     "What are your long-term hair goals?",
//     "Do you have a budget in mind?",
//     "Would you like to take a slower approach and build towards your goal?",
//     "Are you wanting to try and achieve this in one appointment?",
//   ],
//   previousExperience: [
//     "What led you to try a new stylist?",
//     "Was there anything that didn't work after your last appointment?",
//   ],
//   flexibilityAndServices: [
//     "Do you have any allergies to hair products?",
//     "Any upcoming events requiring a special hairstyle?",
//     "Open to exploring new hair treatments or services?",
//     "We can amend the service to suit your budget. Does that work for you?",
//   ],
//   inDepthConsultationOptions: [
//     "How bold do you want the blonde?",
//     "Are all the ends a solid blonde, or is there dimension in the photo?",
//     "How far down is the dimension in the root, if any?",
//   ],
// }
export interface Question {
  id: string
  question: string
  guidance_text: string | string[]
  context: string
  options?: string[]
}

export interface Category {
  id: string
  name: string
  description: string
  questions: Question[]
}

export const knowledgeBase = {
  categories: [
    {
      id: "onboarding",
      name: "Onboarding",
      description: "Initial feelings and expectations",
      questions: [
        {
          id: "current_feeling",
          question: "How are you feeling about your current hair?",
          guidance_text: "Listen for emotional cues and satisfaction level.",
          context: "Initial emotional assessment.",
        },
        {
          id: "current_dislikes",
          question: "What are you not liking about your hair?",
          guidance_text: "Identify pain points to address.",
          context: "Helps prioritize solutions.",
        },
        {
          id: "current_likes",
          question: "What are you liking?",
          guidance_text: "Note elements to preserve or enhance.",
          context: "Maintain positives while addressing concerns.",
        },
        {
          id: "post_appointment_feeling",
          question:
            "When you left the salon after your appointment did you like it? Or do you feel it's not still where you want it to be?",
          guidance_text: "Gauge satisfaction with previous results.",
          context: "Helps understand past experiences.",
        },
        {
          id: "priority_today",
          question: "What is the priority to achieve today?",
          guidance_text: "Focus on main objectives for the session.",
          context: "Sets clear goals for the appointment.",
        },
        {
          id: "desired_feeling",
          question: "What is the feeling you would like? Eg glossy, rich, golden?",
          guidance_text: "Clarify desired outcome and tone.",
          context: "Guides color and style choices.",
        },
        {
          id: "cut_satisfaction",
          question: "Hair cut and shape wise are you happy with your current cut?",
          guidance_text: "Assess satisfaction with current cut.",
          context: "Informs potential changes.",
        },
        {
          id: "new_stylist_reason",
          question: "What led you to a new stylist today?",
          guidance_text: "Understand motivation for switching stylists.",
          context: "Helps avoid previous issues.",
        },
      ],
    },
    {
      id: "goal",
      name: "Goal & Inspiration",
      description: "Determine the goal and inspiration",
      questions: [
        {
          id: "inspiration_pictures",
          question: "Do you have any inspiration pictures of colours you like?",
          guidance_text: "Use visuals to align expectations.",
          context: "Ensures clarity on desired result.",
        },
        {
          id: "photo_likes",
          question: "What do you like about this photo?",
          guidance_text: "Identify specific elements they prefer.",
          context: "Guides recommendations.",
        },
        {
          id: "photo_dislikes",
          question: "What don't you like?",
          guidance_text: "Note elements to avoid.",
          context: "Helps avoid undesired outcomes.",
        },
      ],
    },
    {
      id: "placement_breakdown_face_frame",
      name: "Placement Breakdown: Face Frame",
      description: "Face frame assessment and preferences",
      questions: [
        {
          id: "face_frame_preference",
          question: "Do you like the face frame in this?",
          guidance_text: "Assess preference for face-framing highlights.",
          context: "Impacts overall look.",
        },
        {
          id: "face_frame_boldness",
          question: "Do you like how bold or subtle this is?",
          guidance_text: "Determine desired intensity of face frame.",
          context: "Affects foil placement.",
        },
        {
          id: "face_frame_tied_back",
          question:
            "When your hair is tied back it will look like xyz and maintenance would be xyz",
          guidance_text: "Discuss maintenance and appearance when tied back.",
          context: "Sets expectations for upkeep.",
        },
      ],
    },
    {
      id: "placement_breakdown_roots",
      name: "Placement Breakdown: Roots",
      description: "Roots assessment and preferences",
      questions: [
        {
          id: "roots_natural_base",
          question: "Roots determine if it's darker or lighter than client's natural base.",
          guidance_text: "Assess root color preference.",
          context: "Affects maintenance and regrowth.",
        },
        {
          id: "roots_blonde_preference",
          question: "Do you like how blonde it is to the roots? Maintenance would be XYZ",
          guidance_text: "Discuss maintenance for blonde roots.",
          context: "Sets realistic expectations.",
        },
      ],
    },
    {
      id: "placement_breakdown_mids",
      name: "Placement Breakdown: Mids",
      description: "Mids assessment and preferences",
      questions: [
        {
          id: "mids_dimension",
          question: "Determine how much dimension. Is low lights required or only highlights?",
          guidance_text: "Assess need for dimension in mids.",
          context: "Impacts color depth.",
        },
      ],
    },
    {
      id: "placement_breakdown_ends",
      name: "Placement Breakdown: Ends",
      description: "Ends assessment and preferences",
      questions: [
        {
          id: "ends_solid_colour",
          question: "Are the ends a solid one colour?",
          guidance_text: "Check if ends need more dimension.",
          context: "Affects overall look.",
        },
        {
          id: "ends_tip_out",
          question: "Is a tip out required?",
          guidance_text: "Determine if extra lightening is needed.",
          context: "Impacts hair health.",
        },
        {
          id: "ends_low_lights",
          question: "Low lights required?",
          guidance_text: "Assess if lowlights are needed for balance.",
          context: "Adds depth and contrast.",
        },
        {
          id: "ends_condition",
          question: "Is the condition strong enough for the goal?",
          guidance_text: "Evaluate hair health before proceeding.",
          context: "Ensures safe service.",
        },
      ],
    },
    {
      id: "placement_breakdown_nape",
      name: "Placement Breakdown: Nape",
      description: "Nape assessment and preferences",
      questions: [
        {
          id: "nape_preference",
          question: "When hair is tied up what would you like to see?",
          guidance_text: "Discuss nape area preferences.",
          context: "Affects overall balance.",
        },
        {
          id: "nape_blonde_maintenance",
          question: "If it's blonde the maintenance would be XYZ",
          guidance_text: "Set expectations for nape maintenance.",
          context: "Helps with planning.",
        },
      ],
    },
    {
      id: "expectation_management",
      name: "Expectation Management",
      description: "Set and manage expectations",
      questions: [
        {
          id: "inspiration_possibility",
          question: "Determine if the inspiration is possible",
          guidance_text: "Be honest about what can be achieved.",
          context: "Manages client expectations.",
        },
        {
          id: "likely_outcome",
          question: "Explain what the outcome will most likely be today",
          guidance_text: "Set realistic expectations for today's result.",
          context: "Prevents disappointment.",
        },
        {
          id: "maintenance_and_next_service",
          question: "Talk about maintenance and what service is required next and how soon.",
          guidance_text: "Plan for future appointments.",
          context: "Ensures ongoing satisfaction.",
        },
        {
          id: "not_possible_management",
          question: "Let client know if it's not possible, manage expectation",
          guidance_text: "Communicate limitations clearly.",
          context: "Builds trust and transparency.",
        },
      ],
    },
    {
      id: "cut_and_styling",
      name: "Cut & Styling",
      description: "Questions about haircut and styling routine",
      questions: [
        {
          id: "cut_experience",
          question: "How are you finding your current haircut?",
          guidance_text: "Assess satisfaction with current cut.",
          context: "Guides potential changes.",
        },
        {
          id: "styling_time",
          question: "How much time do you put into styling?",
          guidance_text: "Understand daily styling commitment.",
          context: "Affects recommendations.",
        },
        {
          id: "colour_cut_compatibility",
          question: "Will the above colour work with the haircut they would like?",
          guidance_text: "Ensure color and cut are compatible.",
          context: "Prevents mismatched results.",
        },
      ],
    },
    {
      id: "home_care",
      name: "Home Care",
      description: "Home care and maintenance routine",
      questions: [
        {
          id: "home_care_routine",
          question: "What is your home care routine like?",
          guidance_text: "Assess current product usage and habits.",
          context: "Guides product recommendations.",
        },
        {
          id: "salon_products",
          question: "Are you using salon quality products?",
          guidance_text: "Discuss benefits of professional products.",
          context: "Important for hair health.",
        },
        {
          id: "product_reactions",
          question: "Reactions can occur if not? So we just need to be aware?",
          guidance_text: "Check for sensitivities or allergies.",
          context: "Ensures safe recommendations.",
        },
        {
          id: "tank_water",
          question: "Are you on tank water?",
          guidance_text: "Consider water quality effects on hair.",
          context: "May affect product recommendations.",
        },
        {
          id: "toning_time",
          question: "How much time will you dedicate to your toning?",
          guidance_text: "Discuss toning requirements and maintenance.",
          context: "Important for color upkeep.",
        },
      ],
    },
    {
      id: "summary",
      name: "Summary",
      description: "Summary and final confirmation",
      questions: [
        {
          id: "one_sitting_goal",
          question: "Are you hoping to achieve this in one sitting?",
          guidance_text: "Assess if hair is strong enough for one sitting.",
          context: "Sets realistic goals.",
        },
        {
          id: "stepwise_approach",
          question: "Or happy with a smaller step today?",
          guidance_text: "Offer stepwise approach if needed.",
          context: "Manages expectations.",
        },
        {
          id: "service_recommendation",
          question: "Based on our consultation here is what I'd recommend for today:",
          guidance_text: "Summarize the planned service.",
          context: "Ensures clarity before proceeding.",
        },
        {
          id: "final_confirmation",
          question: "How does all this sound?",
          guidance_text: "Ensure client is comfortable with the plan and price.",
          context: "Final confirmation before proceeding.",
        },
        {
          id: "final_confirmation_budget",
          question: "Do you have a budget in mind? We can adjust the service to suit your budget.",
          guidance_text: "Offer two price options: a smaller service to build goal color or a transformation service.",
          context: "Final confirmation before proceeding.",
        },
      ],
    },
  ],
  key_considerations: [
    {
      scenario:
        "If the client wants to be as blonde as possible but low maintenance and already has heaps of regrowth",
      advice: [
        "Think carefully with your root formula.",
        "If you tap the root too dark, they won't feel blonde enough and might feel like they don't look much different to when they arrived.",
        "Be careful choosing the correct toner.",
        "Use pictures (even of blonde staff) to work out what they consider a 'lived-in root'.",
      ],
    },
    {
      scenario: "When working with natural regrowth",
      advice: [
        "The natural regrowth would become your root.",
        "The correct foil placement would use the root in your favour.",
        "Consider a lighter root to avoid removing all your hard foil work.",
      ],
    },
  ],
}
