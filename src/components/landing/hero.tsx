"use client";

import { Button } from "@/components/ui/button";
import { Clock, FileWarning, Users, AlertCircle, AlertTriangle, Minus } from "lucide-react";

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Hero Section - Full Screen */}
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 sm:px-6">
        <h1
          className="flex flex-col text-7xl font-medium items-center justify-center"
          style={{ lineHeight: "1.2" }}
        >
          <span className="block text-foreground" style={{ textShadow: "0 0 4px currentColor" }}>
            Navigate any codebase
          </span>
          <span className="text-accent" style={{ textShadow: "0 0 4px currentColor" }}>
            in minutes, not months
          </span>
        </h1>
        <p className="pt-2 text-foreground my-3 text-sm sm:mt-5 lg:mb-0 sm:text-base lg:text-lg text-center max-w-4xl">
          CodeCompass is <span className="font-semibold italic">the</span>{" "}
          <span className="text-accent font-semibold italic">open-source</span>{" "}
          AI-powered code navigation tool.
          <br />
          Index your project • Generate documentation • Onboard your team using RAG test powered chat
        </p>
        <div className="flex flex-row gap-4">
          <Button>Get started</Button>
          <Button variant="outline">Our Features</Button>
        </div>
      </div>

      {/* Developer Onboarding Crisis Section */}
      <div className="w-full max-w-7xl px-4 sm:px-6 pb-16">
        <h2 className="text-4xl font-bold text-center mb-4">
          The Developer Onboarding Crisis
        </h2>
        <p className="text-gray-400 text-center text-lg mb-16 max-w-3xl mx-auto">
          New employees spend months familiarizing themselves with complex 
          company codebases before making meaningful contributions
        </p>

        {/* Asymmetric Grid Layout */}
        <div className="space-y-6">
          {/* Large Card - Full Width */}
          <div className="border border-gray-800 rounded-xl p-8 bg-background hover:border-teal-800/50 transition-colors">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-4">
                  <Clock className="w-8 h-8 text-teal-400 mt-1" />
                  <div>
                    <h3 className="text-3xl font-semibold mb-3">3-6 months</h3>
                    <p className="text-gray-400 text-base">
                      Average time for developers to become productive in a new codebase
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-sm text-gray-500">Slow ramp-up time costs companies thousands in lost productivity</span>
                </div>
              </div>

              {/* Visual representation */}
              <div className="flex-1">
                <div className="p-6 bg-black/40 rounded-lg border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500 font-mono">Productivity Timeline</span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-800 rounded overflow-hidden">
                      <div className="h-full w-1/6 bg-teal-500/50"></div>
                    </div>
                    <div className="h-3 bg-gray-800 rounded overflow-hidden">
                      <div className="h-full w-2/6 bg-teal-500/50"></div>
                    </div>
                    <div className="h-3 bg-gray-800 rounded overflow-hidden">
                      <div className="h-full w-3/6 bg-teal-400/50"></div>
                    </div>
                    <div className="h-3 bg-gray-800 rounded overflow-hidden">
                      <div className="h-full w-5/6 bg-teal-300/50"></div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-3 text-sm text-gray-600">
                    <span>Month 1</span>
                    <span>Month 6</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two Smaller Cards - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 2 - Outdated Docs */}
            <div className="border border-gray-800 rounded-xl p-6 bg-background hover:border-teal-800/50 transition-colors">
              <div className="flex items-start gap-3 mb-4">
                <FileWarning className="w-6 h-6 text-teal-400 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Outdated docs</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Documentation that is incomplete, outdated, or does not exist at all
                  </p>
                </div>
              </div>

              {/* Visual representation */}
              <div className="mt-6 p-4 bg-black/40 rounded-lg border border-gray-800 space-y-2">
                <div className="flex items-center gap-2 opacity-40">
                  <div className="w-3 h-3 rounded bg-gray-700"></div>
                  <div className="h-2 bg-gray-800 rounded flex-1"></div>
                  <span className="text-xs text-gray-600">2019</span>
                </div>
                <div className="flex items-center gap-2 opacity-50">
                  <div className="w-3 h-3 rounded bg-gray-700"></div>
                  <div className="h-2 bg-gray-800 rounded flex-1"></div>
                  <span className="text-xs text-gray-600">2021</span>
                </div>
                <div className="flex items-center gap-2 opacity-30">
                  <div className="w-3 h-3 rounded bg-gray-700"></div>
                  <div className="h-2 bg-gray-800 rounded flex-1 line-through"></div>
                  <span className="text-xs text-red-500">Missing</span>
                </div>
                <div className="flex items-center gap-2 opacity-60">
                  <div className="w-3 h-3 rounded bg-gray-700"></div>
                  <div className="h-2 bg-gray-800 rounded flex-1"></div>
                  <span className="text-xs text-gray-600">2020</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-xs text-gray-500">Knowledge gaps</span>
              </div>
            </div>

            {/* Card 3 - Team Bottlenecks */}
            <div className="border border-gray-800 rounded-xl p-6 bg-background hover:border-teal-800/50 transition-colors">
              <div className="flex items-start gap-3 mb-4">
                <Users className="w-6 h-6 text-teal-400 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Team bottlenecks</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Senior developers constantly interrupted to explain code architecture
                  </p>
                </div>
              </div>

              {/* Visual representation */}
              <div className="mt-6 p-4 bg-black/40 rounded-lg border border-gray-800">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-teal-500/20 border-2 border-teal-400 flex items-center justify-center">
                      <span className="text-xs font-mono text-teal-400">Sr</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {[1,2,3,4,5,6].map((i) => (
                    <AlertCircle key={i} className="w-6 h-6 text-gray-600" />
                  ))}
                </div>
                <div className="mt-3 text-center text-xs text-gray-600">
                  Constant interruptions
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Minus className="w-4 h-4 text-red-400" />
                <span className="text-xs text-gray-500">Reduced productivity</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Features Section */}
      <div className="w-full max-w-7xl px-4 sm:px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-4">
          Main Features of CodeCompass
        </h2>
        <p className="text-gray-400 text-center text-lg mb-16 max-w-3xl mx-auto">
          Everything you need to understand, navigate, and contribute to any codebase from day one.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* RAG-Powered Chat */}
          <div className="border border-gray-800 rounded-xl p-8 bg-background hover:border-teal-800/50 transition-colors">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-6 flex items-center justify-center">
                <svg className="w-16 h-16 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">RAG-Powered Chat</h3>
              <p className="text-gray-400">
                Ask questions about any part of your codebase and get instant, contextual answers.
              </p>
            </div>
          </div>

          {/* Auto Documentation */}
          <div className="border border-gray-800 rounded-xl p-8 bg-background hover:border-teal-800/50 transition-colors">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-6 flex items-center justify-center">
                <svg className="w-16 h-16 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Auto Documentation</h3>
              <p className="text-gray-400">
                Generate comprehensive documentation that stays in sync with your code changes.
              </p>
            </div>
          </div>

          {/* Component Trees */}
          <div className="border border-gray-800 rounded-xl p-8 bg-background hover:border-teal-800/50 transition-colors">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-6 flex items-center justify-center">
                <svg className="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Component Trees</h3>
              <p className="text-gray-400">
                Visualize code architecture with interactive component and dependency diagrams.
              </p>
            </div>
          </div>

          {/* Enterprise Ready */}
          <div className="border border-gray-800 rounded-xl p-8 bg-background hover:border-teal-800/50 transition-colors">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-6 flex items-center justify-center">
                <svg className="w-16 h-16 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Enterprise Ready</h3>
              <p className="text-gray-400">
                Deploy locally for security or use our hosted solution for quick testing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How CodeCompass Will Stand Apart Section */}
      <div className="w-full max-w-7xl px-4 sm:px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-4">
          How CodeCompass will stand apart
        </h2>
        <p className="text-gray-400 text-center text-lg mb-16 max-w-3xl mx-auto">
          Unlike other solutions, CodeCompass combines AI-powered exploration with 
          automatic documentation and enterprise-grade deployment options.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Traditional Documentation */}
          <div className="border border-gray-800 rounded-xl p-6 bg-background">
            <h3 className="text-xl font-semibold mb-6">Traditional Documentation</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span className="text-gray-400 text-sm">Manual updates required</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span className="text-gray-400 text-sm">Quickly becomes outdated</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span className="text-gray-400 text-sm">Static, non-interactive</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span className="text-gray-400 text-sm">No contextual answers</span>
              </li>
            </ul>
          </div>

          {/* CodeCompass - Center Highlighted Card */}
          <div className="border-2 border-teal-500 rounded-xl p-6 bg-background relative">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-xs">✓</div>
              <h3 className="text-xl font-semibold">CodeCompass</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">✓</span>
                <span className="text-foreground text-sm font-medium">AI-powered exploration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">✓</span>
                <span className="text-foreground text-sm font-medium">Auto-generated docs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">✓</span>
                <span className="text-foreground text-sm font-medium">Interactive chat interface</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">✓</span>
                <span className="text-foreground text-sm font-medium">Multi-platform support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">✓</span>
                <span className="text-foreground text-sm font-medium">Local & cloud deployment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">✓</span>
                <span className="text-foreground text-sm font-medium">Open source</span>
              </li>
            </ul>
          </div>

          {/* Other Such Tools */}
          <div className="border border-gray-800 rounded-xl p-6 bg-background">
            <h3 className="text-xl font-semibold mb-6">Other Such Tools</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span className="text-gray-400 text-sm">Limited platform support (only GitHub)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span className="text-gray-400 text-sm">Cloud-only solutions (No self-hosting option)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span className="text-gray-400 text-sm">Proprietary systems (Not Open Source)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Demo/Examples Section */}
      <div className="w-full max-w-7xl px-4 sm:px-6 pb-16">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="text-teal-400 font-semibold">AI-Powered Solution</span>
        </div>
        <h2 className="text-4xl font-bold mb-4">
          CodeCompass will include an AI guide to any codebase
        </h2>
        <p className="text-gray-400 text-lg mb-16 max-w-8xl">
          CodeCompass aims to transforms how developers explore and understand code. The RAG-powered chatbot will provide instant answers, while automatic documentation generation will keep everything up-to-date.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Features list */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-teal-500 mt-1">✓</span>
              <span className="text-foreground">Instant answers to codebase questions</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-teal-500 mt-1">✓</span>
              <span className="text-foreground">Automatic documentation generation</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-teal-500 mt-1">✓</span>
              <span className="text-foreground">Visual component tree diagrams</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-teal-500 mt-1">✓</span>
              <span className="text-foreground">Multi-platform repository support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}