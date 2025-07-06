import React, { Component, ErrorInfo, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

// Function to save errors to localStorage with a fun message
const cacheError = (error: Error, errorInfo: ErrorInfo) => {
  console.log(
    "%c👾 Whoops! An error just popped up. Don't worry, I've caught it! 👾",
    "color: #ff00ff; font-size: 16px; font-weight: bold;"
  );
  console.log("Error details have been cached. To view the log, run this in your console:");
  console.log("%cJSON.parse(localStorage.getItem('errorLog'))", "color: #00ff00; font-family: monospace;");

  const errorLog = JSON.parse(localStorage.getItem('errorLog') || '[]');
  const newError = {
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    timestamp: new Date().toISOString(),
  };
  errorLog.push(newError);
  localStorage.setItem('errorLog', JSON.stringify(errorLog));
};

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    cacheError(error, errorInfo);
    toast({
      title: "🤖 Uh oh! An error occurred! 🤖",
      description: "I've logged the details. The dev team will get right on it!",
      variant: "destructive",
    });
  }

  public render() {
    if (this.state.hasError) {
      // A more user-friendly fallback UI
      return (
        <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial, sans-serif' }}>
          <h1>💥 Something went wrong! 💥</h1>
          <p>We've logged the issue and will work on a fix.</p>
          <p>Please refresh the page to continue.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
