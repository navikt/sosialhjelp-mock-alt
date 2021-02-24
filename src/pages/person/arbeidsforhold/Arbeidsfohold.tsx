import React, { useEffect, useState } from 'react';
import { Collapse } from 'react-collapse';
import { Input, Select } from 'nav-frontend-skjema';
import { getMockAltApiURL } from '../../../utils/restUtils';
import { Knapp } from 'nav-frontend-knapper';
import Panel from 'nav-frontend-paneler';
import { FlexWrapper, StyledPanel, StyledSelect, theme } from '../../../styling/Styles';
import styled from 'styled-components/macro';
import { getIsoDateString } from '../../../utils/dateUtils';

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

export enum ArbeidsforholdType {
    PERSON = 'Person',
    ORGANISASJON = 'Organisasjon',
}

export interface ArbeidsforholdObject {
    type: string;
    id: string;
    startDato: string;
    sluttDato: string;
    stillingsProsent: string;
    ident: string;
    orgnummer: string;
    orgnavn: string;
}

interface Params {
    isOpen: boolean;
    callback: (data: any) => void;
}

const ArbeidsforholdPanel = styled(Panel)`
    input {
        margin-right: 1rem;
    }
`;

const StyledInput = styled(Input)<{ size?: number }>`
    input {
        max-width: ${(props) => (props.size ? `${props.size}rem` : '10rem')};
    }
`;

const OrganisasjonsWrapper = styled(FlexWrapper)`
    margin-bottom: 1rem;
`;
const DatoWrapper = styled(FlexWrapper)`
    input {
        margin-right: 0.5rem;
    }

    span {
        font-weight: normal;
    }
`;

export const NyttArbeidsforhold = ({ isOpen, callback }: Params) => {
    let lengesiden = new Date();
    lengesiden.setFullYear(lengesiden.getFullYear() - 3);
    let forrigeMnd = new Date();
    forrigeMnd.setMonth(forrigeMnd.getMonth() - 1);

    const [arbeidsforholdId, setArbeidsforholdId] = useState<string>('1');
    const [startdato, setStartdato] = useState<string>(getIsoDateString(lengesiden));
    const [sluttdato, setSluttdato] = useState<string>(getIsoDateString(forrigeMnd));
    const [stillingsprosent, setStillingsprosent] = useState<number>(100);
    const [arbeidgivertype, setArbeidgivertype] = useState<string>(ArbeidsforholdType.ORGANISASJON);
    const [ident, setIdent] = useState<number>(123456789);
    const [orgnummer, setOrgnummer] = useState<string>('');
    const [organisasjonsNavn, setOrganisasjonsNavn] = useState<string>('Arbeidsgivernavn');

    useEffect(() => {
        fetch(`${getMockAltApiURL()}/fiks/tilfeldig/fnr`)
            .then((response) => response.text())
            .then((text) => setIdent(parseInt(text)));
        fetch(`${getMockAltApiURL()}/fiks/tilfeldig/orgnummer`)
            .then((response) => response.text())
            .then((text) => {
                setOrgnummer(text);
            });
    }, []);

    const onLagre = (event: ClickEvent) => {
        const nyttArbeidsforholdObject: ArbeidsforholdObject = {
            type: arbeidgivertype,
            id: arbeidsforholdId,
            startDato: startdato,
            sluttDato: sluttdato,
            stillingsProsent: stillingsprosent.toString(),
            ident: ident.toString(),
            orgnummer: orgnummer.toString(),
            orgnavn: organisasjonsNavn,
        };

        callback(nyttArbeidsforholdObject);
        event.preventDefault();
    };
    const onCancel = (event: ClickEvent) => {
        callback(null);
        event.preventDefault();
    };

    return (
        <Collapse isOpened={isOpen}>
            <ArbeidsforholdPanel>
                <StyledInput
                    size={5}
                    label="Id"
                    value={arbeidsforholdId}
                    onChange={(evt: any) => setArbeidsforholdId(evt.target.value)}
                    className="arbforhold_id"
                />
                <DatoWrapper>
                    <Input
                        label="Startdato (åååå-mm-dd)"
                        value={startdato}
                        onChange={(evt: any) => setStartdato(evt.target.value)}
                    />
                    <Input
                        label="Sluttdato (åååå-mm-dd)"
                        value={sluttdato}
                        onChange={(evt: any) => setSluttdato(evt.target.value)}
                    />
                </DatoWrapper>
                <StyledInput
                    size={5}
                    label="Stillingsprosent (%)"
                    value={stillingsprosent}
                    onChange={(evt: any) => setStillingsprosent(evt.target.value)}
                />
                <StyledSelect
                    label="Arbeidsgivertype"
                    onChange={(evt: any) => setArbeidgivertype(evt.target.value)}
                    value={arbeidgivertype}
                >
                    <option value={ArbeidsforholdType.ORGANISASJON}>Arbeidsgiver med orgnummer</option>
                    <option value={ArbeidsforholdType.PERSON}>Person med ident</option>
                </StyledSelect>
                {arbeidgivertype === ArbeidsforholdType.PERSON && (
                    <StyledInput
                        label="Ident"
                        value={ident}
                        onChange={(evt: any) => setIdent(evt.target.value)}
                        className="blokk-s"
                    />
                )}
                {arbeidgivertype === ArbeidsforholdType.ORGANISASJON && (
                    <OrganisasjonsWrapper>
                        <StyledInput
                            label="Organisasjonsnavn"
                            value={organisasjonsNavn}
                            onChange={(evt: any) => setOrganisasjonsNavn(evt.target.value)}
                        />
                        <StyledInput
                            label="Orgnummer"
                            value={orgnummer}
                            onChange={(evt: any) => setOrgnummer(evt.target.value)}
                        />
                    </OrganisasjonsWrapper>
                )}
                <Knapp onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onLagre(event)}>
                    Legg til
                </Knapp>
                <Knapp
                    onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onCancel(event)}
                    className="leftPadding"
                >
                    Avbryt
                </Knapp>
            </ArbeidsforholdPanel>
        </Collapse>
    );
};

interface ViseParams {
    arbeidsforhold: ArbeidsforholdObject;
}

const DefinitionList = styled.dl`
    margin: 0;
    overflow: auto;
    line-height: 1.5;
    &:after {
        content: '';
        clear: both;
    }

    dt {
        float: left;
        clear: left;
        font-weight: bold;
        min-width: 8.5rem;
        margin-right: 0.5rem;
        &::after {
            content: ': ';
        }

        @media ${theme.mobileMaxWidth} {
            min-width: initial;
        }
    }
    dd {
        float: left;
        margin: 0;
    }
`;

const DefinitionList2 = styled.dl`
    margin: 0;
    overflow: auto;
    line-height: 1.5;
    display: flex;
    flex-wrap: wrap;

    dt {
        font-weight: bold;
        flex: 1 0 25%;
        &::after {
            content: ': ';
        }
        clear: left;
    }
    dd {
        flex: 1 0 70%;
        clear: left;

        &::after {
            content: '';
            display: flex;
            flex-basis: 100%;
        }
        margin-left: 0.5rem;
    }
`;

export const VisArbeidsforhold = ({ arbeidsforhold }: ViseParams) => {
    return (
        <StyledPanel>
            <DefinitionList>
                <dt>Id</dt>
                <dd>{arbeidsforhold.id}</dd>
                <dt>Startdato</dt>
                <dd>{arbeidsforhold.startDato}</dd>
                <dt>Sluttdato</dt>
                <dd>{arbeidsforhold.sluttDato}</dd>
                <dt>Stillingsprosent</dt>
                <dd>{arbeidsforhold.stillingsProsent} %</dd>
                {arbeidsforhold.type === ArbeidsforholdType.PERSON && (
                    <>
                        <dt>Arbeidsgivertype</dt>
                        <dd>Person med ident</dd>
                        <dt>Ident</dt>
                        <dd>{arbeidsforhold.ident}</dd>
                    </>
                )}
                {arbeidsforhold.type === ArbeidsforholdType.ORGANISASJON && (
                    <>
                        <dt>Arbeidsgivertype</dt>
                        <dd>Arbeidsgiver med orgnummer</dd>
                        <dt>Orgnummer</dt>
                        <dd>{arbeidsforhold.orgnummer}</dd>
                        <dt>Arbeidsgivernavn</dt>
                        <dd>{arbeidsforhold.orgnavn}</dd>
                    </>
                )}
            </DefinitionList>
        </StyledPanel>
    );
};
