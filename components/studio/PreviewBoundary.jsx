"use client";

import {Component} from "react";

// Keeps a render crash inside the preview from taking down the whole Studio
// page, which would also discard whatever is typed in the editor. The boundary
// clears itself when `resetKey` changes (for example after a new Render).
export default class PreviewBoundary extends Component {
  state = {error: null};

  static getDerivedStateFromError(error) {
    return {error};
  }

  componentDidCatch(error) {
    console.error("Preview gagal dirender:", error);
  }

  componentDidUpdate(previous) {
    if (this.state.error && previous.resetKey !== this.props.resetKey) {
      this.setState({error: null});
    }
  }

  render() {
    if (!this.state.error) return this.props.children;
    if (this.props.fallback !== undefined) return this.props.fallback;
    return (
      <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">
        <p className="font-semibold">Preview tidak dapat dirender.</p>
        <p className="mt-1 break-words">{String(this.state.error?.message || this.state.error)}</p>
        <p className="mt-2">Source di editor tidak hilang. Perbaiki JSON, lalu tekan Render carousel.</p>
      </div>
    );
  }
}
