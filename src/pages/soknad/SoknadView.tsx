import { Link, useParams } from 'react-router-dom';
import { useGetSoknadJsonV2 } from '../../generated/frontend-soknad-controller-v-2/frontend-soknad-controller-v-2';
import { Button, Heading } from '@navikt/ds-react';
import ReactJson from '@microlink/react-json-view';
import { ArrowLeftIcon } from '@navikt/aksel-icons';

const downloadSoknad = (data: object, soknadId: string) => {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digisos-${soknadId}-soknad.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const SoknadView = () => {
    const { soknadId } = useParams<{ soknadId: string }>();
    if (!soknadId) throw new Error('Mangler søknad-ID i URL');
    const { data: soknadJson } = useGetSoknadJsonV2(soknadId);

    if (!soknadJson)
        return (
            <Heading level="1" size={'xlarge'}>
                Laster...
            </Heading>
        );

    return (
        <div>
            <Link to={'/soknader'}>
                <div className={'flex items-center pb-2'}>
                    <ArrowLeftIcon title="tilbake" fontSize={'1.5rem'} className={'inline'} />
                    Tilbake til søknadsoversikt
                </div>
            </Link>
            <Heading level="1" size="xlarge">
                Søknad {soknadId}
            </Heading>
            <div className={'flex gap-4 items-center pb-2'}>
                <Heading level={'2'} size={'medium'}>
                    Søknad JSON
                </Heading>
                <Button size={'small'} onClick={() => downloadSoknad(soknadJson, soknadId)}>
                    Last ned
                </Button>
            </div>
            <div className={'bg-gray-50 p-4'}>
                <ReactJson src={soknadJson} />
            </div>
        </div>
    );
};
