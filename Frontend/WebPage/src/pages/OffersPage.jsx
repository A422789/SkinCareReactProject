import { CollectionPage } from '../components/CollectionPage';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';

export default function OffersPage() {
  const { t } = useLanguage();
  const { products } = useSettings();

  const list = products.filter(p => p.hasOffer || p.compareAtPrice > p.price);

  return (
    <CollectionPage
      eyebrow={t('limitedTime')}
      title={t('offersTitle')}
      description={t('offersDescription')}
      products={list}
    />
  );
}
