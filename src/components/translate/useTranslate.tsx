// import { useRouter } from "next/router";
// import en from "../locales/en.json";
// import vi from "../locales/vi.json";
// const useTranslation = () => {
//    const router = useRouter();
//    const t = router.locale === 'en' ? en : vi;
//    return {t}
// }
// export default useTranslation;

import LocalizedStrings from 'react-localization';
import {en} from '../locales/en'
import {vi} from '../locales/vi'

export const translate = new LocalizedStrings({
   en:{
    ...en
   },
   vi: {
    ...vi
   }
  });