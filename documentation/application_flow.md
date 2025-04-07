
# Flow overview

When a user first opens the Salon Questionnaire Application, they begin at the Landing Page located at the root URL. This page features a salon-themed design that gives a short explanation of what the application does. In the middle of the screen, a “Begin Questionnaire” button is impossible to miss. When the user clicks that button, the app directs them to the login provider. After the user completes that quick login process, they are forwarded to the main Questionnaire Page at /questionnaire. This page is split into a series of steps, such as Step 1 for basic client information and Step 2 for service preferences. Certain steps will involve questions about specific services like adding extensions or selecting a type of coloration, and these steps connect to a live price list that accumulates costs as the user makes choices. At the top of the page, there is a progress indicator showing how many steps remain, and right below it appears the step’s title and a short explanation to guide the user on what they are about to answer.

When the user looks at any given step, they see one question at a time displayed in a card format. Each card has the question text, a relevant input control (for example, a dropdown or checkbox), and a small help icon in the top corner. Clicking that help icon opens a tooltip powered by ChatGPT, which offers suggestions or relevant pointers to the stylist. The user enters a response, and the moment they make their selection, another AI insight appears that is specific to the chosen answer. When the user presses the “Next” button at the bottom of the question card, the app gathers the corresponding cost information if the question is tied to pricing, so the final total can be calculated. If the user tries to move forward without answering a required question, a small toast notification appears near the bottom of the screen telling them they must complete that response before advancing. If they need to revise an earlier answer, there is a “Previous” button that brings them back to the previous card. The progress indicator at the top updates with each question so the user always knows how far along they are in the overall consultation.

Once all questions are answered, the app shows a brief completion message confirming everything has been filled out. Immediately after this confirmation, the user is taken to the Summary Page at /summary. Here, the user sees all of their responses arranged by step or category. Each question is accompanied by the selected answer and a help icon that replays any AI insight generated during that step. At the top of this page is a “Save” button that opens a standard save dialog, letting the user keep a digital or local record of the entire consultation. If the user spots a mistake, they can click the “Back to Questionnaire” button to return to the most recently answered question, make any necessary edits, and then come back to the summary. If the user is satisfied, there is a “Start New Consultation” button that clears out the answers and redirects the user to the beginning of the questionnaire flow, so they can start fresh. Through every stage of this process, the layout features a consistent header at the top and a single main content area in the center, ensuring that stylists never lose track of where they stand within the application.


### **1. Application Structure**

```
Salon Questionnaire
├── Landing Page (Index)
├── Questionnaire Flow
│   ├── Category 1 Questions
│   ├── Category 2 Questions
│   ├── ...
│   └── Category N Questions
└── Summary Page

```

## **2. Page Flow**

### **Landing Page (/)**

- Entry point for users
- Brief application introduction
- "Begin Questionnaire" button navigates to login ui and then to questionnaire page
- Content displayed in a clean, salon-themed layout

### **Questionnaire Page (/questionnaire)**

- Core interaction flow
- Displays:
    - Category progress indicator (top)
    - Current category title and description
    - Current question card
    - Navigation controls (Previous/Next buttons)
- Questions are displayed one at a time with smooth transitions
- Each question can have an AI "Insight" card providing additional context
- Once user selects and answer another AI "Insight" will be provided.
- Progress is tracked by category completion status

### **Summary Page (/summary)**

- Final page displaying all collected information
- Organized by category and question
- Print option available
- "Start New Consultation" button available to begin a new questionnaire
- "Back" option to return to the questionnaire

## **3. User Journey**

1. **Start**: User lands on index page and clicks "Begin Questionnaire"
2. **Question Flow**:
    - User answers each question and clicks "Next"
    - If a required question is not answered, a toast notification appears
    - User can click "Previous" to review/modify answers
    - The progress bar updates as categories are completed
    - User can access insights for any question and any of the answer options provided via the help icon
   
3. **Completion**:
    - After answering all questions, user sees a completion notification
    - User is redirected to the Summary page
4. **Review & Export**:
    - User reviews all collected information
    - User can save the summary for record-keeping
    - User can start a new consultation if needed

## **4. Component Hierarchy**

```
App
├── Index Page (Public Landing Page)
│   └── Welcome Card with animated elements
└── Authenticated Section (wrapped with ClerkProvider)
    └── ClerkProvider
        └── Layout (Shared Layout for Authenticated Pages)
            ├── Header (includes user info/sign-out, etc.)
            └── Main Content Area
                ├── Questionnaire Page
                │   ├── CategoryProgress
                │   ├── Category Title/Description
                │   ├── QuestionCard
                │   │   └── Various Input Types (text, select, checkbox, etc.)
                │   └── Navigation Controls
                └── Summary Page
                    ├── Completion Message
                    ├── Category Sections
                    │   └── Question-Answer Pairs
                    └── Action Buttons (Save, New Consultation)

```

## **5. Data Flow**

1. Questionnaire data structure loaded from questionData.ts
2. User answers stored in react hook form state within the Questionnaire component
3. Category completion status tracked in form state
4. Upon completion, all answers passed to Summary page via route state
5. Summary page formats and displays the collected data

This flow document provides a comprehensive overview of your salon questionnaire application's structure and interactions. It should help you understand how users navigate through the experience and how data flows within the application.