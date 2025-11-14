"use client";

import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface LLMModel {
  id: string;
  name: string;
  provider: string;
}

export const AVAILABLE_MODELS: LLMModel[] = [
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "OpenAI"
  },
  {
    id: "claude-4.5-sonnet",
    name: "Claude 4.5 Sonnet",
    provider: "Anthropic"
  },
  {
    id: "llama-4",
    name: "Llama 4",
    provider: "Meta"
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek"
  },
  {
    id: "grok-4",
    name: "Grok",
    provider: "xAI"
  }
];

interface ModelSelectorProps {
  selectedModel: LLMModel;
  onSelectModel: (model: LLMModel) => void;
}

export default function ModelSelector({ 
  selectedModel, 
  onSelectModel 
}: ModelSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg transition-colors text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs">{selectedModel.provider}</span>
            <span className="text-white font-medium text-xs">{selectedModel.name}</span>
          </div>
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        className="w-80 bg-gray-950 border-gray-800" 
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="text-xs font-semibold text-gray-400">
          SELECT MODEL
        </DropdownMenuLabel>
        
        <DropdownMenuGroup>
          {AVAILABLE_MODELS.map((model) => (
            <DropdownMenuItem
              key={model.id}
              onClick={() => onSelectModel(model)}
              className={`cursor-pointer ${
                selectedModel.id === model.id
                  ? 'bg-teal-600 text-white focus:bg-teal-600 focus:text-white'
                  : 'text-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2 w-full">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {model.name}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      selectedModel.id === model.id 
                        ? 'bg-teal-700 text-teal-100' 
                        : 'bg-gray-800 text-gray-400'
                    }`}>
                      {model.provider}
                    </span>
                  </div>
                </div>
                
                {selectedModel.id === model.id && (
                  <Check className="w-4 h-4 flex-shrink-0" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>


      </DropdownMenuContent>
    </DropdownMenu>
  );
}