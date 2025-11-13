import Header from '@/components/layout/Header';
import { getCurrentUser } from '@/lib/data/getCurrentUser';
import AddPotButton from '@/components/pots/AddPotButton';
import { getPots } from '@/lib/data/getPots';
import PotCards from '@/components/pots/PotCards';

export default async function PotsPage() {
  const user = await getCurrentUser();
  const pots = await getPots(user._id); 

  return (
    <div className="flex flex-col gap-400 py-300 lg:py-400">
      <Header>
        <h1 className="text-preset-1 text-grey-900">Pots</h1>
        <div className="absolute right-0 bottom-0 flex gap-200 items-center h-full">
          <AddPotButton />
        </div>
      </Header>

      <PotCards pots={pots} />
    </div>
  );
}