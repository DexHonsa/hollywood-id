import SearchHome from "@/components/search/search_home";
import ResultPage from "@/components/search/result";
import Header from '@/components/header';
import Footer from '@/components/footer';

export default [
    {
        path: "/search",
        components: {
          default: SearchHome,
          header:Header,
          footer:Footer
        }
      },
      {
        path: "/results/:id",
        components: {
          default: ResultPage,
          header:Header,
          footer:Footer
        }
      }
];