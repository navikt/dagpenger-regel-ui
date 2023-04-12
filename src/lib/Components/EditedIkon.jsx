import React from "react";
import EditIkon from "../../assets/svg/editert.svg";

/*
 * EditedIkon
 *
 * Komponent/Ikon som viser om noe i GUI er endret.
 */

function EditedIkon() {
  return (
    <span className="ikon ikon--rediger">
      <img src={EditIkon} alt="" />;
    </span>
  );
}

export default EditedIkon;
