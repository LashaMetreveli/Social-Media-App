import React from "react";
import { useSelector } from "react-redux";
import style from "./Profile.module.css";

function Profile() {
  const [user] = useSelector((state) => {
    return [state.user];
  });

  console.log(user);

  return (
    user && (
      <div>
        <center>
          <div className={style.profile}>my profile</div>
        </center>
      </div>
    )
  );
}

export default Profile;
