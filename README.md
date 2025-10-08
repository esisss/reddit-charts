# Reddit Charts 📊

[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TanStack Router](https://img.shields.io/badge/TanStack_Router-FF4154?logo=react&logoColor=white)](https://tanstack.com/router)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?logo=react&logoColor=white)](https://tanstack.com/query)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)
[![Reddit API](https://img.shields.io/badge/Reddit%20API-FF4500?logo=reddit&logoColor=white)](https://www.reddit.com/dev/api/)

A data visualization tool that fetches and displays Reddit post metrics using modern web technologies.

[Live Demo](https://reddit-charts.vercel.app/)

## 🚀 Features

- **Interactive Charts**: Visualize Reddit post metrics with responsive and interactive charts
- **Real-time Data**: Fetches fresh data from Reddit's API
- **Modern Stack**: Built with React 19, TypeScript, and Vite
- **State Management**: Efficient data fetching and caching with TanStack Query
- **Routing**: Client-side routing with TanStack Router
- **Responsive Design**: Works on desktop and mobile devices
- **UI Components**: Built with Radix UI for accessible components

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **State Management**: TanStack Query (React Query), Zustand
- **Routing**: TanStack Router (File routes)
- **UI Components**: Radix UI with Themes
- **Data Visualization**: Chart.js 4.5 with react-chartjs-2
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/reddit-charts.git
   cd reddit-charts
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm run dev
   ```

4. **Open in your browser**
   ```
   http://localhost:5173
   ```

## 📊 Project Structure

```
src/
├── api/           # API client and services
├── components/    # Reusable UI components
├── containers/    # Page components
├── context/       # React context providers
├── hooks/         # Custom React hooks
└── routes/        # Application routes
```

## 📝 TODO

- Add more chart types
- Improve mobile responsiveness
- Add light/dark mode
- Replicate similar features for users data

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

### Known Limitations

- Reddit’s public API does not expose all comments of a post in a single request.
- Retrieving the full comment tree requires multiple paginated requests and the use of the `morechildren` endpoint.
- This leads to a very high number of requests, which often triggers `429 Too Many Requests` (rate limiting).
- Rate-limited responses may also omit CORS headers, which makes the error appear as a CORS issue in the browser.
- Because of this structural bottleneck, some charts (like _comment activity per hour/day/month/year_) could not be included in this project, even though they would have been interesting visualizations.

---

Built with ❤️ by esisss
