import React, { useEffect, useState } from 'react';
import { Collapse } from 'react-collapse';
import { getMockAltApiURL } from '../../../utils/restUtils';
import { Button, Fieldset, Panel, TextField } from '@navikt/ds-react';
import { DefinitionList, Knappegruppe, StyledPanel, StyledSelect, SmallTextField } from '../../../styling/Styles';
import styled from 'styled-components/macro';
import { getIsoDateString } from '../../../utils/dateUtils';
import SletteKnapp from '../../../components/SletteKnapp';

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
    margin-bottom: 1rem;
`;

const InputWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;

    column-gap: 1rem;

    .navds-form-field {
        flex: 1;
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
                <Fieldset legend="Nytt arbeidsforhold">
                    <SmallTextField
                        label="Id"
                        value={arbeidsforholdId}
                        onChange={(evt: any) => setArbeidsforholdId(evt.target.value)}
                    />
                    <InputWrapper>
                        <TextField
                            label="Startdato (åååå-mm-dd)"
                            value={startdato}
                            onChange={(evt: any) => setStartdato(evt.target.value)}
                        />
                        <TextField
                            label="Sluttdato (åååå-mm-dd)"
                            value={sluttdato}
                            onChange={(evt: any) => setSluttdato(evt.target.value)}
                        />
                    </InputWrapper>
                    <SmallTextField
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
                        <TextField label="Ident" value={ident} onChange={(evt: any) => setIdent(evt.target.value)} />
                    )}
                    {arbeidgivertype === ArbeidsforholdType.ORGANISASJON && (
                        <InputWrapper>
                            <TextField
                                label="Organisasjonsnavn"
                                value={organisasjonsNavn}
                                onChange={(evt: any) => setOrganisasjonsNavn(evt.target.value)}
                            />
                            <TextField
                                label="Orgnummer"
                                value={orgnummer}
                                onChange={(evt: any) => setOrgnummer(evt.target.value)}
                            />
                        </InputWrapper>
                    )}
                </Fieldset>
                <Knappegruppe>
                    <Button onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onLagre(event)}>
                        Legg til
                    </Button>
                    <Button onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onCancel(event)}>
                        Avbryt
                    </Button>
                </Knappegruppe>
            </ArbeidsforholdPanel>
        </Collapse>
    );
};

interface ViseParams {
    arbeidsforhold: ArbeidsforholdObject;
    onSlett: () => void;
}

export const VisArbeidsforhold = ({ arbeidsforhold, onSlett }: ViseParams) => {
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
            <SletteKnapp onClick={onSlett} />
        </StyledPanel>
    );
};
