import React, { Component } from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('SafeHaven UI Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 text-white">
          <div className="max-w-md w-full glass-card p-8 rounded-3xl text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-pink-500/20 text-pink-500 rounded-full flex items-center justify-center text-3xl">
              <FiAlertTriangle />
            </div>
            <h2 className="text-2xl font-bold font-heading">Something went wrong</h2>
            <p className="text-sm text-slate-400">
              An unexpected interface error occurred. Don't worry, your safety features remain operational.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-xl font-semibold transition"
            >
              <FiRefreshCw /> Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
