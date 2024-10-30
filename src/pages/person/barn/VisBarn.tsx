import { FrontendBarn } from '../../../generated/model';
import { DefinitionList, StyledPanel } from '../../../styling/Styles';
import { Adressebeskyttelse } from '../personalia/adressebeskyttelse';
import { Folkeregisterpersonstatus } from './folkeregisterpersonstatus';
import SletteKnapp from '../../../components/SletteKnapp';
import React from 'react';

export const VisBarn = ({ barn, onSlett }: { barn: FrontendBarn; onSlett: () => void }) => {
    return (
        <StyledPanel>
            <DefinitionList labelWidth={35}>
                <dt>Ident</dt>
                <dd>{barn.fnr}</dd>
                <dt>Navn</dt>
                <dd>
                    {barn.navn.fornavn} {barn.navn.mellomnavn} {barn.navn.etternavn}
                </dd>
                <dt>Fødselsdato</dt>
                <dd>{barn.foedsel}</dd>
                <dt>Adressebeskyttelse</dt>
                <dd>{Adressebeskyttelse[barn.adressebeskyttelse]}</dd>
                <dt>Folkeregisterpersonstatus</dt>
                <dd>{Folkeregisterpersonstatus[barn.folkeregisterpersonstatus.status]}</dd>
                <dt>Adresse</dt>
                <dd>
                    {barn.bostedsadresse.adressenavn}, {barn.bostedsadresse.husnummer}, {barn.bostedsadresse.husbokstav}
                    , {barn.bostedsadresse.postnummer}, {barn.bostedsadresse.kommunenummer}
                </dd>
            </DefinitionList>
            <SletteKnapp onClick={onSlett} />
        </StyledPanel>
    );
};
