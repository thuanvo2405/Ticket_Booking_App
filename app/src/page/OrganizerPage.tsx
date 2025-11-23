import CreateOrganizer from "@/components/OrganizerPage/CreateOrganizer";
import EditOrganizer from "@/components/OrganizerPage/EditOrganizer";
import { IMAGE_URL } from "@/constant/constant";
import { useAuth } from "@/context/AuthProvider";
import { getOrganizerProfileAPI } from "@/services/organizerService";
import { useQuery } from "@tanstack/react-query";

export default function OrganizerPage() {
  const { user } = useAuth();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["fetchProfile"],
    queryFn: getOrganizerProfileAPI,
    enabled: user?.vaitro === "TO_CHUC",
  });

  if (user?.vaitro !== "TO_CHUC") return <CreateOrganizer />;
  if (isFetching) return <h1>Loading...</h1>;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto mt-8">
      <div className="flex items-center gap-6 border-b pb-4">
        <img
          src={IMAGE_URL + data?.anhtochuc}
          alt="Logo tổ chức"
          className="w-32 h-32 rounded-full object-cover border"
        />
        <div className="flex flex-col justify-center flex-1">
          <p className="text-3xl font-bold">{data.tentochuc}</p>
          <div className="mt-3">
            <EditOrganizer data={data} refetch={refetch} />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold pb-2">Giới thiệu</h2>
        <p className="mt-3 leading-relaxed text-gray-700">{data.mota}</p>
      </div>
    </div>
  );
}
