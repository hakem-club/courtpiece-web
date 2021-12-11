import { ReactElement } from "react";
import { PlayingCardSuite } from "../../common/types";

export default function CardSuite(props: { suite: PlayingCardSuite, highlighted?: PlayingCardSuite | null }): ReactElement {
    const { suite, highlighted } = props;
    return <span className={`suite-shape suite-shape-${suite} ${suite === highlighted ? 'highlighted' : ''}`}></span>;
}
