import React, {useEffect, useState} from 'react';
import {Collapse} from 'react-collapse';
import {Input, Select} from 'nav-frontend-skjema';
import {getMockAltApiURL} from '../../../utils/restUtils';
import {Knapp} from 'nav-frontend-knapper';
import Panel from 'nav-frontend-paneler';
import {StyledPanel} from '../../../styling/Styles';
import {getIsoDateString} from "../../../utils/dateUtils";

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

export const NyttArbeidsforhold = ({isOpen, callback}: Params) => {
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
    const [orgnummer, setOrgnummer] = useState<string>("");
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
            <Panel>
                <Input
                    label="Arbeidsforholdsid"
                    value={arbeidsforholdId}
                    onChange={(evt: any) => setArbeidsforholdId(evt.target.value)}
                />
                <Input label="Startdato" value={startdato} onChange={(evt: any) => setStartdato(evt.target.value)}/>
                <Input label="Sluttdato" value={sluttdato} onChange={(evt: any) => setSluttdato(evt.target.value)}/>
                <Input
                    label="Stillingsprosent"
                    value={stillingsprosent}
                    onChange={(evt: any) => setStillingsprosent(evt.target.value)}
                />
                <Select
                    label="Velg arbeidsgivertype"
                    onChange={(evt: any) => setArbeidgivertype(evt.target.value)}
                    value={arbeidgivertype}
                >
                    <option value={ArbeidsforholdType.ORGANISASJON}>Arbeidsgiver med orgnummer</option>
                    <option value={ArbeidsforholdType.PERSON}>Person med ident</option>
                </Select>
                <Collapse isOpened={arbeidgivertype === ArbeidsforholdType.PERSON}>
                    <Input label="Ident" value={ident} onChange={(evt: any) => setIdent(evt.target.value)}/>
                </Collapse>
                <Collapse isOpened={arbeidgivertype === ArbeidsforholdType.ORGANISASJON}>
                    <Input
                        label="Organisasjonsnavn"
                        value={organisasjonsNavn}
                        onChange={(evt: any) => setOrganisasjonsNavn(evt.target.value)}
                    />
                    <Input
                        label="Orgnummer"
                        value={orgnummer}
                        onChange={(evt: any) => setOrgnummer(evt.target.value)}
                    />
                </Collapse>
                <Knapp onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onLagre(event)}>
                    Legg til
                </Knapp>
                <Knapp
                    onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onCancel(event)}
                    className="leftPadding"
                >
                    Avbryt
                </Knapp>
            </Panel>
        </Collapse>
    );
};

interface ViseParams {
    arbeidsforhold: ArbeidsforholdObject;
}

export const VisArbeidsforhold = ({arbeidsforhold}: ViseParams) => {
    return (
        <StyledPanel>
            <div>Arbeidsforholdsid: {arbeidsforhold.id}</div>
            <div>Startdato: {arbeidsforhold.startDato}</div>
            <div>Sluttdato: {arbeidsforhold.sluttDato}</div>
            <div>Stillingsprosent: {arbeidsforhold.stillingsProsent}</div>
            {arbeidsforhold.type === ArbeidsforholdType.PERSON && (
                <div>
                    <div>Arbeidsgivertype: Person med ident</div>
                    <div>Ident: {arbeidsforhold.ident}</div>
                </div>
            )}
            {arbeidsforhold.type === ArbeidsforholdType.ORGANISASJON && (
                <div>
                    <div>Arbeidsgivertype: Arbeidsgiver med orgnummer</div>
                    <div>Orgnummer: {arbeidsforhold.orgnummer}</div>
                    <div>Arbeidsgivernavn: {arbeidsforhold.orgnavn}</div>
                </div>
            )}
        </StyledPanel>
    );
};
