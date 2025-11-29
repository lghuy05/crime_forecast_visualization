export const loginStyles = {
  // Layout
  container: "min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8",
  card: "max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-8 border border-gray-200",

  // Header
  header: "text-center space-y-3",
  iconContainer: "mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center",
  title: "text-3xl font-bold text-gray-900 tracking-tight",
  subtitle: "text-gray-600 text-sm",

  // Form
  form: "space-y-6",

  // Error
  errorContainer: "bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3",
  errorIcon: "w-5 h-5 text-red-500 mt-0.5 flex-shrink-0",
  errorText: "text-red-700 text-sm",

  // Input Groups
  inputGroup: "space-y-2",
  label: "block text-sm font-medium text-gray-700",
  input: "block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",

  // Button
  button: "w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
  loadingContainer: "flex items-center space-x-2",
  spinner: "animate-spin w-4 h-4"
} as const;
