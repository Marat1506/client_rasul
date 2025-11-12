import Advantages from '@/components/Advantages';
import Banner from '@/components/Banner';
import Compony from '@/components/Compony';
import Reviews from '@/components/Reviews';
import SubmitRequest from '@/components/SubmitRequest';

export default function Home() {
  return (
    <>
      <Banner />
      <SubmitRequest />
      <Advantages />
      <Compony />
      <Reviews />
      {/*<Infrastructure/>*/}
    </>
  );
}
