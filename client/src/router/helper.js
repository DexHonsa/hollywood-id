import Header from "@/components/header";
import Footer from '@/components/footer';

export const getDefaultComponents = Component => ({
  components: {
    default: Component,
    header: Header,
    footer:Footer
  }
});
