import { ChevronLeft } from "lucide-react";

const MySchedulePage = ({ navigate }: any) => {
  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="flex item-center h-14 px-4 border-b border-gary-200 bg-white shrink-0">
        <button
          onClick={() => navigate("detail")}
          className="text-gray-900 p-1 rounded-full"
        >
          <ChevronLeft size={28} />
        </button>
        <span className="text-base font-bold ml-2">내 여행 배낭</span>
      </div>
    </div>
  );
};

export default MySchedulePage;
