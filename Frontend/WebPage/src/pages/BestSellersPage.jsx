import { CollectionPage } from '../components/CollectionPage';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';

export default function BestSellersPage() {
  const { t } = useLanguage();
  const { products } = useSettings();

  const list = products.filter(p => p.isBestSeller);

  return (
    <CollectionPage
      eyebrow={t('mostLoved')}
      title={t('bestSellers')}
      description={t('bestSellersDescription')}
      products={list}
    />
  );
}
