## Product Requirements Document (PRD)



### 1 Purpose of this Document

This document outlines the requirements for developing a Progressive Web Application with AI-enhanced insights. It captures the objectives, user needs, and functionalities required to streamline stylists’ consultations, reduce the time spent on them, and ensure brand consistency through AI-driven insights.

### 1.2 Background

- **Context**: Stylists often need to perform consultations, gather client's preferences, explain pros and cons, and provide quotes. This process can be time-consuming and prone to inconsistencies.
- **Opportunity**: Integrating a tool with AI and an easy to complete quote generation can offer on-the-fly suggestions and brand-consistent guidance, enhancing customer experience and reducing the manual workload.

### 1.3 Scope

- **In Scope**:
    - A guided consultation flow with a list of questions aimed at covering all aspects of the styling job ahead
    - Real-time AI-driven suggestions
    - Basic quoting functionality or output (as needed by the product) based on existing price lists and done on the final step via stylist input
- **Out of Scope** (examples):
    - Payment processing
    - Detailed CRM or inventory management
    - Advanced analytics dashboards (unless specified later)

---

## 2. Product Overview

We will develop a **smart consultation and quoting tool** enhanced with AI capabilities (ChatGPT-4 and aboce). The system will guide stylists through a series of questions, also providing real-time insights. It will also include simple user authentication. While we will not display the 

---

## 3. Objectives & Goals

1. **Create an intelligent, user-friendly consultation tool** that streamlines the stylist’s workflow.
2. **Implement AI-powered assistance** to provide contextual insights during consultations.
3. **Reduce consultation time** while maintaining high-quality customer service.
4. **Ensure brand consistency** through AI training based on an internal knowledge base.
5. **Enhance user experience with visual aids** throughout the consultation process.
6. **Implement user authentication using Clerk** to ensure only required user access the form

---

## 4. User Personas / Target Audience

1. **Stylist (Primary User)**
    - Needs a fast, guided workflow to capture client requirements.
    - Benefits from AI-driven recommendations for consistent brand messaging.
2. **Salon or Business Owner (Secondary User)**
    - Wants to ensure stylists consistently deliver high-quality consultations.
    - Interested in reducing time and human error in the quoting process.
3. **Customers (Indirect Stakeholders)**
    - Receives a more accurate, branded, and engaging consultation process.

---

## 5. Use Cases & User Stories

### 5.1 Use Cases

1. **Guided Consultation Start**
    - *Trigger*: Stylist initiates a new consultation.
    - *Flow*: The system presents a step-by-step questionnaire.
    - *Outcome*: A structured set of questions ready for AI analysis.
2. **AI-Assisted Recommendations**
    - *Triggers*: The users swipes to a question card 
    - *Flow*: ChatGPT-4 reads the question at hand and generates suggestions or clarifications for the stylist.
    - *Outcome*: Stylist sees brand-consistent options or recommendations to guide the client.
<!-- 3. **Visual Aids Integration**
    - *Trigger*: User arrives at a step with an associated image (e.g., style references, product visuals).
    - *Flow*: The system loads the relevant image to guide the conversation.
    - *Outcome*: Stylist and client can view images in a mobile-responsive layout. -->
4. **Quotation Output**
    - *Trigger*: Stylist completes consultation questions and starts adding the products he/she sees relevant
    - *Flow*: System calculates or suggests a quote based on an existing pricing list
    - *Outcome*: Final consultation summary with a suggested quote is displayed or can be shared.

### 5.2 User Stories (Examples)

1. **Stylist starts consultation**
    - “As a stylist, I want a thorough step-by-step question flow so that I can easily capture all necessary client details.”
2. **Stylist needs AI assistance**
    - “As a stylist, I want AI-generated suggestions so that I can provide personalized recommendations without guesswork.”
<!-- 3. **Stylist wants to show visual aids**
    - “As a stylist, I want to display relevant images for each step so that clients can visualize style options.” -->
4. **Stylist finishes with a quote**
    - “As a stylist, I want the tool to provide a quote based on my inputs so that I can close the consultation quickly.”

---

## 6. Functional Requirements

### 6.1 Smart Consultation Interface

1. **Step-by-Step Guided Flow**
    - The system must present a sequential list of questions or prompts.
    - The number of steps or questions should be configurable by an admin or product owner.
<!-- 2. **Multiple-Choice Questions**
    - Each step should allow multiple-choice inputs.
    - The system should allow text entry or additional notes in certain steps.
3. **Visual Aids**
    - Each question can include an image or set of images.
    - Images must be displayed in an optimized, mobile-responsive format. -->
4. **Mobile-Responsive Design**
    - The interface will be a mobile and tablet-first layout, but must adapt to various screen sizes (e.g., phones, desktops).
    - Buttons and text fields should remain accessible and easily clickable on smaller screens.

### 6.2 AI Integration

1. **ChatGPT-4 Powered Assistance**
    - The system should call the ChatGPT-4 API (or relevant integration) at each relevant step to generate suggestions.
    - Suggestions must align with brand guidelines and knowledge base content.
2. **Contextual Insights Based on Question and Phase at hand**
    - AI should receive the current user’s answers as context, providing tailored follow-up questions or clarifications.
3. **Knowledge Base Integration**
    - An internal knowledge base or FAQ must be referenced to ensure brand alignment.
    - The AI must be trained or fine-tuned to incorporate brand-specific language, services, and pricing guidelines.
4. **Real-Time Suggestions and Recommendations**
    - The tool should display relevant suggestions (style options, add-on services, etc.) immediately as the stylist inputs data.

<!-- ### 6.3 Visual Enhancement – BONUS

1. **Integration of Provided Images**
    - Images supplied by the branding/marketing team should be dynamically linked to questions.
    - The tool should handle various image formats (PNG, JPEG, etc.).
    - In this initial stage all images will me stored in th /public folder.
2. **Optimized Image Loading and Display**
    - Images should be compressed or resized for fast loading without sacrificing quality.
    - Loading indicators or placeholders should appear for slow connections. -->

### 6.4 User Authentication - BONUS

For scalability reasons, basic admin authentication will be added at the stage of the project, even though it is not part of the agreed scope of the project.


---

## 8. Non-Functional Requirements

1. **Performance**
    - The system should load each consultation step within 2 seconds on average connections.
    - AI queries should return suggestions within 3 seconds to avoid user frustration.
2. **Security & Privacy**
    - All data transmissions (including AI API calls) must be encrypted (HTTPS).
    - If storing PII (e.g., client name, contact details), comply with relevant data protection laws.
3. **Reliability & Availability**
    - The system should be available 99% of the time during business hours.
    - In the event of AI API downtime, the tool should still allow basic data capture without suggestions.
4. **Usability**
    - The UI must be intuitive for stylists with minimal training.
    - Key functions (start consultation, navigate steps, finalize quote) should require no more than 3 clicks/taps.
5. **Scalability**
    - The architecture should support multiple stylists using the tool simultaneously without degrading performance.

---

## 9. Technical Considerations

1. **Platform/Architecture**
    - Web-based, mobile-responsive front end: Nextjs.
    - Back end be built in Node.js / nextjs api router, that can integrate easily with ChatGPT-4 APIs.
    - Supabase for future database integration
2. **Integrations & Dependencies**
    - **ChatGPT-4 API** for AI assistance.
    - **Knowledge Base**: JSON in the codebase's data.ts. Need to be added to gitignore.
3. **Data Model**
    - Consultation Session: Captures user ID, client ID, start time, end time, list of answers, generated quote.
    - Knowledge Base: Stores relevant brand info, standardized text, or recommended solutions.
4. **3rd-Party Tools**
    - Image hosting or CDN (e.g., AWS S3) for fast loading.
    - Logging & analytics (e.g., Google Analytics, if applicable).
5. **Testing**
    - Cypress for end-to-end unit testing

---

## 10. Success Metrics & KPIs

1. **Consultation Time Reduction**
    - Target: Decrease average consultation time by at least 30%.
2. **Stylist Adoption Rate**
    - Target: 80% of stylists use the tool for daily consultations after 1 month of launch.
3. **User Satisfaction**
    - Measure through feedback surveys; aim for 4/5 or higher in user-friendliness and satisfaction.
4. **Accuracy and Consistency**
    - Reduction in revisions or corrections post-consultation by 40%.

---

## 11. Timeline & Milestones

1. **Phase 1 – Requirements & Design - 1st week**
    - Project setup and initial configuration
    - UI/UX development
    - Basic consultation flow implementation
    - Deliverables: Wireframes, user flows, final UI designs
2. **Phase 2 – MVP Development - 2nd week**
    - Duration: 3 weeks
    - AI integration
    - Knowledge base implementation
    - Image integration
    - Initial testing
    - Deliverables:
        - Functional consultation flow (step-by-step)
        - Basic AI integration (ChatGPT-4 queries)
        - Visual aids in place
3. **Phase 3 – Testing & Refinements - Week 3**
    - System refinement
    - User testing
    - Bug fixes
    - Documentation
    - Final deployment
    - Deliverables:
        - QA testing on different devices
        - Refined AI integration and brand-specific responses

---

## 12. Testing & Validation

1. **Test Scenarios**
    - **Functional Tests**: Validate each consultation step, AI suggestions, and the quoting process.
    - **Integration Tests**: Ensure chat API calls work and data flows correctly.
    - **Image Display Tests**: Confirm images load properly on various devices.
2. **Acceptance Criteria**
    - Each user story has clear acceptance criteria (e.g., “The tool displays at least one AI-generated suggestion within 3 seconds of user input”).
3. **Beta/Usability Testing**
    - Conduct a closed beta with a small group of stylists. Gather feedback on ease of use, clarity, and speed.

---

## 13. Open Questions & Assumptions

1. **Open Issues**
    - Final format for the quote: on screen.
    - Offline mode availability if the internet connection fails.
2. **Assumptions**
    - ChatGPT-4 API remains stable and accessible.
    - The brand knowledge base is well-structured and up to date.