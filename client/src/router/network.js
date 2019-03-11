import NetworkDeals from "@/components/network/deals";
import NetworkExecutives from "@/components/network/executives";
import NetworkExecutiveResult from '@/components/network/executive_result';
import NetworkDealResult from '@/components/network/deal_result';
import Header from '@/components/header';
import Footer from '@/components/footer';


export default [
    {
        path: "/network/deals",
        components: {
          default: NetworkDeals,
          header:Header,
          footer:Footer
        }
      },
      {
        path: "/network/deals/result",
        components: {
          default: NetworkDealResult,
          header:Header,
          footer:Footer
        }
      },
      {
        path: "/network/executives",
        components: {
          default: NetworkExecutives,
          header:Header,
          footer:Footer
        }
      },
      {
        path: "/network/executives/result",
        components: {
          default: NetworkExecutiveResult,
          header:Header,
          footer:Footer
        }
      }
];