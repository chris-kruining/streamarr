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
      return undefined;
    }

    if (user.image === null) {
      const emailHash = hashedEmail();

      if (emailHash === undefined) {
        return undefined;
      }

      return `https://www.gravatar.com/avatar/${emailHash}`;
    }

    return user.image;
  });

  return <Show when={src()}>{(src) => <img src={src()} class={css.avatar} />}</Show>;
};
