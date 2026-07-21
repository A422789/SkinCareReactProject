import { CollectionPage } from '../components/CollectionPage';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';

export default function NewArrivalsPage() {
  const { t } = useLanguage();
  const { products } = useSettings();

  const list = products.filter(p => p.isNewArrival);

  return (
    <CollectionPage
      eyebrow={t('justArrived')}
      title={t('newArrivalsTitle')}
      description={t('newArrivalsDescription')}
      products={list}
      accent="mauve"
    />
  );
}
