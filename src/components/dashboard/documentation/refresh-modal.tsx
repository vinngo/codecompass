import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface RefreshModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RefreshModal({ isOpen, onClose }: RefreshModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-96">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Refresh this wiki</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-300" />
          </button>
        </div>
        <input
          type="email"
          placeholder="Enter email to refresh"
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
        />
        <Button className="w-full bg-teal-600 hover:bg-teal-700">
          Refresh
        </Button>
      </div>
    </div>
  );
}