import { Component } from "solid-js";
import { User } from "./user";
import { Avatar } from "./avatar";
import css from "./profile.module.css";

interface ProfileProps {
  user: User | undefined;
}

export const Profile: Component<ProfileProps> = (props) => {
  return (
    <div class={css.profile}>
      <Avatar user={props.user} />
      <strong>{props.user?.name ?? ""}</strong>
      <span>{props.user?.email ?? ""}</span>
    </div>
  );
};
