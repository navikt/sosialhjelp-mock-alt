import React, { MouseEventHandler, useEffect, useState } from 'react';
import { Collapse } from 'react-collapse';
import { getMockAltApiURL } from '../../../utils/restUtils';
import { Button, Panel, TextField } from '@navikt/ds-react';
import {
    AvbrytKnapp,
    DefinitionList,
    Knappegruppe,
    SmallTextField,
    StyledFieldset,
    StyledPanel,
    StyledSelect,
} from '../../../styling/Styles';
import styled from 'styled-components';
import { getIsoDateString } from '../../../utils/dateUtils';
import SletteKnapp from '../../../components/SletteKnapp';
import { ArbeidsforholdObject, ArbeidsforholdType } from './types';

interface Params {
    isOpen: boolean;
    callback: (data: ArbeidsforholdObject | null) => void;
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
    const [stillingsprosent, setStillingsprosent] = useState('100');
    const [arbeidgivertype, setArbeidgivertype] = useState<string>(ArbeidsforholdType.ORGANISASJON);
    const [ident, setIdent] = useState('123456789');
    const [orgnummer, setOrgnummer] = useState<string>('');
    const [organisasjonsNavn, setOrganisasjonsNavn] = useState<string>('Arbeidsgivernavn');

    useEffect(() => {
        fetch(`${getMockAltApiURL()}/fiks/tilfeldig/fnr`)
            .then((response) => response.text())
            .then((text) => setIdent(text));
        fetch(`${getMockAltApiURL()}/fiks/tilfeldig/orgnummer`)
            .then((response) => response.text())
            .then((text) => {
                setOrgnummer(text);
            });
    }, []);

    const onLagre: MouseEventHandler = (event) => {
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

    const onCancel: MouseEventHandler = (event) => {
        callback(null);
        event.preventDefault();
    };

    return (
        <Collapse isOpened={isOpen}>
            <ArbeidsforholdPanel>
                <StyledFieldset legend="Nytt arbeidsforhold">
                    <SmallTextField
                        label="Id"
                        value={arbeidsforholdId}
                        onChange={(evt) => setArbeidsforholdId(evt.target.value)}
                    />
                    <InputWrapper>
                        <TextField
                            label="Startdato (åååå-mm-dd)"
                            value={startdato}
                            onChange={(evt) => setStartdato(evt.target.value)}
                        />
                        <TextField
                            label="Sluttdato (åååå-mm-dd)"
                            value={sluttdato}
                            onChange={(evt) => setSluttdato(evt.target.value)}
                        />
                    </InputWrapper>
                    <SmallTextField
                        label="Stillingsprosent (%)"
                        value={stillingsprosent}
                        onChange={(evt) => setStillingsprosent(evt.target.value)}
                    />
                    <StyledSelect
                        label="Arbeidsgivertype"
                        onChange={(evt) => setArbeidgivertype(evt.target.value)}
                        value={arbeidgivertype}
                    >
                        <option value={ArbeidsforholdType.ORGANISASJON}>Arbeidsgiver med orgnummer</option>
                        <option value={ArbeidsforholdType.PERSON}>Person med ident</option>
                    </StyledSelect>
                    {arbeidgivertype === ArbeidsforholdType.PERSON && (
                        <TextField
                            label="Ident"
                            value={ident}
                            type="number"
                            onChange={(evt) => setIdent(evt.target.value)}
                        />
                    )}
                    {arbeidgivertype === ArbeidsforholdType.ORGANISASJON && (
                        <InputWrapper>
                            <TextField
                                label="Organisasjonsnavn"
                                value={organisasjonsNavn}
                                onChange={(evt) => setOrganisasjonsNavn(evt.target.value)}
                            />
                            <TextField
                                label="Orgnummer"
                                value={orgnummer}
                                onChange={(evt) => setOrgnummer(evt.target.value)}
                            />
                        </InputWrapper>
                    )}
                </StyledFieldset>
                <Knappegruppe>
                    <Button onClick={onLagre}>Legg til</Button>
                    <AvbrytKnapp onClick={onCancel}>Avbryt</AvbrytKnapp>
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
