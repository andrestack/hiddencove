export const clientOnboardingQuestions = {
  appearanceAndStylePreferences: [
    "What are you not liking about your current hair?",
    "What are you liking?",
    "What is the priority to achieve today?",
    "When your hair is out, what is important to you?",
    "When it's up, what is important to you?",
    "What is the feeling or vibe you want for today?",
    "Are you happy with your current hairstyle?",
    "Interested in trying a new hair color or style?",
    "If you could have your dream hair today, what would that look like?",
    "Do you have any pictures of colours that you like?",
    "What do you like about this photo?",
    "What don't you like about this picture?",
  ],
  routineAndCare: [
    "What's your current hair care routine?",
    "What is your home care routine like?",
    "How has your current shampoo and conditioner been feeling on your scalp?",
    "Are you using salon quality hair care?",
    "Are you using tank water?",
    "How much time do you typically spend on styling your hair?",
    "How much time will you dedicate to the tone of your hair?",
    "How much time will you allow to your hair styling?",
  ],
  goalsAndConcerns: [
    "Any specific hair concerns or issues?",
    "What are your long-term hair goals?",
    "Do you have a budget in mind?",
    "Would you like to take a slower approach and build towards your goal?",
    "Are you wanting to try and achieve this in one appointment?",
  ],
  previousExperience: [
    "What led you to try a new stylist?",
    "Was there anything that didn't work after your last appointment?",
  ],
  flexibilityAndServices: [
    "Do you have any allergies to hair products?",
    "Any upcoming events requiring a special hairstyle?",
    "Open to exploring new hair treatments or services?",
    "We can amend the service to suit your budget. Does that work for you?",
  ],
  inDepthConsultationOptions: [
    "How bold do you want the blonde?",
    "Are all the ends a solid blonde, or is there dimension in the photo?",
    "How far down is the dimension in the root, if any?",
  ],
}

export const knowledgeBase = {
  categories: [
    {
      id: "assessment",
      name: "Assessment",
      description: "Initial assessment of client needs and expectations",
      questions: [
        {
          id: "current_dislikes",
          question: "What are you not liking about your current hair?",
          guidance_text:
            "Listen for specific concerns that will guide your service recommendations.",
          context: "Understanding pain points helps prioritize solutions.",
        },
        {
          id: "current_likes",
          question: "What are you liking?",
          guidance_text: "Note elements to preserve or enhance in the new style.",
          context: "Important to maintain positive aspects while addressing concerns.",
        },
        {
          id: "priority",
          question: "What is the priority to achieve today?",
          guidance_text: "Focus on main objectives to ensure client satisfaction.",
          context: "Helps prioritize service elements within time/budget constraints.",
        },
        {
          id: "hair_down_importance",
          question: "When your hair is out, what is important to you?",
          guidance_text: "Consider styling needs and maintenance requirements.",
          context: "Affects placement and overall service approach.",
        },
        {
          id: "hair_up_importance",
          question: "When it's up, what is important to you?",
          guidance_text: "Consider visibility of different sections when styled up.",
          context: "Important for placement of highlights and dimension.",
        },
        {
          id: "desired_vibe",
          question: "What is the feeling or vibe you want for today?",
          guidance_text: "Understanding the desired aesthetic helps guide color choices.",
          context: "Affects overall tone and placement decisions.",
        },
        {
          id: "current_satisfaction",
          question: "Are you happy with your current hairstyle?",
          guidance_text: "Probe for specific elements they want to change or maintain.",
          context: "Guides the extent of changes needed.",
        },
        {
          id: "reference_images",
          question: "Do you have any pictures of colours that you like?",
          guidance_text:
            'If client has no pictures, show multiple photos of different types of "lived-in blonde".',
          context: "Visual references ensure alignment on expectations.",
        },
        {
          id: "photo_likes",
          question: "What do you like about this photo?",
          guidance_text:
            "Pay attention to specific elements they point out - brightness, dimension, placement.",
          context: "Understanding preferences helps guide recommendations.",
        },
        {
          id: "photo_dislikes",
          question: "What don't you like about this picture?",
          guidance_text: "Note any concerns to avoid in the service.",
          context: "Equally important to know what to avoid.",
        },
        {
          id: "dream_hair",
          question: "If you could have your dream hair today, what would that look like?",
          guidance_text: "Help articulate ideal outcome while setting realistic expectations.",
          context: "Understanding ultimate goal helps plan the journey.",
        },
        {
          id: "timeline_preference",
          question: "Would you like to take a slower approach and build towards your goal?",
          guidance_text: "Discuss benefits and limitations of different approaches.",
          context: "Important for managing expectations and planning future appointments.",
        },
        {
          id: "one_appointment",
          question: "Are you wanting to try and achieve this in one appointment?",
          guidance_text: "Be honest about what can be safely achieved in one session.",
          context: "Critical for setting realistic expectations.",
        },
        {
          id: "budget",
          question: "Do you have a budget in mind?",
          guidance_text: "Be prepared to offer options at different price points.",
          context: "Important to align service recommendations with budget constraints.",
        },
        {
          id: "budget_flexibility",
          question: "We can amend the service to suit your budget. Does that work for you?",
          guidance_text: "Offer alternative solutions if budget is a concern.",
          context: "Helps find a suitable compromise if needed.",
        },
      ],
    },
    {
      id: "consultation_background",
      name: "Consultation Background",
      description: "Understanding client history and requirements",
      questions: [
        {
          id: "new_stylist_reason",
          question: "What led you to try a new stylist?",
          guidance_text: "Listen for previous experiences and expectations.",
          context: "Helps understand past experiences and avoid potential issues.",
        },
        {
          id: "previous_issues",
          question: "Was there anything that didn't work after your last appointment?",
          guidance_text: "Note specific concerns to address in your service.",
          context: "Important for avoiding past problems.",
        },
        {
          id: "allergies",
          question: "Do you have any allergies to hair products?",
          guidance_text: "Document any allergies for future reference.",
          context: "Critical for safety and product selection.",
        },
        {
          id: "upcoming_events",
          question: "Any upcoming events requiring a special hairstyle?",
          guidance_text: "Consider timing and maintenance requirements.",
          context: "Affects service planning and timing.",
        },
      ],
    },
    {
      id: "maintenance_assessment",
      name: "Maintenance Assessment",
      description: "Understanding client's maintenance capabilities and preferences",
      questions: [
        {
          id: "current_routine",
          question: "What's your current hair care routine?",
          guidance_text: "Assess current practices and potential areas for improvement.",
          context: "Helps recommend appropriate maintenance routine.",
        },
        {
          id: "home_care",
          question: "What is your home care routine like?",
          guidance_text: "Understand current product usage and styling habits.",
          context: "Important for product recommendations.",
        },
        {
          id: "current_products",
          question: "How has your current shampoo and conditioner been feeling on your scalp?",
          guidance_text: "Identify any scalp or product concerns.",
          context: "Guides product recommendations.",
        },
        {
          id: "salon_products",
          question: "Are you using salon quality hair care?",
          guidance_text: "Discuss benefits of professional products.",
          context: "Important for maintaining color and hair health.",
        },
        {
          id: "water_type",
          question: "Are you using tank water?",
          guidance_text: "Consider water quality effects on hair and color.",
          context: "May affect product recommendations and maintenance.",
        },
        {
          id: "styling_time",
          question: "How much time do you typically spend on styling your hair?",
          guidance_text: "Understand styling commitment and capabilities.",
          context: "Affects service and product recommendations.",
        },
        {
          id: "tone_maintenance",
          question: "How much time will you dedicate to the tone of your hair?",
          guidance_text: "Discuss toning requirements and maintenance.",
          context: "Important for color service planning.",
        },
        {
          id: "styling_commitment",
          question: "How much time will you allow to your hair styling?",
          guidance_text: "Consider realistic styling expectations.",
          context: "Guides style recommendations.",
        },
      ],
    },
    {
      id: "face_frame",
      name: "Face Frame",
      description: "Assessment of face-framing elements",
      questions: [
        {
          id: "blonde_boldness",
          question: "How bold do you want the blonde?",
          guidance_text: "This will help determine your foil placement.",
          options: [
            "Very bold – blonde right to the root when tied up",
            "Subtle – a softer look with some regrowth",
            "Natural-looking – a balance between bold and subtle",
          ],
          context: "Face frame placement significantly impacts the overall look.",
        },
      ],
    },
    {
      id: "roots",
      name: "Roots",
      description: "Root area assessment and planning",
      questions: [
        {
          id: "root_dimension",
          question: "How far down is the dimension in the root, if any?",
          guidance_text:
            "Determine if they have enough natural regrowth or if you need to create it. Ask if they want to see blonde on their part line.",
          options: [
            "No dimension – blonde starts right at the root",
            "Slight dimension – natural regrowth is visible",
            "Significant dimension – darker roots with blonde starting lower",
          ],
          context: "Root depth and dimension affect maintenance schedule.",
        },
      ],
    },
    {
      id: "mids",
      name: "Mid Lengths",
      description: "Mid-length assessment and planning",
      questions: [
        {
          id: "mid_dimension",
          question: "Are all the ends a solid blonde, or is there dimension in the photo?",
          guidance_text:
            "If it's all blonde, explain that every piece is blonde and a tip-out would be required. Consider the hair's condition and required home care.",
          options: [
            "Solid blonde – every piece is blonde",
            "Dimension – some lowlights or natural tones are visible",
          ],
          context: "Mid-length treatment affects overall dimension and maintenance.",
        },
      ],
    },
    {
      id: "ends",
      name: "Ends",
      description: "End assessment and treatment planning",
      questions: [
        {
          id: "ends_condition",
          question: "How have your ends been feeling?",
          guidance_text: "Assess the condition and discuss any necessary treatments.",
          context: "End condition affects service approach and product recommendations.",
        },
      ],
    },
    {
      id: "nape",
      name: "Nape",
      description: "Nape area assessment and planning",
      questions: [
        {
          id: "nape_preference",
          question: "How light would you like the nape area to be?",
          guidance_text: "Consider maintenance and natural fall of the hair.",
          context: "Nape brightness affects overall balance and maintenance.",
        },
      ],
    },
    {
      id: "summary",
      name: "Summary (Quote)",
      description: "Service summary and quote",
      questions: [
        {
          id: "service_summary",
          question: "Based on our consultation, here's what I recommend:",
          guidance_text: [
            "We are going to go in with a bold face frame that looks very blonde when tied back.",
            "We are going to tip out your mids to lighten them all to look a lot lighter.",
            "We are going to place your root foils to the root as we have a lot of natural regrowth.",
            "Then, because we already have a lot of dimension, we will just blur the fresh foils.",
          ],
          context: "Summarize the planned service clearly.",
        },
        {
          id: "confirmation",
          question: "How does that all sound?",
          guidance_text: "Ensure client is comfortable with the plan and price.",
          context: "Final confirmation before proceeding.",
        },
        {
          id: "photo_permission",
          question: "Do you mind if I take some before and after pictures?",
          guidance_text:
            "If declined: Ask about taking just the back for records, explaining they won't be posted.",
          context: "Important for tracking progress and marketing.",
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
