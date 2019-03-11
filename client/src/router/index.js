import Vue from "vue";
import Router from "vue-router";
import Login from "@/components/login/login";
import ProfileRoutes from "./profile";
import SearchRoutes from './search';
import StudioRoutes from './studio';
import NetworkRoutes from './network';
import AdminRoutes from './admin';
import IfpRoutes from './ifp';
import PayWall from '@/components/pay_wall';
import AboutUs from '@/components/login/about_us';

import Header from '@/components/header';

 // import Covert from '../components/convert';

import Footer from '@/components/footer';

import SetupSeb from '@/components/payments/setup_sub';
import ChangePayment from '@/components/payments/change_payment';
import ActivateSub from '@/components/payments/activate_sub';

//import { store } from "../store/store.js";

var baseRoutes = [
  {
    path: "/",
    components: {
      default: Login,
      footer:Footer
    }
  },
  {
    path: "/paywall",
    components: {
      default: PayWall,
      header:Header,
      footer:Footer
    }
  },
  {
    path: "/setup_sub",
    components: {
      default: SetupSeb,
      header:Header,
      footer:Footer
    }
  },
  {
    path: "/activate_sub",
    components: {
      default: ActivateSub,
      header:Header,
      footer:Footer
    }
  },
  {
    path: "/change_payment",
    components: {
      default: ChangePayment,
      header:Header,
      footer:Footer
    }
  },
  {
    path: "/about_us",
    components: {
      default: AboutUs,
      header:Header,
      footer:Footer
    }
  },
  // {
  //   path:'/convert',
  //   components:{
  //     default:Covert
  //   }
  // }

];

const routes = baseRoutes
  .concat(ProfileRoutes)
  .concat(SearchRoutes)
  .concat(StudioRoutes)
  .concat(NetworkRoutes)
  .concat(AdminRoutes)
  .concat(IfpRoutes)


Vue.use(Router);

var router = new Router({
  mode: 'hash',
  routes: routes
});

router.beforeEach((to, from, next) => {
  return next();
});

export default router;
