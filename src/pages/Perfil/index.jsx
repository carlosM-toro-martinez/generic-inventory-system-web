import React from "react";
import DrawerComponent from "../../components/DrawerComponent";
import LoginCompononent from "../../components/LoginCompononent";
import ProfileComponent from "../../components/ProfileComponent";

function Perfil() {
  return (
    <>
      <DrawerComponent>
        <ProfileComponent />
      </DrawerComponent>
    </>
  );
}

export default Perfil;
