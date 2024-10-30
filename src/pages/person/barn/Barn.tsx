import React, { useEffect, useState } from 'react';
import { Collapse } from 'react-collapse';
import { Button, TextField } from '@navikt/ds-react';
import { AvbrytKnapp, Knappegruppe, StyledSelect } from '../../../styling/Styles';
import { getIsoDateString } from '../../../utils/dateUtils';
import { Adressebeskyttelse } from '../personalia/adressebeskyttelse';
import Adresse from '../adresse/Adresse';
import { useAdresse } from '../adresse/useAdresse';
import { Folkeregisterpersonstatus } from './folkeregisterpersonstatus';
import {
    FrontendBarn,
    FrontendBarnAdressebeskyttelse,
    PdlFolkeregisterpersonstatusStatus,
} from '../../../generated/model';
import { isValid, parse, subYears } from 'date-fns';
import { getTilfeldigFnr } from '../../../generated/fiks-controller/fiks-controller';
import { NavnSkjema } from './NavnSkjema';

export const NyttBarn = ({
    isOpen,
    onSave,
    onCancel,
}: {
    isOpen: boolean;
    onSave: (barn: FrontendBarn) => void;
    onCancel: () => void;
}) => {
    const { adresseState, bostedsadresse, dispatchAdresse } = useAdresse();

    const [barn, setBarn] = useState<FrontendBarn>({
        fnr: '',
        adressebeskyttelse: 'UGRADERT',
        bostedsadresse,
        folkeregisterpersonstatus: { status: 'bosatt' },
        foedsel: getIsoDateString(subYears(new Date(), 10)),
        navn: { fornavn: 'Ukjent', mellomnavn: '', etternavn: 'Mockbarn' },
    });

    useEffect(
        () =>
            setBarn((prev) => ({
                ...prev,
                bostedsadresse,
            })),
        [bostedsadresse]
    );

    useEffect(() => {
        getTilfeldigFnr().then((fnr) => setBarn((prev) => ({ ...prev, fnr })));
    }, []);

    return (
        <Collapse isOpened={isOpen}>
            <div className={'bg-white p-4 space-y-2'}>
                <TextField
                    value={barn.fnr}
                    label="Ident"
                    onChange={(evt) =>
                        setBarn((prev) => ({
                            ...prev,
                            fnr: evt.target.value,
                        }))
                    }
                    htmlSize={20}
                />
                <NavnSkjema navn={barn.navn} onChange={(navn) => setBarn((prev) => ({ ...prev, navn }))} />
                <TextField
                    label="Fødselsdato (åååå-mm-dd)"
                    htmlSize={20}
                    onChange={(event) => {
                        const date = parse(event.target.value, 'yyyy-MM-dd', new Date());
                        if (isValid(date)) {
                            setBarn((prev) => ({
                                ...prev,
                                foedsel: getIsoDateString(date),
                            }));
                        }
                    }}
                />
                <StyledSelect
                    label="Adressebeskyttelse"
                    value={barn.adressebeskyttelse}
                    onChange={(evt) =>
                        setBarn((prev) => ({
                            ...prev,
                            adressebeskyttelse: evt.target.value as FrontendBarnAdressebeskyttelse,
                        }))
                    }
                >
                    {Object.entries(Adressebeskyttelse).map(([key, label]) => (
                        <option key={key} value={key}>
                            {label}
                        </option>
                    ))}
                </StyledSelect>
                <StyledSelect
                    label="Folkeregisterpersonstatus"
                    value={barn.folkeregisterpersonstatus.status}
                    onChange={(evt) =>
                        setBarn((prev) => ({
                            ...prev,
                            folkeregisterpersonstatus: {
                                status: evt.target.value as PdlFolkeregisterpersonstatusStatus,
                            },
                        }))
                    }
                >
                    {Object.entries(Folkeregisterpersonstatus).map(([key, label]) => (
                        <option key={key} value={key}>
                            {label}
                        </option>
                    ))}
                </StyledSelect>
                <Adresse state={adresseState} dispatch={dispatchAdresse} />
                <Knappegruppe>
                    <Button
                        onClick={(event) => {
                            if (!Number.isInteger(Number(adresseState.husnummer))) {
                                dispatchAdresse({ type: 'validHusnummer', value: false });
                                event.preventDefault();
                                return;
                            }
                            onSave(barn);
                        }}
                    >
                        Legg til
                    </Button>
                    <AvbrytKnapp onClick={onCancel}>Avbryt</AvbrytKnapp>
                </Knappegruppe>
            </div>
        </Collapse>
    );
};
