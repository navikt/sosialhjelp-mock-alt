import React, { useState } from 'react';
import { Collapse } from 'react-collapse';
import { Button, Fieldset, HStack, Select, TextField } from '@navikt/ds-react';
import { AvbrytKnapp, Knappegruppe } from '../../../styling/Styles';
import { getVedtakstype, VedtakKodeType, Vedtakskode } from './vedtak';
import { SakerDto, SakerDtoRolle, SakerDtoStatus } from '../../../generated/model';
import { rolleLabel, statusLabel } from './labels';

type ClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

export const NyBostotteSak = ({ isOpen, callback }: { isOpen: boolean; callback: (data: SakerDto | null) => void }) => {
    let sistManed = new Date();
    sistManed.setMonth(sistManed.getMonth() - 1);

    const [ar, setAr] = useState(sistManed.getFullYear().toString());
    const [mnd, setMnd] = useState(`${sistManed.getMonth() + 1}`);
    const [status, setStatus] = useState<SakerDtoStatus>(SakerDtoStatus.UNDER_BEHANDLING);
    const [rolle, setRolle] = useState<SakerDtoRolle>(SakerDtoRolle.HOVEDPERSON);
    const [vedtaksKode, setVedtaksKode] = useState<VedtakKodeType>('V00');

    const onLagre = (event: ClickEvent) => {
        if (status === SakerDtoStatus.VEDTATT) {
            const nyttBostotteSakObject: SakerDto = {
                ar: parseInt(ar),
                mnd: parseInt(mnd),
                status,
                rolle,
                vedtak: {
                    kode: vedtaksKode,
                    beskrivelse: Vedtakskode[vedtaksKode],
                    type: getVedtakstype(vedtaksKode),
                },
            };
            callback(nyttBostotteSakObject);
        } else {
            const nyttBostotteSakObject: SakerDto = { ar: parseInt(ar), mnd: parseInt(mnd), status, rolle };
            callback(nyttBostotteSakObject);
        }
        event.preventDefault();
    };
    const onCancel = (event: ClickEvent) => {
        callback(null);
        event.preventDefault();
    };

    const { VEDTATT, UNDER_BEHANDLING } = SakerDtoStatus;
    const { HOVEDPERSON, BIPERSON } = SakerDtoRolle;
    return (
        <Collapse isOpened={isOpen}>
            <div className={'bg-white p-4'}>
                <Fieldset legend="Legg til sak fra Husbanken">
                    <HStack gap={'4'}>
                        <TextField
                            label="År"
                            value={ar}
                            type="text"
                            inputMode="numeric"
                            onChange={(evt) => setAr(evt.target.value)}
                            htmlSize={6}
                        />
                        <TextField
                            label="Måned"
                            value={mnd}
                            type="text"
                            inputMode="numeric"
                            onChange={(evt) => setMnd(evt.target.value)}
                            htmlSize={4}
                        />
                    </HStack>
                    <Select
                        className={'w-48'}
                        label="Status"
                        onChange={(evt) => setStatus(evt.target.value as SakerDtoStatus)}
                        value={status}
                    >
                        <option value={VEDTATT}>{statusLabel[VEDTATT]}</option>
                        <option value={UNDER_BEHANDLING}>{statusLabel[UNDER_BEHANDLING]}</option>
                    </Select>
                    {status === VEDTATT && (
                        <Select
                            label="Vedtak"
                            onChange={(evt) => setVedtaksKode(evt.target.value as VedtakKodeType)}
                            value={vedtaksKode}
                        >
                            {Object.entries(Vedtakskode).map(([key, label]) => (
                                <option key={key} value={key}>
                                    {label}
                                </option>
                            ))}
                        </Select>
                    )}
                    <Select
                        className={'w-48'}
                        label="Rolle"
                        onChange={(evt) => setRolle(evt.target.value as SakerDtoRolle)}
                        value={rolle}
                    >
                        <option value={HOVEDPERSON}>{rolleLabel[HOVEDPERSON]}</option>
                        <option value={BIPERSON}>{rolleLabel[BIPERSON]}</option>
                    </Select>
                </Fieldset>
                <Knappegruppe>
                    <Button onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onLagre(event)}>
                        Legg til
                    </Button>
                    <AvbrytKnapp onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onCancel(event)}>
                        Avbryt
                    </AvbrytKnapp>
                </Knappegruppe>
            </div>
        </Collapse>
    );
};
