import { IMAGE_URL } from "@/constant/constant";
import { ScrollArea } from "./ui/scroll-area";
import { ArrowUpRight, Loader2, SearchX } from "lucide-react";

export interface SearchSuggestion {
  masukien: string;
  tensukien: string;
  anhsukienngang?: string;
}

interface SearchModalProps {
  open: boolean;
  query: string;
  suggestions: SearchSuggestion[];
  isLoading: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onSelect: (suggestion: SearchSuggestion) => void;
}

export default function SearchModal({
  open,
  query,
  suggestions,
  isLoading,
  onClose,
  onSubmit,
  onSelect,
}: SearchModalProps) {
  if (!open) return null;

  return (
    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800">
            Gợi ý cho "{query}"
          </p>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Đóng
          </button>
        </div>

        <ScrollArea className="max-h-96">
          {isLoading ? (
            <div className="flex items-center justify-center py-10 gap-2 text-gray-500">
              <Loader2 className="animate-spin" size={18} />
              <span>Đang tìm kiếm sự kiện...</span>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500 gap-2">
              <SearchX size={24} />
              <p>Không tìm thấy sự kiện phù hợp</p>
            </div>
          ) : (
            <div className="divide-y">
              {suggestions.map((item) => (
                <button
                  key={item.masukien}
                  type="button"
                  className="w-full text-left px-5 py-3 hover:bg-gray-50 transition flex gap-4 items-center"
                  onClick={() => onSelect(item)}
                >
                  <div className="w-28 h-20 rounded-xl overflow-hidden bg-gray-100">
                    {item.anhsukienngang ? (
                      <img
                        src={IMAGE_URL + item.anhsukienngang}
                        alt={item.tensukien}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-base leading-tight text-gray-900 line-clamp-2">
                      {item.tensukien}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Nhấn để xem chi tiết
                    </p>
                  </div>
                  <ArrowUpRight className="text-blue-500" size={18} />
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="flex items-center justify-between px-5 py-3 border-t bg-gray-50">
          <p className="text-xs text-gray-500">Đang hiển thị tối đa 3 gợi ý.</p>
          <button
            type="button"
            onClick={onSubmit}
            className="text-sm font-semibold text-green-600 hover:text-green-700"
          >
            Xem tất cả
          </button>
        </div>
      </div>
    </div>
  );
}
