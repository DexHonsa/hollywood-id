import StudioDeals from "@/components/studio/deals";
import StudioExecutives from "@/components/studio/executives";
import StudioExecutiveResult from '@/components/studio/executive_result';
import StudioDealResult from '@/components/studio/deal_result';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default [
    {
        path: "/studio/deals",
        components: {
          default: StudioDeals,
          header:Header,
          footer:Footer
        }
      },
      {
        path: "/studio/deals/result",
        components: {
          default: StudioDealResult,
          header:Header,
          footer:Footer
        }
      },
      {
        path: "/studio/executives",
        components: {
          default: StudioExecutives,
          header:Header,
          footer:Footer
        }
      },
      {
        path: "/studio/executives/result",
        components: {
          default: StudioExecutiveResult,
          header:Header,
          footer:Footer
        }
      }
];