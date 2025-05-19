import { Component } from 'solid-js';
import { Entry } from '~/features/content';
import css from './details.module.css';

interface DetailsProps {
    entry: Entry
}

export const Details: Component<DetailsProps> = (props) => {
    return (
        <div class={css.container}>
            <header class={css.header}>
                <img class={css.background} src={props.entry.image} />

                <h1>{props.entry.title}</h1>
            </header>
        </div>
    );
};