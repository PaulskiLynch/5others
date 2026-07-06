import { CardioBunnyJoinScreen } from "@/components/cardio-bunny/CardioBunnyJoinScreen";

type JoinPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function JoinPage({ searchParams }: JoinPageProps) {
  const { error } = await searchParams;
  return <CardioBunnyJoinScreen error={error} />;
}
