import { Component, createMemo, Show } from "solid-js";
import { User } from "./user";
import { hash } from "~/utilities";
import css from "./avatar.module.css";

interface AvatarProps {
  user: User | undefined;
}

export const Avatar: Component<AvatarProps> = (props) => {
  const hashedEmail = hash("SHA-256", () => props.user?.email);
  const src = createMemo(() => {
    const user = props.user;

    if (user === undefined) {
      return "";
    }

    if (user.image === null) {
      return `https://www.gravatar.com/avatar/${hashedEmail()}`;
    }

    return user.image;
  });

  return <img src={src()} class={css.avatar} />;
};
