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
   - Set up a new Supabase project ✅
   - Configure email/password authentication ⏳ (Frontend component implemented, backend config needed)
   - Set up email templates for auth flows ❌
   - Implement auth middleware for protected routes ❌
2. Set up role-based access control (RBAC):
   - Create roles for stylists and admins ❌
   - Configure RLS policies for each role ❌
   - Set up default role assignment on signup ❌
3. Test authentication flows for edge cases:
   - Sign up/Sign in flows ✅ (Basic flows tested in component)
   - Password reset ❌
   - Email verification ⏳ (Confirmation email sent, needs full flow testing)
   - Session management ❌
   - Protected route access ❌

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

#### **Knowledge Base Integration**

1. Create initial data structure for questions and guidance:

   - Define category types and their order based on "utils/data.ts"

2. Implement data loading utilities:

   - Create type-safe interfaces for database schemas
   - Set up Supabase client configuration
   - Implement query functions for fetching categories and questions
   - Add caching layer for frequently accessed data

3. Set up AI integration configuration:
   - Store OpenAI API key securely
   - Create prompt templates for dynamic insights
   - Implement caching strategy for AI responses

#### **Questionnaire Flow**

1. Design the landing page:

   - Professional salon-themed layout
   - Quick access to consultation guide
   - Authentication integration

2. Create category navigation:

   - Visual category selection interface
   - Progress tracking across categories
   - Easy navigation between categories

3. Implement question display:

   - Card-based question presentation
   - Professional guidance section
   - Product recommendations panel
   - AI insights integration
   - Smooth transitions between questions

4. Add AI assistance features:

   - Context-aware help button for each question
   - Dynamic product suggestions based on context
   - Real-time professional insights

5. Implement summary page:
   - Create a form using React Hook Form.
   - Include radio buttons for selecting `SeniorityLevel` (Baby, Junior, Intermediate, Senior).
   - Add an input field for `downpayment`.
   - For each `ServiceCategory` in `lib/prices.ts`, create a dropdown menu listing the `ServiceItem`s within that category.
   - Add an input field for `duration` (in hours) specifically for services with `price.type === "hourly"`.
   - Implement logic to calculate the total cost based on selected services, seniority level, hourly duration (if applicable), and deduct the downpayment.
   - Display the calculated total cost to the user (stylist).
   - Use `lib/prices.ts` as the data source for services and pricing.

#### **ChatGPT Integration**

1. Set up OpenAI API:

   - Secure API key configuration
   - Implement rate limiting
   - Error handling and fallbacks

2. Create AI utility functions:

   - Dynamic insight generation
   - Product recommendation enhancement
   - Context-aware guidance

3. Optimize AI performance:
   - Implement response caching
   - Batch similar requests
   - Handle API limitations gracefully

#### **Summary Features**

1. Create quick reference views:

   - Category-based question filtering
   - Product recommendation summaries
   - Frequently used guidance compilation

2. Implement export functionality:
   - Product recommendation lists
   - Category-specific guidance notes
   - Price calculations for recommended products

#### **UI Components and Styling**

1. Design system implementation:

   - Consistent salon-themed components
   - Professional color scheme
   - Responsive layouts
   - Accessibility features

2. Component development:

   - Question cards with guidance
   - Product recommendation panels
   - AI insight displays
   - Navigation elements
   - Category progress indicators

3. Animation and interaction:
   - Smooth transitions between questions
   - Loading states and placeholders
   - Interactive help elements
   - Response animations

#### **Theme and Layout**

1. Implement responsive design:

   - Mobile-first approach
   - Tablet optimization
   - Desktop layouts

2. Create consistent styling:
   - Professional typography
   - Color system
   - Spacing guidelines
   - Component themes

#### **Performance Optimization**

1. Implement data loading strategies:

   - Progressive category loading
   - Question prefetching
   - AI response caching
   - Product data optimization

2. Add performance monitoring:
   - Loading time tracking
   - API call monitoring
   - Cache hit rates
   - Error tracking

#### **Testing and Quality Assurance**

1. Implement testing suite:

   - Component unit tests
   - Integration tests for data flow
   - AI response testing
   - Performance benchmarks

2. Add monitoring and logging:
   - Error tracking
   - Usage analytics
   - Performance metrics
   - API call monitoring

#### **Deployment and CI/CD**

1. Set up deployment pipeline:

   - Environment configuration
   - Build optimization
   - Automated testing
   - Deployment automation

2. Implement monitoring:
   - Error tracking
   - Performance monitoring
   - Usage analytics
   - Status notifications

#### **Documentation**

1. Create technical documentation:

   - Setup instructions
   - API documentation
   - Component usage guides
   - Database schema details

2. Prepare user guides:
   - Stylist onboarding guide
   - Feature documentation
   - Best practices
   - Troubleshooting guide

---
