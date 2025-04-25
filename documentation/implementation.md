<!-- ---

### **Adjustments for Knowledge Base in JSON**
1. Store the questionnaire data (questions, options, and help text) in a JSON file within the `utils/` or `data/` directory.
2. Define a clear structure for the JSON file to include:
   - Question ID
   - Step number
   - Question text
   - Input type (e.g., `text`, `checkbox`, `radio`)
   - Options (if applicable)
   - Help text for tooltips
3. Create a utility function to load and parse the JSON file at runtime.
4. Use the parsed JSON data to dynamically render the questionnaire steps and questions.
5. Add a fallback mechanism to handle errors if the JSON file is missing or corrupted.

---


#### **Implementation Steps for ChatGPT Integration**
1. **Set Up OpenAI API:**
   - Obtain an API key from OpenAI and store it securely in the `.env.local` file.
   - Install the OpenAI SDK or use `fetch` to interact with the API.

2. **Create a ChatGPT Utility Function:**
   - Write a utility function (e.g., `getChatGPTResponse`) that sends a prompt to the OpenAI API and retrieves a response.
   - The function should accept parameters like the question text, user input, or context to generate relevant insights.

3. **Integrate Tooltips with ChatGPT:**
   - Add a help icon to each question card in the questionnaire.
   - When the user clicks the help icon, call the `getChatGPTResponse` function with the question text as the prompt.
   - Display the response in a tooltip or modal using a UI component (e.g., Radix UI Tooltip or Dialog).

4. **Generate AI Insights Based on User Input:**
   - After the user selects an answer, send the answer and question text to the ChatGPT API.
   - Display the AI-generated insight below the question card or in a dedicated section.

5. **Optimize API Calls:**
   - Use debouncing or throttling to limit API calls when users interact with the help icon or change their answers.
   - Cache responses for frequently asked questions to reduce API usage and improve performance.

6. **Error Handling:**
   - Display a fallback message (e.g., "Unable to fetch insights at the moment") if the API call fails.
   - Log errors for debugging and monitoring.

7. **Testing:**
   - Test the ChatGPT integration with various question types and inputs to ensure the responses are relevant and helpful.
   - Simulate edge cases like invalid API keys or network issues.

--- -->

#### **Authentication and Initial Database Setup**

1. Configure Supabase for authentication and user management:
   - Set up a new Supabase project
   - Configure email/password authentication
   - Set up email templates for auth flows
   - Implement auth middleware for protected routes
2. Set up role-based access control (RBAC):
   - Create roles for stylists and admins
   - Configure RLS policies for each role
   - Set up default role assignment on signup
3. Test authentication flows for edge cases:
   - Sign up/Sign in flows
   - Password reset
   - Email verification
   - Session management
   - Protected route access

#### **Database Schema Setup**

1. Create initial database tables:

   ```sql
   -- Users (extends Supabase auth.users)
   create table public.profiles (
     id uuid references auth.users primary key,
     full_name text,
     role text check (role in ('stylist', 'admin')),
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Categories for grouping questions
   create table public.categories (
     id uuid default gen_random_uuid() primary key,
     name text not null,
     description text,
     order_index integer not null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Questions with embedded AI guidance
   create table public.questions (
     id uuid default gen_random_uuid() primary key,
     category_id uuid references public.categories(id) on delete cascade,
     question_text text not null,
     guidance_text text not null,
     recommended_products jsonb,
     order_index integer not null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Products/Services for pricing
   create table public.products (
     id uuid default gen_random_uuid() primary key,
     name text not null,
     description text,
     price decimal(10,2) not null,
     category text not null,
     usage_guidelines text,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- AI Response Cache for dynamic insights
   create table public.ai_response_cache (
     id uuid default gen_random_uuid() primary key,
     question_id uuid references public.questions(id) on delete cascade,
     context text not null,
     response text not null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     expires_at timestamp with time zone not null
   );
   ```

2. Set up database triggers and functions:

   - Automatic updated_at timestamp updates
   - AI response cache cleanup

3. Configure Row Level Security (RLS) policies:

   - Profiles: Users can read all profiles but only update their own
   - Questions/Categories: Read-only for stylists, full access for admins
   - Products: Read-only for all authenticated users

4. Create database indexes for performance:

   - Question lookups by category
   - Product lookups by category
   - AI cache lookups by question and context

5. Set up initial data migration:
   - Seed categories with common consultation topics
   - Add initial set of guiding questions with AI prompts
   - Add product catalog with usage guidelines
   - Create admin user

#### **Knowledge Base (JSON)**

4. Create a JSON file to store the questionnaire data in the `utils/` or `data/` directory.
5. Define a schema for the JSON file, including fields for question ID, step, text, input type, options, and help text.
6. Write a utility function to load and parse the JSON file.
7. Use the parsed data to dynamically render the questionnaire steps and questions.
8. Add error handling for missing or corrupted JSON files.

#### **Questionnaire Flow**

9. Design the landing page with a "Begin Questionnaire" button.
10. Create a multi-step questionnaire flow with progress tracking.
11. Render questions dynamically based on the JSON data.
12. Add input controls (e.g., dropdowns, checkboxes) for user responses.
13. Validate user responses using React Hook Form and Zod schemas.
14. Show toast notifications for incomplete or invalid responses.
15. Save user responses in local state or a temporary JSON file.

#### **ChatGPT Integration**

16. Obtain an OpenAI API key and store it securely.
17. Write a utility function to interact with the OpenAI API.
18. Add a help icon to each question card for tooltips.
19. Fetch ChatGPT responses for tooltips based on the question text.
20. Display AI-generated insights below the question card after user input.
21. Cache responses for frequently asked questions to optimize performance.
22. Handle API errors gracefully and display fallback messages.

#### **Summary Page**

23. Create a summary page to display all user responses.
24. Add a "Save" button to download the summary as a file.
25. Implement a "Back to Questionnaire" button for editing responses.
26. Add a "Start New Consultation" button to reset the flow.

#### **UI Components and Styling**

27. Use Tailwind CSS for styling and responsive design.
28. Add animations with `tailwindcss-animate` and Framer Motion.
29. Use Radix UI components for tooltips, modals, and navigation menus.
30. Add Sonner for toast notifications.

#### **Theme and Layout**

31. Configure `next-themes` for dark/light mode switching.
32. Create a consistent header with navigation links and a theme toggle button.

#### **Date Handling and Charts**

33. Use `date-fns` for formatting and manipulating dates.
34. Add a date picker component for scheduling consultations.
35. Integrate Recharts for visualizing data (if needed).

#### **Testing and Monitoring**

36. Write end-to-end tests using Cypress.
37. Set up Sentry for monitoring errors and performance issues.

#### **Future Supabase Integration**

38. Plan for migrating the knowledge base from JSON to Supabase when scaling.
39. Define database tables for `users`, `questions`, `answers`, `prices`, and `quotes`.
40. Enable Row Level Security (RLS) for secure data access.
41. Write SQL migrations for schema changes.
42. Test database queries for performance and security.

#### **Development Tools**

43. Configure ESLint and Prettier for code quality.
44. Use TypeScript for type-safe development.
45. Add PostCSS for advanced CSS processing.

#### **Deployment and CI/CD**

46. Set up a CI/CD pipeline using GitHub Actions or Vercel.
47. Configure environment variables securely in the deployment platform.
48. Test the app in staging before deploying to production.

#### **Documentation**

49. Document the JSON schema for the knowledge base.
50. Add comments and JSDoc annotations for the ChatGPT utility function.
51. Update the README file with instructions for setting up ChatGPT and the JSON-based knowledge base.

---
