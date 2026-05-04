import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(`[Shell] MFE "${this.props.name}" crashed:`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mfe-error">
          MFE "{this.props.name}" indisponible.
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
