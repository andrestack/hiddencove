export const knowledgeBase = {
  consultation: {
    introduction: [
      {
        speaker: 'stylist',
        text: "Hi, I'm ............... I'll be looking after you today.",
      },
      {
        speaker: 'stylist',
        text: 'What are we thinking for your colour today?',
      },
      {
        speaker: 'client',
        text: "Blonde but low maintenance. I haven't been in 10 plus weeks.",
      },
      {
        speaker: 'stylist',
        text: 'Perfect! Do you have any pictures of colours that you like?',
      },
      {
        speaker: 'client',
        text: 'Not really.',
      },
      {
        note: "This is where you would get up multiple photos of different types of 'lived-in blonde'. Note: Not all lived-in blondes want a root, so don't assume you're doing a root tap.",
      },
    ],
    client_selection: {
      description: 'Client picks a very blonde photo with some natural dimension in the root.',
      questions_to_ask: [
        {
          category: 'Face Frame',
          question: 'How bold do you want the blonde?',
          options: [
            'Very bold – blonde right to the root when tied up',
            'Subtle – a softer look with some regrowth',
            'Natural-looking – a balance between bold and subtle',
          ],
          context: 'This will help work out your foil placement.',
        },
        {
          category: 'Mid Lengths',
          question: 'Are all the ends a solid blonde, or is there dimension in the photo?',
          options: [
            'Solid blonde – every piece is blonde',
            'Dimension – some lowlights or natural tones are visible',
          ],
          context:
            "If it's all blonde, explain that every piece is blonde and a tip-out would be required. Consider the hair's condition and required home care.",
        },
        {
          category: 'Roots',
          question: 'How far down is the dimension in the root, if any?',
          options: [
            'No dimension – blonde starts right at the root',
            'Slight dimension – natural regrowth is visible',
            'Significant dimension – darker roots with blonde starting lower',
          ],
          context:
            'Determine if the client has enough natural regrowth or if you need to create it. Ask if they want to see blonde on their part line.',
        },
      ],
    },
    key_considerations: [
      {
        scenario:
          'If the client wants to be as blonde as possible but low maintenance and already has heaps of regrowth',
        advice: [
          'Think carefully with your root formula.',
          "If you tap the root too dark, they won't feel blonde enough and might feel like they don't look much different to when they arrived.",
          'Be careful choosing the correct toner.',
          "Use pictures (even of blonde staff) to work out what they consider a 'lived-in root'.",
        ],
      },
      {
        scenario: 'In this particular case',
        advice: [
          'The natural regrowth would become your root.',
          'The correct foil placement would use the root in your favour, so perhaps a lighter root would be more appropriate to avoid removing all your hard foil work.',
        ],
      },
    ],
    final_consultation_summary: {
      stylist_summary: [
        'We are going to go in with a bold face frame that looks very blonde when tied back.',
        'We are going to tip out your mids to lighten them all to look a lot lighter.',
        'We are then going to place your root foils to the root as we have a lot of natural regrowth, so we won’t remove all of it.',
        'Then, because we already have a lot of dimension, we will just blur the fresh foils so you don’t feel too dark.',
      ],
      stylist_questions: [
        'How does that all sound?',
        'Do you have any questions?',
        'Do you mind if I take some before and after pictures?',
      ],
      client_photo_permission: {
        if_declined:
          'Not a problem. Are you comfortable having just the back taken for our files? We will not post them, but I can add them to your profile for our records.',
      },
      note: "Even if you're not cutting, ask what type of haircut they are having so that you don’t have all your hard work cut off.",
    },
  },
  key_consultation_questions: [
    {
      question: 'What do you like about this photo?',
      options: [],
    },
    {
      question: 'What don’t you like about this picture?',
      options: [],
    },
    {
      question: 'If you could have your dream hair today, what would that look like?',
      options: [],
    },
    {
      question: 'Do you have a budget in mind?',
      options: ['Yes, I have a specific budget.', 'No, I’m open to suggestions.'],
    },
    {
      question: 'Would you like to take a slower approach and build towards your goal?',
      options: [
        'Yes, I prefer a gradual approach.',
        'No, I’d like to achieve my goal in one appointment.',
      ],
    },
    {
      question: 'Are you wanting to try and achieve this in one appointment?',
      options: [
        'Yes, I’d like to achieve it in one session.',
        'No, I’m okay with multiple sessions.',
      ],
    },
    {
      question: 'What led you to try a new stylist?',
      options: [],
    },
    {
      question: "Was there anything that didn't work after your last appointment?",
      options: [],
    },
    {
      question: 'We can amend the service to suit your budget. Does that work for you?',
      options: ['Yes, that works for me.', 'No, I’d like to discuss further.'],
    },
    {
      question: 'What is your home care routine like?',
      options: [],
    },
    {
      question: 'How has your current shampoo and conditioner been feeling on your scalp?',
      options: [],
    },
    {
      question: 'What are you not liking about your current hair?',
      options: [],
    },
  ],
}
