import AddListing from '@/components/admin/add_listing';
import EditListing from '@/components/admin/edit_listing';
import Header from '@/components/header';
import Footer from '@/components/footer';
import PendingLisings from '@/components/admin/pending_listings';
import PendingResult from '@/components/admin/pending_result';
import ManageAdmins from '@/components/admin/manage_admins';


export default [
    {
        path: "/admin/add_listing",
        components: {
          default: AddListing,
          header:Header,
          footer:Footer
        }
      },
      {
        path: "/admin/edit_listing/:id",
        components: {
          default: EditListing,
          header:Header,
          footer:Footer
        }
      },
      {
        path: "/admin/pending_listings",
        components: {
          default: PendingLisings,
          header:Header,
          footer:Footer
        }
      },
      {
        path: "/admin/pending_results/:id",
        components: {
          default: PendingResult,
          header:Header,
          footer:Footer
        }
      },
      {
        path: "/admin/manage_admins",
        components: {
          default: ManageAdmins,
          header:Header,
          footer:Footer
        }
      },
     
];