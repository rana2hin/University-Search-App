# Application Architecture

This document provides a detailed overview of the technical architecture for the US University Explorer application.

## 1. Core Technologies

### 1.1. Frontend Framework
The application is a **Single Page Application (SPA)** built using **React (v19)** and **TypeScript**.
-   **React** was chosen for its component-based architecture, which promotes reusability and maintainability. Its virtual DOM ensures efficient UI updates.
-   **TypeScript** is used to add static typing to JavaScript. This improves developer experience by catching errors early, enabling better autocompletion, and making the codebase more self-documenting and robust, which is crucial as the application scales.

### 1.2. Styling
Styling is handled by **Tailwind CSS**.
-   This utility-first CSS framework allows for rapid UI development directly within the JSX markup. It avoids the need for separate CSS files for component-specific styles, leading to a more streamlined workflow.
-   The dark-mode theme and responsive design are implemented using Tailwind's built-in variants (`md:`, `lg:`, `hover:`, etc.), ensuring a consistent and modern look across all devices.

### 1.3. Mapping
The interactive map view is powered by **Leaflet.js**.
-   Leaflet was chosen as a lightweight, open-source, and highly performant mapping library. It has a simple API and is well-suited for displaying custom markers on a map.
-   A dark-themed tile layer from **CartoDB** is used to match the application's overall aesthetic.

### 1.4. AI and Search
The "Admission Info" feature is powered by the **Google Gemini API (`@google/genai` SDK)**.
-   The **`gemini-2.5-pro` model** is used for its advanced reasoning and instruction-following capabilities.
-   **Google Search Grounding** (`tools: [{ googleSearch: {} }]`) is a critical part of the integration. It allows the Gemini model to access real-time information from Google Search, ensuring the admission data it retrieves is up-to-date and accurate.
-   The prompt is carefully engineered to request a **JSON-formatted string**, as the API does not support forcing a JSON response schema when a tool like `googleSearch` is active. Robust parsing logic is implemented on the client-side to handle potential variations in the model's text output.

## 2. Component Structure

The application is broken down into several functional components:

-   **`App.tsx` (Root Component)**:
    -   Acts as the main container for the entire application.
    -   Manages the top-level state, including the active tab (`list` or `map`), the list of selected states for filtering, the AI search results cache, and the visibility of the modal.
    -   Passes state and callback functions down to child components as props.
    -   Renders the main layout, including the sidebar and the main content panel.

-   **`StateFilter.tsx`**:
    -   A reusable component responsible for rendering the state selection UI in the sidebar.
    -   It manages its own internal state for the search term.
    -   It receives the list of states and the currently selected states from `App.tsx` and calls back `onStateChange` or `onClear` when the user interacts with it.

-   **`UniversityCard.tsx`**:
    -   Displays information for a single university in the list view.
    -   It is a presentational component that receives a `university` object as a prop.
    -   It utilizes the `useLocalTime` custom hook to calculate and display the university's local time and mailing status.

-   **`MapView.tsx`**:
    -   Integrates the Leaflet.js library to display universities on a map.
    -   It uses `useEffect` hooks to initialize the map once and to update the markers whenever the `filteredUniversities` prop changes.
    -   Markers are cleared and redrawn on each update to ensure the map accurately reflects the current filter selection.

-   **`AdmissionRequirementsModal.tsx`**:
    -   Handles the entire AI interaction flow.
    -   First checks if data for the selected university exists in the cache prop. If so, it displays it instantly.
    -   If no cached data is found, it triggers an asynchronous `fetchAdmissionData` function.
    -   Manages its own loading, data, and error states to provide clear feedback to the user.
    -   Makes the API call to the Gemini API and parses the response.
    -   On a successful fetch, it calls the `onCacheResults` callback to store the new data in the parent `App` component's state.
    -   Renders the data in a formatted table and provides "Copy Table" and "Search Again" functionality.

-   **`icons.tsx`**:
    -   A central file that exports all SVG icons as React components. This promotes consistency and makes it easy to manage and reuse icons throughout the app.

## 3. State Management & Data Flow

The application employs a simple, top-down data flow using React's built-in hooks.

1.  **Data Source**: The `universityData.ts` file acts as the primary, static data source.
2.  **Central State**: The `App.tsx` component is the single source of truth for application-wide state (selected filters, active tab, AI results cache).
3.  **Derived State**: `useMemo` is used to efficiently recalculate the `filteredUniversities` list only when `selectedStates` changes. This prevents unnecessary re-rendering and computation.
4.  **Props Drilling**: State and callbacks are passed down from `App` to child components via props. For example, `StateFilter` receives `selectedStates` and `onStateChange`.
5.  **Event Handling**: User interactions in child components (e.g., checking a state box) trigger callback functions (`onStateChange`) passed down from `App`, which then updates the central state.
6.  **Re-rendering**: The state update in `App` causes it and its children to re-render with the new, filtered data.

### 3.1. Client-Side Caching
To enhance performance and reduce API calls, the application implements a client-side, in-memory cache for AI search results.
-   **Storage**: A state variable `cachedResults` in `App.tsx` holds the cache as an object, mapping university names to their fetched admission data.
-   **Lifecycle**: This cache is **ephemeral**, meaning it is cleared when the user refreshes or closes the browser tab. It is not shared between different users.
-   **Flow**:
    -   When the `AdmissionRequirementsModal` is opened, `App.tsx` passes any existing cached data for that university to the modal.
    -   The modal displays this cached data instantly.
    -   If no cached data exists, the modal performs a new API fetch.
    -   Upon a successful fetch, the modal uses the `onCacheResults` callback to send the new data back up to `App.tsx`, where it is stored in the `cachedResults` state for future use.

This unidirectional data flow makes the application's logic predictable and easier to debug. For a more complex application, a state management library like Redux or Zustand could be considered, but for the current scope, React hooks are sufficient and effective.