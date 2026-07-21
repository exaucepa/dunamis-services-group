import GroupageCard from "./GroupageCard";

export default function GroupageCarousel({ groupages }: { groupages: any[] }) {
  if (!groupages || groupages.length === 0) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {groupages.map((g) => <GroupageCard key={g.id} groupage={g} />)}
    </div>
  );
}