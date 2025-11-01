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

### 1.5. Backend & Database
The application uses **Firebase Firestore** as its backend database for caching.
-   **Firestore** is a flexible, scalable NoSQL document database that allows for real-time data synchronization.
-   It serves as a **persistent, shared cache** for AI-generated admission data. This significantly improves performance for all users and reduces costs by minimizing redundant API calls to the Gemini API.

### 1.6. Deployment Considerations
The application is designed as a static site, making it suitable for deployment on platforms like Vercel or Netlify. A critical aspect of the architecture is the secure handling of the Gemini API key.
-   The key is accessed via `process.env.API_KEY`. It is **not** hardcoded in the source.
-   In a deployed environment, this variable must be set in the hosting platform's settings. This ensures the key remains secret and is not exposed in the client-side code.

## 2. Component Structure

-   **`App.tsx` (Root Component)**: Manages top-level state (filters, active tab) and renders the main layout.
-   **`StateFilter.tsx`**: Renders the interactive state selection panel in the sidebar.
-   **`UniversityCard.tsx`**: Displays information for a single university and utilizes the `useLocalTime` hook.
-   **`MapView.tsx`**: Integrates Leaflet.js to display universities on a map, updating markers based on filters.
-   **`AdmissionRequirementsModal.tsx`**: Handles the entire AI and caching interaction flow. It is self-contained and manages its own data fetching from either Firestore or the Gemini API.
-   **`firebase.ts`**: Initializes the connection to the Firebase app and exports the Firestore database instance.
-   **`icons.tsx`**: A central file exporting all SVG icons as React components.

## 3. State Management & Data Flow

The application employs a unidirectional, top-down data flow using React's built-in hooks.

1.  **Data Source**: `universityData.ts` acts as the primary, static data source for the list of universities.
2.  **Central State**: `App.tsx` is the source of truth for UI state, such as the selected filters and the active tab.
3.  **Derived State**: `useMemo` is used to efficiently recalculate the `filteredUniversities` list only when `selectedStates` changes.
4.  **Props & Callbacks**: UI state and event handlers are passed from `App` to child components as props.

### 3.1. Persistent Caching with Firestore
The application leverages Firestore for a smart, persistent caching layer that is shared across all users.

-   **Data Model**: Firestore contains a single collection named `admission_data`. Each **document** in this collection has an ID corresponding to a university's name (e.g., `"Stanford University"`). The document itself contains a single field, `requirements`, which is an array of the admission data objects.
-   **Data Flow**:
    1.  When a user opens the `AdmissionRequirementsModal` for a university, the component first queries the `admission_data` collection in Firestore for a document whose ID matches the university's name.
    2.  **Cache Hit**: If the document is found, its `requirements` data is immediately fetched and rendered in the modal. A "Cached" badge is displayed.
    3.  **Cache Miss**: If the document does not exist, the modal triggers a call to the Gemini API to fetch new data.
    4.  Upon receiving a successful response from the API, the modal parses the data and then writes it to a new document in Firestore, using the university's name as the document ID.
    5.  This new data is now cached and available for any subsequent requests by any user, turning the cache miss into a cache hit for the future.