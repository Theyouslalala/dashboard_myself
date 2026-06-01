"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="card p-8 text-center">
            <div className="text-4xl mb-3 opacity-40">⚠</div>
            <p className="text-slate-500 text-sm font-mono">
              COMPONENT ERROR
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
