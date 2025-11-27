import { getOrdersByUserIDAPI } from "@/services/orderService";
import { useQuery } from "@tanstack/react-query";

export default function MyTicketPage() {
  const { data } = useQuery({
    queryKey: ["fetchOrderByUserId"],
    queryFn: getOrdersByUserIDAPI,
  });
  console.log(data);
  return <div>HI</div>;
}
