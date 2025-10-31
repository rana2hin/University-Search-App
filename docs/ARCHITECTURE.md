# Application Architecture

This document provides a detailed overview of the technical architecture for the US University Explorer application.

## 1. Core Technologies

### 1.1. Frontend Framework
The application is a **Single Page Application (SPA)** built using **React (v19)** and **TypeScript**.
-   **React** was chosen for its component-based architecture, which promotes reusability and maintainability. Its virtual DOM ensures efficient UI updates.
-   **TypeScript** is used to add static typing to JavaScript. This improves developer experience by catching errors early, enabling better autocompletion, and making the codebase more self-documenting and robust.

### 1.2. Styling
Styling is handled by **Tailwind CSS**.
-   This utility-first CSS framework allows for rapid UI development directly within the JSX markup. It avoids the need for separate CSS files for component-specific styles, leading to a more streamlined workflow.
-   The dark-mode theme and responsive design are implemented using Tailwind's built-in variants (`md:`, `lg:`, `hover:`, etc.).

### 1.3. Mapping
The interactive map view is powered by **Leaflet.js**.
-   Leaflet was chosen as a lightweight, open-source, and highly performant mapping library.
-   A dark-themed tile layer from **CartoDB** is used to match the application's overall aesthetic.

### 1.4. AI and Search
The "Admission Info" feature is powered by the **Google Gemini API (`@google/genai` SDK)**.
-   The **`gemini-2.5-pro` model** is used for its advanced reasoning and instruction-following capabilities.
-   **Google Search Grounding** (`tools: [{ googleSearch: {} }]`) is a critical part of the integration. It allows the Gemini model to access real-time information from Google Search, ensuring the admission data it retrieves is up-to-date.
-   The prompt is engineered to request a **JSON-formatted string**. Robust parsing logic is implemented on the client-side to extract the JSON from the model's text output, handling variations like markdown code blocks.

### 1.5. Deployment Considerations
The application is designed as a static site, making it suitable for deployment on platforms like Vercel or Netlify. A critical aspect of the architecture is the secure handling of the Gemini API key.
-   The key is accessed via `process.env.API_KEY`. It is **not** hardcoded in the source.
-   In a deployed environment, this variable must be set in the hosting platform's settings. This ensures the key remains secret and is not exposed in the client-side code.

## 2. Component Structure

-   **`App.tsx` (Root Component)**: Manages top-level state (filters, active tab, AI cache) and renders the main layout.
-   **`StateFilter.tsx`**: Renders the interactive state selection panel in the sidebar.
-   **`UniversityCard.tsx`**: Displays information for a single university and utilizes the `useLocalTime` hook.
-   **`MapView.tsx`**: Integrates Leaflet.js to display universities on a map, updating markers based on filters.
-   **`AdmissionRequirementsModal.tsx`**: Handles the entire AI interaction flow, including checking the cache, fetching data from the Gemini API, managing loading/error states, and saving new results back to the cache.
-   **`icons.tsx`**: A central file exporting all SVG icons as React components.

## 3. State Management & Data Flow

The application employs a unidirectional, top-down data flow using React's built-in hooks.

1.  **Data Source**: `universityData.ts` acts as the primary, static data source.
2.  **Central State**: `App.tsx` is the single source of truth for application-wide state.
3.  **Derived State**: `useMemo` is used to efficiently recalculate the `filteredUniversities` list only when `selectedStates` changes.
4.  **Props & Callbacks**: State and state-updating functions are passed from `App` to child components as props. User interactions in children trigger these callbacks to update the central state.

### 3.1. Client-Side Caching
To enhance performance and reduce API calls, the application implements a client-side, in-memory cache for AI search results.
-   **Storage**: A state variable `cachedResults` in `App.tsx` holds the cache as an object, mapping university names to their fetched admission data.
-   **Lifecycle**: This cache is **ephemeral**, meaning it is cleared when the user refreshes or closes the browser tab. It is not shared between different users or sessions.
-   **Flow**:
    -   When the `AdmissionRequirementsModal` is opened, `App.tsx` passes any existing cached data for that university to the modal.
    -   The modal displays this cached data instantly and provides a "Search Again" option.
    -   If no cached data exists, the modal performs a new API fetch.
    -   Upon a successful fetch, the modal uses the `onCacheResults` callback to send the new data back up to `App.tsx`, where it is stored in the `cachedResults` state.
