# US University Explorer

A modern, interactive web application designed to help prospective students and researchers explore universities across the United States. This tool provides a filterable, dual-view interface (list and map) and leverages the power of the Google Gemini API to fetch detailed graduate program admission requirements on demand.

---

## Key Features

-   **Interactive Dual View**: Seamlessly switch between a detailed **List View** and a geographic **Map View** to visualize university locations.
-   **Dynamic State Filtering**: Easily filter universities by one or more states using a modern, searchable multi-select dropdown.
-   **Real-Time Local Clocks**: Each university card displays the institution's current local time, calculated based on its longitude.
-   **Smart Mailing Status**: A color-coded label on each card indicates whether it's a good time to email, a bad time, or if staff are likely asleep, helping users time their communications effectively.
-   **AI-Powered Admission Search**: Click the "Admission Info" button on any university to trigger a Gemini API call. The AI uses Google Search to find and display detailed admission requirements for graduate programs (MS/PhD) in Statistics, Data Science, and related fields.
-   **Intelligent Caching**: AI search results are cached after the first request. Subsequent views of the same university's admission info are instantaneous, improving performance and reducing redundant API calls. A "Search Again" button allows for fetching fresh data when needed.
-   **Formatted Data Table**: The AI-generated admission data is presented in a clean, scrollable, and easy-to-read table.
-   **Copy to Clipboard**: A convenient "Copy Table" button allows users to export the admission data for use in spreadsheets or other documents.
-   **Responsive Design**: A polished, dark-mode UI that is fully responsive and works beautifully on devices of all sizes.

---

## Technology Stack

-   **Frontend Framework**: [React](https://reactjs.org/) (v19) with [TypeScript](https://www.typescriptlang.org/) for robust, type-safe component development.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a utility-first, responsive, and highly customizable design system.
-   **Mapping Library**: [Leaflet.js](https://leafletjs.com/) for the lightweight and interactive map view.
-   **AI & Search**: [Google Gemini API](https://ai.google.dev/) (`gemini-2.5-pro` model) with **Google Search grounding** for fetching real-time, accurate information from the web.
-   **Development Environment**: The application is built to run in a modern browser environment that supports ES Modules and `importmap`.

---

## Getting Started

This project is designed to run in a browser-based development environment where the Gemini API key is securely managed as an environment variable (`process.env.API_KEY`).

### Prerequisites

-   A modern web browser (e.g., Chrome, Firefox, Edge).
-   The `API_KEY` environment variable must be available in the execution context.

### Running the Application

1.  Ensure all project files are in their correct directory structure.
2.  Serve the `index.html` file using a simple local server. A tool like `serve` can be used:
    ```bash
    npx serve .
    ```
3.  Open the provided local server address in your web browser. The application will mount and be ready to use.

---

## Project Structure

The project follows a standard React component-based architecture:

```
.
├── docs/
│   ├── ARCHITECTURE.md  # Detailed technical architecture
│   ├── README.md        # This file
│   └── ROADMAP.md       # Future plans and features
├── components/
│   ├── AdmissionRequirementsModal.tsx # AI-powered modal for fetching data
│   ├── MapView.tsx                     # Leaflet map component
│   ├── StateFilter.tsx                 # Sidebar filter component
│   ├── UniversityCard.tsx              # Card for the list view
│   └── icons.tsx                       # Reusable SVG icon components
├── hooks/
│   └── useLocalTime.ts    # Custom hook for local time calculation
├── utils/
│   └── location.ts        # Utility functions (e.g., getUniqueStates)
├── App.tsx                # Main application component, manages state and layout
├── index.html             # Entry point, loads scripts and styles
├── index.tsx              # Mounts the React application
├── universityData.ts      # Static university data source
└── types.ts               # Shared TypeScript types and interfaces
```

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.