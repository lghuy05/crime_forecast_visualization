export const dashboardStyles = {
  // Layout
  container: "min-h-screen bg-gray-100",

  // Navigation
  nav: "bg-white shadow-sm border-b border-gray-200",
  navContainer: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  navContent: "flex justify-between h-16",
  navLeft: "flex items-center",
  navRight: "flex items-center space-x-4",

  // Text
  title: "text-xl font-semibold text-gray-900",
  welcomeText: "text-gray-700 font-medium",

  // Buttons
  logoutButton: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",

  // Main Content
  main: "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8",
  contentContainer: "px-4 py-6 sm:px-0",
  placeholder: "border-4 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center bg-gray-50",
  placeholderText: "text-gray-500 text-lg"
} as const;
