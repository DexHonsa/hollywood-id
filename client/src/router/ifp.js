
import Ifp from "@/components/ifp/ifp";
import IfpResult from '@/components/ifp/ifp_result';

import Header from '@/components/header';
import Footer from '@/components/footer';


export default [
    {
        path: "/ifp",
        components: {
          default: Ifp,
          header:Header,
          footer:Footer
        }
      },
      {
        path: "/ifp/result",
        components: {
          default: IfpResult,
          header:Header,
          footer:Footer
        }
      }
      
];