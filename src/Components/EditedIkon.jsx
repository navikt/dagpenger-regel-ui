import React from 'react';
import { ReactComponent as EditIkon } from '../images/editert.svg';
/*
 * EditedIkon
 *
 * Komponent/Ikon som viser om noe i GUI er endret.
 */

const EditedIkon = () => (
  <span className="ikon ikon--rediger">
    <EditIkon />
  </span>
);

export default EditedIkon;
