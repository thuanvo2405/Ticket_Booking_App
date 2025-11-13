export default function TicketDescription({ moTa }: { moTa: string }) {
  return (
    <div className="shadow-xl border mt-10 rounded-2xl p-4">
      <p className="text-xl font-semibold text-center border-b-1 py-3">
        Giới thiệu về sự kiện
      </p>
      <div className="p-4" dangerouslySetInnerHTML={{ __html: moTa }}></div>
    </div>
  );
}
