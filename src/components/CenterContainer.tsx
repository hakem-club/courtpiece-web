import { Container } from "@mui/material";
import { ReactElement } from "react";

export default function CenterContainer(props: { children: ReactElement[] | ReactElement }): ReactElement {
    return (
        <Container maxWidth="sm">
            {props.children}
        </Container>
    );
}
