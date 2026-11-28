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
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#fafafa] dark:bg-[#141415] text-[#171717] dark:text-[#ededed]">
          <div className="max-w-lg w-full surface-panel p-8 text-center space-y-5">
            <div className="w-10 h-10 mx-auto rounded-lg bg-[#e11d48]/10 text-[#e11d48] flex items-center justify-center">
              <FiAlertTriangle className="w-5 h-5 dispatch-icon" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-medium">Something went wrong</h2>
              <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
                An unexpected interface error occurred. Your core emergency dispatch routes remain active.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left bg-[#f4f4f5] dark:bg-[#0f0f10] p-4 rounded-lg text-xs font-mono text-[#dc2626] dark:text-[#e5484d] overflow-auto max-h-36 border border-zinc-900/10 dark:border-white/10">
                {this.state.error.toString()}
              </div>
            )}

            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="btn-solid px-5"
            >
              <FiRefreshCw className="w-4 h-4 dispatch-icon" /> Reload application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
