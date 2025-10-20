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
      <div className="w-full max-w-7xl px-4 sm:px-6 pb-32">
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
          <div className="border border-gray-800 rounded-xl p-8 bg-grey-900 hover:border-teal-800/50 transition-colors">
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
            <div className="border border-gray-800 rounded-xl p-6 bg-grey-900 hover:border-teal-800/50 transition-colors">
              <div className="flex items-start gap-3 mb-4">
                <FileWarning className="w-6 h-6 text-teal-400 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Outdated docs</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Documentation that's incomplete, outdated, or doesn't exist at all
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
            <div className="border border-gray-800 rounded-xl p-6 bg-grey-900 hover:border-teal-800/50 transition-colors">
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
    </div>
  );
}