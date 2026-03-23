import { Plus } from "lucide-react";

export function CurrentlyReading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[#F3F4F6]" style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.45px" }}>
          Currently Reading
        </h2>
        <button className="text-red-500" style={{ fontSize: 12, fontWeight: 600 }}>
          View All
        </button>
      </div>

      {/* Add Book Card */}
      <div
        className="rounded-[14px] bg-[#1a0a28] relative"
        style={{ border: "2px dashed #2d1142" }}
      >
        <div className="flex items-center gap-3 px-5 py-5">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #FF0000 0%, #1031C6 100%)" }}
          >
            <Plus size={20} color="white" strokeWidth={2} />
          </div>
          <div>
            <p className="text-[#F3F4F6]" style={{ fontSize: 14, fontWeight: 700 }}>
              Add Book
            </p>
            <p className="text-[#6B7280]" style={{ fontSize: 12 }}>
              Start tracking a new read
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
