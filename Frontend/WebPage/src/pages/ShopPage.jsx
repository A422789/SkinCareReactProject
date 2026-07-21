import { useSearchParams } from 'react-router-dom';
import { CollectionPage } from '../components/CollectionPage';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const { t } = useLanguage();
  const { products, categories } = useSettings();

  const sourceList = products;
  let filtered = sourceList;
  if (category) {
    const catObj = categories?.find(c => c.name.toLowerCase() === category.toLowerCase() || c._id === category);
    if (catObj) {
      filtered = sourceList.filter((p) => p.category === catObj._id);
    } else {
      filtered = sourceList.filter((p) => p.category.toLowerCase() === category.toLowerCase() || p.category === category);
    }
  }

  const displayTitle = category ? (t(category.toLowerCase()) === category.toLowerCase() ? category : t(category.toLowerCase())) : t('shopAll');

  return (
    <CollectionPage
      eyebrow={t('theCollection')}
      title={displayTitle}
      description={t('shopDescription')}
      products={filtered}
    />
  );
}
