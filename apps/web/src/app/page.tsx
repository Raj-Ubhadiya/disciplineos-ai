import { LandingPage } from '@/components/public/landing-page';
import { PublicFooter } from '@/components/public/public-footer';
import { PublicNavbar } from '@/components/public/public-navbar';

export default function HomePage() {
  return (
    <>
      <PublicNavbar />
      <LandingPage />
      <PublicFooter />
    </>
  );
}
