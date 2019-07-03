import React, { useContext } from 'react';
import { LocaleContext } from '../Context/Locale';


export const i18n = (WrappedComponent) => {
  const locale = useContext(LocaleContext);

  return (
    <WrappedComponent locale={locale} />
  );
};

export default i18n;
