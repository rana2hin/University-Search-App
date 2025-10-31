# Project Roadmap

This document outlines the future direction and potential features for the US University Explorer application. The roadmap is divided into short-term, medium-term, and long-term goals.

---

## Short-Term (Immediate Polish)

These are goals focused on improving the existing application and user experience.

-   **[UI/UX] Accessibility Improvements**:
    -   Conduct a full accessibility audit (WCAG).
    -   Add ARIA attributes where necessary, especially for interactive elements like the filter and modal.
    -   Ensure full keyboard navigability for all features.

-   **[AI] Prompt Engineering & Refinement**:
    -   Experiment with different prompts for the `AdmissionRequirementsModal` to improve the consistency and accuracy of the JSON output.
    -   Add more robust logic to handle cases where the model returns an error or refuses the request.

-   **[Feature] Persist User Settings**:
    -   Use `localStorage` to save the user's selected state filters and active tab (List/Map) between browser sessions.
    -   **Note**: Persisting the AI cache in `localStorage` can also be done but will be superseded by the medium-term backend goal.

-   **[Performance] List View Optimization**:
    -   Implement list virtualization (windowing) for the university card list to improve performance when displaying a very large number of universities.

---

## Medium-Term (Major New Features)

These goals involve adding significant new features that expand the application's capabilities, with a focus on a shared backend.

-   **[Data] Shared, Persistent Caching via Backend**:
    -   **This is the most critical next step.** Transition the current, temporary client-side cache to a shared, persistent backend cache.
    -   **Implementation**: Use a Backend-as-a-Service (BaaS) platform like **Firebase (Firestore)** or **Supabase**.
    -   **Benefit**: This will allow all users to benefit from previous searches made by anyone, making the app significantly faster for everyone and drastically reducing the total number of Gemini API calls. The cache will also persist between sessions.

-   **[Feature] Advanced Filtering & Sorting**:
    -   Add a "Sort By" option (e.g., alphabetically, by state).
    -   Introduce new filter criteria, such as by university name (search input) or region (e.g., "Northeast," "West Coast").

-   **[Feature] University Comparison Tool**:
    -   Allow users to select up to 3-4 universities.
    -   Display the AI-fetched admission requirements for the selected universities in a side-by-side table for easy comparison.

-   **[Feature] User Accounts**:
    -   Implement user authentication (e.g., using Firebase Authentication).
    -   Allow logged-in users to save a list of "favorite" universities.
    -   Save AI search results to a user's profile.

---

## Long-Term (Vision)

These are ambitious, long-term goals that would transform the application into a comprehensive platform for prospective students.

-   **[AI] Conversational AI Assistant**:
    -   Integrate a Gemini-powered chatbot into the interface.
    -   The chatbot could answer natural language questions like, "Show me universities in California with a good data science program" or "What are the GRE requirements for UT Austin?".

-   **[Feature] Application Tracker**:
    -   Create a dashboard where users can add the universities they are applying to.
    -   Allow them to track application deadlines, submission status, and results.

-   **[Data] Deeper Data Integration**:
    -   Integrate with public APIs to pull in more dynamic data for each university, such as average acceptance rates, tuition costs, and student population size.
    -   Visualize this data with charts and graphs on a dedicated university details page.

-   **[Community] User Reviews and Notes**:
    -   Allow authenticated users to leave public reviews or private notes on university pages, creating a community-driven knowledge base.
